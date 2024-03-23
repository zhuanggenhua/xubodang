import { Color, Label } from 'cc'
import { IPlayer } from '../common'
import { SkillPathEnum } from '../enum'

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

export const setPlayerName = (label: Label, player: IPlayer) => {
  if (player?.godname && player?.godname !== '') {
    label.string = player?.godname
    // 神名是金色
    label.color = new Color('#FFD700')
  } else {
    label.string = player?.nickname
  }
}

export const getSkillPath = (skill: SkillPathEnum) => {
  return `ui/skills/${skill}/spriteFrame`
}
