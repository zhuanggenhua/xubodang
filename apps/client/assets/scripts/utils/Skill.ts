import { ISkill } from '../common'
import { EventEnum } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'

// 执行器，用于延时结算数据
export default class Skill {
  constructor(public skill: ISkill, public id: number) {}

  excute() {}
  isPlayer(id) {
    return DataManager.Instance.player.id === id
  }

  //   每拥有的一种类型都对应一种处理
  // 蓄力
  powerHandler() {
    const power = this.skill.power
    if (power) {
      if (DataManager.Instance.actors.get(this.id).power < 6) {
        DataManager.Instance.actors.get(this.id).power += power
      }

      if (this.isPlayer(this.id))
        EventManager.Instance.emit(EventEnum.updateSkillItem, DataManager.Instance.actors.get(this.id).power)
    }
  }
  defenseHandler: Function = null
  attackHandler() {}
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
