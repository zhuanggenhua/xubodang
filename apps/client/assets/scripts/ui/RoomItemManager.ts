import { _decorator, Component, Node, Label, Widget, tween, Sprite, SpriteFrame } from 'cc'
import { EventEnum } from '../enum'
import EventManager from '../global/EventManager'
import { ApiFunc, RoomMode } from '../common'
import NetworkManager from '../global/NetworkManager'
import DataManager from '../global/DataManager'
import { createErrorTip } from '../utils'
import { HallUiMgr } from './HallUiMgr'
const { ccclass, property } = _decorator

@ccclass('RoomItemManager')
export class RoomItemManager extends Component {
  id: number
  roomName: string
  life: number
  mode: RoomMode
  hasPwd: boolean

  @property(SpriteFrame)
  lockFrame: SpriteFrame = null
  @property(SpriteFrame)
  oneFrame: SpriteFrame = null
  @property(SpriteFrame)
  twoFrame: SpriteFrame = null

  isActive: boolean = false

  init({ id, roomName, life, mode, hasPwd, players, turn }) {
    this.id = id
    this.roomName = roomName
    this.life = life
    this.mode = mode
    this.hasPwd = hasPwd

    // 设置状态
    const stateFrame = this.node.getChildByName('State').getComponent(Sprite)
    if (hasPwd) {
      stateFrame.spriteFrame = this.lockFrame
    } else {
      if (players.length == 2 || turn > 0) {
        stateFrame.spriteFrame = this.twoFrame
      } else if (players.length == 1) {
        stateFrame.spriteFrame = this.oneFrame
      }
    }

    this.node.getChildByName('RoomName').getComponent(Label).string = roomName
    this.node.getChildByName('Life').getComponent(Label).string = life
    this.node.getChildByName('Mode').getComponent(Label).string = mode

    this.node.active = true
  }

  handleClick() {
    const roomContainer = this.node.parent
    // 取消其他room选中状态
    for (const item of roomContainer.children) {
      if (item == this.node) continue
      item.getComponent(RoomItemManager).offCheck()
    }
    if (this.isActive) {
      // 输入密码
      if(this.hasPwd){
        DataManager.Instance.stage.getComponent(HallUiMgr).nowRid = this.id
        DataManager.Instance.stage.getChildByName('InputPwd').active = true
        return
      }
      // 进入房间
      EventManager.Instance.emit(EventEnum.RoomJoin, {
        rid: this.id,
        pwd: '',
      })
    } else {
      // 选中状态
      this.isActive = true
      const widget = this.node.getChildByName('Tip').getComponent(Widget)
      tween(widget).to(0.1, { left: 0 }).start()
    }
    // EventManager.Instance.emit(EventEnum.RoomJoin, this.id);
  }

  offCheck() {
    this.isActive = false
    const widget = this.node.getChildByName('Tip').getComponent(Widget)
    tween(widget).to(0.1, { left: -180 }).start()
  }
}
