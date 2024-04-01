import { Tween, tween, Node, Vec3, _decorator, instantiate, IVec2, Vec2, UITransform } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum } from '../../common'
import { EventEnum, ParamsNameEnum, SHAKE_TYPE_ENUM } from '../../enum'
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

  init(actor, type = EntityTypeEnum.Crossbow) {
    this.actor = actor
    this.type = type

    this.fsm = this.addComponent(BulletStateMachine)
    this.fsm.init(type)
    this.state = ParamsNameEnum.Idle
  }

  move(targetNode: Node, callback?: Function) {
    // 带点随机
    const tempPosition = new Vec3(targetNode.position)
    const actorTran = this.actor.node.getComponent(UITransform)
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

    // 修正方向
    // this.angle += Math.random() * 20 - 10
    this.node.setRotationFromEuler(0, 0, this.angle - 90)

    const tw = tween(this.node)
      .to(
        0.4,
        { position: tempPosition },
        {
          onUpdate: (target, ratio) => {
            // target 是当前的节点对象, ratio 是当前动画的完成比率（0.0 到 1.0）
            const tempNode = new Node()
            tempNode.position = this.node.position
            const tran = this.node.getComponent(UITransform)
            tempNode.addComponent(UITransform).setContentSize(tran.height, tran.width)
            if (checkCollision(tempNode, targetNode, [EntityTypeEnum.Crossbow, EntityTypeEnum.Actor])) {
              // 如果检测到碰撞，可以通过 tween.stop() 停止移动
              console.log('子弹碰撞')
              tw.stop()

              EventManager.Instance.emit(
                EventEnum.SCREEN_SHAKE,
                isPlayer(this.actor.id) ? SHAKE_TYPE_ENUM.RIGHT : SHAKE_TYPE_ENUM.LEFT,
              )

              EventManager.Instance.emit(EventEnum.attackFinal, this.actor)

              if (callback) callback()
              // 箭矢驻留
              if (this.actor.skill.damage > 0 && this.actor.skill.skill.bullet === EntityTypeEnum.Crossbow) {
                this.node.setPosition(getNodePos(this.node, this.actor.skill.otherActor.node))
                this.node.setParent(this.actor.skill.otherActor.node)
                // 避免翻转影响
                if (isPlayer(this.actor.id)) this.node.scale = new Vec3(1, -1, 1)
                return
              }

              this.node.destroy()
            }
          },
        },
      )
      .start() // 开始执行tween
  }
}
