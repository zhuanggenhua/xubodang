import { EntityTypeEnum } from '../common'
import { BuffEnum, IActor, MissType, ParamsNameEnum, PrefabPathEnum, SkillPathEnum, Special, TexturePathEnum } from '../enum'
import skills from './skills'

const actors: { [key: string]: IActor } = {
  soldier: {
    actorName: '战士',
    prompt: [],
    skills: {
      0: [skills['000'], skills['001'], skills['002'], skills['003']],
      1: [skills['010'], skills['011'], skills['012'], skills['013']],
      2: [skills['020'], skills['021'], skills['022'], skills['023']],
      3: [skills['030'], skills['031'], skills['032'], skills['033']],
      4: [skills['040'], skills['041'], skills['042']],
    },
  },
  animeMan: {
    actorName: '动漫人',
    prompt: [],
    skills: {
      // 这里应该只持有技能编号比较好
      0: [skills['000'], skills['001'], skills['002'], skills['003']],
      1: [skills['110'], skills['111'], skills['112'], skills['113']],
      2: [skills['120'], skills['121'], skills['122'], skills['123']],
      3: [skills['130'], skills['131'], skills['132'], skills['133']],
      4: [skills['140'], skills['141'], skills['142']],
    },
  },
  // joker: {
  //   actorName: '小丑',
  //   prompt: [],
  //   skills: {
  //     // 这里应该只持有技能编号比较好
  //     0: [
  //       {},
  //       {
  //         name: '蓄',
  //         type: [0],
  //         desc: '获得一点能量',
  //         power: 1,
  //         target: 1,
  //         particle: SkillPathEnum.Xu,
  //       },

  //       {},
  //       {},
  //     ],
  //     1: [
  //       {},
  //       {
  //         name: '血祭',
  //         type: [3],
  //         desc: '一血换三气，易伤，受到攻击受到额外一点伤害',
  //         particle: SkillPathEnum.Dodging,
  //       },
  //       {},
  //       {},
  //     ],
  //     2: [
  //       {},
  //       {
  //         name: '小丑喇叭',
  //         type: [1],
  //         desc: '偏斜所有攻击',
  //         damage: 2,
  //         speed: 0,
  //         target: 0,
  //         range: ['0'],
  //         longrang: false,
  //         pierce: true,
  //         particle: SkillPathEnum.xielunyan,
  //       },
  //       {},
  //       {},
  //     ],
  //     3: [
  //       {},
  //       {
  //         name: '射击',
  //         type: [0, 4, 5],
  //         desc: '每重都有两点防御力',
  //         power: 0,
  //         damage: 4,
  //         particle: SkillPathEnum.luoshengmen,
  //       },
  //       {},
  //       {},
  //     ],
  //     4: [
  //       {},
  //       {
  //         name: '狂欢夜',
  //         type: [5],
  //         desc: '小丑喇叭不消耗气',
  //         particle: SkillPathEnum.aura,
  //       },
  //       {},
  //     ],
  //   },
  // },
}

export default actors
