import { _decorator, Color, Component, Graphics, instantiate, Node, UITransform } from 'cc'
import DataManager from '../global/DataManager'
import { getRandomNumber } from '../utils'
const { ccclass, property } = _decorator

@ccclass('BattleCanvas')
export class BattleCanvas extends Component {
  graphics: Graphics

  round: number = 0
  width: number = 0
  height: number = 0
  async start() {
    await DataManager.Instance.loadRes() //temp
    this.graphics = this.node.addComponent(Graphics)
    const tran = this.node.getComponent(UITransform)
    this.height = tran.height
    this.round = tran.height / 3
    this.width = tran.width

    // 设置线条颜色
    this.graphics.strokeColor = Color.BLACK // 可以改为你想要的颜色
    this.graphics.fillColor = Color.BLACK
    this.graphics.lineWidth = 10
    this.generaRound()

    this.generateClouds()
  }
  generateClouds() {
    const cloudpre = DataManager.Instance.prefabMap.get('Cloud')

    const count = getRandomNumber(3, 4)
    for (let i = 0; i < count; i++) {
      const cloud = instantiate(cloudpre)
      cloud.parent = this.node

      const tran = cloud.getComponent(UITransform)
      cloud.setPosition(
        getRandomNumber(i * (this.width / count + tran.width / 2), (i + 1) * (this.width / count - tran.width / 2)),
        getRandomNumber(this.height / 1.25, this.height - tran.height / 2),
      )
    }
  }

  generaRound() {
    // 开始绘制路径
    this.graphics.moveTo(0, this.round / 2) // 起始点

    // 生成2到4之间的随机石头数量
    let stoneCount = Math.floor(Math.random() * 3) + 2 // 随机生成2到4个石头

    // 上一个石头的结束位置，用于计算下一个石头的位置
    let lastX = 0

    for (let i = 0; i < stoneCount; i++) {
      // 基于石头数量平均分布，但为每个石头的位置增加随机偏移
      let spaceBetween = this.width / (stoneCount + 1) // 基础间隔
      let randomOffset = (Math.random() * spaceBetween) / 3 - spaceBetween / 6 // 随机偏移量，确保石头之间不会相互重叠
      let startX = lastX + spaceBetween + randomOffset // 计算当前石头的起始位置，包含随机偏移

      // 确保石头的起始位置不会超出画布边界
      startX = Math.min(Math.max(startX, 10), this.width - 20)

      // 画到当前石头的起始位置
      this.graphics.lineTo(startX, this.round / 2)

      // 画石头（半圆形）
      this.graphics.arc(startX + 10, this.round / 2, 10, 0, Math.PI, true)

      // 更新上一个石头的结束位置，考虑随机偏移
      lastX = startX + 20 + randomOffset
    }

    // 从最后一个石头的位置画到节点的右端
    this.graphics.lineTo(this.width, this.round / 2)

    // 描边和填充来显示图形
    this.graphics.stroke()
    this.graphics.fill()
  }

  update(deltaTime: number) {}
}