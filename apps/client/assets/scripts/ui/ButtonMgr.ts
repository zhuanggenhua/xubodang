import { _decorator, Component, director, EventTouch } from 'cc'
import { EventEnum, SceneEnum } from '../enum'
import NetworkManager from '../global/NetworkManager'
import { ApiFunc } from '../common'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import actors from '../config/actor'
const { ccclass, property } = _decorator

// 负责battle场景的按钮管理
@ccclass('ButtonMgr')
export class ButtonMgr extends Component {
  isDisable: boolean = false

  async handlerBack(e: EventTouch, name: SceneEnum) {
    // 单人模式直接回到首页
    if (DataManager.Instance.mode == 'single') {
      director.loadScene(SceneEnum.Home)
    }

    if (name === SceneEnum.Battle) {
      // 处理离开房间
      NetworkManager.Instance.callApi(ApiFunc.ApiRoomLeave)
      // 通知ai上线，名字改为托管中
      director.loadScene(SceneEnum.Hall)
      return
    }
    director.loadScene(name)
  }

  protected onLoad(): void {
    NetworkManager.Instance.listenMsg(ApiFunc.Restart, this.restart, this)
  }
  protected onDestroy(): void {
    NetworkManager.Instance.unlistenMsg(ApiFunc.Restart, this.restart, this)
  }
  count: number = 0
  isDone: boolean = false

  handlerRestart() {
    DataManager.Instance.roomInfo.turn = 0
    if (DataManager.Instance.mode == 'single') {
      director.loadScene(SceneEnum.Battle)
    } else if (DataManager.Instance.mode == 'network') {
      if (this.isDone) return
      this.isDone = true
      this.restart()
      NetworkManager.Instance.callApi(ApiFunc.ApiRestart)
    }
  }
  restart() {
    this.count++
    console.log('准备重启', this.count)

    if (this.count >= 2) {
      director.loadScene(SceneEnum.Battle)
      this.count = 0
    }
  }

  async randomActor() {
    if (this.isDisable) return
    this.isDisable = true
    let active = Object.keys(actors)[Math.floor(Math.random() * Object.keys(actors).length)]

    EventManager.Instance.emit(EventEnum.createActor, active)
    EventManager.Instance.emit(EventEnum.renderSkills, active)
    EventManager.Instance.emit(EventEnum.renderChart, active, 'Graphics1')

    EventManager.Instance.emit(EventEnum.randomActor)

    if (DataManager.Instance.mode === 'network') {
      const res = await NetworkManager.Instance.callApi(ApiFunc.enterGame, {
        actor: active,
      })
    }
  }
}
