import { _decorator, Component, Node, Label, Widget, tween, Sprite, SpriteFrame, Button } from 'cc'
import { EventEnum, SkillPathEnum } from '../enum'
import EventManager from '../global/EventManager'
import { ApiFunc, ISkill, RoomMode } from '../common'
import NetworkManager from '../global/NetworkManager'
import DataManager from '../global/DataManager'
import { createErrorTip } from '../utils'
import { HallUiMgr } from './HallUiMgr'
const { ccclass, property } = _decorator

@ccclass('SkillItemManager')
export class SkillItemManager extends Component {
  // 显隐

  // 绑定事件
  init(skills: ISkill[]) {}
}
