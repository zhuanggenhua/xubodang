import {
  _decorator,
  Canvas,
  Component,
  EditBox,
  EventTouch,
  Label,
  Node,
  ResolutionPolicy,
  sys,
  UITransform,
  view,
} from 'cc'
import NetworkManager from '../global/NetworkManager'
import DataManager, { mapH, mapW } from '../global/DataManager'
import { ApiFunc } from '../common'
const { ccclass, property } = _decorator

@ccclass('InputMgr')
export class InputMgr extends Component {
  editBox = null
  handlerInputStart(editBox: EditBox) {
    this.editBox = editBox
    editBox.getComponent(EditBox).string = ''
  }

  private timerId: any

  handlerInput(value) {
    // 防抖
    clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      NetworkManager.Instance.callApi(ApiFunc.RoomListByName, { roomName: value })
    }, 500)
    // if(sys.os === sys.OS.ANDROID){
    //   this.editBox.getComponent(EditBox).string += value
    // }
  }
}
