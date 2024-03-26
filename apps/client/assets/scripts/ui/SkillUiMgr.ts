import {
  _decorator,
  Component,
  Node,
  Label,
  Widget,
  tween,
  Sprite,
  SpriteFrame,
  Button,
  Prefab,
  EventHandler,
  Input,
} from 'cc'
import { EventEnum, SkillPathEnum } from '../enum'
import EventManager from '../global/EventManager'
import { ApiFunc, IActor, ISkill, RoomMode } from '../common'
import NetworkManager from '../global/NetworkManager'
import DataManager from '../global/DataManager'
import { createErrorTip, createPrompt } from '../utils'
import { HallUiMgr } from './HallUiMgr'
const { ccclass, property } = _decorator

@ccclass('SkillUiMgr')
export class SkillUiMgr extends Component {
  private skillNodes: Node[] = []
  private skillItemNodes: Node[] = []
  private prompt: Prefab = null
  // 能级
  // 显隐

  // 维护当前能级的所有技能

  // 绑定事件
  init(actor: IActor) {
    const skills = actor.skills
    Object.keys(skills).forEach((key, index) => {
      const skillItemNode = this.node.children[index]
      this.skillItemNodes.push(skillItemNode) //保存起来方便管理

      skills[key].forEach((skill, index) => {
        // 遍历每个技能
        // 获取到栏位
        const skillNode = skillItemNode.getChildByName('Skills').children[index]

        this.skillNodes.push(skillNode) //保存起来方便管理
        const icon = skillNode.getChildByName('SkillIcon')

        icon.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(skill.particle)
        this.node.active = true

        //   绑定点击事件()
        let button = skillNode.getComponent(Button)
        const normalSprite = button.normalSprite

        // const clickEventHandler = new EventHandler()
        // clickEventHandler.target = this.node // 这个 node 节点是你的事件处理代码组件所属的节点
        // clickEventHandler.component = 'SkillUiMgr' // 这个是脚本类名
        // clickEventHandler.handler = 'callback'
        // clickEventHandler.customEventData = 'foobar'

        // button.clickEvents.push(clickEventHandler)
        skillNode.on(
          Button.EventType.CLICK,
          (event: Button) => {
            // 第一次按下
            // 排他
            this.skillNodes.forEach((node) => {
              node.getComponent(Sprite).spriteFrame = normalSprite
              node.getComponent(Button).normalSprite = normalSprite
            })

            // 设置按钮为按下状态的样式
            skillNode.getComponent(Sprite).spriteFrame = button.pressedSprite
            button.normalSprite = button.pressedSprite

            // 设置提示框
            createPrompt(skillNode, skill)
          },
          this,
        )

        // 技能绑定拖动动画
      })
    })
  }
}
