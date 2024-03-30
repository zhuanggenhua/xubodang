import { _decorator, Component, UITransform, Sprite } from 'cc'
import { EntityStateEnum, ParamsNameEnum } from '../enum';
import StateMachine from './StateMachine';

const { ccclass } = _decorator

// 实体管理基类
@ccclass('EntityManager')
export abstract class EntityManager extends Component {
  fsm: StateMachine;
  private _state: ParamsNameEnum;

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
    this.fsm.setParams(newState, true);
  }

  abstract init(...args: any[]): void;
}