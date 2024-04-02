import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, SpriteFrame, tween, Tween, Vec3 } from 'cc'
import Particle from './Particle'
import DataManager from '../global/DataManager'

// 挖掘碎屑效果
export class GroundSplash extends Particle {
  gravity: number //重力
  constructor() {
    super()
    this.size = Math.random() * 20 + 10

    this.speedX = Math.random() * 300 - 150 //0-2
    this.speedY = Math.random() * 150 + 300 //1-3  --这是向上的
    this.gravity = 0
    this.color = new Color('#000000')
    // this.color = new Color('#ffffff')
  }
  init(params: any): void {
    const { x, y } = params
    this.x = x - this.size * 0.5
    this.y = y - this.size * 0.5
  }

  update(dt) {
    super.update(dt)
    // this.gravity += 60 * dt //匀加速曲线
    // this.speedY -= this.gravity;
    this.gravity += 100 * dt // 重力加速度约为 980 cm/s^2
    this.speedY -= this.gravity // 速度随时间受重力影响变化
    // this.y -= this.gravity
  }

  draw(graphics: Graphics) {
    graphics.fillColor = this.color
    graphics.rect(this.x, this.y, this.size, this.size)
    graphics.fill()
  }
  destroyed() {
    if (this.y < 0) this.markedForDeletion = true
  }
}
