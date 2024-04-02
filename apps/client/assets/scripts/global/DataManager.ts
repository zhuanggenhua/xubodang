import { Prefab, SpriteFrame, Node, director, view } from 'cc'
import { IPlayer, IRoom } from '../common'
import { Singleton } from '../common/base'
import { PrefabPathEnum, SkillPathEnum, TexturePathEnum } from '../enum'
import { ResourceManager } from './ResourceManager'
import { getSkillPath } from '../utils'
import { ActorManager } from '../entity/actor/ActorManager'
import { BattleCanvas } from '../ui/BattleCanvas'

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
  // 动画播放速度
  animalTime = 2

  mode: 'single' | 'network' | 'teach' = 'single'

  setting: any = null

  player: IPlayer = {
    id: 1,
    nickname: '游客',
  }
  otherPlayer: IPlayer = null
  roomInfo: IRoom = {
    life: 5,
    turn: 0,
  }

  stage: Node = director.getScene().getChildByName('Canvas')
  battleCanvas: BattleCanvas = null

  // actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map()
  textureMap: Map<string, SpriteFrame[]> = new Map()
  skillMap: Map<SkillPathEnum, SpriteFrame> = new Map()
  actors: Map<number, ActorManager> = new Map()
  // bulletMap: Map<number, BulletManager> = new Map();

  // actor1 表示玩家  2表示对方
  get actor1() {
    return this.actors.get(this.player.id)
  }
  get actor2() {
    return this.actors.get(this.otherPlayer.id)
  }

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
    console.log('数据中心',this);
    
  }
}
