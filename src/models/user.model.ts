import { Common } from '.'


export namespace User {

  export enum UserGender {
    FEMALE,
    MALE,
    UNKNOWN
  }

  export interface UserAuth {
    role: string, // 角色
    expired: number, // 有效期
  }

  export interface Profile extends Common.DBDoc {
    uid?: string
    showNo?: string,
    name?: string,
    gender?: UserGender,
    avatar?: string,
  }

  export interface Account extends Common.DBDoc {
    phone?: string,
    encryptPWD?: string,
    token?: string,
  }
}