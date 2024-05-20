import { Component, Prefab, _decorator, director, instantiate, Node, SpriteFrame, screen, Label } from 'cc'
import { SceneEnum, EventEnum, PrefabPathEnum, TexturePathEnum, SkillPathEnum } from '../enum'
import DataManager, { mapH, mapW } from '../global/DataManager'
import EventManager from '../global/EventManager'
import NetworkManager from '../global/NetworkManager'
import { ApiFunc, IRoom } from '../common'
import { RoomItemManager } from '../ui/RoomItemManager'
import { ResourceManager } from '../global/ResourceManager'
import { createErrorTip, getSkillPath } from '../utils'

const { ccclass, property } = _decorator

@ccclass('HallManager')
export class HallManager extends Component {
  @property(Node)
  roomContainer: Node = null

  @property(Prefab)
  roomPrefab: Prefab = null

  async onLoad() {
    //应该放在场景管理类一起处理
    director.preloadScene(SceneEnum.Battle)

    EventManager.Instance.on(EventEnum.RoomCreate, this.handleCreateRoom, this)
    EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this)
    // 接收房间广播
    NetworkManager.Instance.listenMsg(ApiFunc.RoomList, this.renderRooms, this)

    await NetworkManager.Instance.connect().catch(() => false)
    this.roomContainer.destroyAllChildren()

    // DataManager.Instance.loadRes()
  }

  onDestroy() {    
    EventManager.Instance.off(EventEnum.RoomCreate, this.handleCreateRoom, this)
    EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this)
    NetworkManager.Instance.unlistenMsg(ApiFunc.RoomList, this.renderRooms, this)
  }

  async start() {
    this.syncRooms()
  }
  // 同步房间信息，以及用户名设置
  async syncRooms() {
    // 进入房间就请求一次
    if (NetworkManager.Instance.isConnected === false) {
      await new Promise((resolve) => setTimeout(resolve, 1000)) //防止无限 递归
      await this.syncRooms()
    }
    NetworkManager.Instance.callApi(ApiFunc.RoomListByName, { roomName: '' })

    const { nickname, godname } = DataManager.Instance.player
    const username = DataManager.Instance.stage.getChildByName('UserName')
    username.getChildByName('NickName').getComponent(Label).string = nickname
    if (godname) {
      username.getChildByName('Tag').getChildByName('GodName').getComponent(Label).string = godname
      username.getChildByName('Tag').active = true
    } else {
      username.getChildByName('Tag').active = false
    }
  }

  renderRooms = ({ rooms }) => {
    // 暂无数据
    if (rooms.length == 0) {
      return
    }

    // 在已有节点基础上生成指定数量节点
    for (const item of this.roomContainer.children) {
      item.active = false
    }
    while (this.roomContainer.children.length < rooms.length) {
      const roomItem = instantiate(this.roomPrefab)
      roomItem.active = false
      roomItem.setParent(this.roomContainer)
    }

    // 为节点填充数据
    for (let i = 0; i < rooms.length; i++) {
      const data = rooms[i]
      const node = this.roomContainer.children[i]
      const roomItemManager = node.getComponent(RoomItemManager)
      roomItemManager.init(data)
    }
  }

  async handleCreateRoom(roomInfo: IRoom) {
    const res = await NetworkManager.Instance.callApi(ApiFunc.RoomCreate, roomInfo)

    DataManager.Instance.roomInfo = res.room
    console.log('创建房间', DataManager.Instance.roomInfo)
    director.loadScene(SceneEnum.Battle)
    DataManager.Instance.mode = 'network'
  }

  async handleJoinRoom(data) {
    const res = await NetworkManager.Instance.callApi(ApiFunc.ApiRoomJoin, data)

    if (res.error === '') {
      DataManager.Instance.roomInfo = res.room
      console.log('进入房间', DataManager.Instance.roomInfo)
      director.loadScene(SceneEnum.Battle)
      DataManager.Instance.mode = 'network'
    } else {
      createErrorTip(res.error)
    }
  }
}
