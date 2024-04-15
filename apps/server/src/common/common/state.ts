// @ts-ignore
import { EntityTypeEnum, InputTypeEnum } from "./enum.ts";

export interface IParticleOptions {
  duration?: number; // 有生命周期就在生命结束时清除
  gap?: number; // 两种类型，一种持续生成，一种一次性生成, 没有间隔就是一次性
  max?: number; //最大数量
  min?: number;
  maxRange?: number;// 最大数量存在大小范围
  minRange?: number;
  other?: any;//给粒子初始化的数据
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
