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
  tween,
} from 'cc'
import { mapH, mapW } from '../global/DataManager'
import { getRandomNumber } from '../utils/tool'
import ParticleMgr from '../particle/ParticleMgr'
import { LightParticle } from '../particle/LightParticle'
const { ccclass, property } = _decorator

const blinkInterval = 1 // 闪烁间隔时间（秒）

@ccclass('HomeMgr')
export class HomeMgr extends Component {
  @property(Node)
  canvas: Node = null
  @property(Node)
  bg: Node = null

  particleMgr: ParticleMgr

  onLoad() {
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
