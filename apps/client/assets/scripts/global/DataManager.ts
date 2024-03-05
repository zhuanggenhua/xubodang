import { Prefab, SpriteFrame, Node } from 'cc';
import { IRoom, IState } from '../common';
import { Singleton } from '../common/base';


const PLAYER_SPEED = 100;
const BULLET_SPEED = 600;

const WEAPON_DAMAGE = 5;

const PLAYER_RADIUS = 50;
const BULLET_RADIUS = 10;

export const mapW = 720;
export const mapH = 1280;

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  myPlayerId: number = 1;
  roomInfo: IRoom;

  stage: Node;
  
  // actorMap: Map<number, ActorManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();
  // bulletMap: Map<number, BulletManager> = new Map();

  // state: IState = {
  //   seed: 1, //伪随机种子
  // };

  // 执行动作
  // applyInput(input: IClientInput) {
    
  // }
}
