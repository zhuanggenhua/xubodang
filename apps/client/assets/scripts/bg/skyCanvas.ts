import { _decorator, Component, Graphics, Node, UITransform, v2, v3, Vec2, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('skyCanvas')
export class skyCanvas extends Component {
  graphics: Graphics = null
  stars: Star[] = []
  vp: Vec2 = v2(0, 0)
  fl: number = 0
  starsNumber: number = 1500
  speed: number = 0.0005
  easing: number = 0.93
  target: Vec2 = v2(0, 0)

  onLoad() {
    this.graphics = this.getComponent(Graphics)
    const uiTransform = this.getComponent(UITransform)
    this.vp = v2(uiTransform.width / 2, uiTransform.height / 2)
    this.fl = uiTransform.width / 2
    this.generateStars()
  }

  generateStars() {
    const uiTransform = this.getComponent(UITransform)
    for (let i = 0; i < this.starsNumber; i++) {
      let x = Math.random() * 2 * uiTransform.width - uiTransform.width
      let y = Math.random() * 2 * uiTransform.height - uiTransform.height
      let z = Math.random() * 1000 - 500
      this.stars.push(new Star(x, y, z, this.vp, this.fl))
    }
  }

  update(dt: number) {
    this.graphics.clear()

    this.target.x *= this.easing
    this.target.y *= this.easing

    this.stars.forEach((star) => {
      star.rotateX(this.target.x)
      star.rotateY(this.target.y)
      if (star.visible) {
        star.draw3D(this.graphics)
      }
    })
  }
}

export default class Star {
  pos: Vec3 = v3(0, 0, 0)
  scale: Vec2 = v2(1, 1)
  visible: boolean = false
  vp: Vec2
  fl: number

  constructor(x: number, y: number, z: number, vp: Vec2, fl: number) {
    this.pos = v3(x, y, z)
    this.vp = vp
    this.fl = fl
  }

  rotateX(angle: number) {
    let cos = Math.cos(angle)
    let sin = Math.sin(angle)
    let y = this.pos.y * cos - this.pos.z * sin
    let z = this.pos.z * cos + this.pos.y * sin
    this.pos.y = y
    this.pos.z = z
  }

  rotateY(angle: number) {
    let cos = Math.cos(angle)
    let sin = Math.sin(angle)
    let x = this.pos.x * cos - this.pos.z * sin
    let z = this.pos.z * cos + this.pos.x * sin
    this.pos.x = x
    this.pos.z = z
  }

  draw3D(graphics: Graphics) {
    if (this.pos.z > -this.fl) {
      let scale = this.fl / (this.fl - this.pos.z)
      let x = this.vp.x + this.pos.x * scale
      let y = this.vp.y + this.pos.y * scale
      this.visible = true
      graphics.fillRect(x, y, 2 * this.scale.x * scale, 2 * this.scale.y * scale)
    } else {
      this.visible = false
    }
  }
}
