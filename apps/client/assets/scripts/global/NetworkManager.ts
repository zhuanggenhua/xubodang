import { ApiFunc, EntityTypeEnum } from '../common'
import { Singleton } from '../common/base'
import { EventEnum } from '../enum'
import DataManager from './DataManager'
import { instantiate, sys } from 'cc'
import EventManager, { IItem } from './EventManager'

const TIMEOUT = 5000

interface ICallApiRet<T> {
  success: boolean
  res?: T
  error?: Error
}

export default class NetworkManager extends Singleton {
  static get Instance() {
    return super.GetInstance<NetworkManager>()
  }

  isConnected = false
  port = 9876
  ws: WebSocket
  private map: Map<ApiFunc, Array<IItem>> = new Map()

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(true)
        return
      }
      EventManager.Instance.on(EventEnum.ReConnect, this.reconnect, this)

      this.ws = new WebSocket(`ws://localhost:${this.port}`)
      // 设置传输的二进制类型
      this.ws.binaryType = 'arraybuffer'
      this.ws.onopen = async () => {
        resolve(true)
        this.isConnected = true

        // 登录或注册
        // 通过uuid标记用户唯一性
        let uuid = sys.localStorage.getItem('uuid')
        if (uuid) {
          // 登录
          NetworkManager.Instance.callApi(ApiFunc.login, { uuid })
        } else {
          // 注册
          let { playerId } = await NetworkManager.Instance.callApi(ApiFunc.signIn)
          console.log('playerId', playerId);
          sys.localStorage.setItem('uuid', playerId)
        }
      }
      this.ws.onclose = () => {
        this.isConnected = false
        reject(false)
        EventManager.Instance.emit(EventEnum.ReConnect)
      }
      this.ws.onerror = (e) => {
        this.isConnected = false
        console.log('ws错误', e)
        reject(false)
        EventManager.Instance.emit(EventEnum.ReConnect)
      }
      this.ws.onmessage = (e) => {
        try {
          // const json = binaryDecode(e.data)
          const json = JSON.parse(e.data)
          const { name, data } = json

          if (this.map.has(name)) {
            this.map.get(name).forEach(({ cb, ctx }) => {
              cb.call(ctx, data)
            })
          }
        } catch (error) {
          console.log('消息接收错误', error)
        }
      }
    })
  }
  async connectServer() {
    if (!(await NetworkManager.Instance.connect().catch(() => false))) {
      await new Promise((resolve) => setTimeout(resolve, 1000)) //防止无限 递归
      await this.connectServer()
    }
  }
  // 断线重连
  async reconnect() {
    // const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.ReConnect)
    // const reconnect = instantiate(prefab)
    // reconnect.setParent(DataManager.Instance.stage)
    await this.connectServer()
  }

  // 有返回值的属于api，没有的属于msg
  // keyof创建IModel['api']所有键组成的联合类型
  callApi(name: ApiFunc, data: any = {}): any {
    return new Promise((resolve, reject) => {
      try {
        // 超时处理
        const timer = setTimeout(() => {
          resolve({ success: false, error: new Error('timeout') })
          this.unlistenMsg(name as any, cb, null)
        }, TIMEOUT)

        // 回调处理
        //  模仿http 只接收一次
        const cb = (res) => {
          resolve(res)
          clearTimeout(timer)
          this.unlistenMsg(name as any, cb, null)
        }
        this.listenMsg(name as any, cb, null)

        this.sendMsg(name as any, data)
      } catch (error) {
        resolve({ success: false, error: error as Error })
      }
    })
  }

  async sendMsg(name: ApiFunc, data: any) {
    // const view = binaryEncode(name, data)
    // this.ws.send(view.buffer)

    this.ws.send(JSON.stringify({ name, data }))
    // 模拟延迟
    // await new Promise(resolve => setTimeout(resolve, 100));
  }

  listenMsg(name: ApiFunc, cb: (args: any) => void, ctx: unknown) {
    if (this.map.has(name)) {
      this.map.get(name).push({ cb, ctx })
    } else {
      this.map.set(name, [{ cb, ctx }])
    }
  }
  unlistenMsg(name: ApiFunc, cb: (args: any) => void, ctx: unknown) {
    if (this.map.has(name)) {
      const index = this.map.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx)
      index > -1 && this.map.get(name).splice(index, 1)
    }
  }
}
