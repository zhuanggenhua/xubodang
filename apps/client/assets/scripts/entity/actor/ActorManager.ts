import { _decorator, Component, instantiate, Node, ProgressBar, tween, Tween, Vec3, warn } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum, IActor, InputTypeEnum, IPlayer, ISkill } from '../../common'
import { EntityStateEnum, EventEnum } from '../../enum'
import DataManager from '../../global/DataManager'
import EventManager from '../../global/EventManager'
import { ActorStateMachine } from './ActorStateMachine'
import Skill from '../../utils/Skill'

const { ccclass, property } = _decorator

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
  id: number
  bulletType: EntityTypeEnum

  //动态数据
  hp: number
  hpMax: number
  power: number = 0
  buffs: any[] = []
  // position: IVec2;
  // direction: IVec2;
  skill: Skill = null

  private tw: Tween<unknown>

  // private wm: WeaponManager;
  init(id, type, hp) {
    this.id = id
    this.hpMax = hp

    // this.fsm = this.addComponent(ActorStateMachine)
    // this.fsm.init(type)

    this.state = EntityStateEnum.Idle

    // this.node.active = false
  }

 

  
  useSkill(skill: ISkill) {}
}
