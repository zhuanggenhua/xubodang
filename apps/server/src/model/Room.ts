import { IClientInput, EntityTypeEnum, InputTypeEnum, ApiFunc, RoomMode } from '../common'
import { Connection } from '../common/core/Connection'
import PlayerManager from '../game/PlayerManager'
import RoomManager from '../game/RoomManager'
import Player from './Player'

export default class Room {
  players: Set<Player> = new Set()

  private lastTime?: number
  private timers: NodeJS.Timer[] = []
  private pendingInput: Array<IClientInput> = []
  private lastPlayerFrameIdMap: Map<number, number> = new Map()

  constructor(
    public id: number,
    public roomName: String,
    public pwd: String,
    public life: number,
    public mode: RoomMode,
    public turn: number = 0,
  ) {}

  join(uid: number) {
    const player = PlayerManager.Instance.getPlayerById(uid)
    if (player) {
      player.rid = this.id
      this.players.add(player)
    }
  }

  leave(uid: number) {
    const player = PlayerManager.Instance.getPlayerById(uid)
    if (player) {
      // 玩家删除房间，房间也删除玩家
      player.rid = -1
      // player.connection.unlistenMsg(ApiFunc.MsgClientSync, this.getClientMsg, this);
      this.players.delete(player)
      
      if (!this.players.size) {
        RoomManager.Instance.closeRoom(this.id)
      }
    }
  }

  close() {
    for (const player of this.players) {
      player.rid = -1
      // player.connection.sendMsg(ApiMsgEnum.MsgGameEnd, {});
      // player.connection.unlistenMsg(ApiMsgEnum.MsgClientSync, this.getClientMsg, this);
    }
    this.players.clear()
  }

  sync() {
    for (const player of this.players) {
      player.connection.sendMsg(ApiFunc.MsgRoom, {
        room: RoomManager.Instance.getRoomView(this),
      })
    }
  }

  start() {
    for (const player of this.players) {
      // player.connection.sendMsg(ApiMsgEnum.MsgGameStart, {
      //   state,
      // });
      // player.connection.listenMsg(ApiMsgEnum.MsgClientSync, this.getClientMsg, this);
    }
  }

  getClientMsg(connection: Connection, { frameId, input }) {
    // // 记录玩家上一帧的输入
    // this.lastPlayerFrameIdMap.set(connection.playerId, frameId);
    // this.pendingInput.push(input);
  }

  sendServerMsg() {
    // const pendingInput = this.pendingInput;
    // this.pendingInput = [];
    // for (const player of this.players) {
    //   player.connection.sendMsg(ApiMsgEnum.MsgServerSync, {
    //     // 最后一帧
    //     lastFrameId: this.lastPlayerFrameIdMap.get(player.id) ?? 0,
    //     inputs: pendingInput,
    //   });
    // }
  }
}
