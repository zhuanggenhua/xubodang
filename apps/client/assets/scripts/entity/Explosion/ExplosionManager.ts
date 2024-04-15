import { IVec2, _decorator, Node } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { EntityTypeEnum } from '../../common'
import { ExplosionStateMachine } from './ExplosionStateMachine'
import { ParamsNameEnum } from '../../enum'
const { ccclass, property } = _decorator

@ccclass('ExplosionManager')
export class ExplosionManager extends EntityManager {
  init(node: Node, type: EntityTypeEnum = EntityTypeEnum.Explosion) {
    this.node.setPosition(node.position.x, node.position.y)
    this.fsm = this.addComponent(ExplosionStateMachine)
    this.fsm.init(type)
    this.state = ParamsNameEnum.Idle
  }
}
