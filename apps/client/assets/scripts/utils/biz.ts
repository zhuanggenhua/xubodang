import { Color, Label, instantiate } from 'cc'
import { IPlayer, ISkill } from '../common'
import { BuffEnum, ParamsNameEnum, SkillPathEnum, Special } from '../enum'
import DataManager from '../global/DataManager'

// 属性值映射
export const attrMap = {
  speed: {
    0: '慢速',
    1: '快速',
  },
  target: {
    0: '敌人',
    1: '自己',
  },
  range: {
    0: '地面',
    1: '天空',
    2: '地下',
  },
}

export const getSkillPath = (skill: SkillPathEnum) => {
  return `ui/skills/${skill}/spriteFrame`
}

export const setPrefab = (name, node) => {
  const prefab = DataManager.Instance.prefabMap.get(name)
  const fire = instantiate(prefab)
  fire.setParent(node)
  return fire
}

export const canUse = (skill: ISkill) => {
  if (DataManager.Instance.playerActor.location == '1' && skill.buff && skill.buff?.indexOf(BuffEnum.wall) != -1) {
    return true
  }
  if (DataManager.Instance.playerActor.buffs?.has(BuffEnum.wall)) {
    //禁用近战
    if (skill.type.indexOf(1) !== -1 && !skill.longrang) {
      return true
    }
    // 禁用跳跃
    if (skill.type.indexOf(3) !== -1) {
      if (skill.buff?.indexOf(BuffEnum.fly) != -1) {
        return true
      }
      if (skill.animal == ParamsNameEnum.Jump) {
        return true
      }
      // 特殊不兼容
      if (skill.special == Special.copy || skill.special == Special.qigongpao) {
        return true
      }
    }
  }

  return false
}
