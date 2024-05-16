import { _decorator, Component, director, EventTouch } from 'cc'
import { SceneEnum } from '../enum'
import NetworkManager from '../global/NetworkManager'
import { ApiFunc } from '../common'
import DataManager from '../global/DataManager'
const { ccclass, property } = _decorator

@ccclass('ButtonMgr')
export class ButtonMgr extends Component {
  async handlerBack(e: EventTouch, name: SceneEnum) {
    // 单人模式直接回到首页
    if (DataManager.Instance.mode == 'single') {
      director.loadScene(SceneEnum.Home)
    }

    if(name === SceneEnum.Battle) {
        // 处理离开房间
        NetworkManager.Instance.callApi(ApiFunc.ApiRoomLeave)
        // 通知ai上线，名字改为托管中
        director.loadScene(SceneEnum.Hall)
        return 
    }
    director.loadScene(name)
  }
}
