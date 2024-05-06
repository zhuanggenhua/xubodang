import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import { Singleton } from '../common/base'
import EventManager from '../global/EventManager'
import { BuffEnum, EventEnum } from '../enum'
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

  useSkill(useSkill) {
    if (useSkill) {
      EventManager.Instance.emit(EventEnum.useSkill, useSkill.skill, useSkill.power, this.id)
    } else {
      // 没有匹配，直接聚气
      EventManager.Instance.emit(EventEnum.useSkill, this.actor.skills[0][3], 0, this.id)
    }
  }

  excute() {
    const actor = DataManager.Instance.actors.get(this.id)
    const player = DataManager.Instance.actor1
    const power = actor.power
    let canKill = false

    // 权重  --按顺序依次判定
    let weight = {
      attack: 0,
      power: 0,
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

    // 先决定使用的种类，再决定用哪一个
    const skills = this.actor.skills
    const keys = Object.keys(skills)
    keys.forEach((key, index) => {
      skills[key].forEach((skill: ISkill) => {
        if (skill.damage >= player.hp) {
          canKill = true
        }

        if (power >= parseInt(key)) {
          if (skill.type.indexOf(0) != -1) {
            canUse.power.push({ skill, power: index })
          }
          if (skill.type.indexOf(1) != -1) {
            canUse.attack.push({ skill, power: index })
          }
          if (skill.type.indexOf(2) != -1) {
            canUse.defense.push({ skill, power: index })
          }
          if (skill.type.indexOf(3) != -1) {
            canUse.miss.push({ skill, power: index })
          }
          if (skill.type.indexOf(4) != -1) {
            canUse.buff.push({ skill, power: index })
          }
        }
      })
    })

    // 优先使用buff增强的能力
    if (actor.buffs.size > 0) {
      let useSkill = null
      if (actor.buffs.has(BuffEnum.spine)) {
        weight.defense += 20
      }
      if (actor.buffs.has(BuffEnum.retain)) {
        weight.defense += 50
      }
      if (actor.buffs.has(BuffEnum.blood)) {
        weight.attack += 50
        weight.power -= 50
      }
      if (actor.buffs.has(BuffEnum.spartan)) {
        weight.attack += 25
        weight.defense -= 25
        weight.power -= 25
      }
      if (actor.buffs.has(BuffEnum.shuangbei)) {
        weight.attack += 50
        weight.defense -= 25
        weight.power -= 30
      }
      if (actor.buffs.has(BuffEnum.saiya)) {
        if (power >= 1) {
          useSkill = {
            power: 2,
            skill: skills['123'],
          }
        } else {
          useSkill = {
            power: 1,
            skill: skills['113'],
          }
        }
      }
      if (actor.buffs.has(BuffEnum.saiya)) {
        useSkill = {
          power: 1,
          skill: skills['012'],
        }
      }

      if (useSkill) {
        this.useSkill(useSkill)
        return
      }
    }

    // 能够杀死敌人   因为耦合，这里甚至不好计算最终伤害
    let randomCount = getRandomNumber(0, 100)
    if (canKill) {
      weight.attack = 80
      if (randomCount < weight.attack) {
        const useSkill = canUse.attack.filter((skill) => skill.damage >= player.hp)[
          getRandomNumber(0, canUse.attack.length - 1)
        ]
        this.useSkill(useSkill)
        return
      }
    } else {
      weight.attack += 20
    }

    // 前五个回合，优先集气  或者用buff
    randomCount = getRandomNumber(0, 100)
    if (DataManager.Instance.roomInfo.turn < 5 && power < 4) {
      weight.power += 100 - DataManager.Instance.roomInfo.turn * 10
    } else {
      weight.power += 80 - power * 20

      if (DataManager.Instance.roomInfo.turn < 6) {
        const useSkill = canUse.buff[getRandomNumber(0, canUse.buff.length - 1)]
        if (useSkill) {
          this.useSkill(useSkill)
          return
        }
      }
    }
    if (randomCount < weight.power) {
      const useSkill = canUse.power[getRandomNumber(0, canUse.power.length - 1)]
      this.useSkill(useSkill)
      return
    }

    // 防御
    randomCount = getRandomNumber(0, 100)
    weight.defense += player.power * 15
    if (randomCount < weight.defense) {
      const useSkill = canUse.defense[getRandomNumber(0, canUse.defense.length - 1)]
      this.useSkill(useSkill)
      return
    }
    // 攻击
    randomCount = getRandomNumber(0, 100)
    if (randomCount < weight.attack) {
      let useSkill = null
      useSkill = canUse.attack[getRandomNumber(0, canUse.attack.length - 1)]
      if (actor.buffs.has(BuffEnum.blood)) {
        useSkill = canUse.attack.filter((skill: ISkill) => !skill.range)[getRandomNumber(0, canUse.attack.length - 1)]
      }
      this.useSkill(useSkill)
      return
    }

    // 闪避
    const useSkill = canUse.miss[getRandomNumber(0, canUse.miss.length - 1)]
    this.useSkill(useSkill)

    // 回合不同，决策不同
    // 受当前气，敌人气，  自身buff  影响  一定随机性？
    // if (DataManager.Instance.roomInfo.turn === 0) {
    //   EventManager.Instance.emit(EventEnum.useSkill, skills[1][2], 0, this.id)
    //   // EventManager.Instance.emit(EventEnum.useSkill, skills[2][3], 0, this.id)
    //   // EventManager.Instance.emit(EventEnum.useSkill, skills[2][2], 0, this.id)
    //   return
    // }
    // // else EventManager.Instance.emit(EventEnum.useSkill, skills[1][3], 0, this.id)

    // EventManager.Instance.emit(EventEnum.useSkill, skills[1][2], 0, this.id)

    // switch (actor.power) {
    //   case 0:
    //     break
    // }
  }

  reset() {
    this.actor = null
  }
}
