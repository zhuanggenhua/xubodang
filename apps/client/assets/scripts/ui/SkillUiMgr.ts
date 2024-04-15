import {
  _decorator,
  Component,
  Node,
  Widget,
  tween,
  Sprite,
  SpriteFrame,
  Input,
  instantiate,
  Vec3,
  UITransform,
  UIOpacity,
  EventTouch,
  view,
  v3,
  v2,
} from 'cc'
import { EventEnum, SkillPathEnum } from '../enum'
import EventManager from '../global/EventManager'
import { IActor, ISkill } from '../common'
import DataManager from '../global/DataManager'
import { createPrompt, destroyPromt, isEmpty } from '../utils'
import Ai from '../ai/Ai'
const { ccclass, property } = _decorator

@ccclass('SkillUiMgr')
export class SkillUiMgr extends Component {
  @property(Node)
  private hands: Node = null
  // 落点
  @property(Node)
  private downPoint: Node = null

  private skillNodes: Node[] = []
  private skillItemNodes: Node[] = []

  private activeSkill: Node = null
  private dragNode: Node = null // 触摸拖动的对象
  private entryHand: boolean = false //进入手势区域
  private isDisable: boolean = false
  private isStart: boolean = false
  startGame() {
    this.isStart = true
  }

  // 绑定事件
  beforeDestroy() {
    EventManager.Instance.off(EventEnum.updateSkillItem, this.updateSkillItem, this)
    EventManager.Instance.off(EventEnum.handlerNextTurn, this.handlerNextTurn, this)
  }
  onLoad() {
    EventManager.Instance.on(EventEnum.updateSkillItem, this.updateSkillItem, this)
    EventManager.Instance.on(EventEnum.handlerNextTurn, this.handlerNextTurn, this)
  }
  init(actor: IActor) {
    // 把显示与绑定事件分开性能更好，不过也不用考虑性能
    this.skillItemNodes = []
    this.skillNodes = []
    const normalSprite = DataManager.Instance.skillMap.get(SkillPathEnum.NormalSprite)
    const activeSprite = DataManager.Instance.skillMap.get(SkillPathEnum.ActiveSprite)

    const skills = actor.skills
    Object.keys(skills).forEach((key, itemIndex) => {
      const skillItemNode = this.node.children[itemIndex]
      if (itemIndex !== 0) skillItemNode.getComponent(UIOpacity).opacity = 100
      this.skillItemNodes.push(skillItemNode) //保存起来方便管理

      skills[key].forEach((skill, index) => {
        // 遍历每个技能
        // 获取到栏位
        const skillNode = skillItemNode.getChildByName('Skills').children[index]

        this.skillNodes.push(skillNode) //保存起来方便管理
        const icon = skillNode.getChildByName('SkillIcon-001')

        this.node.active = true
        if (isEmpty(skill)) {
          skillNode.getComponent(Sprite).spriteFrame = null
          icon.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.addBlack)
          return
        }
        skillNode.getComponent(Sprite).spriteFrame = normalSprite
        icon.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(skill.particle)

        //   绑定点击事件()
        skillNode.off(Input.EventType.TOUCH_END)
        skillNode.on(
          Input.EventType.TOUCH_END,
          (event: EventTouch) => {
            if (this.isDisable) return
            // skillNode.getComponent(UIOpacity).opacity = 255
            // 处理旋转下落的

            this.handlerTouchEnd(skillNode, skill, itemIndex)()

            // 设置提示框
            createPrompt(skillNode, skill)

            if (!this.isStart) return //未开始不实际使用
            if (skillNode.getComponent(UIOpacity).opacity === 100) return //变灰的无法使用
            // 第二次按下
            if (this.activeSkill == skillNode) {
              if (DataManager.Instance.actors.get(DataManager.Instance.player.id).power < itemIndex) return
              // 排他
              this.skillNodes.forEach((node) => {
                node.getComponent(Sprite).spriteFrame = normalSprite
              })

              // 设置按钮为按下状态的样式
              skillNode.getComponent(Sprite).spriteFrame = activeSprite

              // 触发技能，执行逻辑
              skillNode.getComponent(Sprite).spriteFrame = normalSprite
              destroyPromt()

              this.handlerCheck(skillNode, skill, itemIndex)
              return
            }
            this.activeSkill = skillNode
          },
          this,
        )

        // 技能绑定拖动动画
        const skillTransform = skillNode.getComponent(UITransform)
        skillNode.off(Input.EventType.TOUCH_START)
        skillNode.on(Input.EventType.TOUCH_START, (event) => {
          if (!this.isStart) return
          if (this.isDisable || DataManager.Instance.actors.get(DataManager.Instance.player.id).power < itemIndex)
            return
          // 创建新节点并设置为拖动对象
          this.dragNode?.destroy()
          this.dragNode = instantiate(skillNode)
          this.dragNode.getComponent(Widget).destroy()
          this.dragNode.setParent(DataManager.Instance.stage)

          // 获取原节点世界坐标
          const worldPos = new Vec3(0, 0, 0)
          skillNode.getWorldPosition(worldPos)
          // 将世界坐标转换为新父节点的局部坐标
          let localPosition = DataManager.Instance.stage.getComponent(UITransform).convertToNodeSpaceAR(worldPos)
          this.dragNode.setPosition(localPosition.x, localPosition.y)

          // 隐藏原按钮
          skillNode.getComponent(UIOpacity).opacity = 0
        })
        skillNode.off(Input.EventType.TOUCH_MOVE)
        skillNode.on(Input.EventType.TOUCH_MOVE, (event: EventTouch) => {
          if (this.dragNode) {
            // 要除以缩放比
            const scaleY = view.getScaleY()
            const scaleX = view.getScaleX()

            let delta = event.getDelta() // 获取拖动的距离差值
            this.dragNode.setPosition(
              this.dragNode.position.x + delta.x / scaleX,
              this.dragNode.position.y + delta.y / scaleY,
            )

            // 获取触摸点位置
            // let touchPos = DataManager.Instance.stage
            //   .getComponent(UITransform)
            //   .convertToNodeSpaceAR(v3(event.getLocation().x, event.getLocation().y, 0))
            // 判断技能是否进入手势
            if (
              this.hands
                .getComponent(UITransform)
                .getBoundingBox()
                .contains(v2(this.dragNode.position.x, this.dragNode.position.y))
            ) {
              this.entryHand = true

              // #region
              // 改变手势
              const hand1 = this.hands.children[0]
              const hand2 = this.hands.children[1]
              if (skill.type.indexOf(0) !== -1) {
                hand1.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandXu)
                hand2.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandXu)
              } else if (skill.type.indexOf(1) !== -1) {
                hand1.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandTwo)
                hand2.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandTwo)
              } else if (skill.type.indexOf(2) !== -1) {
                hand1.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandFour)
                hand2.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandFour)
              } else if (skill.type.indexOf(3) !== -1) {
                hand1.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandCenter)
                hand2.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandCenter)
              } else if (skill.type.indexOf(4) !== -1) {
                hand1.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandXu)
                hand2.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandXu)
              } else if (skill.type.indexOf(5) !== -1) {
                hand1.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandCenter)
                hand2.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.HandCenter)
              }
              // #endregion
            } else {
              this.entryHand = false
            }
          }
        })
        skillNode.off(Input.EventType.TOUCH_CANCEL)
        skillNode.on(Input.EventType.TOUCH_CANCEL, this.handlerTouchEnd(skillNode, skill, itemIndex))
      })
    })
  }
  handlerTouchEnd(skillNode, skill, itemIndex) {
    return () => {
      if (this.dragNode) {
        if (this.entryHand) {
          // 旋转，缩放，下落
          tween(this.dragNode)
            .to(0.5, { scale: v3(0.1, 0.1, 1), eulerAngles: v3(0, 0, 360), position: this.downPoint.position })
            .call(() => {
              this.dragNode.destroy()
              this.dragNode = null

              // 触发选中效果
              this.handlerCheck(skillNode, skill, itemIndex)
            })
            .start()
        } else {
          this.dragNode.destroy()
          this.dragNode = null
          skillNode.getComponent(UIOpacity).opacity = 255
        }
      }
    }
  }

  handlerCheck(skillNode: Node, skill: ISkill, power: number) {
    EventManager.Instance.emit(EventEnum.useSkill, skill, power)

    if (DataManager.Instance.mode === 'single') {
      Ai.Instance.excute()
    }

    this.isDisable = true
    // 除了选中的都变灰
    this.skillNodes.forEach((item) => {
      if (item == skillNode) return
      item.getComponent(UIOpacity).opacity = 100
    })
  }

  updateSkillItem(power: number) {
    console.log('当前能量, 所需能量', power)
    this.skillItemNodes.forEach((item, index) => {
      if (index > power) item.getComponent(UIOpacity).opacity = 100
      else item.getComponent(UIOpacity).opacity = 255
    })
  }

  keys: number[] = []
  handlerNextTurn() {
    // 虎符校验，都结算完就进入下一回合
    this.keys.push(1)
    if (this.keys.length < 2) {
      return
    } else {
      this.keys = []
    }

    this.scheduleOnce(() => {
      console.log('重置')

      // 恢复场景
      DataManager.Instance.battleCanvas.reset()

      DataManager.Instance.roomInfo.turn += 1
      DataManager.Instance.actors.forEach((actor) => {
        actor.skill.onDestroy()
        // if (actor.skill && actor.skill.destroy) {
        //   actor.skill.destroy()
        // }
        actor.skill = null
        // 重置位置
        actor.reset()
      })

      // 必须异步才能改到，奇妙……
      setTimeout(() => {
        this.isDisable = false
      })

      // 技能栏透明度
      this.updateSkillItem(DataManager.Instance.actor1.power)

      // 技能透明度变回
      if (this.activeSkill) this.activeSkill.getComponent(UIOpacity).opacity = 100 //处理不变回问题
      this.activeSkill = null
      setTimeout(() => {
        this.skillNodes.forEach((item) => {
          item.getComponent(Sprite).spriteFrame = DataManager.Instance.skillMap.get(SkillPathEnum.NormalSprite)
          item.getComponent(UIOpacity).opacity = 255
        })
      })

      console.log('当前轮次', DataManager.Instance.roomInfo.turn);
      
    }, 0.05 * DataManager.Instance.animalTime)
  }
}
