import { Color, Node, Graphics, UITransform, Vec2, Vec3 } from 'cc'
import Particle from './Particle'
import DataManager from '../global/DataManager'
import { checkCollision, createUINode, isPlayer, rad2Angle } from '../utils'
import { EventEnum } from '../enum'
import EventManager from '../global/EventManager'
import ParticleMgr from './ParticleMgr'
import { ActorManager, flyHeight } from '../entity/actor/ActorManager'
import { EntityTypeEnum } from '../common'

// 城墙  表现层，无逻辑
export class Wall extends Particle {
  actor: ActorManager
  doors = []
  height = 0
  maxHeight = flyHeight
  width = 100
  x: number
  y: number
  done = false
  constructor() {
    super()
  }

  init(params: any): void {
    const { actor } = params
    this.actor = actor
    this.x = -this.width / 2
    const offsetY = this.actor.tran.height / 2
    this.y = this.actor.location == '0' ? -offsetY : -offsetY - flyHeight
  }

  update(dt) {
    super.update(dt)

    if (this.height >= this.maxHeight && !this.done) {
      EventManager.Instance.emit(EventEnum.continueFinal, this.actor)
      // this.y = -flyHeight
      this.y = -this.actor.tran.height / 2 - flyHeight
      this.actor.location = '1'
      this.done = true
    }
    if (this.height >= this.maxHeight) return
    this.height += 100 * dt * DataManager.Instance.animalTime
  }

  draw(graphics: Graphics) {
    graphics.fillColor = new Color('#000')

    graphics.rect(
      this.x,
      this.y,
      this.width, //宽
      this.height, //高
    )
    const battleSize = 20
    // 城垛
    for (let i = 0; i < 3; i++) {
      graphics.rect(this.x + i * (battleSize * 2), this.height + this.y, battleSize, battleSize)
    }

    graphics.fill()
    // graphics.stroke()
  }
  destroyed() {
    // this.markedForDeletion = true
  }
}
