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

    server.on('DisConnect', (connection: Connection) => {
      console.log(`${getTime()}走人|人数|${server.connections.size}`)
      if (connection.playerId) {
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
      connection.sendMsg(ApiFunc.RoomList, { rooms: RoomManager.Instance.getRoomsView() })
      return {
        state: player.state,
      }
    })
    server.setApi(ApiFunc.signIn, (connection: Connection) => {
      const player = PlayerManager.Instance.createPlayer(connection)
      const playerInfo = PlayerManager.Instance.getPlayerView(player)
      connection.sendMsg(ApiFunc.RoomList, { rooms: RoomManager.Instance.getRoomsView() })
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
        rooms: RoomManager.Instance.getRoomsView().filter((room) => room.roomName.includes(data.roomName)),
      })
    })
    server.setApi(ApiFunc.ApiRoomJoin, (connection: Connection, data) => {
      const { rid, pwd } = data
      if(pwd && pwd !== ''){
        if(pwd !== RoomManager.Instance.getRoomById(rid).pwd){
          return {
            room: null,
            error: '密码错误'
          }
        }
      }

      const room = RoomManager.Instance.joinRoom(rid, connection.playerId)
      if (room) {
        // 这是给房间外的人发送的
        RoomManager.Instance.syncRooms()
        // 同步房间内玩家的 房间信息
        RoomManager.Instance.syncRoom(room.id)
        return {
          room: RoomManager.Instance.getRoomView(room),
          error: ''
        }
      } else {
        return {
          room: null,
          error: '房间不存在'
        }
      }
    })
  }
}
