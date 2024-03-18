import { Component, Prefab, _decorator, director, instantiate, Node, SpriteFrame, screen } from 'cc'
import { SceneEnum, EventEnum, PrefabPathEnum, TexturePathEnum } from '../enum'
import DataManager, { mapH, mapW } from '../global/DataManager'
import EventManager from '../global/EventManager'
import NetworkManager from '../global/NetworkManager'
import { ApiFunc, IRoom } from '../common'
import { RoomItemManager } from '../ui/RoomItemManager'
import { ResourceManager } from '../global/ResourceManager'
import { createErrorTip } from '../utils'

const { ccclass, property } = _decorator

@ccclass('HallManager')
export class HallManager extends Component {
  @property(Node)
  roomContainer: Node = null

  @property(Prefab)
  roomPrefab: Prefab = null

  onLoad() {
    // director.preloadScene(SceneEnum.CheckActor);
    EventManager.Instance.on(EventEnum.RoomCreate, this.handleCreateRoom, this)
    EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this)
    // 接收房间广播
    NetworkManager.Instance.listenMsg(ApiFunc.RoomList, this.renderRooms, this)

    // screen.requestFullScreen() //全屏
    this.loadRes()
  }
  // test
  async loadRes() {
    const list = []
    for (const type in PrefabPathEnum) {
      const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
        DataManager.Instance.prefabMap.set(type, prefab)
      })
      list.push(p)
    }
    for (const type in TexturePathEnum) {
      const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((spriteFrames) => {
        DataManager.Instance.textureMap.set(type, spriteFrames)
      })
      list.push(p)
    }
    await Promise.all(list)
  }

  onDestroy() {
    EventManager.Instance.off(EventEnum.RoomCreate, this.handleCreateRoom, this)
    EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this)
    NetworkManager.Instance.unlistenMsg(ApiFunc.RoomList, this.renderRooms, this)
  }

  async start() {
    setTimeout(async () => {
      await NetworkManager.Instance.connect().catch(() => false)
    }, 1000)
    this.roomContainer.destroyAllChildren()
  }

  renderRooms = ({ rooms }) => {
    // 暂无数据
    if (rooms.length == 0) {
      return
    }

    for (const item of this.roomContainer.children) {
      item.active = false
    }
    while (this.roomContainer.children.length < rooms.length) {
      const roomItem = instantiate(this.roomPrefab)
      roomItem.active = false
      roomItem.setParent(this.roomContainer)
    }

    for (let i = 0; i < rooms.length; i++) {
      const data = rooms[i]
      const node = this.roomContainer.children[i]
      const roomItemManager = node.getComponent(RoomItemManager)
      roomItemManager.init(data)
    }
  }

  async handleCreateRoom(roomInfo: IRoom) {
    const res = await NetworkManager.Instance.callApi(ApiFunc.RoomCreate, roomInfo)
    console.log('room', res)

    DataManager.Instance.roomInfo = res.room
    // director.loadScene(SceneEnum.CheckActor);
  }

  async handleJoinRoom(data) {
    const res = await NetworkManager.Instance.callApi(ApiFunc.ApiRoomJoin, data)
    
    if (res.error === '') {
      console.log('进入房间')
      DataManager.Instance.roomInfo = res.room
    } else {
      createErrorTip(res.error)
    }
  }
}
