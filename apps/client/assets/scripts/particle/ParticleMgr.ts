import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, SpriteFrame, Vec2, Vec3 } from 'cc'
import { IParticleOptions } from '../common/state'
import Particle from './Particle'
import { getRandomNumber } from '../utils'
import { LightParticle } from './LightParticle'
const { ccclass, property } = _decorator

// 粒子系统
export default class ParticleMgr extends Component {
  particles: Particle[] = []
  graphics: Graphics
  timer: number = 0

  private particle: { new (): Particle } // 改为接收一个构造函数
  private options: IParticleOptions = {}

  init(particle, options: IParticleOptions = {}) {
    this.particle = particle
    this.options = options

    this.graphics = this.node.getComponent(Graphics) || this.node.addComponent(Graphics)   

    if (!this.options.gap) {
      this.generateParticles()
    }

    if (this.options.maxRange && this.options.minRange) {
      this.options.max = getRandomNumber(this.options.minRange, this.options.maxRange)
    }

    if (this.options.duration) {
      this.scheduleOnce(() => {
        this.clear()
      }, this.options.duration)
    }
  }

  update(dt: number) {
    // 清空画布
    this.graphics.clear()

    // 持续生成
    if (this.options.gap) {
      if (this.timer > this.options.gap) {
        this.addParticles()
        // this.generateParticles()
        this.timer = 0
      } else {
        this.timer += dt
      }
    }

    this.updateParticles(dt)
  }
  generateParticles() {
    for (let i = 0; i < this.options.max; i++) {
      const particle = new this.particle()
      if(this.options.other) particle.init(this.options.other)
      this.particles.push(particle)
    }
  }
  addParticles() {
    if (this.options.max && this.options.max > this.particles.length) {
      // 清除超出上限的粒子
      this.particles.length = this.options.max
    }
    const particle = new this.particle()
    if(this.options.other) particle.init(this.options.other)
    this.particles.push(particle)
  }
  updateParticles(dt) {
    this.particles.forEach((particle) => {
      particle.update(dt)
      particle.draw(this.graphics)
    })
    // 删除销毁的粒子
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion)
  }

  clear() {
    this.particles.forEach((particle) => (particle.markedForDeletion = true))
  }

  // 粒子聚拢效果
  gather(point: Vec2) {
    const gatherRadius = 200 // 定义聚拢半径
    const gatherSpeed = 100 // 定义聚拢速度

    // 找到触点周围的粒子
    this.particles.forEach((particle) => {
      // 计算粒子与触点的距离
      const distance = Vec2.distance(new Vec2(particle.x, particle.y), point)
      if (distance < gatherRadius) {
        ;(particle as LightParticle).isGather = true
        // 计算方向向量并归一化
        let direction = new Vec2()
        Vec2.subtract(direction, point, new Vec2(particle.x, particle.y))
        direction = direction.normalize()

        // 改变粒子速度，使其朝向触点
        const diffSpeedX =
          (Math.abs(Vec2.distance(new Vec2(particle.x, 0), new Vec2(point.x, 0))) / gatherRadius) * gatherSpeed
        const diffSpeedY =
          (Math.abs(Vec2.distance(new Vec2(0, particle.y), new Vec2(0, point.y))) / gatherRadius) * gatherSpeed
        particle.speedX = direction.clone().multiplyScalar(diffSpeedX).x
        particle.speedY = direction.clone().multiplyScalar(diffSpeedY).y
      }
    })
  }
  offGather() {
    this.particles.forEach((particle) => {
      if ((particle as LightParticle).isGather) {
        ;(particle as LightParticle).isGather = false
        // 触摸结束立即移动
        ;(particle as LightParticle).randomMove()
      }
      // 重置y轴速度
      particle.speedY = Math.random() * 20 + 40
    })
  }
}
