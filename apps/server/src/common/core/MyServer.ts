import { EventEmitter } from 'stream'
import WebSocket, { WebSocketServer } from 'ws'
import { Connection } from './Connection'
import { ApiFunc } from '../common'

export interface IMyServerOptions {
  port: number
}

export class MyServer extends EventEmitter {
  wss?: WebSocketServer
  port: number
  connections: Set<Connection> = new Set()
  apiMap: Map<ApiFunc, Function> = new Map()

  constructor({ port = 8080 }: Partial<IMyServerOptions>) {
    super()
    this.port = port
  }

  start() {
    return new Promise((resolve, reject) => {
      this.wss = new WebSocketServer({ port: this.port })
      this.wss.on('connection', this.handleConnect.bind(this))

      this.wss.on('error', (e) => {
        reject(e)
      })

      this.wss.on('close', () => {
        console.log('MyServer 服务关闭')
      })

      this.wss.on('listening', () => {
        resolve(true)
      })
    })
  }

  handleConnect(ws: WebSocket) {
    //初始化
    const connection = new Connection(this, ws)

    //向外告知有人来了
    this.connections.add(connection)
    this.emit('Connect', connection)

    //向外告知有人走了
    connection.on('close', (code: number, reason: string) => {
      this.connections.delete(connection)
      this.emit('DisConnect', connection, code, reason)
    })
  }

  setApi(apiName: ApiFunc, cb: (connection: Connection, args: any) => void) {
    this.apiMap.set(apiName, cb)
  }
}
