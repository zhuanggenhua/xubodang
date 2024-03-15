import { _decorator, Component, Node, Label, Widget, tween, Sprite, SpriteFrame } from 'cc'
import { EventEnum } from '../enum'
import EventManager from '../global/EventManager'
import { RoomMode } from '../common'
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

  init({ id, roomName, life, mode, hasPwd, players }) {
    this.id = id
    this.roomName = roomName
    this.life = life
    this.mode = mode
    this.hasPwd = hasPwd

    // 设置状态
    const stateFrame = this.node.getChildByName('State').getComponent(Sprite)
    if(hasPwd){
      stateFrame.spriteFrame = this.lockFrame
    }else{
      if(players.length == 1){
        stateFrame.spriteFrame = this.oneFrame
      }else if(players.length == 2){
        stateFrame.spriteFrame = this.twoFrame
      }
    }
    // const label = this.getComponent(Label);
    // label.string = `房间id:${id},当前人数:${players.length}`;
    // this.node.active = true;
  }

  handleClick() {
    const roomContainer = this.node.parent
    // 取消其他room选中状态
    for (const item of roomContainer.children) {
      if (item == this.node) continue
      item.getComponent(RoomItemManager).offCheck()
    }
    if (this.isActive) {
      // 进入房间
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
