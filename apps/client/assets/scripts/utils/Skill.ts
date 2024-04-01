import { isPlayer } from './index'
import { EntityTypeEnum, ISkill } from '../common'
import { EventEnum, ParamsNameEnum, SkillPathEnum } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { ActorManager } from '../entity/actor/ActorManager'

/**
 * 添加技能：
 * 在TexturePathEnum配置资源路径
 * 在actorMgr配置新State状态机
 */
// 执行器，用于延时结算数据
export default class Skill {
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
    this.tigerLength = skill.type.length
    this.damage = skill.damage
    this.defense = skill.defense
  }
  onDestroy() {
    // 在对象销毁前取消事件注册
    EventManager.Instance.off(EventEnum.attackFinal, this.attackFinal, this)
    EventManager.Instance.off(EventEnum.powerFinal, this.powerFinal, this)
    EventManager.Instance.off(EventEnum.defenseFinal, this.defenseFinal, this)
    EventManager.Instance.off(EventEnum.missFinal, this.missFinal, this)
  }

  excute() {
    this.skill.type.forEach((type) => {
      switch (type) {
        case 0:
          this.powerHandler()
          EventManager.Instance.on(EventEnum.powerFinal, this.powerFinal, this)
          break
        case 1:
          EventManager.Instance.on(EventEnum.attackFinal, this.attackFinal, this)
          this.attackHandler()
          break
        case 2:
          EventManager.Instance.on(EventEnum.defenseFinal, this.defenseFinal, this)
          this.defenseHandler()
          break
        case 3:
          EventManager.Instance.on(EventEnum.missFinal, this.missFinal, this)
          this.missHandler()
          break
      }
    })
  }
  // 虎符  在这里等所有动作执行完进入下一轮
  tigerLength: number = 0
  tiger() {
    this.tigerLength--
    if (this.tigerLength <= 0) {
      console.log('下一轮', this.tigerLength)
      EventManager.Instance.emit(EventEnum.handlerNextTurn)
    }
  }

  // 在动画后结算伤害
  attackFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('attack')
      // 盾牌碎裂
      this.damage = this.otherActor.shieldBreak(this.damage || 0)

      this.otherActor.hp -= this.damage
      // 同时防御结束
      EventManager.Instance.emit(EventEnum.defenseFinal, this.otherActor, this.damage)
      this.tiger()
    }
  }
  powerFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('power')
      this.tiger()
      if (isPlayer(this.id))
        EventManager.Instance.emit(EventEnum.updateSkillItem, DataManager.Instance.actors.get(this.id).power)
    }
  }
  defenseFinal(actor: ActorManager, damage) {
    if (actor === this.actor) {
      console.log('defense')
      this.tiger()
    }
  }
  missFinal() {}

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
      this.actor.generateShield(this.skill.shield, this.defense)
    }
  }
  attackHandler() {
    const otherSkill = this.otherSkill.skill

    if (this.skill.speed === 1) {
      // 快速攻击（一般是射击）  立即触发动画
      this.setSkillState()
      if (this.skill.bullet) {
        this.actor.shoot(this.otherActor.node, this.skill.bullet)
      }
    }

    if (this.skill.target === 1) {
      // 目标是自己
      DataManager.Instance.actor1.hp -= this.skill.damage
      return
    } else {
      if (!this.skill.longrang) {
        if (!this.otherSkill.skill.location || this.otherSkill.skill.location == 0) {
          // 近战攻击，进入移动  反正就两个角色，不用事件系统更方便
          this.actor.state = ParamsNameEnum.Run
          this.actor.move(this.otherActor.node, () => {
            this.setSkillState()
          })
        } else {
          // 不在范围，骂街
        }
      }
    }
  }
  missHandler() {
    this.setSkillState()
    this.tiger()
  }
  specialHandler: Function = null

  reset() {
    this.powerHandler = null
    this.defenseHandler = null
    this.attackHandler = null
    this.missHandler = null
    this.specialHandler = null
  }
}
