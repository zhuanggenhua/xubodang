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
  log,
} from 'cc'
import { EventEnum, SkillPathEnum } from '../enum'
import { ApiFunc } from '../common'
import DataManager from '../global/DataManager'
import { createPrompt, destroyPromt } from '../utils'
import actors from '../config/actor'
import EventManager from '../global/EventManager'
import Ai from '../ai/Ai'
import NetworkManager from '../global/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('ChooseMgr')
export class ChooseMgr extends Component {
  private active: any = null
  private label1: Label = null
  private label2: Label = null
  private isDisable: boolean = false

  // 绑定事件
  onLoad() {
    EventManager.Instance.on(EventEnum.randomActor, this.randomActor, this)
  }
  onDestroy() {
    EventManager.Instance.off(EventEnum.randomActor, this.randomActor, this)
  }
  randomActor() {
    this.isDisable = true
  }
  start() {
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
        async (event: EventTouch) => {
          destroyPromt()
          if (this.isDisable) return
          // 排他
          chooseNode.children.forEach((node) => {
            node.getComponent(Sprite).spriteFrame = normalSprite
          })

          // 设置按钮为按下状态的样式
          actorNode.getComponent(Button).normalSprite = activeSprite
          this.active = actor
          this.label1.string = actors[actor].actorName
          EventManager.Instance.emit(EventEnum.renderSkills, this.active)
          EventManager.Instance.emit(EventEnum.renderChart, this.active, 'Graphics1')

          // 广播
          if (DataManager.Instance.mode == 'network') {
            const res = await NetworkManager.Instance.callApi(ApiFunc.ApiChooseActor, {
              actor: this.active,
            })
            console.log('选择角色', res)
          }
        },
        this,
      )

      //   默认选中第一个
      if (index === 0) {
        actorNode.getComponent(Button).normalSprite = activeSprite
        this.active = actor
        EventManager.Instance.emit(EventEnum.renderSkills, this.active)
        EventManager.Instance.emit(EventEnum.renderChart, this.active, 'Graphics1')
        EventManager.Instance.emit(EventEnum.renderChart, this.active, 'Graphics2')
      }
    })

    // 单人模式，ai直接选择
    if (DataManager.Instance.mode === 'single') {
      Ai.Instance.setActor(actors.soldier)
      EventManager.Instance.emit(EventEnum.createActor, 'soldier', Ai.Instance.id)
      EventManager.Instance.emit(EventEnum.renderChart, 'soldier', 'Graphics2')
    }
  }

  async handlerReady(event: EventTouch) {
    // 人没齐，不让进
    if (DataManager.Instance.mode === 'network' && DataManager.Instance.roomInfo.players.length < 2) return
    if (this.isDisable) return
    event.target.getComponent(Button).normalSprite = event.target.getComponent(Button).activeSprite
    this.isDisable = true
    EventManager.Instance.emit(EventEnum.createActor, this.active)
    EventManager.Instance.emit(EventEnum.renderSkills, this.active)
    EventManager.Instance.emit(EventEnum.renderChart, this.active, 'Graphics1')

    if (DataManager.Instance.mode === 'network') {
      const res = await NetworkManager.Instance.callApi(ApiFunc.enterGame, {
        actor: this.active,
      })
      console.log('进入游戏', res)
    }
  }
}
