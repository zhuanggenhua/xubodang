import { _decorator, Color, Component, Graphics, instantiate, Node, UITransform } from 'cc'
import DataManager from '../global/DataManager'
import { getRandomNumber } from '../utils'
import ParticleMgr from '../particle/ParticleMgr'
import { GroundSplash } from '../particle/GroundSplash'
const { ccclass, property } = _decorator

export const holeRadius = 100
@ccclass('BattleCanvas')
export class BattleCanvas extends Component {
  @property(Node)
  canvas2: Node = null

  graphics: Graphics

  round: number = 0
  width: number = 0
  height: number = 0
  async onLoad() {
    this.graphics = this.node.getComponent(Graphics)
    const tran = this.node.getComponent(UITransform)
    this.height = tran.height
    this.round = tran.height / 5
    this.width = tran.width

    await DataManager.Instance.loadRes() //temp

    this.graphics.lineWidth = 10
    this.generaRound()
    this.generateClouds()
  }
  reset() {
    this.graphics.clear()
    this.generaRound()
  }

  // 陷阱
  drawTrap() {
    this.graphics.strokeColor = new Color('#6B6B6B')
    this.graphics.fillColor = new Color('#6B6B6B')
    // +10是补正石头
    const start = this.width / 2 - 200
    this.graphics.rect(start, 0, 400, this.round + 10)
    this.graphics.stroke()
    this.graphics.fill()
    
    // 绘制尖刺
    const spikeWidth = 20 // 尖刺的宽度
    const spikeHeight = 30 // 尖刺的高度
    const numSpikes = 400 / spikeWidth // 根据画布宽度计算尖刺数量
    this.graphics.strokeColor = Color.BLACK
    this.graphics.fillColor = Color.BLACK

    for (let i = 0; i < numSpikes; i++) {
      this.graphics.moveTo(start + i * spikeWidth, 0) // 移动到每个尖刺的起始位置
      this.graphics.lineTo(start + i * spikeWidth + spikeWidth / 2, spikeHeight) // 画到尖刺的顶点
      this.graphics.lineTo(start + (i + 1) * spikeWidth, 0) // 画回尖刺的终点
      this.graphics.close() // 关闭路径
      this.graphics.stroke() // 描边尖刺
      this.graphics.fill() // 填充尖刺
    }
  }

  // 挖掘
  drawHole(x, y = this.round) {
    this.graphics.strokeColor = new Color('#6B6B6B')
    this.graphics.fillColor = new Color('#6B6B6B')
    // 假设 holeRadius 是半圆的半径

    // 从左侧半圆的最高点开始绘制
    this.graphics.moveTo(x - holeRadius, y)

    // 绘制半圆弧形，逆时针（即向下）
    this.graphics.arc(x, y + this.graphics.lineWidth, holeRadius, Math.PI, 0, true)

    // 描边和填充来显示挖掘的半圆
    this.graphics.stroke()
    this.graphics.fill()

    // 触发粒子特效
    const particleMgr = this.canvas2.getComponent(ParticleMgr) || this.canvas2.addComponent(ParticleMgr)
    particleMgr.init(GroundSplash, {
      // gap: 1,
      max: 6,
      other: {
        x: x,
        y: y,
      },
    })
  }

  generaRound() {
    // 设置线条颜色
    this.graphics.strokeColor = Color.BLACK // 可以改为你想要的颜色
    this.graphics.fillColor = Color.BLACK
    // 开始绘制路径
    this.graphics.moveTo(0, this.round) // 起始点

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
      this.graphics.lineTo(startX, this.round)

      // 画石头（半圆形）
      this.graphics.arc(startX + 5, this.round, 5, 0, Math.PI, true)

      // 更新上一个石头的结束位置，考虑随机偏移
      lastX = startX + 20 + randomOffset
    }

    // 从最后一个石头的位置画到节点的右端
    this.graphics.lineTo(this.width, this.round)

    // 填充地下
    this.graphics.lineTo(this.width, 0)
    this.graphics.lineTo(0, 0)
    this.graphics.lineTo(0, this.round)

    // 描边和填充来显示图形
    this.graphics.stroke()
    this.graphics.fill()
  }
  generateClouds() {
    const cloudpre = DataManager.Instance.prefabMap.get('Cloud')

    const count = getRandomNumber(2, 4)
    for (let i = 0; i < count; i++) {
      const cloud = instantiate(cloudpre)
      cloud.parent = this.node

      const tran = cloud.getComponent(UITransform)
      cloud.setPosition(
        getRandomNumber(i * (this.width / count) + tran.width / 2, (i + 1) * (this.width / count) - tran.width / 2),
        getRandomNumber(this.height / 1.25, this.height - tran.height / 2),
      )
    }
  }

  update(deltaTime: number) {}
}
