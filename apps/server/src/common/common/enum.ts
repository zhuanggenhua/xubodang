
// 玩家当前联网状态，用于随机匹配、断线重连
export enum ConnectStateEnum {
  Idle,
  Battle,
}

// 房间模式
export enum RoomMode {
  normal = '标准',
  challenge = '挑战',
  limit = '限制',
  infinite = '无限',
}

export interface IPlayer {
  id?: number
  nickname: string
  godname?: string
  rid?: number
  actorName?: string
}

export interface IRoom {
  id?: number
  roomName?: string
  life: number
  mode?: RoomMode
  hasPwd?: boolean
  players?: Array<IPlayer>

  turn?: number //回合数
}

export enum InputTypeEnum {
  ActorMove,
  WeaponShoot,
  TimePast,
}
export enum EntityTypeEnum {
  Actor = 'Actor',
  RoundShield = 'RoundShield',
  Crossbow = 'Crossbow',
  Bo = 'Bo',
  Sword = 'Sword',
  Yu = 'Yu',
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
  ApiRoomJoin,
  ApiRoomLeave,
  ApiChooseActor,
  ApiUseSkill,
  gap = 100,
  // 从100继续，这是api和msg的分界线，msg一般是用于无状态
  inputFromClient,
  stateFromServer,
  RoomList,
  MsgRoom,
  ChooseActor,
  UseSkill,
}

export const ProtoPathEnum: Record<ApiFunc, any> = {
  [ApiFunc.ApiUseSkill]: {
    req: 'game.ApiUseSkillReq',
    res: 'game.ApiUseSkillRes',
  },
  [ApiFunc.ApiChooseActor]: {
    req: 'game.ApiChooseActorReq',
    res: 'game.ApiChooseActorRes',
  },
  [ApiFunc.ApiRoomLeave]: {
    req: 'game.ApiRoomLeaveReq',
    res: 'game.ApiRoomLeaveRes',
  },
  [ApiFunc.ApiRoomJoin]: {
    req: 'game.ApiRoomJoinReq',
    res: 'game.ApiRoomJoinRes',
  },
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
  [ApiFunc.MsgRoom]: 'game.MsgRoom',
  [ApiFunc.ChooseActor]: 'game.ChooseActor',
  [ApiFunc.UseSkill]: 'game.UseSkill',
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

