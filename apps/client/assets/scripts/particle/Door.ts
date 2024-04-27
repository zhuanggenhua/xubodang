import { Color, Node, Graphics, UITransform, Vec2, Vec3 } from 'cc'
import Particle from './Particle'
import DataManager from '../global/DataManager'
import { checkCollision, createUINode, isPlayer, rad2Angle } from '../utils'
import { EventEnum } from '../enum'
import EventManager from '../global/EventManager'
import ParticleMgr from './ParticleMgr'
import { ActorManager } from '../entity/actor/ActorManager'
import { EntityTypeEnum } from '../common'

// 三重罗生门
export const doorOffsetX = 120
export class Door extends Particle {
  doors = []
  maxheight = 200
  actor
  done = false
  door2Die = false
  door3Die = false
  constructor() {
    super()
  }

  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EventEnum.onDoorDefense, this.onDefense, this)
  }
  init(params: any): void {
    EventManager.Instance.on(EventEnum.onDoorDefense, this.onDefense, this)
    const { actor, y } = params
    this.actor = actor
    const isplayer = isPlayer((actor as ActorManager).id)

    const door1 = {
      x: doorOffsetX,
      y: y,
      width: 50,
      height: 0,
    }
    const door2 = {
      x: doorOffsetX * 2,
      y: y,
      width: 50,
      height: 0,
    }
    const door3 = {
      x: doorOffsetX * 3,
      y: y,
      width: 50,
      height: 0,
    }

    // 顺序不同
    this.doors.push(door1, door2, door3)
  }

  update(dt) {
    super.update(dt)
    this.doors.forEach((door) => {
      if (door.height >= this.maxheight) return
      door.height += 800 * dt * DataManager.Instance.animalTime
    })
  }
  onDefense(actor, hp) {
    if (actor === this.actor) {
      console.log('攻击墙壁', actor, actor.otherActor)

      if (hp < 5) {
        this.door3Die = true
      }
      if (hp < 3) {
        this.door2Die = true
      }
      if (hp < 1) {
        this.markedForDeletion = true
      }
    }
  }

  draw(graphics: Graphics) {
    graphics.fillColor = new Color('#000')

    let door1 = this.doors[0]
    let door2 = this.doors[1]
    let door3 = this.doors[2]

    graphics.rect(
      door1.x,
      door1.y,
      door1.width, //宽
      door1.height, //高
    )

    if (door1.height >= this.maxheight && !this.door2Die) {
      graphics.rect(
        door2.x,
        door2.y,
        door2.width, //宽
        door2.height, //高
      )
    }
    if (door2.height >= this.maxheight && !this.door3Die) {
      graphics.rect(
        door3.x,
        door3.y,
        door3.width, //宽
        door3.height, //高
      )

      if (door3.height >= this.maxheight && !this.done) {
        EventManager.Instance.emit(EventEnum.defenseFinal, this.actor)
        this.done = true
      }
    }

    graphics.fill()
    // graphics.stroke()
  }
  destroyed() {
    // this.markedForDeletion = true
  }
}
