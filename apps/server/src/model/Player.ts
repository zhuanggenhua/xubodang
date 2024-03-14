import { Connection } from '../common/core/Connection'

export default class Player {
  id: number
  nickname: string
  connection: Connection
  rid: number//房间id

  //   Pick 创造新类型，包含指定的属性
  constructor(id, connection) { 
    this.id = id
    this.connection = connection
    this.connection.playerId = this.id
    this.rid = -1
  }
}
