import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, SpriteFrame, Vec3 } from 'cc'

export default class Particle {
  markedForDeletion: boolean = false
  protected size: number = 0
  protected speedX: number = 0
  protected speedY: number = 0
  protected x: number = 0
  protected y: number = 0
  protected color: Color = null

  constructor() {}

  update(dt) {
    this.move(dt)
    this.destroyed()
  }
  move(dt) {
    // 粒子的移动
    this.x -= this.speedX * dt
    this.y += this.speedY * dt
  }
  draw(graphics: Graphics) {}
  destroyed() {
    // 粒子不断变小
    this.size *= 0.95
    if (this.size < 0.5) this.markedForDeletion = true //基于大小的清除
  }
}
