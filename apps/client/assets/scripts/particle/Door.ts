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
export class Door extends Particle {
  doors
  maxheight = 200
  actor
  done = false
  constructor() {
    super()
  }
  init(params: any): void {
    const { actor } = params
    this.actor = actor
    const isplayer = isPlayer((actor as ActorManager).id)
    const offsetX = isplayer ? -50 : 50

    const door1 = {
      x: DataManager.Instance.battleCanvas.width / 5 + 200 + offsetX,
      y: DataManager.Instance.battleCanvas.round,
      width: 50,
      height: 0,
    }
    const door2 = {
      x: DataManager.Instance.battleCanvas.width / 2 + offsetX,
      y: DataManager.Instance.battleCanvas.round,
      width: 50,
      height: 0,
    }
    const door3 = {
      x: DataManager.Instance.battleCanvas.width - DataManager.Instance.battleCanvas.width / 5 - 200 + offsetX,
      y: DataManager.Instance.battleCanvas.round,
      width: 50,
      height: 0,
    }

    // 顺序不同
    if (isplayer) {
      this.doors.push(door3, door2, door1)
    }
  }

  update(dt) {
    super.update(dt)
    this.doors.forEach((door) => {
      door.height += 800 * dt * DataManager.Instance.animalTime
    })
  }

  draw(graphics: Graphics) {
    graphics.fillColor = new Color('#000')

    let door1 = this.doors[0]
    let door2 = this.doors[1]
    let door3 = this.doors[2]

    if (door1.height < this.maxheight) {
      graphics.rect(
        door1.x,
        door1.y,
        door1.width, //宽
        door1.height, //高
      )
    }
    if (door1.height >= this.maxheight) {
      graphics.rect(
        door2.x,
        door2.y,
        door2.width, //宽
        door2.height, //高
      )
    }
    if (door2.height >= this.maxheight) {
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
