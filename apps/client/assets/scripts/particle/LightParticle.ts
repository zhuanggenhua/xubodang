import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, SpriteFrame, tween, Tween, Vec3 } from 'cc'
import Particle from './Particle'
import { getRandomNumber } from '../utils/tool'
import { mapH, mapW } from '../global/DataManager'

// 光辉背景
export class LightParticle extends Particle {
  color2: Color
  alpha: number
  flickerDuration: number
  flickerTimer: number
  flickerSpeed: number
  flickerTween: Tween<unknown>
  flickerTween2: Tween<unknown>
  angle: number
  va: number
  curve: number
  borthX: number
  constructor() {
    super()
    this.size = getRandomNumber(5, 7)
    // 粒子在宽度上散布
    this.borthX = getRandomNumber(0, mapW)
    this.y = this.y
    console.log('??', this.x)

    this.speedY = Math.random() * 20 + 40 //1-3  --这是向上的

    // 移动方式：基于sin
    this.angle = 0
    // 速度
    this.va = Math.random() * 10 + 20 // 2 ~ 4

    // 上下浮动范围的随机值  0.2 -- 0.3  --> 0.1 ~ 0.45
    this.curve = Math.random() * 0.4

    // this.color = new Color(255, 242, 0, 200) // 金色
    this.color = new Color(255, 250, 101, 200) // 中金色
    // 背景光环
    this.color2 = new Color(255, 247, 153, 100) // 淡金色

    // 创建一个循环的 tween 来改变 alpha 值，包含闪烁完成后的延时
    const delay = Math.random() * 0.5 + 1
    this.flickerTween = tween(this.color)
      .to(0.5, { a: 0 }, { easing: 'sineInOut' })
      .to(0.5, { a: 200 }, { easing: 'sineInOut' })
      .delay(delay) // 闪烁完成后，延时1秒
      // 确保to按顺序执行
      .union()
      .repeatForever()
      .start()
    this.flickerTween2 = tween(this.color2)
      .to(0.5, { a: 0 }, { easing: 'sineInOut' })
      .to(0.5, { a: 100 }, { easing: 'sineInOut' })
      .delay(delay) // 闪烁完成后，延时1秒
      // 确保to按顺序执行
      .union()
      .repeatForever()
      .start()
  }
  update(dt) {
    super.update(dt)
  }
  move(dt) {
    // 粒子的移动
    this.y += this.speedY * dt

    this.angle += this.va * dt
    // 基于sin函数图像的移动方式
    const diffX = Math.sin((this.angle * Math.PI) / 180) * mapW * this.curve * 0.5
    this.x = this.borthX + diffX
    console.log('???', diffX)
  }
  draw(graphics: Graphics) {
    graphics.fillColor = this.color2
    graphics.rect(this.x + 2, this.y + 2, this.size, this.size)
    graphics.fill()
    graphics.fillColor = this.color
    graphics.rect(this.x, this.y, this.size, this.size)
    graphics.fill()
  }
  destroyed() {
    if (this.y > mapH) {
      this.markedForDeletion = true
      this.flickerTween.stop() // 在对象被销毁时，停止并清理 tween
    }
  }
}
