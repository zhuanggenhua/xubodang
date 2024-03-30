import { _decorator, Tween, UITransform, Vec3 } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum, ISkill } from '../../common'
import { EntityStateEnum, EventEnum, ParamsNameEnum } from '../../enum'
import DataManager from '../../global/DataManager'
import Skill from '../../utils/Skill'
import { isPlayer } from '../../utils'
import { ActorStateMachine } from './ActorStateMachine'
import EventManager from '../../global/EventManager'

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
  tran: UITransform

  initPosition: Vec3 = new Vec3(0, 0)

  private tw: Tween<unknown>

  // private wm: WeaponManager;
  init(id, type, hp) {
    this.id = id
    this.hpMax = hp
    this.tran = this.node.getComponent(UITransform)

    this.fsm = this.addComponent(ActorStateMachine)
    this.fsm.init(type)

    this.state = ParamsNameEnum.Idle
    
    const offsetX = DataManager.Instance.battleCanvas.width / 5
    if (isPlayer(id)) {
      this.initPosition = new Vec3(offsetX, DataManager.Instance.battleCanvas.round + this.tran.height/2)
    } else {
      this.initPosition = new Vec3(
        DataManager.Instance.battleCanvas.width - offsetX,
        DataManager.Instance.battleCanvas.round + this.tran.height/2,
      )
    }
    this.resetPosition()
  }

  onAttackShake(type: EventEnum) {
    EventManager.Instance.emit(EventEnum.SCREEN_SHAKE, type)
  }
  resetPosition() {
    this.node.setPosition(this.initPosition)
  }

  useSkill(skill: ISkill) {}
}
