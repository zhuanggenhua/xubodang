import { _decorator, Color, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';

export default class Particle {
  private markedForDeletion: boolean = false
  protected size: number = 0
  protected speedX: number = 0
  protected speedY: number = 0
  protected x: number = 0
  protected y: number = 0
  protected color: Color = null
  constructor(protected node: Node) {
    this.x = this.node.position.x
    this.y = this.node.position.y
  }

  update() {
    this.move()
    this.destroyed()
  }
  move() {
    // 粒子的移动
    this.x -= this.speedX
    this.y -= this.speedY
  }
  destroyed() {
    // 粒子不断变小
    this.size *= 0.95
    if (this.size < 0.5) this.markedForDeletion = true //基于大小的清除
  }
}
