import {
  _decorator,
  Component,
  EditBox,
  EventTouch,
  find,
  Label,
  Node,
  tween,
  UIOpacity,
  UITransform,
  v2,
  v3,
  Widget,
} from 'cc'
import EventManager from '../global/EventManager'
import { EventEnum } from '../enum'
import { RoomMode } from '../common'
const { ccclass, property } = _decorator

@ccclass('HallUiMgr')
export class HallUiMgr extends Component {
  @property(Node)
  selectDesc: Node = null
  @property(Node)
  createHome: Node = null

  activeSelect: Node = null
  oldSelectChild: Node = null

  nowRid: number

  handlerRoomJoin(event: EventTouch) {
    const pwd = event.target.parent.getChildByName('Pwd').getChildByName('EditBox').getComponent(EditBox).string
    EventManager.Instance.emit(EventEnum.RoomJoin, {
      rid: this.nowRid,
      pwd,
    })
  }
  // 创建房间
  handlerRoomCreate(event: EventTouch) {
    const modalBox = this.createHome.getChildByName('ModalBox')
    const roomName = modalBox.getChildByName('RoomName').getChildByName('EditBox').getComponent(EditBox).string
    const pwd = modalBox.getChildByName('Pwd').getChildByName('EditBox').getComponent(EditBox).string
    const life = modalBox
      .getChildByName('Life')
      .getChildByName('Select')
      .getChildByName('SelectActive')
      .getChildByName('Label')
      .getComponent(Label).string
    const mode = modalBox
      .getChildByName('Mode')
      .getChildByName('Select')
      .getChildByName('SelectActive')
      .getChildByName('Label')
      .getComponent(Label).string

    if (!roomName || roomName == '') {
      modalBox.getChildByName('RoomName').getChildByName('EditBox').getComponent(EditBox).placeholder = '请输入房间名'
      return
    }
    EventManager.Instance.emit(EventEnum.RoomCreate, {
      roomName,
      pwd,
      life,
      mode,
    })
  }
  // 点击创建房间按钮
  handlerCreateRoomClick(event: EventTouch) {
    // 给房间名一个初始值
    const roomNameEdit = this.createHome
      .getChildByName('ModalBox')
      .getChildByName('RoomName')
      .getChildByName('EditBox')
      .getComponent(EditBox)
    if (roomNameEdit.string == '') roomNameEdit.string = '房间' + Math.floor(1000 + Math.random() * 9000)

    if (!this.createHome.active) {
      // 打开创建房间模态框
      this.createHome.active = true
      const modalBox = this.createHome.getChildByName('ModalBox')

      // 过渡动画
      const opacity = modalBox.getComponent(UIOpacity)

      tween(opacity).to(0.1, { opacity: 255 }).start()
      // z轴必须是1，不然无法点击
      modalBox.setScale(0.1, 0.1, 0.1)
      tween(modalBox)
        .to(0.2, { scale: v3(1, 1, 1) })
        .start()
    } else {
      // 关闭模态框
      const modalBox = this.createHome.getChildByName('ModalBox')
      const opacity = modalBox.getComponent(UIOpacity)
      tween(opacity).to(0.1, { opacity: 0 }).start()
      tween(modalBox)
        .to(0.2, { scale: v3(0.1, 0.1, 0.1) })
        .call(() => {
          this.createHome.active = false
        })
        .start()
    }
  }

  handlerSelectClick(event: EventTouch) {
    this.activeSelect = event.target
    const select = this.activeSelect.parent
    // 显示下拉框
    let child = select.getChildByName('Child')
    // 如果打开新的下拉框，关闭上次下拉框
    if (this.oldSelectChild && this.oldSelectChild != child) this.oldSelectChild.active = false
    child.active = !child.active
    this.oldSelectChild = child

    const input = select.parent
    let totalChildren = input.parent.children.length // 获取父节点的子节点总数
    input.setSiblingIndex(totalChildren - 1) // 将child节点的层级设为最高
  }
  handlerSelectItemClick(event: EventTouch) {
    const selectItem = event.target
    const label = selectItem.getChildByName('Label').getComponent(Label)
    const select = this.activeSelect.parent
    select.getChildByName('Child').active = false
    const selectActive = select.getChildByName('SelectActive')
    selectActive.getChildByName('Label').getComponent(Label).string = label.string

    switch (label.string) {
      case RoomMode.normal:
        this.selectDesc.getComponent(Label).string = ''
        break
      case RoomMode.old:
        this.selectDesc.getComponent(Label).string = '只有最原始的能力'
        break
      case RoomMode.limit:
        this.selectDesc.getComponent(Label).string = '不允许使用崇高假身'
        break
      case RoomMode.infinite:
        this.selectDesc.getComponent(Label).string = '没有时间限制'
        break
    }
  }
}
