export namespace RemoteAPI {

  export const Common = {
    BasePath: '/common',
    AppConfig: '/appConfig',
    DBMgrDBs: '/dbmgr/dbs',
    DBMgrDBDocs: '/dbmgr/doc/all',
    DBMgrDBDocUpdate: '/dbmgr/doc/update',
    DBMgrDBDocDelete: '/dbmgr/doc/delete',
  }

  export const User = {
    BasePath: '/user',
    Login: '/login',
    Register: '/register',
    Contact: '/contact',
    Search: '/search',
    ProfileAvatar: '/uploadAvatar',
    ProfileSave: '/profile/save',
    ProfileMyself: '/profile/myself',
    ProfileInfo: '/profile/info',
    ProfileSearch: '/profile/search',
  }

  export const IOT = {
    BasePath: '/iot',
    DeviceSearch: '/device/search',
    DeviceInfo: '/device/info',
    DeviceSave: '/device/save',
    DeviceDelete: '/device/remove',
    CompanyInfo: '/company/info',
    CompanySave: '/company/save',
    RoleAll: '/company/role/all',
    RoleSave: '/company/role/save',
    RoleDelete: '/company/role/delete',
    PagedOperators: '/company/operator/paged',
    OperatorMyself: '/company/operator/myself',
    OperatorSave: '/company/operator/save',
    OperatorDelete: '/company/operator/delete',
    MyPrivileges: '/company/privileges/myself',
  }

  export const IM = {
    BasePath: '/im',
    SyncFrom: '/sync/get',
    BulkSyncFrom: '/sync/bulkGet',
    SyncTo: '/sync/save',
    SendMsg: '/sendMsg',
    GetOfflineMessages: '/sync/messages',
  }

  export const Chatroom = {
    BasePath: '/room',
    MyRooms: '/myRooms',
    RoomInfo: '/info', // 房间基础信息
    RoomSave: '/save',
    RoomDelete: '/delete',
    SeatRequests: '/seatRequests',
    SeatReq: '/seatReq', // cmd code: see Chatroom.MsgType.SeatXXX
    SeatMgr: '/seatMgr', // 
    Collect: '/collect',
    Gifts: '/gifts', // 礼物信息
    Emojis: '/emojis',
    Enter: '/enter',
    Leave: '/leave',
    Reward: '/reward',
    SendMsg: '/sendMsg',
  }

  export const Timeline = {
    BasePath: '/timeline',
    MyPosts: '/post/my',
    PostPub: '/post/pub',
    PostDel: '/post/del',
    MyMoments: '/moment/my',
    MomentPub: '/moment/pub',
    MomentDel: '/moment/del',
    MomentLike: '/moment/like',
    Comments: '/comments', // 评论
    CommentPub: '/comment/pub', // 发表评论
    CommentDel: '/comment/del', // 删除评论
  }

  export const Square = {
    BasePath: '/square',
    Recommend: '/recommend',
    MyCollections: '/myCollections',
  }
}