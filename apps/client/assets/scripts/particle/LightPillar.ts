import { Color, Node, Graphics, UITransform, Vec2, Vec3 } from 'cc'
import Particle from './Particle'
import DataManager from '../global/DataManager'
import { checkCollision, createUINode, getCollisionNode, isPlayer, rad2Angle } from '../utils'
import { EventEnum } from '../enum'
import EventManager from '../global/EventManager'
import ParticleMgr from './ParticleMgr'
import { ActorManager } from '../entity/actor/ActorManager'
import { EntityTypeEnum } from '../common'

// 龟波气功
export class LightPillar extends Particle {
  lineH
  angle
  width
  maxWidth
  tempNode: Node
  target
  done = false
  constructor() {
    super()
    // 宽度
    this.width = 0
    this.maxWidth = 800
    this.lineH = 80

    // this.color = new Color('#ffffff')

    this.tempNode = createUINode()
  }
  init(params: any): void {
    const { x, y, target, angle, particleMgr } = params
    this.x = x
    this.y = y - this.lineH
    this.target = target
    this.tempNode.parent = target.otherActor.node

    this.tempNode.setPosition(this.x, this.y)

    particleMgr.node.setRotationFromEuler(0, 0, angle)
  }

  update(dt) {
    super.update(dt)
    // if (this.lineH < 50) {
    //   this.lineH += 0.2
    // }
    // this.deg += 0.3
    if (this.width >= this.maxWidth) return
    this.width += 800 * dt * DataManager.Instance.animalTime

    // 矩形碰撞检测  -- 因为不能设置锚点所以直接用两倍宽
    this.tempNode.getComponent(UITransform).setContentSize(this.width * 2, this.lineH)
    if (checkCollision(this.tempNode, getCollisionNode(this.target), [null, EntityTypeEnum.Actor]) && !this.done) {
      EventManager.Instance.emit(EventEnum.attackFinal, this.target.otherActor)
      this.done = true
      // EventManager.Instance.emit(EventEnum.flicker, this.target)
    }
  }

  draw(graphics: Graphics) {
    graphics.fillColor = new Color('#0229fe')
    graphics.rect(
      this.x,
      this.y,
      this.width, //宽
      this.lineH, //高
    )
    let height = this.lineH
    graphics.arc(this.x + this.width, this.y + this.lineH * 0.5, height * 0.5, 0.5 * Math.PI, 1.5 * Math.PI, false)
    graphics.fill()

    graphics.fillColor = new Color('#1effff')
    graphics.rect(
      this.x,
      this.y + this.lineH * 0.2,
      this.width, //宽
      this.lineH * 0.6, //高
    )
    height = this.lineH * 0.6
    graphics.arc(this.x + this.width, this.y + this.lineH * 0.5, height * 0.5, 0.5 * Math.PI, 1.5 * Math.PI, false)
    graphics.fill()

    graphics.fillColor = new Color('#ffffff')
    graphics.rect(
      this.x,
      this.y + this.lineH * 0.35,
      this.width, //宽
      this.lineH * 0.3, //高
    )
    height = this.lineH * 0.3
    graphics.arc(this.x + this.width, this.y + this.lineH * 0.5, height * 0.5, 0.5 * Math.PI, 1.5 * Math.PI, false)
    graphics.fill()
    // graphics.stroke()
  }
  destroyed() {
    if (this.width >= this.maxWidth) {
      if(!this.done){
        EventManager.Instance.emit(EventEnum.attackFinal, this.target.otherActor)
      }
      this.markedForDeletion = true
    }
  }
}
