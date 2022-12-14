import { defineStore } from 'pinia'
import msgClient from '../common/PahoMsgClient'
import { Chatroom, User } from '../models'
import { ChatroomApi } from '../models/chatroom.api'
import { useCommonStore } from './Common'

export type ChatroomState = {
  gifts: Array<Chatroom.Gift>
  curRoom: Chatroom.Room
  effects: Array<Chatroom.Message>
  messages: Array<Chatroom.Message>
}

export interface ChatroomAction {
  isMaster(uid: string): boolean
  isOnSeat(uid: string): boolean
  enterRoom(roomId: string): Promise<void>
  leaveRoom(uid: string): Promise<void>
  reward(giftId: string, count: number, receivers: Array<string>): Promise<void>
  sendMessage(content: string, type: Chatroom.MsgType): Promise<void>
  seatOnReq(seatInfo: Chatroom.Seat, uid: string): Promise<void>
  seatDown(seatInfo: Chatroom.Seat, uid: string): Promise<void>
  mute(seatInfo: Chatroom.Seat): Promise<void>
  lock(seatInfo: Chatroom.Seat): Promise<void>
  allowSeatOn(uid: string, seq: number): Promise<void>
  onMessageArrived(msgs: Chatroom.Message[]): Promise<void>
}

export const useChatroomStore = defineStore<string, ChatroomState, {}, ChatroomAction>('Chatroom', {
  state: () => {
    return {
      gifts: [],
      curRoom: null,
      effects: [],
      messages: [],
    }
  },
  actions: {
    isMaster(uid: string) {
      return this.curRoom?.masters.includes(uid) || this.curRoom?.owner == uid
    },
    isOnSeat(uid: string) {
      return this.curRoom.seats.find((it: Chatroom.Seat) => { return it.userInfo?.uid == uid }) != null
    },
    async enterRoom(roomId: string) {
      this.curRoom = await ChatroomApi.enter(roomId)
      if (this.gifts.length == 0) {
        this.gifts = await ChatroomApi.gifts()
      }
      if (!msgClient.subscribe(`_room/${this.curRoom._id}`)) {
        this.curRoom = null
        throw 'cant subscribe room'
      }

      this.messages = []
      if (this.curRoom.welcome != null) {
        this.messages.push({
          from: 'string',
          type: Chatroom.MsgType.Sys,
          data: { content: this.curRoom.welcome } as Chatroom.SysInfoContent
        })
      }

      this.mockMessages()
    },
    async leaveRoom(uid: string) {
      await ChatroomApi.leave(this.curRoom._id)

      this.curRoom = null
      this.messages = []
      this.effects = []
    },
    async sendMessage(content: string, type: Chatroom.MsgType) {
      let msg: Chatroom.Message = {
        type,
        data: { content } as Chatroom.ChatContent
      }
      await ChatroomApi.sendMsg(this.curRoom._id, msg)
    },
    async reward(giftId: string, count: number, receivers: Array<string>) {
      // let messages = receivers.map(it => {
      //   return {
      //     type: Chatroom.MsgType.Reward,
      //     from: '',
      //     content: { to: it, giftId, count }
      //   } as Chatroom.Message
      // })
      // ?????????????????????????????????????????????
      await ChatroomApi.reward(this.curRoom._id, giftId, count, receivers)
    },
    async seatOnReq(seatInfo: Chatroom.Seat, uid: string) {
      if (this.curRoom?.masters?.includes(uid)) { // ?????????????????????
        await ChatroomApi.seatMgr(this.curRoom._id, uid, seatInfo.seq, Chatroom.MsgType.SeatOn)
      } else { // ??????????????????
        await ChatroomApi.seatReq(this.curRoom._id, seatInfo.seq, Chatroom.MsgType.SeatReq)
      }
    },
    async seatDown(seatInfo: Chatroom.Seat, uid: string) {
      if (uid == seatInfo.userInfo.uid) {
        await ChatroomApi.seatReq(this.curRoom._id, seatInfo.seq, Chatroom.MsgType.SeatDown)
      } else if (this.curRoom?.masters?.includes(uid)) {
        await ChatroomApi.seatMgr(this.curRoom._id, seatInfo.userInfo.uid, seatInfo.seq, Chatroom.MsgType.SeatDown)
      }
    },
    async mute(seatInfo: Chatroom.Seat) {
      await ChatroomApi.seatMgr(this.curRoom._id, null, seatInfo.seq, seatInfo.isMute ? Chatroom.MsgType.SeatUnmute : Chatroom.MsgType.SeatMute)
    },
    async lock(seatInfo: Chatroom.Seat) {
      await ChatroomApi.seatMgr(this.curRoom._id, null, seatInfo.seq, seatInfo.isLocked ? Chatroom.MsgType.SeatUnlock : Chatroom.MsgType.SeatLock)
    },
    async allowSeatOn(uid: string, seq: number) {
      await ChatroomApi.seatMgr(this.curRoom._id, uid, seq, Chatroom.MsgType.SeatOn)
    },
    async onMessageArrived(msgs: Chatroom.Message[]) {
      let commonStore = useCommonStore()
      msgs.forEach(it => {
        switch (it.type) {
          case Chatroom.MsgType.SeatLock:
          case Chatroom.MsgType.SeatUnlock: {
            let isLock = it.type == Chatroom.MsgType.SeatLock
            let seq = (it.data as Chatroom.SeatContent).seq
            this.curRoom.seats.find((item: Chatroom.Seat) => { return item.seq == seq }).isLocked = isLock
            break
          }

          case Chatroom.MsgType.SeatMute:
          case Chatroom.MsgType.SeatUnmute: {
            let isMute = it.type == Chatroom.MsgType.SeatMute
            let seq = (it.data as Chatroom.SeatContent).seq
            this.curRoom.seats.find((item: Chatroom.Seat) => { return item.seq == seq }).isMute = isMute
            break
          }

          case Chatroom.MsgType.SeatOn: {
            let data = it.data as Chatroom.SeatContent
            let seq = (it.data as Chatroom.SeatContent).seq
            let profile: User.Profile = { uid: data.uid, name: data.name, avatar: data.avatar }
            this.curRoom.seats.find((it: Chatroom.Seat) => { return it.seq == seq }).userInfo = profile
            break
          }
          case Chatroom.MsgType.SeatDown: {
            let seq = (it.data as Chatroom.SeatContent).seq
            if (this.curRoom) {
              this.curRoom.seats.find((it: Chatroom.Seat) => { return it.seq == seq }).userInfo = null
            }
            break
          }
          case Chatroom.MsgType.Enter:
            break
          case Chatroom.MsgType.Reward:
            this.effects.push(it)
            break
          case Chatroom.MsgType.ChatText:
          case Chatroom.MsgType.ChatEmoji:
          case Chatroom.MsgType.Sys:
            this.messages.push(it)
            break
        }
      })
    },
    mockMessages() {


      this.messages.push({
        from: '8f4e7438-4285-4268-910c-3898fb8d6d96',
        type: Chatroom.MsgType.ChatText,
        data: { content: `hello world` }
      })

      this.messages.push({
        from: 'string',
        type: Chatroom.MsgType.Sys,
        data: { content: `<span style="font-size: 0.8rem; font-style: italic; color: #8e44ad;"> ?????? </span> ??? <span style="font-size: 0.8rem; font-style: italic; color: #e67e22;"> ?????? </span> ????????? <span style="font-size: 1rem; font-style: italic; font-weight: bold; color: #f39c12;"> 1 </span> ??? <span>?????????</span>` } as Chatroom.SysInfoContent
      })
    }
  }
})