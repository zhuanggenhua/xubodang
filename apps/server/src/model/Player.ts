import { Connection } from '../common/core/Connection'

export default class Player {
  id: number
  nickname: string
  connection: Connection
  rid: number

  //   Pick 创造新类型，包含指定的属性
  constructor(id, nickname, connection) {
    this.id = id
    this.nickname = nickname
    this.connection = connection
    this.connection.playerId = this.id
    this.rid = -1
  }
}
