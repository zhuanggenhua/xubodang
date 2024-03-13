import { _decorator, Component, EventTouch, find, Label, Node, tween, UIOpacity, UITransform, v2, v3, Widget } from 'cc'
const { ccclass, property } = _decorator

@ccclass('HallUiMgr')
export class HallUiMgr extends Component {
  @property(Node)
  selectDesc: Node = null
  @property(Node)
  createHome: Node = null

  oldSelectRoom: Node = null

  activeSelect: Node = null
  oldSelectChild: Node = null

  handlerRoomClick(event: EventTouch) {
    const room = event.target
    if (this.oldSelectRoom === room) {
      // 进入房间
    } else {
      // 取消之前选中的
      if (this.oldSelectRoom) {
        const widget = this.oldSelectRoom.getChildByName('Tip').getComponent(Widget)
        tween(widget).to(0.1, { left: -180 }).start()
      }
      // 选中状态
      this.oldSelectRoom = room
      const widget = this.oldSelectRoom.getChildByName('Tip').getComponent(Widget)
      tween(widget).to(0.1, { left: 0 }).start()
    }
  }

  handlerCreateRoomClick(event: EventTouch) {
    if (!this.createHome.active) {
      // 打开创建房间模态框
      this.createHome.active = true
      const modalBox = this.createHome.getChildByName('ModalBox')

      // 过渡动画
      const opacity = modalBox.getComponent(UIOpacity)

      tween(opacity).to(0.1, { opacity: 255 }).start()
      // z轴必须是1，不然无法点击
      modalBox.setScale(0.2, 0.2, 1)
      tween(modalBox)
        .to(0.1, { scale: v3(1, 1, 1) })
        .start()
    } else {
      const modalBox = this.createHome.getChildByName('ModalBox')
      const opacity = modalBox.getComponent(UIOpacity)
      tween(opacity).to(0.1, { opacity: 0 }).start()
      tween(modalBox)
        .to(0.1, { scale: v3(0.2, 0.2, 1) })
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
      case '标准':
        this.selectDesc.getComponent(Label).string = ''
        break
      case '怀旧':
        this.selectDesc.getComponent(Label).string = '只有最原始的能力'
        break
      case '限制':
        this.selectDesc.getComponent(Label).string = '不允许使用崇高假身'
        break
      case '无限':
        this.selectDesc.getComponent(Label).string = '没有时间限制'
        break
    }
  }
}
