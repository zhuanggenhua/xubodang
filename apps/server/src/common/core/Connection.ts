import { EventEmitter } from 'stream';
import { MyServer } from './MyServer';
import WebSocket, { WebSocketServer } from 'ws';
import { ApiFunc } from '../common';

const em = new EventEmitter();

interface IItem {
  cb: Function;
  ctx: unknown;
}

// 继承事件类，可以有自己的on、emit
export class Connection extends EventEmitter {
  playerId: number
  private msgMap: Map<ApiFunc, Array<IItem>> = new Map();

  constructor(private server: MyServer, private ws: WebSocket) {
    super();
    this.ws.on('close', () => {
      this.emit('close');
    });

    this.ws.on('message', (buffer: Buffer) => {

      // const typeArray = new Uint8Array(buffer);
      // const str = strdecode(typeArray);

      try {
        // const json = binaryDecode(buffer2ArrayBuffer(buffer))
        // const msg = json
        const msg = JSON.parse(buffer.toString())
        const { name, data } = msg;

        try {    
          if (this.server.apiMap.has(name)) {
            // 模拟的http
            const cb = this.server.apiMap.get(name);
            const res = cb.call(null, this, data);
            this.sendMsg(name, {
              success: true,
              res,
            });
          } else if (this.msgMap.has(name)) {
            this.msgMap.get(name).forEach(({ cb, ctx }) => {
              cb.call(ctx, this, data);
            });
          }
        } catch (error) {
          this.sendMsg(name, {
            success: false,
            error: error.message,
          });
        }
      } catch (error) {
        console.log('消息接收错误', error);
      }
    });
  }

  sendMsg(name: ApiFunc, data: any) {
    const msg = {
      name,
      data,
    };
    const str = JSON.stringify(msg);
    // const typeArray = strencode(str);
    // const buffer = Buffer.from(typeArray)
    this.ws.send(str);


    // const dataArray = binaryEncode(name, data);
    // const buffer = Buffer.from(dataArray.buffer)
    // this.ws.send(buffer);
  }

  listenMsg(name: ApiFunc, cb: (connection: Connection, args: any) => void, ctx: unknown) {
    if (this.msgMap.has(name)) {
      this.msgMap.get(name)?.push({ cb, ctx });
    } else {
      this.msgMap.set(name, [{ cb, ctx }]);
    }
  }
  unlistenMsg(name: ApiFunc, cb: (connection: Connection, args: any) => void, ctx: unknown) {
    if (this.msgMap.has(name)) {
      const index = this.msgMap.get(name)?.findIndex((i) => cb === i.cb && i.ctx === ctx) || -1;
      index > -1 && this.msgMap.get(name)?.splice(index, 1);
    }
  }
}
