import { _decorator, Component, director, EventTouch, Node } from 'cc'
import DataManager from '../global/DataManager'
import { EventEnum, SceneEnum } from '../enum'
import EventManager from '../global/EventManager'
import { createPopTip } from '../utils'
import NetworkManager from '../global/NetworkManager'
import { ApiFunc } from '../common'
const { ccclass, property } = _decorator

@ccclass('ButtonMgr')
export class ButtonMgr extends Component {
  async handlerBack(e: EventTouch, name: SceneEnum) {
    if(name === SceneEnum.Hall) {
        // 处理离开房间
        NetworkManager.Instance.callApi(ApiFunc.ApiRoomLeave)
        // 通知ai上线，名字改为托管中
    }
    director.loadScene(name)
  }
}
