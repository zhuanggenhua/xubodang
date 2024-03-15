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
  async preLoad() {
    director.preloadScene(SceneEnum.Home)
    // tween(this.bar).to(1, { progress: 0.4 }).start() // 手动+ 0.2, 不然资源过多一开始不走
    const dirs = ['images', 'sounds', 'animations'] // 需要预加载的目录列表
    let loaded = 0 // 已加载的目录数量

    for (const dir of dirs) {
      await new Promise((resolve, reject) => {
        resources.preloadDir(
          dir,
          (cur, total) => {
            // 更新进度条，计算公式根据实际需要调整  Math.min(cur / total, 0.8)
            this.bar.progress = (loaded + cur / total) / dirs.length
          },
          (err) => {
            if (err) {
              console.error(`Failed to load resources from ${dir}:`, err)
              reject(err)
            } else {
              console.log(`${dir} loaded successfully.`)
              resolve(true)
            }
          },
        )
      }).catch(async (err) => {
        // 发生错误，等待2秒后重试当前目录
        await new Promise((rs) => setTimeout(rs, 2000))
        dirs.unshift(dir) // 将未成功加载的目录放回列表前端，准备重新尝试加载
      })
      loaded++ // 更新已加载目录的计数
    }

    // 所有目录加载完成，进度条补满
    tween(this.bar).to(1, { progress: 1 }).start()

    // 最终加载主场景
    director.loadScene(SceneEnum.Home)
  }
}
