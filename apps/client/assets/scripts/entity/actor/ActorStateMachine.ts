import { _decorator, Animation, AnimationClip, v3 } from 'cc'
import State, { ANIMATION_SPEED } from '../../base/State'
import StateMachine, { getInitParamsTrigger } from '../../base/StateMachine'
import { EntityTypeEnum } from '../../common'
import { ParamsNameEnum, SHAKE_TYPE_ENUM, EventEnum } from '../../enum'
import { ActorManager } from './ActorManager'
import EventManager from '../../global/EventManager'
import DataManager from '../../global/DataManager'
import { isPlayer } from '../../utils'
import { LightPillar } from '../../particle/LightPillar'

const { ccclass } = _decorator

@ccclass('ActorStateMachine')
export class ActorStateMachine extends StateMachine {
  actor: ActorManager
  init(type: EntityTypeEnum, actor: ActorManager) {
    // actor 有不同类型
    this.type = type
    this.actor = actor
    this.animationComponent = this.node.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
  }

  initAnimationEvent() {
    const reset = () => {
      const whiteList = [ParamsNameEnum.Xu, ParamsNameEnum.Bo]
      const name = this.animationComponent.defaultClip.name
      // 白名单内的动画结束后都要转为静止动画
      if (whiteList.some((v) => name.includes(v))) {
        this.node.getComponent(ActorManager).state = ParamsNameEnum.Idle
      }
      // xu的事件
      if ([ParamsNameEnum.Xu].some((v) => name.includes(v))) {
        EventManager.Instance.emit(EventEnum.powerFinal, this.actor)
      }

      if (name.includes(ParamsNameEnum.AncientSwordIdle)) {
        // 咖喱棒下一阶段
        DataManager.Instance.battleCanvas.drawLightPillar()
        this.actor.state = ParamsNameEnum.AncientSwordAttack
      }
      if (name.includes(ParamsNameEnum.AncientSwordAttack)) {
        // 没有动画，用闪白将就下
        EventManager.Instance.emit(EventEnum.flicker, this.actor.otherActor)
        EventManager.Instance.emit(EventEnum.moveBack, this.actor.otherActor, 200, 0)
        this.scheduleOnce(() => {
          this.actor.onAttack()
        }, 0.2)
      }
    }
    // this.animationComponent.on(Animation.EventType.FINISHED, reset)
    this.animationComponent.on(Animation.EventType.STOP, reset)
    this.animationComponent.on(Animation.EventType.PLAY, () => {
      const name = this.animationComponent.defaultClip.name

      if (name.includes(ParamsNameEnum.AncientSwordIdle)) {
        // 光粒子
        this.actor.node.setPosition(this.actor.node.position.add(v3(0, 50, 0)))
        this.actor.tran.setContentSize(300, 300)
        DataManager.Instance.battleCanvas.drawLight()
      }
    })
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
      new State(this, `${this.type}${ParamsNameEnum.Idle}`),
    )
    this.stateMachines.set(
      ParamsNameEnum.Run,
      new State(this, `${this.type}${ParamsNameEnum.Run}`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      ParamsNameEnum.Xu,
      new State(
        this,
        `${this.type}${ParamsNameEnum.Xu}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        0.2 * DataManager.Instance.animalTime,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.Kan,
      new State(this, `${this.type}${ParamsNameEnum.Kan}`, AnimationClip.WrapMode.Normal, [
        {
          frame: ANIMATION_SPEED * 2, // 第 2帧时触发事件
          func: 'onAttack', // 事件触发时调用的函数名称
          params: [],
        },
      ]),
    )
    this.stateMachines.set(
      ParamsNameEnum.ShieldImpact,
      new State(this, `${this.type}${ParamsNameEnum.ShieldImpact}`, AnimationClip.WrapMode.Normal, [
        {
          frame: ANIMATION_SPEED * 1, // 第 2帧时触发事件
          func: 'onAttack', // 事件触发时调用的函数名称
          params: [],
        },
      ]),
    )
    this.stateMachines.set(
      ParamsNameEnum.Jump,
      new State(
        this,
        `${this.type}${ParamsNameEnum.Jump}`,
        AnimationClip.WrapMode.Normal,
        [
          {
            frame: ANIMATION_SPEED * 2, // 第 2帧时触发事件
            func: 'onJump', // 事件触发时调用的函数名称
            params: [],
          },
        ],
        1 / 4,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.Crossbow,
      new State(this, `${this.type}${ParamsNameEnum.Crossbow}`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      ParamsNameEnum.Spade,
      new State(
        this,
        `${this.type}${ParamsNameEnum.Spade}`,
        AnimationClip.WrapMode.Loop,
        [
          {
            frame: ANIMATION_SPEED * 1, // 第 2帧时触发事件
            func: 'onSpade', // 事件触发时调用的函数名称
            params: [],
          },
        ],
        // 1/4
      ),
    )

    // 咖喱棒动画，分两个阶段
    this.stateMachines.set(
      ParamsNameEnum.AncientSwordIdle,
      new State(
        this,
        `${this.type}${ParamsNameEnum.AncientSwordIdle}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        1 * DataManager.Instance.animalTime,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.AncientSwordAttack,
      new State(this, `${this.type}${ParamsNameEnum.AncientSwordAttack}`, AnimationClip.WrapMode.Normal, [], 1 / 6),
    )

    // 动漫人
    this.stateMachines.set(
      ParamsNameEnum.Bo,
      new State(
        this,
        `${this.type}${ParamsNameEnum.Bo}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        0.2 * DataManager.Instance.animalTime,
      ),
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
