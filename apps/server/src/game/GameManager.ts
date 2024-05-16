import { Singleton } from '../common/common/base'
import { Logger, Inject, ApiFunc } from '../common'
import { MyServer } from '../common/core/MyServer'
import { Connection } from '../common/core/Connection'
import { getTime } from '../utils'
import PlayerManager from './PlayerManager'
import RoomManager from './RoomManager'

export class GameManager extends Singleton {
  static get Instance() {
    return super.GetInstance<GameManager>()
  }

  //日志
  @Inject
  logger: Logger

  // 数据库连接
  //   connection: Connection = createDBConnection()

  server: MyServer
  async init() {
    let server = new MyServer({ port: 9876 })
    this.server = server

    server
      .start()
      .then(() => {
        // symlinkCommon() //同步common文件夹
        console.log('服务启动！')
      })
      .catch((e) => {
        console.log('服务异常', e)
      })

    server.on('Connect', (connection: Connection) => {
      console.log(`${getTime()}来人|人数|${server.connections.size}`)
    })

    // 处理客户端关闭连接
    server.on('DisConnect', (connection: Connection) => {
      console.log(`${getTime()}走人|人数|${server.connections.size}`)
      if (connection.playerId) {
        const player = PlayerManager.Instance.getPlayerById(connection.playerId)
        const rid = player.rid
        if (rid !== -1) {
          RoomManager.Instance.leaveRoom(rid, player.id)
          RoomManager.Instance.syncRooms()
          RoomManager.Instance.syncRoom(rid)
          return {}
        }

        PlayerManager.Instance.removePlayer(connection.playerId)
      }
    })

    // 注册api
    // 登录注册
    server.setApi(ApiFunc.login, (connection: Connection, { player: playerInfo }) => {
      const player = PlayerManager.Instance.createPlayer(connection, playerInfo)
      // 如果还在房间，就跳转战斗
      if (player.rid !== -1) {
      }
      return {
        state: player.state,
      }
    })
    server.setApi(ApiFunc.signIn, (connection: Connection) => {
      const player = PlayerManager.Instance.createPlayer(connection)
      const playerInfo = PlayerManager.Instance.getPlayerView(player)
      return {
        player: playerInfo,
      }
    })

    server.setApi(ApiFunc.RoomCreate, (connection: Connection, data) => {
      if (connection.playerId) {
        const room = RoomManager.Instance.joinRoom(RoomManager.Instance.createRoom(data).id, connection.playerId)
        if (room) {
          RoomManager.Instance.syncRooms()
          return {
            room: RoomManager.Instance.getRoomView(room),
          }
        } else {
          throw new Error('ApiRoomCreate room不存在')
        }
      } else {
        throw new Error('ApiRoomCreate 玩家未登录')
      }
    })

    server.setApi(ApiFunc.RoomListByName, (connection: Connection, data) => {
      connection.sendMsg(ApiFunc.RoomList, {
        rooms: RoomManager.Instance.getRoomsView().filter((room) => room.roomName.includes(data.roomName || '')),
      })
    })

    server.setApi(ApiFunc.ApiRoomJoin, (connection: Connection, data) => {
      const { rid, pwd } = data
      if (pwd && pwd !== '') {
        if (pwd !== RoomManager.Instance.getRoomById(rid).pwd) {
          return {
            room: null,
            error: '密码错误',
          }
        }
      }

      const room = RoomManager.Instance.joinRoom(rid, connection.playerId)
      if (room) {
        if (room.players.size > 2 || room.turn > 0) {
          return {
            room: null,
            error: '人数已满',
          }
        }
        // 这是给房间外的人发送的
        RoomManager.Instance.syncRooms()
        // 同步房间内玩家的 房间信息
        RoomManager.Instance.syncRoom(room.id)
        return {
          room: RoomManager.Instance.getRoomView(room),
          error: '',
        }
      } else {
        return {
          room: null,
          error: '房间不存在',
        }
      }
    })

    server.setApi(ApiFunc.ApiRoomLeave, (connection: Connection, data) => {
      if (connection.playerId) {
        const player = PlayerManager.Instance.getPlayerById(connection.playerId)
        if (player) {
          const rid = player.rid
          if (rid !== -1) {
            RoomManager.Instance.leaveRoom(rid, player.id)
            RoomManager.Instance.syncRooms()
            RoomManager.Instance.syncRoom(rid)
            return {}
          } else {
            throw new Error('ApiRoomLeave 玩家不在房间')
          }
        } else {
          throw new Error('ApiRoomLeave 玩家不存在')
        }
      } else {
        throw new Error('ApiRoomLeave 玩家未登录')
      }
    })

    // 房间内部消息
    // 选择角色
    server.setApi(ApiFunc.ApiChooseActor, (connection: Connection, data) => {
      if (connection.playerId) {
        const { actor } = data

        const player = PlayerManager.Instance.getPlayerById(connection.playerId)
        if (player) {
          // 记录
          player.actorName = actor

          const rid = player.rid
          if (rid !== -1) {
            // 通知房间内其他玩家
            for (const otherPlayer of RoomManager.Instance.getRoomById(rid).players) {
              if (otherPlayer.id == player.id) return
              RoomManager.Instance.syncRoom(rid)
            }
            return {}
          } else {
            throw new Error('ApiRoomLeave 玩家不在房间')
          }
        } else {
          throw new Error('ApiRoomLeave 玩家不存在')
        }
      } else {
        throw new Error('ApiRoomLeave 玩家未登录')
      }
    })
    // 确认选择，进入游戏
    server.setApi(ApiFunc.enterGame, (connection: Connection, data) => {
      if (connection.playerId) {
        const { actor } = data

        const player = PlayerManager.Instance.getPlayerById(connection.playerId)
        const rid = player.rid
        // 通知房间内其他玩家
        for (const otherPlayer of RoomManager.Instance.getRoomById(rid).players) {
          if (otherPlayer.id == player.id) continue
          const otherPlayer2 = PlayerManager.Instance.getPlayerById(otherPlayer.id)
          otherPlayer2.connection.sendMsg(ApiFunc.ChooseActor, {
            id: player.id,
            actor,
          })
        }
        return {}
      } else {
        throw new Error('ApiRoomLeave 玩家未登录')
      }
    })

    // 发送技能
    server.setApi(ApiFunc.ApiUseSkill, (connection: Connection, data) => {
      if (connection.playerId) {
        const player = PlayerManager.Instance.getPlayerById(connection.playerId)
        const rid = player.rid
        // 通知房间内其他玩家
        for (const otherPlayer of RoomManager.Instance.getRoomById(rid).players) {
          if (otherPlayer.id == player.id) continue
          const otherPlayer2 = PlayerManager.Instance.getPlayerById(otherPlayer.id)
          otherPlayer2.connection.sendMsg(ApiFunc.UseSkill, {
            ...data,
            id: player.id,
          })
        }
        return {}
      } else {
        throw new Error('ApiRoomLeave 玩家未登录')
      }
    })
  }
}
