import { IM } from '.'
import { RemoteAPI } from './api.const'
import { formPost, get } from './base.api'

export namespace IMApi {

  export function syncFrom(sid: string) {
    return get<IM.Session>(RemoteAPI.IM.BasePath + RemoteAPI.IM.SyncFrom, { sid })
  }

  export function syncTo(session: IM.Session) {
    let obj = Object.assign({}, session)
    delete obj._id
    delete obj._rev

    if (obj.type == IM.SessionType.P2P) {
      delete obj.title
      delete obj.thumb
    }

    let data = new FormData()
    data.append('session', JSON.stringify(obj))
    return formPost<string>(RemoteAPI.IM.BasePath + RemoteAPI.IM.SyncTo, data)
  }

  export function sendMsg(message: IM.Message) {
    let data = new FormData()
    data.append('message', JSON.stringify(message))
    return formPost<string>(RemoteAPI.IM.BasePath + RemoteAPI.IM.SendMsg, data)
  }
}