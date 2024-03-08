import { _decorator, resources, Asset, SpriteFrame } from 'cc'
import { Singleton } from '../common/base'

export class ResourceManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }

  loadRes(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame>((resolve, reject) => {
      resources.load<SpriteFrame>(path, type, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }

  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir<SpriteFrame>(path, type, (err, res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(res)
      })
    })
  }
}
