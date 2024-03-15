import { EventEmitter } from 'stream'
import { MyServer } from './MyServer'
import WebSocket, { WebSocketServer } from 'ws'
import { ApiFunc, getProtoPathByApiFunc } from '../common'
import protoRoot from '../idl/auto-gen-ws'

const em = new EventEmitter()

interface IItem {
  cb: Function
  ctx: unknown
}

// 继承事件类，可以有自己的on、emit
export class Connection extends EventEmitter {
  playerId: number
  private msgMap: Map<ApiFunc, Array<IItem>> = new Map()

  constructor(private server: MyServer, private ws: WebSocket) {
    super()
    this.ws.on('close', () => {
      this.emit('close')
    })

    this.ws.on('message', (buffer: Buffer) => {
      // 心跳
      if (buffer.toString() === 'ping') {
        this.ws.send('pong')
        return
      }

      // 根据name拿到path，根据path解析二进制数据生成data
      const name = buffer.readUInt8(0) as ApiFunc //=buffer[0]
      const path = getProtoPathByApiFunc(name, 'req')
      // 通过lookup 获取到game.js 对应path的消息类型描述信息  可以理解为一个编译器
      // 描述信息就是一个用于告诉解析器如何处理二进制数据的规则集合
      const coder = protoRoot.lookup(path)
      // 用编译器 解码得到对应的类型
      const data = coder.decode(buffer.slice(1))

      console.log('req',name,data);

      try {
        // const msg = json
        // const msg = JSON.parse(buffer.toString())
        // const { name, data } = data

        try {
          if (this.server.apiMap.has(name)) {
            // 模拟的http
            const cb = this.server.apiMap.get(name)
            const res = cb.call(null, this, data)
            this.sendMsg(name, res)
          } else if (this.msgMap.has(name)) {
            this.msgMap.get(name).forEach(({ cb, ctx }) => {
              cb.call(ctx, this, data)
            })
          }
        } catch (error) {
          console.log('消息处理错误', error)
        }
      } catch (error) {
        console.log('消息接收错误', error)
      }
    })
  }

  sendMsg(name: ApiFunc, data: any) {
    console.log('res',name,data);
    
    
    const nameBuffer = Buffer.alloc(1) //创建一个一字节长的buffer
    nameBuffer.writeUint8(name) //无符号8位整数（即一个字节）写入到 Buffer
    
    const path = getProtoPathByApiFunc(name, 'res')
    const coder = protoRoot.lookup(path)
    const dataBuffer = coder.encode(data).finish() //fish返回编码后的数据
    
    const buffer = Buffer.concat([nameBuffer, dataBuffer])
    
    this.ws.send(buffer)
    // const msg = {
    //   name,
    //   data,
    // }
    // const str = JSON.stringify(msg)
    // this.ws.send(str)
  }

  listenMsg(name: ApiFunc, cb: (connection: Connection, args: any) => void, ctx: unknown) {
    if (this.msgMap.has(name)) {
      this.msgMap.get(name)?.push({ cb, ctx })
    } else {
      this.msgMap.set(name, [{ cb, ctx }])
    }
  }
  unlistenMsg(name: ApiFunc, cb: (connection: Connection, args: any) => void, ctx: unknown) {
    if (this.msgMap.has(name)) {
      const index = this.msgMap.get(name)?.findIndex((i) => cb === i.cb && i.ctx === ctx) || -1
      index > -1 && this.msgMap.get(name)?.splice(index, 1)
    }
  }
}
