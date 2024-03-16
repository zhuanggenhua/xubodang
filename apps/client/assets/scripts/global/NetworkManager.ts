import { ApiFunc, getProtoPathByApiFunc } from '../common'
import { Singleton } from '../common/base'
import { EventEnum } from '../enum'
import DataManager from './DataManager'
import { instantiate, sys } from 'cc'
import EventManager, { IItem } from './EventManager'
import protoRoot from '../proto/index.js'
import { createErrorTip, destroyTip } from '../utils'

const TIMEOUT = 5000

interface ICallApiRet<T> {
  success: boolean
  res?: T
  error?: Error
}

class HeartCheck extends Singleton {
  static get Instance() {
    return super.GetInstance<HeartCheck>()
  }
  ws: WebSocket
  timeout = 2 * 1000 // 每2s向服务端发送一次消息
  serverTimeout = 10 * 1000 // 10s收不到服务端消息算超时
  timer = null
  serverTimer = null
  init(ws: WebSocket) {
    this.ws = ws
  }
  reset() {
    // 心跳检测重置
    clearTimeout(this.timer)
    clearTimeout(this.serverTimer)
    this.timer = null
    this.serverTimer = null
    return this
  }
  start() {
    try {
      // 心跳检测启动
      this.reset() //每次刷新
      this.timer = setTimeout(() => {
        if (this.ws.readyState === WebSocket.OPEN) this.ws.send('ping') // 定时向服务端发送消息
        if (!this.serverTimer) {
          this.serverTimer = setTimeout(() => {
            // 关闭连接触发重连
            console.log('关闭连接触发重连')
            this.ws.close()
          }, this.serverTimeout)
        }
      }, this.timeout)
    } catch (error) {
      console.log('心跳检测异常', error)
    }
  }
}

export default class NetworkManager extends Singleton {
  static get Instance() {
    return super.GetInstance<NetworkManager>()
  }

  connected = false

  isConnected = false
  host = '192.168.1.123'
  port = 9876
  ws: WebSocket
  private map: Map<ApiFunc, Array<IItem>> = new Map()

  connect() {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(true)
        return
      }

      this.ws = new WebSocket(`ws://${this.host}:${this.port}`)
      // 设置传输的二进制类型
      this.ws.binaryType = 'arraybuffer'

      HeartCheck.Instance.init(this.ws)

      this.ws.onopen = async () => {
        // 心跳
        HeartCheck.Instance.start()

        resolve(true)
        this.isConnected = true

        // 登录或注册
        // 通过uuid标记用户唯一性
        let player = sys.localStorage.getItem('player')
        player = JSON.parse(player)
        if (player && player.id !== '') {
          // 登录
          NetworkManager.Instance.callApi(ApiFunc.login, { player })
        } else {
          // 注册
          let { player } = await NetworkManager.Instance.callApi(ApiFunc.signIn)
          console.log('player', player)
          if (player.id) sys.localStorage.setItem('player', JSON.stringify(player))
        }
      }
      this.ws.onclose = () => {
        this.isConnected = false
        reject(false)
        this.reconnect()
      }
      this.ws.onerror = (e) => {
        this.isConnected = false
        console.log('ws错误', e)
      }
      this.ws.onmessage = (e) => {
        HeartCheck.Instance.start()
        if (e.data === 'pong') return

        /** 解包二进制数组，格式是[name,...data] */
        // 转TypeArray方便操作
        const ta = new Uint8Array(e.data)
        // 获取name（RpcFunc是数字类型，不需要解码处理）
        const name = ta[0] as ApiFunc
        // 根据name生成对应的编码器并解码出数据data
        const path = getProtoPathByApiFunc(name, 'res')
        const coder = protoRoot.lookup(path)
        const data = coder.decode(ta.slice(1))

        try {
          // const json = JSON.parse(e.data)
          // const { name, data } = json

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

  // 断线重连
  reconnect() {
    // 当前正在操作连接的时候就不进行连接，防止出现重复连接的情况
    if (this.connected) return
    this.connected = true
    this.connectServer()
  }
  async connectServer() {
    if (!(await NetworkManager.Instance.connect().catch(() => false))) {
      // 弹窗
      createErrorTip('连接中...')
      await new Promise((resolve) => setTimeout(resolve, 2000)) //防止无限 递归
      await this.connectServer()
    } else {
      destroyTip()
      console.log("服务连接成功！");
      this.connected = false
    }
  }

  // 有返回值的属于api，没有的属于msg
  // keyof创建IModel['api']所有键组成的联合类型
  callApi(name: ApiFunc, data: any = {}): any {
    return new Promise((resolve, reject) => {
      try {
        // 超时处理
        // const timer = setTimeout(() => {
        //   resolve({ success: false, error: new Error('timeout') })
        //   this.unlistenMsg(name as any, cb, null)
        // }, TIMEOUT)

        // 回调处理
        //  模仿http 只接收一次
        const cb = (res) => {
          resolve(res)
          // clearTimeout(timer)
          this.unlistenMsg(name as any, cb, null)
        }
        this.listenMsg(name as any, cb, null)

        this.sendMsg(name as any, data)
      } catch (error) {
        // resolve({ success: false, error: error as Error })
      }
    })
  }

  async sendMsg(name: ApiFunc, data: any) {
    // 根据name生成对应的编码器并编码生成TypeArray
    const path = getProtoPathByApiFunc(name, 'req')
    const coder = protoRoot.lookup(path)
    const ta = coder.encode(data).finish()

    /** 封包二进制数组，格式是[name,...data] */
    const ab = new ArrayBuffer(ta.length + 1)
    // DataView基于ArrayBuffer，提供操作二进制的api
    const view = new DataView(ab)
    let index = 0
    // name作为标识
    view.setUint8(index++, name)
    for (let i = 0; i < ta.length; i++) {
      view.setUint8(index++, ta[i])
    }

    this.ws.send(view.buffer)

    // this.ws.send(JSON.stringify({ name, data }))
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
