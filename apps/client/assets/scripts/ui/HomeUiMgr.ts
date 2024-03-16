import { _decorator, Component, EventTouch, Node, UITransform } from 'cc'
import NetworkManager from '../global/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('HomeUiMgr')
export class HomeUiMgr extends Component {
  handlerClick(event: EventTouch, type: string) {
    switch (type) {
      case 'singleStart':
        console.log('单机模式')
        break
      case 'Hall':
        if (!NetworkManager.Instance.isConnected) {
          console.log('未连接！')
          NetworkManager.Instance.connect()
        }
        
        break
      default:
        break
    }
  }
}
