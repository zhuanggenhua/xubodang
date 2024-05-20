import { _decorator, Component, director, EventTouch, screen, Node, UITransform, macro, view } from 'cc'
import NetworkManager from '../global/NetworkManager'
import { EventEnum, SceneEnum } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
const { ccclass, property } = _decorator

@ccclass('HomeUiMgr')
export class HomeUiMgr extends Component {
  handlerClick(event: EventTouch, type: string) {
    switch (type) {
      case 'singleStart':
        console.log('单机模式')
        DataManager.Instance.mode = 'single'
        director.loadScene(SceneEnum.Battle)

        // 清除当前缓动动画
        EventManager.Instance.emit(EventEnum.clearTween)
        break
      case 'Hall':
        if (!NetworkManager.Instance.isConnected) {
          console.log('未连接！')
          NetworkManager.Instance.connect()
        }

        DataManager.Instance.mode = 'network'
        director.loadScene(SceneEnum.Hall)

        EventManager.Instance.emit(EventEnum.clearTween)
        break
      case 'tip':
        break
      case 'full':
        view.setOrientation(macro.ORIENTATION_PORTRAIT)
        if (screen.fullScreen()) {
          screen.exitFullScreen()
        } else {
          screen.requestFullScreen() //全屏
        }
        break
      case 'animalSpeed':
        break
      default:
        break
    }
  }
}
