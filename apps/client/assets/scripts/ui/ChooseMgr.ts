import {
  _decorator,
  Component,
  Node,
  Widget,
  Sprite,
  Input,
  instantiate,
  Vec3,
  UITransform,
  UIOpacity,
  EventTouch,
  view,
  v2,
  SpriteFrame,
  Button,
  Label,
} from 'cc'
import { EventEnum, SkillPathEnum } from '../enum'
import { IActor } from '../common'
import DataManager from '../global/DataManager'
import { createPrompt, destroyPromt } from '../utils'
import actors from '../config/actor'
import EventManager from '../global/EventManager'
import Ai from '../ai/Ai'
const { ccclass, property } = _decorator

@ccclass('ChooseMgr')
export class ChooseMgr extends Component {
  private active: any = null
  private label1: Label = null
  private label2: Label = null
  private isDisable: boolean = false

  // 绑定事件
  beforeDestroy() {}
  onLoad() {
    this.label1 = this.node.getChildByName('Label1').getComponent(Label)
    this.label2 = this.node.getChildByName('Label2').getComponent(Label)

    const normalSprite = DataManager.Instance.skillMap.get(SkillPathEnum.NormalSprite)
    const activeSprite = DataManager.Instance.skillMap.get(SkillPathEnum.ActiveSprite)
    const chooseNode = this.node.getChildByName('Choose')
    Object.keys(actors).forEach((actor, index) => {
      const prefab = DataManager.Instance.prefabMap.get('ActorIcon')

      const actorNode = instantiate(prefab)
      actorNode.getChildByName('Icon').getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(
        SkillPathEnum[actor],
      )
      actorNode.setParent(chooseNode)

      actorNode.on(
        Button.EventType.CLICK,
        (event: EventTouch) => {
          destroyPromt()
          if (this.isDisable) return
          // 排他
          chooseNode.children.forEach((node) => {
            node.getComponent(Sprite).spriteFrame = normalSprite
          })
          // 设置按钮为按下状态的样式
          actorNode.getComponent(Button).normalSprite = activeSprite
          this.active = actor
          EventManager.Instance.emit(EventEnum.renderSkills, actors[actor])
          this.label1.string = actors[actor].actorName
        },
        this,
      )

      //   默认选中第一个
      if (index === 0) {
        actorNode.getComponent(Button).normalSprite = activeSprite
        this.active = actor
        EventManager.Instance.emit(EventEnum.renderSkills, actors[actor])
      }
    })
  }

  handlerReady(event: EventTouch) {
    if (this.isDisable) return
    event.target.getComponent(Button).normalSprite = DataManager.Instance.skillMap.get(SkillPathEnum.ActiveSprite)
    this.isDisable = true
    EventManager.Instance.emit(EventEnum.createActor)
    EventManager.Instance.emit(EventEnum.renderSkills, actors[this.active])
    if (DataManager.Instance.mode === 'single') {
      // 单人模式，直接进入
      Ai.Instance.setActor('soldier')
      EventManager.Instance.emit(EventEnum.createActor, Ai.Instance.id)
    }
  }
}
