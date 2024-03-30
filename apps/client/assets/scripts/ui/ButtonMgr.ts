import { _decorator, Component, director, EventTouch } from 'cc'
import { SceneEnum } from '../enum'
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
