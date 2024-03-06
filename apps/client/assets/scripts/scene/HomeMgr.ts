import {
  _decorator,
  Color,
  Component,
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
        gap: 1,
    })
  }
  onDestroy(){
    this.particleMgr.clear()
  }

  start() {
  }

  update(deltaTime: number) {
    this.particleMgr.update(deltaTime)
  }
}
