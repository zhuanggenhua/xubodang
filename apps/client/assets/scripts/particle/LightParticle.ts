import { _decorator, Color, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import Particle from './Particle'

// 光辉背景
export class LightParticle extends Particle {
  constructor(node: Node) {
    super(node)
    this.size = Math.random() * 10 + 10
    // 粒子在宽度上散布
    this.x = this.x - this.size * 0.5
    this.y = this.y - this.size * 0.5

    this.speedX = Math.random(); //0-2
    this.speedY = Math.random() * 2 + 1; //1-3  --这是向上的

    this.color = new Color()
  }
}
