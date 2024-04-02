import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, SpriteFrame, Vec3 } from 'cc'

export default class Particle extends Component {
  markedForDeletion: boolean = false
  protected size: number = 0
  speedX: number = 0
  speedY: number = 0
  x: number = 0
  y: number = 0
  protected color: Color = null

  constructor() {
    super()
  }
  init(params){}

  update(dt) {
    this.move(dt)
    this.destroyed()
  }
  move(dt) {
    // 粒子的移动
    this.x += this.speedX * dt
    this.y += this.speedY * dt
  }
  draw(graphics: Graphics) {}
  destroyed() {
    // 粒子不断变小
    this.size *= 0.95
    if (this.size < 0.5) this.markedForDeletion = true //基于大小的清除
  }
}
