import { _decorator, Animation } from 'cc'
import State from '../../base/State'
import StateMachine, { getInitParamsTrigger } from '../../base/StateMachine'
import { EntityTypeEnum } from '../../common'
import { ParamsNameEnum } from '../../enum'

const { ccclass, property } = _decorator

@ccclass('ExplosionStateMachine')
export class ExplosionStateMachine extends StateMachine {
  init(type: EntityTypeEnum) {
    this.type = type
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
  }

  initParams() {
    this.params.set(ParamsNameEnum.Idle, getInitParamsTrigger())
  }

  initStateMachines() {
    this.stateMachines.set(ParamsNameEnum.Idle, new State(this, `${this.type}${ParamsNameEnum.Idle}`))
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(ParamsNameEnum.Idle):
        if (this.params.get(ParamsNameEnum.Idle).value) {
          this.currentState = this.stateMachines.get(ParamsNameEnum.Idle)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(ParamsNameEnum.Idle)
        break
    }
  }
}
