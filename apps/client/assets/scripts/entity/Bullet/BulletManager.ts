import { Tween, tween, Node, Vec3, _decorator, instantiate, IVec2, Vec2, UITransform } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum } from '../../common'
import { EventEnum, MissType, ParamsNameEnum, SHAKE_TYPE_ENUM, Special } from '../../enum'
import DataManager from '../../global/DataManager'
import EventManager from '../../global/EventManager'
import ObjectPoolManager from '../../global/ObjectPoolManager'
import { BulletStateMachine } from './BulletStateMachine'
import { checkCollision, getNodePos, isPlayer, rad2Angle } from '../../utils'
import { ActorManager } from '../actor/ActorManager'
const { ccclass } = _decorator

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
  //静态数据
  actor: ActorManager
  type: EntityTypeEnum

  //动态数据
  position: IVec2
  direction: IVec2

  private angle: number
  private tw: Tween<any>
  private targetPos: Vec3

  // 添加子弹： 在TexturePathEnum添加状态参数，在PrefabPathEnum添加预制体
  init(actor, type = EntityTypeEnum.Crossbow) {
    this.actor = actor
    this.type = type

    this.fsm = this.addComponent(BulletStateMachine)
    this.fsm.init(type)
    this.state = ParamsNameEnum.Idle
  }

  move(targetNode: Node, callback?: Function, callbackStart?: Function) {
    if (callbackStart) callbackStart()
    // 真正的目标位置，带点随机
    // new Vec3(targetNode.position)
    const tempPosition = getNodePos(targetNode, DataManager.Instance.battleCanvas.node)

    const actorTran = this.actor.node.getComponent(UITransform)

    let offsetX = 200
    if (this.type == EntityTypeEnum.Bo) offsetX = 50
    tempPosition.x += isPlayer(this.actor.id) ? offsetX : -offsetX
    tempPosition.y += (Math.random() * actorTran.width) / 2 - actorTran.width / 4

    // 设置方向
    const directionVec2 = new Vec2(
      tempPosition.x - this.actor.node.position.x,
      tempPosition.y - this.actor.node.position.y,
    ).normalize()
    const { x, y } = directionVec2
    const side = Math.sqrt(x * x + y * y)
    //   当点在第二象限时,使用-y获取第四象限的对应角度，然后加180得到第二象限的角度
    this.angle = x > 0 ? rad2Angle(Math.asin(y / side)) : rad2Angle(Math.asin(-y / side)) + 180
    if (isPlayer(this.actor.id)) console.log('玩家角度', this.angle)
    else console.log('敌人角度', this.angle)

    // 修正方向   不同预制体初始方向不同
    let offsetRange = -90
    let shootSpeed = 0.3
    switch (this.type) {
      case EntityTypeEnum.Sword:
        shootSpeed = 0.2
        offsetRange = -45
        break
      case EntityTypeEnum.Yu:
        shootSpeed = 0.2
        break
    }

    // this.angle += Math.random() * 20 - 10
    this.node.getChildByName('Sprite').setRotationFromEuler(0, 0, this.angle + offsetRange)

    const tempNode = new Node('tempNode')
    tempNode.parent = this.node.parent
    const tran = this.node.getComponent(UITransform)
    tempNode.addComponent(UITransform).setContentSize(tran.height, tran.width)
    const tw = tween(this.node)
      .to(
        shootSpeed * DataManager.Instance.animalTime,
        { position: tempPosition },
        {
          //  target 是当前的节点对象, ratio 是当前动画的完成比率（0.0 到 1.0）
          onUpdate: (target, ratio) => {
            // 闪避，则不处理碰撞
            if (this.actor.skill.miss()) return
            // 重新设置箭矢的宽高
            tempNode.position = this.node.position

            if (checkCollision(tempNode, targetNode, [EntityTypeEnum.Crossbow, EntityTypeEnum.Actor])) {
              tempNode.destroy()
              if (callback) callback()
              // 如果检测到碰撞，可以通过 tween.stop() 停止移动
              console.log('子弹碰撞')
              tw.stop()

              this.actor.onAttack()

              // 打到人身上
              if (targetNode.getComponent(ActorManager)) {
                // 箭矢驻留
                if (this.actor.skill.skill?.bullet === EntityTypeEnum.Crossbow) {
                  this.node.setPosition(getNodePos(this.node, this.actor.skill.otherActor.node))
                  this.node.setParent(this.actor.skill.otherActor.node)
                  // 避免翻转影响
                  if (isPlayer(this.actor.id)) this.node.scale = new Vec3(-this.node.scale.x, this.node.scale.y, 1)
                  return
                }
              } else {
                // 如果是反射盾
                if (this.actor.otherSkill.skill.special === Special.Reflect) {
                  if (this.actor.skill.skill?.bullet) {
                    // 设置方向的时候就会翻转
                    // this.node.scale = new Vec3(1, -this.node.scale.y, 1)

                    this.move(
                      this.actor.shields[this.actor.shields.length - 1]?.node || this.actor.node,
                      () => {},
                      () => {
                        // 用回调修正攻击者
                        this.actor.otherActor.skill.skill = this.actor.skill.skill
                        this.actor = this.actor.otherActor
                        // this.actor.otherActor.onAttack()
                      },
                    )
                    return
                  }

                  EventManager.Instance.emit(EventEnum.specialFinal, this.actor.otherActor)
                }
              }

              this.node.destroy()
            }
          },
        },
      )
      .call(() => {
        tempNode.destroy()
        // 跟踪波处理
        if (this.actor.skill.skill.special === Special.gengzongbo && !this.actor.skill.miss()) {
          this.move(
            this.actor.otherActor.shields[this.actor.otherActor.shields.length - 1]?.node || this.actor.otherActor.node,
          )
          return
        }

        if (callback) callback()
        this.actor.onAttack()
        if (this.type != EntityTypeEnum.Crossbow) this.node.destroy()
      })
      .start() // 开始执行tween
  }
}
