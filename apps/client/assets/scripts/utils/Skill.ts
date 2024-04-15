import { isPlayer } from './index'
import { EntityTypeEnum, ISkill } from '../common'
import { BuffEnum, EventEnum, MissType, ParamsNameEnum, SkillPathEnum, Special } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { ActorManager } from '../entity/actor/ActorManager'
import { Component } from 'cc'

/**
 * 添加技能：
 * 在TexturePathEnum配置资源路径
 * 在ActorStateMachine配置新State状态机
 */
// 执行器，用于拆分数据结算
export default class Skill extends Component {
  get otherSkill() {
    if (isPlayer(this.id)) {
      return DataManager.Instance.actor2.skill
    } else {
      return DataManager.Instance.actor1.skill
    }
  }
  get actor() {
    return DataManager.Instance.actors.get(this.id)
  }
  get otherActor() {
    return DataManager.Instance.actors.get(this.otherSkill.id)
  }

  setSkillState() {
    // 确保SkillPathEnum和ParamsNameEnum 的key是一致的
    console.log('设置状态', ParamsNameEnum[this.getKeyByValue(this.skill.particle)])
    this.actor.state = this.skill.animal || ParamsNameEnum[this.getKeyByValue(this.skill.particle)]
  }
  // temp 临时获取key
  getKeyByValue(value, object = SkillPathEnum) {
    return Object.keys(object).find((key) => object[key] === value)
  }

  damage: number
  defense: number
  constructor(public skill: ISkill, public id: number) {
    super()
  }
  onDestroy() {
    // 在对象销毁前取消事件注册
    EventManager.Instance.off(EventEnum.powerFinal, this.powerFinal, this)
    EventManager.Instance.off(EventEnum.attackFinal, this.attackFinal, this)
    EventManager.Instance.off(EventEnum.defenseFinal, this.defenseFinal, this)
    EventManager.Instance.off(EventEnum.missFinal, this.missFinal, this)
    EventManager.Instance.off(EventEnum.continueFinal, this.continueFinal, this)
    EventManager.Instance.off(EventEnum.specialFinal, this.specialFinal, this)
  }

  excute() {
    this.tigerLength = this.skill.type.length
    this.defense = this.skill.defense

    if (this.actor.buffs.has(BuffEnum.loopSword)) {
      this.tigerLength++
      this.actor.shoot(this.otherActor, EntityTypeEnum.Sword, () => {
        this.tiger()
      })
    }

    this.skill.type.forEach((type) => {
      switch (type) {
        case 0:
          EventManager.Instance.on(EventEnum.powerFinal, this.powerFinal, this)
          this.powerHandler()
          break
        case 1:
          // 用命令模式加队列，也可以达到分步骤执行效果
          EventManager.Instance.on(EventEnum.attackFinal, this.attackFinal, this)
          setTimeout(() => {
            this.attackHandler()
          })
          break
        case 2:
          EventManager.Instance.on(EventEnum.defenseFinal, this.defenseFinal, this)
          this.defenseHandler()
          break
        case 3:
          EventManager.Instance.on(EventEnum.missFinal, this.missFinal, this)
          this.missHandler()
          break
        case 4:
          EventManager.Instance.on(EventEnum.continueFinal, this.continueFinal, this)
          this.continueHandler()
          break
        case 5:
          EventManager.Instance.on(EventEnum.specialFinal, this.specialFinal, this)
          this.specialHandler()
          break
      }
    })
  }
  // 虎符  在这里等所有动作执行完进入下一轮
  tigerLength: number = 0
  tiger() {
    this.tigerLength--
    if (this.tigerLength === 0) {
      console.log('下一轮', this.tigerLength)
      EventManager.Instance.emit(EventEnum.handlerNextTurn)
    }
  }

  // 在动画后结算伤害
  attackFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('attack结束')
      // 处理闪避
      if (!this.miss()) {
        // 盾牌碎裂
        console.log('伤害', this.skill.damage)
        this.skill.damage = this.otherActor.shieldBreak(this.skill.damage || 0, this.skill.broken || 0)
        console.log('最终伤害', this.skill.damage)

        this.otherActor.hp -= this.skill.damage

        // 盾牌碎裂,等动画播完再下回合
        if (this.skill.damage >= 0 && this.otherActor.shields.length > 0) {
          this.scheduleOnce(() => {
            this.tiger()
          }, 0.1 * DataManager.Instance.animalTime)
          return
        }
      }
      if (this.skill.damage > 0 && !this.miss()) {
        if (this.actor.buffs.has(BuffEnum.blood)) {
          this.actor.hp += this.skill.damage
        }
        // 波类攻击才闪白
        // EventManager.Instance.emit(EventEnum.flicker, this.otherActor)
      }

      // 盾牌碎裂,等动画播完再下回合
      if (this.damage >= 0 && this.otherActor.shields.length > 0) {
        this.scheduleOnce(() => {
          this.tiger()
        }, 0.1 * DataManager.Instance.animalTime)
        return
      }

      this.tiger()
    }
  }
  // 判断是否被闪避
  miss() {
    // 闪避弹丸类型
    if (this.skill.bullet && this.otherSkill.skill.missType === MissType.Bullet) {
      return true
    }

    let tag = true
    // 默认只能打地面
    if (!this.skill.range) this.skill.range = ['0']
    this.skill.range.forEach((range) => {
      let location = this.otherSkill.skill.location || '0'
      if (range.includes(location.toString())) {
        //只要包含了，就没有被闪避，当然在missType后判断
        tag = false
      }
    })
    return tag
  }
  powerFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('power结束')
      if (isPlayer(this.id))
        EventManager.Instance.emit(EventEnum.updateSkillItem, DataManager.Instance.actors.get(this.id).power)
      this.tiger()
    }
  }
  defenseFinal(actor: ActorManager, damage) {
    if (actor === this.actor) {
      console.log('defense结束')
      this.tiger()
    }
  }
  missFinal(actor: ActorManager) {
    if (actor === this.actor) {
      this.tiger()
    }
  }
  continueFinal(actor: ActorManager) {
    if (actor === this.actor) {
      this.tiger()
    }
  }
  specialFinal(actor: ActorManager) {
    if (actor === this.actor) {
      this.tiger()
    }
  }

  //   每拥有的一种类型都对应一种处理, 等动画执行触发结算时，都是修正好的数值了
  // 蓄力
  powerHandler() {
    const power = this.skill.power
    if (this.actor.power < 6) {
      this.actor.power += power
    }

    this.setSkillState()
  }
  defenseHandler() {
    // 在角色面前生成盾牌
    if (this.skill.shield) {
      if (this.actor.buffs.has(BuffEnum.solid)) {
        this.skill.defense++
      }
      this.actor.generateShield(this.skill.shield, this.skill)
    }
    // 直接防御结束
    EventManager.Instance.emit(EventEnum.defenseFinal, this.actor)
  }
  attackHandler() {
    if (this.skill.speed === 1) {
      // 快速攻击（一般是射击）  立即触发动画
      this.setSkillState()
      if (this.skill.bullet) {
        this.actor.shoot(this.otherActor, this.skill.bullet)
      }
    }

    if (this.skill.target === 1) {
      // 目标是自己
      DataManager.Instance.actor1.hp -= this.skill.damage
      this.tiger()
      return
    } else {
      if (!this.skill.longrang) {
        // if (!this.otherSkill.skill.location || this.otherSkill.skill.location == 0) {
        // 近战攻击，进入移动  反正就两个角色，不用事件系统更方便
        this.actor.state = ParamsNameEnum.Run
        this.actor.move(this.otherActor, () => {
          this.setSkillState()
        })
        // } else {
        //   // 不在范围，骂街
        // }
      }
    }
  }
  missHandler() {
    this.setSkillState()
  }
  continueHandler() {
    if (this.skill.buff?.indexOf(BuffEnum.trap) !== -1) {
      this.actor.state = ParamsNameEnum.Xu
    }
    this.actor.setBuffer(this.skill)
  }
  specialHandler() {
    switch (this.skill.special) {
      case Special.Reflect:
        //bullet存在就代表是远程弹丸攻击
        if (this.otherSkill.skill.bullet) {
          // 这里让盾墙只能保留普通护盾
          EventManager.Instance.on(EventEnum.attackFinal, this.attackFinal, this)
        } else {
          EventManager.Instance.emit(EventEnum.specialFinal, this.actor)
        }
        break
      default:
        // 没有特殊情况直接结束
        EventManager.Instance.emit(EventEnum.specialFinal, this.actor)
        break
    }
  }

  reset() {
    this.powerHandler = null
    this.defenseHandler = null
    this.attackHandler = null
    this.missHandler = null
    this.specialHandler = null
  }
}
