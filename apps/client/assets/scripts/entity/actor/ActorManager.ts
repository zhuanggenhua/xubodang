import {
  _decorator,
  tween,
  Tween,
  UITransform,
  Vec3,
  Node,
  instantiate,
  SpriteFrame,
  Sprite,
  Rect,
  v3,
  UIOpacity,
  v2,
  Size,
  Color,
  Prefab,
} from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum, IActor, ISkill } from '../../common'
import {
  BuffEnum,
  EventEnum,
  ParamsNameEnum,
  PrefabPathEnum,
  SHAKE_TYPE_ENUM,
  SkillPathEnum,
  Special,
  TexturePathEnum,
} from '../../enum'
import DataManager from '../../global/DataManager'
import Skill from '../../utils/Skill'
import { checkCollision, createUINode, getCollisionNode, getNodePos, isPlayer } from '../../utils'
import { ActorStateMachine } from './ActorStateMachine'
import EventManager from '../../global/EventManager'
import { BulletManager } from '../Bullet/BulletManager'
import SplitFrame from '../../utils/SplitFrame'
import { holeRadius } from '../../ui/BattleCanvas'

const { ccclass, property } = _decorator

export const flyHeight = 150
@ccclass('ActorManager')
export class ActorManager extends EntityManager {
  id: number
  bulletType: EntityTypeEnum
  count: number = 0 //计数用
  actor: IActor

  isMove: boolean = false
  //动态数据
  lastHp: number = 0
  _hp: number = 0
  get hp() {
    return this._hp
  }
  set hp(hp) {
    if (hp < 0) hp = 0
    if (hp > this.hpMax) hp = this.hpMax

    this._hp = hp
    EventManager.Instance.emit(EventEnum.updateHp, this.id)
  }
  hpMax: number
  power: number = 5
  buffs: Set<BuffEnum> = new Set()
  // position: IVec2;
  // direction: IVec2;
  skill: Skill = null
  get otherSkill() {
    return this.skill.otherSkill
  }
  get otherActor() {
    return this.skill?.otherActor
  }

  shields = []
  actorClone: Node[] = [null, null]

  initPosition: Vec3 = new Vec3(0, 0)
  flyPosition: Vec3 = new Vec3(0, 0)

  private tw: Tween<unknown>
  tran: UITransform
  location: '0' | '1' | '2' = '0'

  doorHp: number = 0

  beforeDestroy() {
    EventManager.Instance.off(EventEnum.flicker, this.flicker, this)
    EventManager.Instance.off(EventEnum.moveBack, this.moveBack, this)
    EventManager.Instance.off(EventEnum.missSingle, this.onMissSingle, this)
  }
  protected onLoad(): void {
    EventManager.Instance.on(EventEnum.flicker, this.flicker, this)
    EventManager.Instance.on(EventEnum.moveBack, this.moveBack, this)
    EventManager.Instance.on(EventEnum.missSingle, this.onMissSingle, this)
  }

  isClone: boolean = false
  set state(newState) {
    super.state = newState // 调用父类的 setter
    // 这里可以添加额外的处理逻辑
    if (this.buffs.has(BuffEnum.clone) && !this.isClone) {
      this.actorClone.forEach((node) => {
        if (node) {
          const actor = node.getComponent(ActorManager)
          actor.state = newState
        }
      })
    }
  }

  // private wm: WeaponManager;
  init(id, type: EntityTypeEnum, hp, actor: IActor) {
    this.actor = actor
    this.id = id
    this.hpMax = hp
    this.hp = hp
    this.lastHp = hp
    this.tran = this.node.getComponent(UITransform)

    this.fsm = this.addComponent(ActorStateMachine)
    this.fsm.init(type, this)

    this.state = ParamsNameEnum.Idle

    if (this.isClone) return

    const offsetX = DataManager.Instance.battleCanvas.width / 5
    if (isPlayer(id)) {
      this.initPosition = new Vec3(offsetX, DataManager.Instance.battleCanvas.round + this.tran.height / 2)
    } else {
      this.initPosition = new Vec3(
        DataManager.Instance.battleCanvas.width - offsetX,
        DataManager.Instance.battleCanvas.round + this.tran.height / 2,
      )
    }
    this.flyPosition = new Vec3(this.initPosition.x, this.initPosition.y + flyHeight)
    this.reset()
  }
  onDestroy() {}

  setBuffer(skill: ISkill) {
    if (skill.buff.some((buff) => this.buffs.has(buff))) {
      EventManager.Instance.emit(EventEnum.continueFinal, this)
      return
    }
    skill.buff.forEach((buff) => {
      this.buffs.add(buff)
    })
    // 陷阱类不渲染
    if (skill.buff.indexOf(BuffEnum.wall) !== -1) {
      return
    }
    if (
      skill.buff.indexOf(BuffEnum.trap) !== -1 ||
      skill.buff.indexOf(BuffEnum.fly) !== -1 ||
      skill.buff.indexOf(BuffEnum.clone) !== -1 ||
      skill.buff.indexOf(BuffEnum.door) !== -1
    ) {
      EventManager.Instance.emit(EventEnum.continueFinal, this)
      return
    }

    // 渲染
    const prefab = DataManager.Instance.prefabMap.get('Buff')
    const buff = instantiate(prefab).getChildByName('Icon')
    // 图片是动态的
    buff.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(skill.particle)
    buff.getComponent(Sprite).color = new Color('#000000')
    buff.parent = this.node.getChildByName('Buffs')

    // buff动画
    const newNode = createUINode()
    const newNodeSprite = newNode.addComponent(Sprite)
    newNodeSprite.spriteFrame = DataManager.Instance.skillMap.get(skill.particle)
    newNodeSprite.color = new Color('#000000')
    newNode.setParent(this.node.getChildByName('Rubbish'))
    newNode.getComponent(UITransform).setContentSize(new Size(100, 100))
    const opacity = newNode.addComponent(UIOpacity)
    tween(opacity).to(0.5, { opacity: 0 }).start()
    const newPosition = new Vec3(0, 100, 0)
    tween(newNode)
      .to(0.5, { position: newPosition })
      .call(() => {
        newNode.destroy()
        EventManager.Instance.emit(EventEnum.continueFinal, this)
      })
      .start()
  }

  // 受伤闪白
  flicker(actor: ActorManager) {
    if (actor === this) {
      tween(this.node.getComponent(UIOpacity)).to(0.1, { opacity: 0 }).to(0.1, { opacity: 255 }).start()
    }
  }
  // 击退
  moveBack(actor: ActorManager, offsetX, offsetY = 0) {
    if (actor === this) {
      if (this.otherActor.skill.miss()) return
      if (this.buffs.has(BuffEnum.wall)) return
      const { x, y } = this.node.position
      if (isPlayer(this.id)) offsetX = -offsetX
      console.log('击退', offsetX, offsetY)

      tween(this.node)
        .to(0.2, { position: new Vec3(x + offsetX, y + offsetY, this.node.position.z) }, { easing: 'sineOut' })
        .call(() => {
          if (!this.isMove) this.node.position = this.location == '0' ? this.initPosition : this.flyPosition
        })
        .start()
    }
  }

  generateShield(shield: SkillPathEnum, skill: ISkill) {
    const prefab = DataManager.Instance.prefabMap.get('RoundShield')
    const roundShield = instantiate(prefab)
    // 图片是动态的
    roundShield.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(shield)

    let offsetX = 50
    if (this.buffs.has(BuffEnum.retain) && this.node.getChildByName('Shields').children.length < 8) {
      roundShield.parent = this.node.getChildByName('Shields')
      if (this.node.getChildByName('Shields').children.length > 1) {
        offsetX += 20 * this.node.getChildByName('Shields').children.length
      }
    } else {
      roundShield.parent = this.node.getChildByName('Rubbish')
    }
    roundShield.setPosition(offsetX, 0)
    // 保存护盾
    this.shields.push({
      defense: skill.defense,
      node: roundShield,
    })
    console.log('护盾', this.shields)
  }
  shieldBreak(damage: number, broken: number = 0) {
    if (this.shields.length === 0) return damage
    if (this.buffs.has(BuffEnum.spine) && !this.otherSkill.skill.longrang) {
      this.otherActor.hp--
    }
    for (let i = this.shields.length - 1; i >= 0; i--) {
      const shield = this.shields[i]
      if (this.buffs.has(BuffEnum.solid)) {
        shield.defense++
      }

      // 两种情况，一种直接破甲一种未破甲，将伤害叠加到攻击上
      if (broken >= shield.defense) {
        broken -= shield.defense
        // 穿甲大于防御直接破防
        this.removeShield(shield)
        continue
      } else {
        damage += broken //修正攻击伤害
        // 累计护盾收到的伤害
        const tempDefense = shield.defense
        shield.defense -= damage
        damage -= tempDefense
        if (damage >= 0) {
          this.removeShield(shield)
        } else {
          if (damage < 0) damage = 0
          return damage
        }
      }
    }

    return damage
  }
  removeShield(shield) {
    const split = shield.node.addComponent(SplitFrame)
    split.init()
    shield.node.destroy()
    this.shields.splice(this.shields.indexOf(shield), 1)
  }

  shoot(target: ActorManager, bulletEnum: EntityTypeEnum | Node, callback?: Function) {
    let bullet

    if (bulletEnum instanceof Node) {
      // 处理元气弹
      // bulletEnum 是 Prefab
      bullet = bulletEnum
      bulletEnum = EntityTypeEnum.Bo
    } else {
      const prefab = DataManager.Instance.prefabMap.get(bulletEnum)
      bullet = instantiate(prefab)
      // bullet.addComponent(UITransform).setContentSize(100, 20)
      bullet.setParent(this.node.parent)
      bullet.setPosition(
        isPlayer(this.id) ? this.node.position.x + 100 : this.node.position.x - 100,
        this.node.position.y,
      )
    }

    const bulletManager = bullet.addComponent(BulletManager)
    bulletManager.init(this, bulletEnum)
    // 目标是对方或者盾牌
    let targetNode = getCollisionNode(target, this.skill.skill.damage)

    bulletManager.move(targetNode, callback || function () {})
  }
  move(target: ActorManager, callback: Function) {
    this.state = ParamsNameEnum.Run
    this.isMove = true

    let targetPosition
    if (this.buffs.has(BuffEnum.fly)) {
      targetPosition = target.node.position
    }
    targetPosition = target.initPosition
    // 处理咖喱棒变形
    if (this.otherActor.skill.skill.animal === ParamsNameEnum.AncientSwordIdle)
      targetPosition = new Vec3(targetPosition.x, targetPosition.y - 50, targetPosition.z)
    const tw = tween(this.node)
      .to(
        0.2 * DataManager.Instance.animalTime,
        { position: targetPosition },
        {
          // target 是当前的节点对象, ratio 是当前动画的完成比率（0.0 到 1.0）
          onUpdate: (target1, ratio) => {
            // // 闪避，则不处理碰撞
            // if (this.skill.miss()) return
            // 优先计算护盾的碰撞
            if (checkCollision(this.node, getCollisionNode(target, this.skill.skill.damage))) {
              console.log('碰撞')
              this.isMove = false
              // 如果检测到碰撞，可以通过 tween.stop() 停止移动
              tw.stop() //stop了就不会触发call
              callback()
              this.resetPosition()
            }
          },
        },
      )
      .call(() => {
        this.isMove = false
        this.resetPosition()
        callback()
      })
      .start() // 开始执行tween

    // 如果有陷阱
    if (this.otherActor.buffs.has(BuffEnum.trap)) {
      this.scheduleOnce(() => {
        this.state = ParamsNameEnum.Idle
        DataManager.Instance.battleCanvas.drawTrap()
        // 下落并旋转90度
        tw.stop()

        const offsetX = isPlayer(this.id) ? 200 : -200
        const newPosition = new Vec3(
          this.node.position.x + offsetX,
          this.node.position.y - DataManager.Instance.battleCanvas.round - this.tran.width / 3,
          this.node.position.z,
        )
        tween(this.node)
          .to(0.5, {
            position: newPosition,
            eulerAngles: isPlayer(this.id) ? new Vec3(0, 0, -90) : new Vec3(0, 0, 90),
          })
          .call(() => {
            this.hp -= 2 //如果把技能数据抽取出来就不用硬编码了
            this.skill.skill.damage = 0
            EventManager.Instance.emit(EventEnum.attackFinal, this)
            this.otherActor.buffs.delete(BuffEnum.trap)
          })
          .start()
      }, 0.1)
    }
  }

  onMissSingle(actor: ActorManager) {
    if (actor === this) {
      // 用木头替换
      this.node.getComponent(UIOpacity).opacity = 0
      const prefab = DataManager.Instance.prefabMap.get('Wood')
      const wood = instantiate(prefab)
      wood.setParent(this.node.parent)
      wood.setPosition(this.node.position)

      this.scheduleOnce(() => {
        this.node.getComponent(UIOpacity).opacity = 255
        wood.destroy()
      }, 0.2)
    }
  }

  onFly() {
    if (this.node.position.y == this.initPosition.y) {
      this.node.position = this.flyPosition
      this.location = '1'
    } else {
      this.node.position = this.initPosition
      this.location = '0'
    }
    this.state = ParamsNameEnum.Idle

    EventManager.Instance.emit(EventEnum.missFinal, this)
  }
  onJump() {
    if (this.buffs.has(BuffEnum.fly)) {
      this.onFly()
      return
    }
    const jumpHeight = 200 // 跳跃高度为头顶100像素
    const duration = 0.25 // 跳跃动作持续时间为1秒

    tween(this.node)
      .sequence(
        // 向上跳跃
        tween().to(
          (duration / 2) * DataManager.Instance.animalTime,
          { position: v3(this.node.position.x, this.node.position.y + jumpHeight, this.node.position.z) },
          { easing: 'quadOut' },
        ),
        // 落回原点
        tween().to(
          (duration / 2) * DataManager.Instance.animalTime,
          { position: v3(this.node.position.x, this.node.position.y, this.node.position.z) },
          { easing: 'quadIn' },
        ),
      )
      .call(() => {
        EventManager.Instance.emit(EventEnum.missFinal, this)
      })
      .start() // 开始执行tween
  }

  onAttack() {
    EventManager.Instance.emit(EventEnum.attackFinal, this)
    if (!this.skill.miss())
      EventManager.Instance.emit(
        EventEnum.SCREEN_SHAKE,
        isPlayer(this.id) ? SHAKE_TYPE_ENUM.RIGHT : SHAKE_TYPE_ENUM.LEFT,
      )
    this.state = ParamsNameEnum.Idle
    // this.scheduleOnce(() => {
    //   this.node.setPosition(this.initPosition)
    // }, 0.05)
  }

  onSpade() {
    // 只挖三次
    if (this.count < 3) {
      // 城墙动画
      if (this.skill.skill.buff.indexOf(BuffEnum.wall) !== -1) {
        DataManager.Instance.battleCanvas.drawHole(this.node.position.x)
        return
      }

      if (this.count === 0) {
        DataManager.Instance.battleCanvas.drawHole(this.node.position.x)
      } else {
        DataManager.Instance.battleCanvas.drawHole(this.node.position.x, this.node.position.y - this.tran.height / 2.5)
      }

      tween(this.node)
        .to(
          0.1 * DataManager.Instance.animalTime,
          { position: v3(this.node.position.x, this.node.position.y - holeRadius, this.node.position.z) },
          { easing: 'quadIn' },
        )
        .call(() => {
          if (this.count === 2) {
            this.count = 0
            this.state = ParamsNameEnum.Idle
            EventManager.Instance.emit(EventEnum.missFinal, this)
          }
        })
        .start()

      this.count++
    }
  }

  onClone() {
    // let clone1 = instantiate<Node>(this.node)
    // clone1.setParent(this.node)
    // clone1.setPosition(v3(0, 0))
    // clone1.getComponent(ActorManager).isClone = true
    // clone1.getComponent(ActorManager).init(this.id, EntityTypeEnum.Actor, 1)
    // this.actorClone[0] = clone1
    // let clone2 = instantiate<Node>(this.node)
    // clone2.setParent(this.node)
    // clone2.setPosition(v3(0, 0))
    // clone2.getComponent(ActorManager).isClone = true
    // clone2.getComponent(ActorManager).init(this.id, EntityTypeEnum.Actor, 1)
    // this.actorClone[1] = clone2

    tween(this.actorClone[0])
      .to(0.1, { position: v3(50, 0) })
      .start()
    tween(this.actorClone[1])
      .to(0.1, { position: v3(-50, 0) })
      .start()
  }

  reset() {
    this.state = ParamsNameEnum.Idle
    if (this.buffs.has(BuffEnum.fly) || this.buffs.has(BuffEnum.wall)) {
      this.location = '1'
      this.node.setPosition(this.flyPosition)
    } else {
      this.location = '0'
      this.node.setPosition(this.initPosition)
    }
    this.tran.setContentSize(200, 200)
    this.node.getChildByName('Rubbish').destroyAllChildren()
    this.node.eulerAngles = new Vec3(0, 0, 0)
    if (!this.buffs.has(BuffEnum.retain)) this.shields = []
    else {
      // 保留护盾重置为最基础的
      this.shields.forEach((item) => {
        if (item.defense > 2) item.defense = 2
        item.node.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.RoundShieldFrame)
      })
    }

    // 不能让其他canvas受到影响
    this.node.children.forEach((child) => {
      if (child.name.includes('canvas')) child.setPosition(v3(0, 0))
    })
  }
  resetPosition() {
    this.scheduleOnce(() => {
      this.node.position = this.location == '0' ? this.initPosition : this.flyPosition
    }, 0.2 * DataManager.Instance.animalTime)
  }
}
