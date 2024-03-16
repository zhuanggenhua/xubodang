// 玩家当前联网状态，用于随机匹配、断线重连
export enum ConnectStateEnum {
  Idle,
  Battle,
}

// 房间模式
export enum RoomMode{
  normal = '标准',
  old = '怀旧',
  limit = '限制',
  infinite = '无限',
}

export interface IPlayer {
  id: number
  nickname: string
  godname: string
  rid: number
}

export interface IRoom {
  id: number
  roomName: string
  life: number
  mode: RoomMode
  hasPwd: boolean
  players: Array<IPlayer>
}

export enum InputTypeEnum {
  ActorMove,
  WeaponShoot,
  TimePast,
}
export enum EntityTypeEnum {
  
  Map1 = 'Map1',
  Actor1 = 'Actor1',
  Actor2 = 'Actor2',
  Weapon1 = 'Weapon1',
  Weapon2 = 'Weapon2',
  Bullet1 = 'Bullet1',
  Bullet2 = 'Bullet2',
  Explosion = 'Explosion',
  JoyStick = 'JoyStick',
  Shoot = 'Shoot',
  Particle = 'Particle',
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
  RoomCreate,
  RoomListByName,
  gap = 100,
  // 从100继续，这是api和msg的分界线
  inputFromClient,
  stateFromServer,
  RoomList,
}

export const ProtoPathEnum: Record<ApiFunc, any> = {
  [ApiFunc.RoomListByName]: {
    req: 'game.RoomListByNameReq',
    res: 'game.RoomListByNameRes',
  },
  [ApiFunc.login]: {
    req: 'game.LoginReq',
    res: 'game.LoginRes',
  },
  [ApiFunc.signIn]: {
    req: 'game.SignInReq',
    res: 'game.SignInRes',
  },
  [ApiFunc.enterGame]: {
    req: 'game.EnterGameReq',
    res: 'game.EnterGameRes',
  },
  [ApiFunc.listActor]: {
    req: 'game.ListActorReq',
    res: 'game.ListActorRes',
  },
  [ApiFunc.createActor]: {
    req: 'game.CreateActorReq',
    res: 'game.CreateActorRes',
  },
  [ApiFunc.enterScene]: {
    req: 'game.EnterSceneReq',
    res: 'game.EnterSceneRes',
  },
  [ApiFunc.changeScene]: {
    req: 'game.ChangeSceneReq',
    res: 'game.ChangeSceneRes',
  },
  [ApiFunc.createReplication]: {
    req: 'game.CreateReplicationReq',
    res: 'game.CreateReplicationRes',
  },
  [ApiFunc.leaveReplication]: {
    req: 'game.LeaveReplicationReq',
    res: 'game.LeaveReplicationRes',
  },
  [ApiFunc.RoomCreate]: {
    req: 'game.RoomCreateReq',
    res: 'game.RoomCreateRes',
  },
  [ApiFunc.gap]: '',
  [ApiFunc.inputFromClient]: 'game.InputFromClient',
  [ApiFunc.stateFromServer]: 'game.StateFromServer',
  [ApiFunc.RoomList]: 'game.RoomList',
}

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
