import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import { Singleton } from '../common/base'
import EventManager from '../global/EventManager'
import { EventEnum } from '../enum'
import { IActor, ISkill } from '../common'
import DataManager from '../global/DataManager'
import actors from '../config/actor'
import { getRandomNumber } from '../utils'

export default class Ai extends Singleton {
  static get Instance() {
    return super.GetInstance<Ai>()
  }
  id: number = -1
  actor: IActor

  setActor(actor: IActor) {
    this.actor = actor
  }

  excute() {
    const actor = DataManager.Instance.actors.get(this.id)
    const power = actor.power

    // 权重
    let weight = {
      power: 0,
      attack: 0,
      defense: 0,
      miss: 0,
      buff: 0,
    }
    let canUse = {
      power: [],
      attack: [],
      defense: [],
      miss: [],
      buff: [],
    }

    const randomCount = getRandomNumber(0, 100)

    // 先决定使用的种类，再决定用哪一个
    const skills = this.actor.skills
    const keys = Object.keys(skills)
    keys.forEach((key) => {
      skills[key].forEach((skill: ISkill) => {
        console.log('??', parseInt(key))

        if (power >= parseInt(key)) {
          if (skill.type.indexOf(0) != -1) {
            canUse.power.push(skill)
          }
          if (skill.type.indexOf(1) != -1) {
            canUse.attack.push(skill)
          }
          if (skill.type.indexOf(2) != -1) {
            canUse.defense.push(skill)
          }
          if (skill.type.indexOf(3) != -1) {
            canUse.miss.push(skill)
          }
          if (skill.type.indexOf(4) != -1) {
            canUse.buff.push(skill)
          }
        }
      })
    })

    // 前五个回合，优先集气
    if (DataManager.Instance.roomInfo.turn < 5 && power < 4) {
      weight.power = 100 - DataManager.Instance.roomInfo.turn * 10
    } else {
      weight.power = 80 - power * 20
    }

    // 如果可以秒杀，会直接使用
    // const killSkill = actor.skills.

    // 回合不同，决策不同
    // 受当前气，敌人气，  自身buff  影响  一定随机性？
    if (DataManager.Instance.roomInfo.turn === 0) {
      EventManager.Instance.emit(EventEnum.useSkill, skills[1][2], 0, this.id)
      // EventManager.Instance.emit(EventEnum.useSkill, skills[2][3], 0, this.id)
      // EventManager.Instance.emit(EventEnum.useSkill, skills[2][2], 0, this.id)
      return
    }
    // else EventManager.Instance.emit(EventEnum.useSkill, skills[1][3], 0, this.id)

    EventManager.Instance.emit(EventEnum.useSkill, skills[1][2], 0, this.id)

    // switch (actor.power) {
    //   case 0:
    //     break
    // }
  }

  reset() {
    this.actor = null
  }
}
