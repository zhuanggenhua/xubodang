import { _decorator, Component, EventTouch, Node, UITransform } from 'cc'
const { ccclass, property } = _decorator

@ccclass('HomeUiMgr')
export class HomeUiMgr extends Component {
  handlerClick(event: EventTouch, type: string) {
    switch (type) {
      case 'singleStart':
        console.log('单机模式')
        break
      default:
        break
    }
  }
}
