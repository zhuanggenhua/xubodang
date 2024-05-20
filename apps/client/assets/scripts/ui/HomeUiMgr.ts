import { _decorator, Component, director, EventTouch, screen, Node, UITransform, macro, view, Label } from 'cc'
import NetworkManager from '../global/NetworkManager'
import { EventEnum, SceneEnum } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { createErrorTip, createPrompt } from '../utils'
const { ccclass, property } = _decorator

@ccclass('HomeUiMgr')
export class HomeUiMgr extends Component {
  @property(Label)
  speedLabel: Label = null

  index: number = 0

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
        let txt = ['1. 用户名点击即可修改', '2. 封弊者名称开启作弊模式', '3. 包含空格即可隐藏神名']
        createErrorTip(txt[this.index++ % txt.length], 800)
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
        let speed = DataManager.Instance.animalTime
        switch (speed) {
          case 1:
            DataManager.Instance.animalTime = 2
            this.speedLabel.string = '动画速度x2'
            break
          case 2:
            DataManager.Instance.animalTime = 4
            this.speedLabel.string = '动画速度x1'
            break
          case 4:
            DataManager.Instance.animalTime = 1
            this.speedLabel.string = '动画速度x4'
            break

          default:
        }
        break
      default:
        break
    }
  }
}
