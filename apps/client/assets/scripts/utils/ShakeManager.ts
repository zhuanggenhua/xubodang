import { Component, game, _decorator } from 'cc'
import { EventEnum, SHAKE_TYPE_ENUM } from '../enum'
import EventManager from '../global/EventManager'
const { ccclass } = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking: boolean
  private shakeType: SHAKE_TYPE_ENUM
  private oldTime: number
  private oldPos: { x: number; y: number } = { x: 0, y: 0 }

  //振幅
  shakeAmount = 4

  onLoad() {
    EventManager.Instance.on(EventEnum.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EventEnum.SCREEN_SHAKE, this.onShake, this)
  }

  stop() {
    this.isShaking = false
  }

  onShake(type: SHAKE_TYPE_ENUM, shakeAmount?: number) {
    if (this.isShaking) {
      return
    }
    if (shakeAmount) this.shakeAmount = shakeAmount
    else this.shakeAmount = 5
    this.isShaking = true
    this.shakeType = type
    this.oldTime = game.totalTime
    this.oldPos.x = this.node.position.x
    this.oldPos.y = this.node.position.y
  }

  update() {
    this.onShakeUpdate()
  }

  /***
   * 正弦震动
   * y= A * sin *(wx + f)
   */
  onShakeUpdate() {
    if (this.isShaking) {
      //持续时间
      const duration = 200
      //频率
      const frequency = 12
      //当前时间
      const curSecond = (game.totalTime - this.oldTime) / 1000
      //总时间
      const totalSecond = duration / 1000

      const offset = this.shakeAmount * Math.sin(frequency * Math.PI * curSecond)
      if (this.shakeType === SHAKE_TYPE_ENUM.TOP) {
        this.node.setPosition(this.oldPos.x, this.oldPos.y - offset)
      } else if (this.shakeType === SHAKE_TYPE_ENUM.BOTTOM) {
        this.node.setPosition(this.oldPos.x, this.oldPos.y + offset)
      } else if (this.shakeType === SHAKE_TYPE_ENUM.LEFT) {
        this.node.setPosition(this.oldPos.x - offset, this.oldPos.y)
      } else if (this.shakeType === SHAKE_TYPE_ENUM.RIGHT) {
        this.node.setPosition(this.oldPos.x + offset, this.oldPos.y)
      }

      if (curSecond > totalSecond) {
        // 振动结束
        this.isShaking = false
        this.node.setPosition(this.oldPos.x, this.oldPos.y)
      }
    }
  }
}
