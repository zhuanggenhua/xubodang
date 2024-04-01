// @ts-ignore
import { EntityTypeEnum, InputTypeEnum } from "./enum.ts";

export interface IParticleOptions {
  duration?: number; // 
  gap?: number;
  max?: number;
  min?: number;
  maxRange?: number;
  minRange?: number;
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
