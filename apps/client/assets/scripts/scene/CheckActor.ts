import { _decorator, Component, director, Node } from 'cc'
import { SceneEnum } from '../enum'
import NetworkManager from '../global/NetworkManager'
import { ApiFunc } from '../common'
const { ccclass, property } = _decorator

@ccclass('CheckActor')
export class CheckActor extends Component {
  onLoad() {
    // director.preloadScene(SceneEnum.Battle)
    // NetworkManager.Instance.listenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
    // NetworkManager.Instance.listenMsg(ApiFunc.MsgGameStart, this.handleGameStart, this)
  }

  onDestroy() {
    // NetworkManager.Instance.unlistenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
    // NetworkManager.Instance.unlistenMsg(ApiFunc.MsgGameStart, this.handleGameStart, this)
  }
  start() {}

  update(deltaTime: number) {}
}
