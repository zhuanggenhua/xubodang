import { _decorator, Component, director, Node, ProgressBar, resources, tween } from 'cc'
import { SceneEnum } from '../enum'
import { ResourceManager } from '../global/ResourceManager'
const { ccclass, property } = _decorator

@ccclass('LoadingMgr')
export class LoadingMgr extends Component {
  @property(ProgressBar)
  bar: ProgressBar

  onLoad() {
    this.preLoad()
  }
  preLoad() {
    director.preloadScene(SceneEnum.Home)
    tween(this.bar).to(3, { progress: 0.8 }).start() // 手动+ 0.2, 不然资源过多一开始不走
    resources.preloadDir(
      'texture',
      (cur, total) => {
        this.bar.progress = Math.min(cur / total, 0.8)
      },
      async (err) => {
        if (err) {
          // 发生错误重新加载
          await new Promise((rs) => {
            setTimeout(rs, 2000)
          })
          this.preLoad()
          return
        }

        director.loadScene(SceneEnum.Home)
      },
    )
  }
}
