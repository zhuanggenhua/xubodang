import { game, RenderRoot2D } from 'cc'
import { createUINode } from '../utils'
import { Singleton } from '../common/base'
import { DEFAULT_FADE_DURATION, DrawManager } from '../ui/DrawManager'

// 场景过渡
export default class FaderManager extends Singleton {
  static get Instance() {
    return super.GetInstance<FaderManager>()
  }

  private _fader: DrawManager = null

  get fader(): DrawManager {
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const node = createUINode()
    node.setParent(root)
    this._fader = node.addComponent(DrawManager)
    this._fader.init()
    game.addPersistRootNode(root)

    return this._fader
  }

  async fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    await this.fader.fadeIn(duration)
  }

  async fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    await this.fader.fadeOut(duration)
  }

  async mask() {
    await this.fader.mask()
  }
}
