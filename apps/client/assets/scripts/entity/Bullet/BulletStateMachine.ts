import { _decorator, Animation } from "cc";
import State from "../../base/State";
import StateMachine, { getInitParamsTrigger } from "../../base/StateMachine";
import { EntityTypeEnum } from "../../common";
import { ParamsNameEnum } from "../../enum";
import DataManager from "../../global/DataManager";
const { ccclass } = _decorator;

@ccclass("BulletStateMachine")
export class BulletStateMachine extends StateMachine {
  init(type: EntityTypeEnum) {
    this.type = type;
    this.animationComponent = this.node.addComponent(Animation);

    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();
  }

  initParams() {
    Object.keys(ParamsNameEnum).forEach((key) => {
      this.params.set(key, getInitParamsTrigger())
    })
  }

  initStateMachines() {    
    this.stateMachines.set(ParamsNameEnum.Idle, new State(this, `${this.type}${ParamsNameEnum.Idle}`));
  }

  initAnimationEvent() {}

  run() {
    const newState = Object.keys(ParamsNameEnum).find((key) => this.params.get(key).value) || ParamsNameEnum.Idle
    this.currentState = this.stateMachines.get(newState)
  }
}
