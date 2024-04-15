import { Color, Graphics } from 'cc'
import Particle from './Particle'

// 挖掘碎屑效果
export class LightPillar extends Particle {
  preLineH
  lineH
  x2
  y2
  deg
  constructor() {
    super()
    this.color = new Color('#000000')
    // 宽度
    this.preLineH = 10 //起始宽度
    this.lineH = 10
    this.deg = -75
    // this.color = new Color('#ffffff')
  }
  init(params: any): void {
    const { x, y, width, height } = params
    this.x = x + width - 20
    this.y = y + height / 2 + 10
    // 长度
    this.x2 = this.x + 500
    this.y2 = this.y + 500
  }

  update(dt) {
    super.update(dt)
    if (this.lineH < 50) {
      this.lineH += 0.2
    }
    this.deg += 0.3

    // // 矩形碰撞检测
    // // 怪物没死才处理碰撞
    // this.game.enemies.forEach((enemy) => {
    //     if (checkCollision(enemy, this, 'separation')) {
    //       //发生碰撞 --各处理各的
    //       enemy.handleCollision(this);
    //       // 消灭敌人   --处理乌鸦这种不会被直接杀死的
    //       if (enemy.dead) {
    //         this.game.score += enemy.score;
    //         // 浮动消息 --起始位置到偏移量
    //         this.game.floatingMessages.push(
    //           new FloatingMessageRed(this.game, enemy.score, enemy.x, enemy.y, 150, 50),
    //         );
    //       }
    //     }
    //   });
  }

  draw(graphics: Graphics) {
    graphics.fillColor = this.color
    graphics.rect(this.x, this.y, this.size, this.size)
    graphics.fill()

    // 线性渐变设置的是y方向上的渐变，y不断减小，宽度就不断变大  --注意这里x、y取得是右下角
    const _y = this.y - (this.lineH - this.preLineH) / 2

    // --后面的参数圆角,  根号下 x1-x2的平方+y1-y2的平方
    graphics.rect(
      this.x,
      _y,
      Math.sqrt(Math.pow(this.x - this.x2, 2) + Math.pow(this.y - this.y2, 2)), //宽
      this.lineH, //高
    )
    graphics.fill()
    graphics.stroke()
  }
  destroyed() {
    if (this.y < 0) this.markedForDeletion = true
  }
}
