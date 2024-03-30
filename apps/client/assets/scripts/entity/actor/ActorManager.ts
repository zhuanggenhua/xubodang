import { _decorator, Tween, Vec3 } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum, ISkill } from '../../common'
import { EntityStateEnum } from '../../enum'
import DataManager from '../../global/DataManager'
import Skill from '../../utils/Skill'
import { isPlayer } from '../../utils'

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

  initPosition: Vec3 = new Vec3(0, 0)

  private tw: Tween<unknown>

  // private wm: WeaponManager;
  init(id, type, hp) {
    this.id = id
    this.hpMax = hp

    // this.fsm = this.addComponent(ActorStateMachine)
    // this.fsm.init(type)

    this.state = EntityStateEnum.Idle

    if (isPlayer(id)) {
      this.initPosition = new Vec3(DataManager.Instance.battle.width / 5, DataManager.Instance.battle.round)
    } else {
      this.initPosition = new Vec3(
        DataManager.Instance.battle.width - DataManager.Instance.battle.width / 5,
        DataManager.Instance.battle.round,
      )
    }
    this.resetPosition()
  }
  resetPosition() {
    this.node.setPosition(this.initPosition)
  }

  useSkill(skill: ISkill) {}
}
