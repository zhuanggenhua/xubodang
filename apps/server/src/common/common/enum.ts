export interface IPlayer {
  id: number;
  nickname: string;
  rid: number;
}

export interface IRoom {
  id: number;
  players: Array<IPlayer>;
}

export enum InputTypeEnum {
  ActorMove,
  WeaponShoot,
  TimePast,
}
export enum EntityTypeEnum {
  Map1 = "Map1",
  Actor1 = "Actor1",
  Actor2 = "Actor2",
  Weapon1 = "Weapon1",
  Weapon2 = "Weapon2",
  Bullet1 = "Bullet1",
  Bullet2 = "Bullet2",
  Explosion = "Explosion",
  JoyStick = "JoyStick",
  Shoot = "Shoot",
  ReConnect = "ReConnect",
  Particle = "Particle",
}


export enum ApiFunc {
  signIn,
  login,
  enterGame,
  listActor,
  createActor,
  enterScene,
  changeScene,
  createReplication,
  leaveReplication,
  gap = 100,
  // 从100继续，这是api和msg的分界线
  inputFromClient,
  stateFromServer,
}

export const ProtoPathEnum: Record<ApiFunc, any> = {
  [ApiFunc.login]: {
    req: "game.LoginReq",
    res: "game.LoginRes",
  },
  [ApiFunc.signIn]: {
    req: "game.SignInReq",
    res: "game.SignInRes",
  },
  [ApiFunc.enterGame]: {
    req: "game.EnterGameReq",
    res: "game.EnterGameRes",
  },
  [ApiFunc.listActor]: {
    req: "game.ListActorReq",
    res: "game.ListActorRes",
  },
  [ApiFunc.createActor]: {
    req: "game.CreateActorReq",
    res: "game.CreateActorRes",
  },
  [ApiFunc.enterScene]: {
    req: "game.EnterSceneReq",
    res: "game.EnterSceneRes",
  },
  [ApiFunc.changeScene]: {
    req: "game.ChangeSceneReq",
    res: "game.ChangeSceneRes",
  },
  [ApiFunc.createReplication]: {
    req: "game.CreateReplicationReq",
    res: "game.CreateReplicationRes",
  },
  [ApiFunc.leaveReplication]: {
    req: "game.LeaveReplicationReq",
    res: "game.LeaveReplicationRes",
  },
  [ApiFunc.gap]: "",
  [ApiFunc.inputFromClient]: "game.InputFromClient",
  [ApiFunc.stateFromServer]: "game.StateFromServer",
};

export enum ServerIdEnum {
  // 核心服务
  Game,
  Gateway,
  // 副本管理服务
  ReplicationManager,
  // 场景服务
  Scene1 = 101,
  Scene2,
  // 副本实例服务
  ReplicationInstance,
}

export enum ReplicationEnum {
  Replication1 = 1,
}

export enum ServerPort {
  AuthHttp = 3000,
  AuthRpc = 3001,
  Gateway = 4000,
  Game = 5000,
}
