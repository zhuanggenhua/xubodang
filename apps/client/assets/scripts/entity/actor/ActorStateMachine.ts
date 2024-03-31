import { _decorator, Animation, AnimationClip } from 'cc'
import State, { ANIMATION_SPEED } from '../../base/State'
import StateMachine, { getInitParamsTrigger } from '../../base/StateMachine'
import { EntityTypeEnum } from '../../common'
import { ParamsNameEnum, EntityStateEnum, SHAKE_TYPE_ENUM, EventEnum } from '../../enum'
import { ActorManager } from './ActorManager'
import EventManager from '../../global/EventManager'

const { ccclass } = _decorator

@ccclass('ActorStateMachine')
export class ActorStateMachine extends StateMachine {
  init(type: EntityTypeEnum) {
    // actor 有不同类型
    this.type = type
    this.animationComponent = this.node.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
  }

  initAnimationEvent() {
    const reset = () => {
      const whiteList = [ParamsNameEnum.Xu, ParamsNameEnum.Jump, 'attack']
      const name = this.animationComponent.defaultClip.name
      // 白名单内的动画结束后都要转为静止动画
      if (whiteList.some((v) => name.includes(v))) {
        this.node.getComponent(ActorManager).state = ParamsNameEnum.Idle
      }
      // xu的事件
      if ([ParamsNameEnum.Xu].some((v) => name.includes(v))) {
        EventManager.Instance.emit(EventEnum.onPower)
      }
    }
    // this.animationComponent.on(Animation.EventType.FINISHED, reset)
    this.animationComponent.on(Animation.EventType.STOP, reset)
  }

  initParams() {
    Object.keys(ParamsNameEnum).forEach((key) => {
      this.params.set(key, getInitParamsTrigger())
    })
  }

  initStateMachines() {
    this.stateMachines.set(
      ParamsNameEnum.Idle,
      // ${this.type}${ParamsNameEnum.Idle}拼起来就是texture枚举的资源路径
      new State(this, `${this.type}${ParamsNameEnum.Idle}`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      ParamsNameEnum.Run,
      new State(this, `${this.type}${ParamsNameEnum.Run}`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      ParamsNameEnum.Xu,
      new State(this, `${this.type}${ParamsNameEnum.Xu}`, AnimationClip.WrapMode.Loop, [], 2),
    )
    this.stateMachines.set(
      ParamsNameEnum.Kan,
      new State(this, `${this.type}${ParamsNameEnum.Kan}`, AnimationClip.WrapMode.Normal, [
        {
          frame: ANIMATION_SPEED * 3, // 第 2帧时触发事件
          func: 'onAttack', // 事件触发时调用的函数名称
          params: [SHAKE_TYPE_ENUM.RIGHT],
        },
      ]),
    )
    this.stateMachines.set(
      ParamsNameEnum.Jump,
      new State(this, `${this.type}${ParamsNameEnum.Jump}`, AnimationClip.WrapMode.Normal, [], null, 4),
    )
  }

  run() {
    const newState = Object.keys(ParamsNameEnum).find((key) => this.params.get(key).value) || ParamsNameEnum.Idle
    this.currentState = this.stateMachines.get(newState)
    // switch (this.currentState) {
    //   case this.stateMachines.get(ParamsNameEnum.Idle):
    //   case this.stateMachines.get(ParamsNameEnum.Run):
    //   case this.stateMachines.get(ParamsNameEnum.Xu):
    //     if (this.params.get(ParamsNameEnum.Run).value) {
    //       this.currentState = this.stateMachines.get(ParamsNameEnum.Run)
    //     } else if (this.params.get(ParamsNameEnum.Idle).value) {
    //       this.currentState = this.stateMachines.get(ParamsNameEnum.Idle)
    //     } else if (this.params.get(ParamsNameEnum.Xu).value) {
    //       this.currentState = this.stateMachines.get(ParamsNameEnum.Xu)
    //     } else {
    //       this.currentState = this.currentState
    //     }
    //     break
    //   default:
    //     this.currentState = this.stateMachines.get(ParamsNameEnum.Idle)
    //     break
    // }
  }
}
