import { Prefab, SpriteFrame, Node, director, view } from 'cc'
import { IPlayer, IRoom } from '../common'
import { Singleton } from '../common/base'
import Particle from '../particle/Particle'
import { PrefabPathEnum, SkillPathEnum, TexturePathEnum } from '../enum'
import { ResourceManager } from './ResourceManager'
import { getSkillPath } from '../utils'

const PLAYER_SPEED = 100
const BULLET_SPEED = 600

const WEAPON_DAMAGE = 5

const PLAYER_RADIUS = 50
const BULLET_RADIUS = 10

// 设计图尺寸
export const mapW = view.getVisibleSize().width
export const mapH = view.getVisibleSize().height
// export const mapW = 720;
// export const mapH = 1280;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  mode: 'single' | 'network' | 'teach' = 'single'

  setting: any = null

  player: IPlayer = {
    nickname: '游客',
  }
  roomInfo: IRoom = {
    life: 5,
  }

  stage: Node = director.getScene().getChildByName('Canvas')

  // actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map()
  textureMap: Map<string, SpriteFrame[]> = new Map()
  skillMap: Map<SkillPathEnum, SpriteFrame> = new Map()
  // bulletMap: Map<number, BulletManager> = new Map();

  // state: IState = {
  //   seed: 1, //伪随机种子
  // };

  // 执行动作
  // applyInput(input: IClientInput) {

  // }

  async loadRes() {
    const list = []
    // 注意取得时候不能用枚举，懒得改了
    for (const type in PrefabPathEnum) {
      const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
        DataManager.Instance.prefabMap.set(type, prefab)
      })
      list.push(p)
    }
    for (const type in TexturePathEnum) {
      const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((spriteFrames) => {
        DataManager.Instance.textureMap.set(type, spriteFrames)
      })
      list.push(p)
    }

    for (const type in SkillPathEnum) {
      const p = ResourceManager.Instance.loadRes(getSkillPath(SkillPathEnum[type]), SpriteFrame).then((spriteFrame) => {
        DataManager.Instance.skillMap.set(SkillPathEnum[type], spriteFrame)
      })
      list.push(p)
    }
    await Promise.all(list)
  }
}
