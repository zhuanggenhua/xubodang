import { _decorator, tween, Tween, UITransform, Vec3, Node, instantiate, SpriteFrame, Sprite, Rect, v3 } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum, ISkill } from '../../common'
import { EventEnum, ParamsNameEnum, SHAKE_TYPE_ENUM, SkillPathEnum, TexturePathEnum } from '../../enum'
import DataManager from '../../global/DataManager'
import Skill from '../../utils/Skill'
import { checkCollision, isPlayer } from '../../utils'
import { ActorStateMachine } from './ActorStateMachine'
import EventManager from '../../global/EventManager'
import { BulletManager } from '../Bullet/BulletManager'
import SplitFrame from '../../utils/SplitFrame'

const { ccclass, property } = _decorator

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
  id: number
  bulletType: EntityTypeEnum

  //动态数据
  _hp: number = 0
  get hp() {
    return this._hp
  }
  set hp(hp) {
    this._hp = hp
    EventManager.Instance.emit(EventEnum.updateHp, this.id)
  }
  hpMax: number
  power: number = 5
  buffs: any[] = []
  // position: IVec2;
  // direction: IVec2;
  skill: Skill = null
  tran: UITransform

  shields = []

  initPosition: Vec3 = new Vec3(0, 0)

  private tw: Tween<unknown>

  // private wm: WeaponManager;
  init(id, type: EntityTypeEnum, hp) {
    this.id = id
    this.hpMax = hp
    this.hp = hp
    this.tran = this.node.getComponent(UITransform)

    this.fsm = this.addComponent(ActorStateMachine)
    this.fsm.init(type)

    this.state = ParamsNameEnum.Idle

    const offsetX = DataManager.Instance.battleCanvas.width / 5
    if (isPlayer(id)) {
      this.initPosition = new Vec3(offsetX, DataManager.Instance.battleCanvas.round + this.tran.height / 2)
    } else {
      this.initPosition = new Vec3(
        DataManager.Instance.battleCanvas.width - offsetX,
        DataManager.Instance.battleCanvas.round + this.tran.height / 2,
      )
    }
    this.reset()

    EventManager.Instance.on(EventEnum.onPower, this.onPower, this)
  }
  onDestroy() {
    EventManager.Instance.off(EventEnum.onPower, this.onPower, this)
  }

  generateShield(shield: SkillPathEnum, defense: number) {
    const prefab = DataManager.Instance.prefabMap.get('RoundShield')
    const roundShield = instantiate(prefab)
    roundShield.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(shield)

    roundShield.parent = this.node.getChildByName('Rubbish')
    roundShield.setPosition(50, 0)
    // 保存护盾
    this.shields.push({
      defense,
      node: roundShield,
    })
  }
  shieldBreak(damage: number) {
    for (let i = 0; i < this.shields.length; i++) {
      const shield = this.shields[i]
      damage -= shield.defense

      if (damage >= 0) {
        const split = shield.node.addComponent(SplitFrame)
        split.init()

        this.shields.splice(this.shields.indexOf(shield), 1)
      }
    }
    if (damage < 0) damage = 0
    return damage
  }

  shoot(targetNode: Node, bulletEnum: EntityTypeEnum) {
    const prefab = DataManager.Instance.prefabMap.get(bulletEnum)
    const bullet = instantiate(prefab)
    // bullet.addComponent(UITransform).setContentSize(100, 20)
    bullet.setParent(this.node.parent)
    bullet.setPosition(this.node.position.x + 100, this.node.position.y)
    const bulletManager = bullet.addComponent(BulletManager)
    bulletManager.init(this)
    bulletManager.move(targetNode)
  }
  move(targetNode: Node, callback: Function) {
    const tw = tween(this.node)
      .to(
        0.4,
        { position: targetNode.position },
        {
          onUpdate: (target, ratio) => {
            // 这里可以调用你的碰撞检测方法
            // target 是当前的节点对象, ratio 是当前动画的完成比率（0.0 到 1.0）
            if (checkCollision(this.node, targetNode)) {
              // 如果检测到碰撞，可以通过 tween.stop() 停止移动
              console.log('碰撞')
              tw.stop()
              callback()
            }
          },
        },
      )
      .start() // 开始执行tween
  }

  onJump() {
    const jumpHeight = 200 // 跳跃高度为头顶100像素
    const duration = 1 // 跳跃动作持续时间为1秒
    tween(this.node)
      .sequence(
        // 向上跳跃
        tween().to(
          duration / 2,
          { position: v3(this.node.position.x, this.node.position.y + jumpHeight, this.node.position.z) },
          { easing: 'quadOut' },
        ),
        // 落回原点
        tween().to(
          duration / 2,
          { position: v3(this.node.position.x, this.node.position.y, this.node.position.z) },
          { easing: 'quadIn' },
        ),
      )
      .start() // 开始执行tween
  }

  onAttack() {
    EventManager.Instance.emit(EventEnum.SCREEN_SHAKE, isPlayer(this.id) ? SHAKE_TYPE_ENUM.RIGHT : SHAKE_TYPE_ENUM.LEFT)
    EventManager.Instance.emit(EventEnum.attackFinal, this)
  }
  onPower(type: EventEnum) {
    EventManager.Instance.emit(EventEnum.powerFinal, this)
  }
  reset() {
    this.state = ParamsNameEnum.Idle
    this.node.setPosition(this.initPosition)
    this.node.getChildByName('Rubbish').destroyAllChildren()
    this.shields = []
  }

  useSkill(skill: ISkill) {}
}
