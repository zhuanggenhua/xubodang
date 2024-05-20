import { _decorator, Animation, AnimationClip, Color, Graphics, Size, tween, UITransform, v3, Vec2, Vec3 } from 'cc'
import State, { ANIMATION_SPEED } from '../../base/State'
import StateMachine, { getInitParamsTrigger } from '../../base/StateMachine'
import { EntityTypeEnum } from '../../common'
import { ParamsNameEnum, SHAKE_TYPE_ENUM, EventEnum, Special } from '../../enum'
import { ActorManager, flyHeight } from './ActorManager'
import EventManager from '../../global/EventManager'
import DataManager from '../../global/DataManager'
import { createUINode, isPlayer, rad2Angle, setPrefab } from '../../utils'
import { LightPillar } from '../../particle/LightPillar'
import ParticleMgr from '../../particle/ParticleMgr'
import { Door } from '../../particle/Door'

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
      // 不明原因导致白名单无法触发帧事件
      const whiteList = [ParamsNameEnum.Xu, ParamsNameEnum.Bo, ParamsNameEnum.men]
      const name = this.animationComponent.defaultClip.name
      // 白名单内的动画结束后都要转为静止动画
      if (whiteList.some((v) => name.includes(v))) {
        this.node.getComponent(ActorManager).state = ParamsNameEnum.Idle
      }
      // xu的事件
      if ([ParamsNameEnum.Xu].some((v) => name.includes(v))) {
        EventManager.Instance.emit(EventEnum.powerFinal, this.actor)

        // 气功炮
        if (this.actor.skill.skill.special == Special.qigongpao) {
          // 不影响其他canvans
          const canvas2 = this.node.getChildByName('canvas2')
          canvas2.setParent(this.actor.node.parent)
          canvas2.setPosition(this.actor.node.position)

          this.scheduleOnce(() => {
            this.actor.state = ParamsNameEnum.WuKong
            this.scheduleOnce(() => {
              let offsetX = isPlayer(this.actor.id) ? -100 : 100
              const { x, y } = this.actor.otherActor.flyPosition
              this.actor.node.position = new Vec3(x + offsetX, y)
              this.actor.state = ParamsNameEnum.qigongpao
              this.actor.location = this.actor.skill.skill.location
              this.scheduleOnce(() => {
                const angle = isPlayer(this.actor.id) ? -80 : -80
                const canvas = this.node.getChildByName('canvas')
                canvas.setRotationFromEuler(0, 0, angle)
                const graphics = canvas.getComponent(Graphics) || canvas.addComponent(Graphics)
                graphics.fillColor = new Color('#6B6B6B')
                graphics.rect(
                  this.actor.tran.height,
                  -250,
                  1000, //宽
                  500, //高
                )
                graphics.fill()

                this.scheduleOnce(() => {
                  this.actor.onAttack()
                  EventManager.Instance.emit(EventEnum.flicker, this.actor.otherActor)
                  canvas.setRotationFromEuler(0, 0, 0)
                  graphics.clear()
                  this.scheduleOnce(() => {
                    this.actor.node.position =
                      this.actor.location == '0' ? this.actor.initPosition : this.actor.flyPosition

                    canvas2.setParent(this.actor.node)
                    canvas2.setPosition(v3(0, 0))
                  }, 0.2 * DataManager.Instance.animalTime)
                }, 0.2 * DataManager.Instance.animalTime)
              }, 0.2 * DataManager.Instance.animalTime)
            }, 0.2 * DataManager.Instance.animalTime)
          }, 0.2 * DataManager.Instance.animalTime)
        }
      }

      // 影分身
      if (name.includes(ParamsNameEnum.clone)) {
        this.actor.state = ParamsNameEnum.Idle
        // this.actor.onClone()
      }

      // 咖喱棒下一阶段
      if (name.includes(ParamsNameEnum.AncientSwordIdle)) {
        this.actor.state = ParamsNameEnum.AncientSwordAttack
      }
      if (name.includes(ParamsNameEnum.AncientSwordAttack)) {
        this.actor.node.setPosition(this.actor.node.position.add(v3(0, -50, 0)))
        this.actor.tran.setContentSize(200, 200)
        this.scheduleOnce(() => {
          this.actor.onAttack()
        }, 0.1 * DataManager.Instance.animalTime)
      }

      // 龟波气功
      if (name.includes(ParamsNameEnum.QiGong)) {
        this.actor.state = ParamsNameEnum.Bo
        let offsetX = isPlayer(this.actor.id) ? 50 : 50
        // 设置方向
        let target
        if (this.actor.otherActor.location == '1') target = this.actor.otherActor.flyPosition
        else target = this.actor.otherActor.node
        target = this.actor.otherActor.node
        const directionVec2 = new Vec2(
          target.position.x - this.actor.node.position.x,
          target.position.y - this.actor.node.position.y,
        ).normalize()
        const { x: x1, y: y1 } = directionVec2
        const side = Math.sqrt(x1 * x1 + y1 * y1)
        //   当点在第二象限时,使用-y获取第四象限的对应角度，然后加180得到第二象限的角度
        let angle = x1 > 0 ? rad2Angle(Math.asin(y1 / side)) : rad2Angle(Math.asin(-y1 / side)) + 180
        if (!isPlayer(this.actor.id)) {
          angle += 180
          // 对空和对地都要修正
          if (this.actor.location == '1' && this.actor.otherActor.location == '0') {
            angle -= 30
          }
          if (this.actor.otherActor.location == '1' && this.actor.location == '0') {
            angle += 30
          }
        }

        const canvas = this.node.getChildByName('canvas2')
        const particleMgr = canvas.getComponent(ParticleMgr) || canvas.addComponent(ParticleMgr)
        particleMgr.init(LightPillar, {
          max: 1,
          other: {
            x: offsetX,
            y: 0,
            target: this.actor.otherActor,
            angle,
            particleMgr,
          },
        })
      }
    }
    // this.animationComponent.on(Animation.EventType.FINISHED, reset)
    this.animationComponent.on(Animation.EventType.STOP, reset)
    // 处理多阶段动画
    this.animationComponent.on(Animation.EventType.PLAY, () => {
      const name = this.animationComponent.defaultClip.name

      if (name.includes(ParamsNameEnum.AncientSwordIdle)) {
        // 光粒子
        // 不能让其他canvas受到影响
        this.actor.node.children.forEach((child) => {
          if (child.name.includes('canvas')) child.position.add(v3(0, -50, 0))
        })
        // 角色的锚点应该在脚下！
        this.actor.node.setPosition(this.actor.node.position.add(v3(0, 50, 0)))
        this.actor.tran.setContentSize(200, 300)
        DataManager.Instance.battleCanvas.drawLight()
      }

      // 龟波气功
      if (name.includes(ParamsNameEnum.QiGong)) {
        const bo = setPrefab('Bo', this.node)
        bo.setPosition(v3(-20, -40, 0))
        const boTran = bo.getComponent(UITransform)
        boTran.setContentSize(10, 10)
        tween(boTran)
          .to(0.3 * DataManager.Instance.animalTime, { contentSize: new Size(80, 80) })
          .call(() => {
            bo.destroy()
          })
          .start()
      }

      // 元气弹
      if (name.includes(ParamsNameEnum.yuanqidan)) {
        if (this.actor.isClone) return
        const bo = setPrefab('Bo', this.node)
        bo.setParent(this.node.parent)
        bo.setPosition(v3(this.node.position.x, this.node.position.y + 200))
        const boTran = bo.getComponent(UITransform)
        boTran.setContentSize(10, 10)
        tween(boTran)
          .to(0.5 * DataManager.Instance.animalTime, { contentSize: new Size(500, 500) })
          .call(() => {
            this.actor.shoot(this.actor.otherActor, bo)
          })
          .start()
      }

      // 三重罗生门
      if (name.includes(ParamsNameEnum.men)) {
        // DataManager.Instance.battleCanvas.drawMen(isPlayer(this.actor.id))
        const canvas = this.node.getChildByName('canvas3')
        const particleMgr = canvas.getComponent(ParticleMgr) || canvas.addComponent(ParticleMgr)
        const offsetY = this.actor.tran.height / 2
        particleMgr.init(Door, {
          max: 1,
          other: {
            actor: this.actor,
            y: this.actor.location == '0' ? -offsetY : -offsetY - flyHeight,
          },
        })
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
        1 / 6,
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
    this.stateMachines.set(
      ParamsNameEnum.Sun,
      new State(
        this,
        `${this.type}${ParamsNameEnum.Sun}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        0.2 * DataManager.Instance.animalTime,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.WuKong,
      new State(
        this,
        `${this.type}${ParamsNameEnum.WuKong}`,
        AnimationClip.WrapMode.Normal,
        [
          {
            frame: ANIMATION_SPEED * 2, // 第 2帧时触发事件
            func: 'onFly', // 事件触发时调用的函数名称
            params: [],
          },
        ],
        1 / 6,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.QiGong,
      new State(
        this,
        `${this.type}${ParamsNameEnum.QiGong}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        0.3 * DataManager.Instance.animalTime,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.qigongpao,
      new State(
        this,
        `${this.type}${ParamsNameEnum.qigongpao}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        0.2 * DataManager.Instance.animalTime,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.clone,
      new State(this, `${this.type}${ParamsNameEnum.clone}`, AnimationClip.WrapMode.Normal),
    )
    this.stateMachines.set(
      ParamsNameEnum.yuanqidan,
      new State(
        this,
        `${this.type}${ParamsNameEnum.yuanqidan}`,
        AnimationClip.WrapMode.Loop,
        [],
        ANIMATION_SPEED,
        0.5 * DataManager.Instance.animalTime,
      ),
    )
    this.stateMachines.set(
      ParamsNameEnum.men,
      new State(
        this,
        `${this.type}${ParamsNameEnum.men}`,
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
