// @ts-ignore
import { EntityTypeEnum, InputTypeEnum } from "./enum.ts";


export interface IBullet {
  id: number;
  owner: number;
  type: EntityTypeEnum;

  //动态数据    
  position: IVec2;
  direction: IVec2;
}

export interface IVec2 {
  x: number;
  y: number;
}



export type IClientInput = IActorMove | IWeaponShoot | ITimePast;

export interface IActorMove {
  type: InputTypeEnum.ActorMove;
  id: number;
  direction: IVec2;
  dt: number;
}

export interface IWeaponShoot {
  type: InputTypeEnum.WeaponShoot;
  owner: number;
  position: IVec2;
  direction: IVec2;
}

// 将时间抽象成输入
export interface ITimePast {
  type: InputTypeEnum.TimePast;
  dt: number;
}
