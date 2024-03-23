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
  // 能级
  // 显隐

  // 维护当前能级的所有技能

  // 绑定事件
  init(skills: ISkill[]) {
    skills.forEach((skill, index) => {
      // 遍历每个技能
      // 获取到栏位
      const skillNode = this.node.children[index]
      const icon = skillNode.getChildByName('SkillIcon')

      icon.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(skill.particle)
      this.node.active = true

      //   绑定点击事件()      
      skillNode.on(
        Button.EventType.CLICK,
        () => {
          let buttonComp = skillNode.getComponent(Button)
          // 设置按钮为按下状态的样式
          skillNode.getComponent(Sprite).spriteFrame = buttonComp.pressedSprite
        //   todo 点击方框亮
          console.log('??', buttonComp.pressedSprite);
        },
        this,
      )

      // 技能绑定拖动动画
    })
  }
}
