import {
  _decorator,
  Color,
  Component,
  EventTouch,
  GradientRange,
  Graphics,
  instantiate,
  Node,
  ParticleSystem2D,
  Prefab,
  SpriteFrame,
  sys,
  tween,
} from 'cc'
import DataManager, { mapH, mapW } from '../global/DataManager'
import { getRandomNumber } from '../utils'
import ParticleMgr from '../particle/ParticleMgr'
import { LightParticle } from '../particle/LightParticle'
import FaderManager from '../global/FaderManager'
import NetworkManager from '../global/NetworkManager'
import { PrefabPathEnum, TexturePathEnum } from '../enum'
import { ResourceManager } from '../global/ResourceManager'
const { ccclass, property } = _decorator

@ccclass('HomeMgr')
export class HomeMgr extends Component {
  @property(Node)
  canvas: Node = null
  @property(Node)
  bg: Node = null

  particleMgr: ParticleMgr

  async onLoad() {
    DataManager.Instance.loadRes()
    FaderManager.Instance.fadeOut(1000)

    this.particleMgr = this.canvas.addComponent(ParticleMgr)
    this.particleMgr.init(LightParticle, {
      gap: 0.5,
      // max: 1,
    })

    // this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  onDestroy() {
    this.particleMgr.clear()
    // this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this)
  }

  onTouchMove(event: EventTouch) {
    // 辉光聚拢效果
    const touch = event.touch
    this.particleMgr.gather(touch.getLocation())
  }
  onTouchEnd() {
    this.particleMgr.offGather()
  }

  start() {}

  update(deltaTime: number) {
    this.particleMgr.update(deltaTime)
  }
}
