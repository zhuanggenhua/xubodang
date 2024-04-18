import { animation, Animation, AnimationClip, Component, Sprite, SpriteFrame } from 'cc'

import StateMachine from './StateMachine'
import { ResourceManager } from '../global/ResourceManager'
import { sortSpriteFrame } from '../utils'
import DataManager from '../global/DataManager'
import { EventEnum } from '../enum'
import EventManager from '../global/EventManager'
import { ActorManager } from '../entity/actor/ActorManager'

/***
 * 帧间隔,越大播放速度越快，一秒12帧
 */
export const ANIMATION_SPEED = 1 / 8

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default class State extends Component {
  private animationClip: AnimationClip

  constructor(
    private fsm: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private events: Array<AnimationClip.IEvent> = [], //帧事件
    private speed: number = ANIMATION_SPEED,
    private time: number = null, // 设置定时动画
    private force: boolean = false,
  ) {
    super()
    this.speed /= DataManager.Instance.animalTime
    //生成动画轨道属性
    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const spriteFrames = DataManager.Instance.textureMap.get(this.path)

    console.log('spriteFrames', spriteFrames, this.path);
    

    // 添加关键帧 --每个二元组有两个元素：时间戳（单位为秒）和相应的SpriteFrame对象
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [
      index * this.speed,
      item,
    ])
    // assignSorted(frames) 是一个方法，用来将预先排序好的关键帧数据分配给轨道
    track.channel.curve.assignSorted(frames) //curve : 曲线对象，它储存了属性值随时间变化的信息

    //动画添加轨道
    this.animationClip = new AnimationClip()
    this.animationClip.name = this.path
    this.animationClip.duration = frames.length * this.speed
    this.animationClip.addTrack(track)
    this.animationClip.wrapMode = this.wrapMode

    if (fsm.node.getComponent(ActorManager)) {
      if (fsm.node.getComponent(ActorManager).isClone) return
    }
    // 帧事件
    for (const event of this.events) {
      this.animationClip.events.push(event)
    }
    // 必要的，虽然弃用了但有用？
    // 方法内容：this.events = this._events;
    this.animationClip.updateEventDatas()
  }

  run() {
    // 不重复执行
    if (this.fsm.animationComponent.defaultClip?.name === this.animationClip.name && !this.force) {
      return
    }
    console.log('状态切换', this.animationClip.name)

    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()

    if (this.time) {
      this.scheduleOnce(() => {
        // 在这里再次调用stop以确保动画停止
        if (this.fsm?.animationComponent.node) this.fsm?.animationComponent?.stop()
      }, this.time)
    }
  }
}
