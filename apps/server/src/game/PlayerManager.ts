import { Singleton } from '../common/common/base'
import { Connection } from '../common/core/Connection'
import Player from '../model/Player'
//v1基于时间戳，无重复，v4是随机生成
import { v1 as uuid } from 'uuid'

// import RoomManager from './RoomManager';
export default class PlayerManager extends Singleton {
  static get Instance() {
    return super.GetInstance<PlayerManager>()
  }

  players: Set<Player> = new Set()

  private nextPlayerId = 1
  //   专门用idmap，方便查找，属于空间换时间
  private idMapPlayer: Map<number, Player> = new Map()

  //   交叉类型，表示一个对象同时包含IApiPlayerJoinReq类型的所有属性和一个额外的connection属性
  createPlayer(connection, playerInfo?): Player {
    let player
    if (playerInfo) {
      // 玩家已存在
      player = new Player(connection, playerInfo)
    } else {
      // 为玩家生成初始信息
      const id = uuid()
      const nickname = `游客${this.nextPlayerId++}`
      const godname = ''
      player = new Player(connection, { id, nickname, godname })
    }
    connection.playerId = player.id //绑定连接与玩家，用于退出
    this.players.add(player)
    this.idMapPlayer.set(player.id, player)
    return player
  }

  removePlayer(uid: number) {
    const player = this.idMapPlayer.get(uid)
    if (player) {
      const rid = player.rid
      if (rid !== undefined) {
        // RoomManager.Instance.leaveRoom(rid, uid)
        // RoomManager.Instance.syncRooms()
        // RoomManager.Instance.syncRoom(rid)
      }
      this.players.delete(player)
      this.idMapPlayer.delete(uid)
    }
  }

  getPlayerById(uid: number) {
    return this.idMapPlayer.get(uid)
  }

  getPlayersView(players: Set<Player> = this.players) {
    return [...players].map((player) => this.getPlayerView(player))
  }

  // 获取玩家公开数据
  getPlayerView({ id, nickname, godname, rid }: Player) {
    return { id, nickname, godname, rid }
  }
}
