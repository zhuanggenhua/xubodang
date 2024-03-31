import { isPlayer } from './index'
import { ISkill } from '../common'
import { EventEnum, ParamsNameEnum, SkillPathEnum } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { ActorManager } from '../entity/actor/ActorManager'

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
    this.actor.state = ParamsNameEnum[this.getKeyByValue(this.skill.particle)]
  }
  // temp 临时获取key
  getKeyByValue(value, object = SkillPathEnum) {
    return Object.keys(object).find((key) => object[key] === value)
  }

  constructor(public skill: ISkill, public id: number) {
    this.tigerLength = skill.type.length
  }
  onDestroy() {
    // 在对象销毁前取消事件注册
    EventManager.Instance.off(EventEnum.attackFinal, this.attackFinal, this)
    EventManager.Instance.off(EventEnum.powerFinal, this.powerFinal, this)
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
          this.defenseHandler()
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
  attackFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('attack')
      EventManager.Instance.emit(EventEnum.updateHp, this.id)
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

  //   每拥有的一种类型都对应一种处理
  // 蓄力
  powerHandler() {
    const power = this.skill.power
    if (power) {
      if (this.actor.power < 6) {
        this.actor.power += power
        this.setSkillState()
      }
    }
  }
  defenseHandler: Function = null
  attackHandler() {
    const otherSkill = this.otherSkill.skill

    if (this.skill.speed === 1) {
      // 快速攻击  立即触发动画
    }

    if (this.skill.target === 1) {
      // 目标是自己
      DataManager.Instance.actor1.hp -= this.skill.damage
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

      this.otherActor.hp -= this.skill.damage
    }
  }
  missHandler: Function = null
  specialHandler: Function = null

  reset() {
    this.powerHandler = null
    this.defenseHandler = null
    this.attackHandler = null
    this.missHandler = null
    this.specialHandler = null
  }
}
