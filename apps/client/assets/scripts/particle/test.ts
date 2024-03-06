import { _decorator, Color, Component, Graphics, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('test')
export class test extends Component {
  graphics: Graphics
  start() {
    let graphics = this.node.getComponent(Graphics)
    graphics.strokeColor = Color.RED // 设置正方形的颜色
    graphics.fillColor = Color.RED // 设置正方形的颜色
    graphics.rect(0, 0, 100, 100) // 绘制一个起点在(0,0)边长为100的正方形
    graphics.fill() // 描绘正方形的边界
  }

  update(deltaTime: number) {}
}
