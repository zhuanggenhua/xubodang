import { ConnectStateEnum } from '../common'
import { Connection } from '../common/core/Connection'

export default class Player {
  id: number
  nickname: string
  godname: string
  connection: Connection
  rid: number //房间id
  state: ConnectStateEnum = ConnectStateEnum.Idle

  //   Pick 创造新类型，包含指定的属性
  constructor(connection, {id, nickname, godname}) {
    this.id = id
    this.nickname = nickname  
    this.godname = godname
    this.connection = connection
    this.connection.playerId = this.id
    this.rid = -1
  }
}
