import { isPlayer } from '.'
import { ISkill } from '../common'
import { EventEnum } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'

// 执行器，用于延时结算数据
export default class Skill {
  otherSkill: Skill
  get actor() {
    return DataManager.Instance.actors.get(this.id)
  }
  get otherActor() {
    return DataManager.Instance.actors.get(this.otherSkill.id)
  }

  constructor(public skill: ISkill, public id: number) {
    if (isPlayer(this.id)) {
      this.otherSkill = DataManager.Instance.actor2.skill
    }else{
      this.otherSkill = DataManager.Instance.actor1.skill
    }
  }
  

  excute() {}


  //   每拥有的一种类型都对应一种处理
  // 蓄力
  powerHandler() {
    const power = this.skill.power
    if (power) {
      if (DataManager.Instance.actors.get(this.id).power < 6) {
        DataManager.Instance.actors.get(this.id).power += power
      }

      if (isPlayer(this.id))
        EventManager.Instance.emit(EventEnum.updateSkillItem, DataManager.Instance.actors.get(this.id).power)
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
      // 如果是近战，就移动
      // this.actor.move()
      // if(this.otherSkill.skill.type.indexOf(3) == -1){
      //   // 没有闪避，直接结算伤害
      // }
      DataManager.Instance.actor2.hp -= this.skill.damage
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
