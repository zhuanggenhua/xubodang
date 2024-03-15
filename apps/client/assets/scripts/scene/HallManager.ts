import { Component, Prefab, _decorator, director, instantiate,Node } from "cc";
import { SceneEnum, EventEnum } from "../enum";
import DataManager from "../global/DataManager";
import EventManager from "../global/EventManager";
import NetworkManager from "../global/NetworkManager";
import { ApiFunc, IRoom } from "../common";
import { RoomItemManager } from "../ui/RoomItemManager";

const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends Component {
  @property(Node)
  roomContainer: Node = null;

  @property(Prefab)
  roomPrefab: Prefab = null;

  onLoad() {
    // director.preloadScene(SceneEnum.Battle);
    EventManager.Instance.on(EventEnum.RoomCreate, this.handleCreateRoom, this);
    EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this);
    // 接收房间广播
    NetworkManager.Instance.listenMsg(ApiFunc.RoomList, this.renderRooms, this);
  }

  onDestroy() {
    EventManager.Instance.off(EventEnum.RoomCreate, this.handleCreateRoom, this);
    EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this);
    NetworkManager.Instance.unlistenMsg(ApiFunc.RoomList, this.renderRooms, this);
  }

  async start() {
    await NetworkManager.Instance.connect();
    console.log("服务连接成功！");
    this.roomContainer.destroyAllChildren();
  }


  renderRooms = ({rooms}) => {
    console.log('rooms',rooms);
    
    
    for (const item of this.roomContainer.children) {
      item.active = false;
    }
    while (this.roomContainer.children.length < rooms.length) {
      const roomItem = instantiate(this.roomPrefab);
      roomItem.active = false;
      roomItem.setParent(this.roomContainer);
    }

    for (let i = 0; i < rooms.length; i++) {
      const data = rooms[i];
      const node = this.roomContainer.children[i];
      const roomItemManager = node.getComponent(RoomItemManager);
      roomItemManager.init(data);
      node.active = true;
    }
  };

  async handleCreateRoom(roomInfo: IRoom) {
    const res = await NetworkManager.Instance.callApi(ApiFunc.RoomCreate,roomInfo);
    console.log('room',res);
    

    DataManager.Instance.roomInfo = res.room;
    // director.loadScene(SceneEnum.Room);
  }

  async handleJoinRoom(rid: number) {
    // const { success, res, error } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomJoin, { rid });
    // if (!success) {
    //   console.log(error);
    //   return;
    // }

    // DataManager.Instance.roomInfo = res.room;
    // director.loadScene(SceneEnum.Room);
  }
}
