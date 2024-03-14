import { Singleton } from '../common/common/base'
import { Logger, Inject, ApiFunc } from '../common'
import { MyServer } from '../common/core/MyServer'
import { Connection } from '../common/core/Connection'
import { getTime } from '../utils'
import PlayerManager from './PlayerManager'

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
    server.setApi(ApiFunc.signIn, (connection: Connection) => {
      const player = PlayerManager.Instance.createPlayer(connection)

      return {
        playerId: player.id,
      }
    })
  }
}
