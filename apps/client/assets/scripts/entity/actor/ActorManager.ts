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
} from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum, ISkill } from '../../common'
import {
  BuffEnum,
  EventEnum,
  ParamsNameEnum,
  SHAKE_TYPE_ENUM,
  SkillPathEnum,
  Special,
  TexturePathEnum,
} from '../../enum'
import DataManager from '../../global/DataManager'
import Skill from '../../utils/Skill'
import { checkCollision, createUINode, getNodePos, isPlayer } from '../../utils'
import { ActorStateMachine } from './ActorStateMachine'
import EventManager from '../../global/EventManager'
import { BulletManager } from '../Bullet/BulletManager'
import SplitFrame from '../../utils/SplitFrame'
import { holeRadius } from '../../ui/BattleCanvas'

const { ccclass, property } = _decorator

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
  id: number
  bulletType: EntityTypeEnum
  count: number = 0 //计数用

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
    return this.skill.otherActor
  }

  shields = []

  initPosition: Vec3 = new Vec3(0, 0)

  private tw: Tween<unknown>
  private tran: UITransform

  beforeDestroy() {
    EventManager.Instance.off(EventEnum.flicker, this.flicker, this)
  }
  protected onLoad(): void {
    EventManager.Instance.on(EventEnum.flicker, this.flicker, this)
  }

  // private wm: WeaponManager;
  init(id, type: EntityTypeEnum, hp) {
    this.id = id
    this.hpMax = hp
    this.hp = hp
    this.lastHp = hp
    this.tran = this.node.getComponent(UITransform)

    this.fsm = this.addComponent(ActorStateMachine)
    this.fsm.init(type, this)

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
    if (skill.buff.indexOf(BuffEnum.trap) !== -1) {
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
      special: skill.special || null,
      node: roundShield,
    })
    console.log('护盾', this.shields)
  }
  shieldBreak(damage: number, broken: number = 0) {
    if (this.shields.length === 0) return damage
    if (this.buffs.has(BuffEnum.spine)) {
      this.otherActor.hp--
    }
    for (let i = 0; i < this.shields.length; i++) {
      const shield = this.shields[i]

      // 两种情况，一种直接破甲一种未破甲，将伤害叠加到攻击上
      if (broken >= shield.defense) {
        broken -= shield.defense
        // 穿甲大于防御直接破防
        this.removeShield(shield)
        continue
      } else {
        damage += broken //修正攻击伤害
        damage -= shield.defense
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
    this.shields.splice(this.shields.indexOf(shield), 1)
  }

  shoot(target: ActorManager, bulletEnum: EntityTypeEnum, callback?: Function) {
    const prefab = DataManager.Instance.prefabMap.get(bulletEnum)
    const bullet = instantiate(prefab)
    // bullet.addComponent(UITransform).setContentSize(100, 20)
    bullet.setParent(this.node.parent)
    bullet.setPosition(
      isPlayer(this.id) ? this.node.position.x + 100 : this.node.position.x - 100,
      this.node.position.y,
    )
    const bulletManager = bullet.addComponent(BulletManager)
    bulletManager.init(this, bulletEnum)
    // 目标是对方或者盾牌
    let targetNode = target.node
    if (target.shields.length > 0) {
      targetNode = target.shields[target.shields.length - 1].node
    }

    bulletManager.move(targetNode, callback || function () {})
  }
  move(target: ActorManager, callback: Function) {
    this.isMove = true
    const tw = tween(this.node)
      .to(
        0.2 * DataManager.Instance.animalTime,
        { position: target.node.position },
        {
          // target 是当前的节点对象, ratio 是当前动画的完成比率（0.0 到 1.0）
          onUpdate: (target1, ratio) => {
            // 闪避，则不处理碰撞
            if (this.skill.miss()) return
            // 优先计算护盾的碰撞
            if (checkCollision(this.node, target.shields[target.shields.length - 1]?.node || target.node)) {
              // 如果检测到碰撞，可以通过 tween.stop() 停止移动
              console.log('碰撞')
              tw.stop()
              callback()
            }
          },
        },
      )
      .call(() => (this.isMove = false))
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

  onJump() {
    const jumpHeight = 200 // 跳跃高度为头顶100像素
    const duration = 0.5 // 跳跃动作持续时间为1秒

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
      .call(() => {
        EventManager.Instance.emit(EventEnum.missFinal, this)
      })
      .start() // 开始执行tween
  }

  onAttack() {
    EventManager.Instance.emit(EventEnum.SCREEN_SHAKE, isPlayer(this.id) ? SHAKE_TYPE_ENUM.RIGHT : SHAKE_TYPE_ENUM.LEFT)
    EventManager.Instance.emit(EventEnum.attackFinal, this)
  }

  onSpade() {
    // 只挖三次
    if (this.count < 3) {
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
  reset() {
    this.state = ParamsNameEnum.Idle
    this.node.setPosition(this.initPosition)
    this.node.getChildByName('Rubbish').destroyAllChildren()
    this.node.eulerAngles = new Vec3(0, 0, 0)
    if (!this.buffs.has(BuffEnum.retain)) this.shields = []
  }

  useSkill(skill: ISkill) {}
}
