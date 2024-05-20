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
import { BuffEnum, EventEnum, IActor, ISkill, ParamsNameEnum, SkillPathEnum, Special } from '../enum'
import EventManager from '../global/EventManager'
import DataManager from '../global/DataManager'
import { cantUse, createPrompt, destroyPromt, isEmpty } from '../utils'
import Ai from '../ai/Ai'
import skills from '../config/skills'
import { ApiFunc } from '../common'
import NetworkManager from '../global/NetworkManager'
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
  private skills: ISkill[] = [] //记录技能，用于判断

  private activeSkill: Node = null
  private dragNode: Node = null // 触摸拖动的对象
  private entryHand: boolean = false //进入手势区域
  private isDisable: boolean = false
  private isStart: boolean = false

  private keys: number[] = []
  startGame() {
    this.isStart = true
  }

  // 绑定事件
  onDestroy() {
    EventManager.Instance.off(EventEnum.updateSkillItem, this.updateSkillItem, this)
    EventManager.Instance.off(EventEnum.handlerNextTurn, this.handlerNextTurn, this)
  }
  onLoad() {
    EventManager.Instance.on(EventEnum.updateSkillItem, this.updateSkillItem, this)
    EventManager.Instance.on(EventEnum.handlerNextTurn, this.handlerNextTurn, this)
  }

  init(actor: IActor) {
    console.log('初始化技能列表', actor)
    // 把显示与绑定事件分开性能更好，不过也不用考虑性能
    this.skillItemNodes = []
    this.skillNodes = []
    this.skills = []

    const normalSprite = DataManager.Instance.skillMap.get(SkillPathEnum.NormalSprite)
    const activeSprite = DataManager.Instance.skillMap.get(SkillPathEnum.ActiveSprite)

    const thisSkills = actor.skills

    Object.keys(thisSkills).forEach((key, itemIndex) => {
      const skillItemNode = this.node.children[itemIndex]
      // if (itemIndex !== 0) skillItemNode.getComponent(UIOpacity).opacity = 100
      this.skillItemNodes.push(skillItemNode) //保存起来方便管理

      thisSkills[key].forEach((skill, index) => {
        // 遍历每个技能
        // 获取到栏位
        const skillNode = skillItemNode.getChildByName('Skills').children[index]

        this.skillNodes.push(skillNode) //保存起来方便管理
        this.skills.push(skill) //保存起来方便管理
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
            // 处理旋转下落的
            this.handlerTouchEnd(skillNode, { key, index }, itemIndex)()

            // 设置提示框
            createPrompt(skillNode, skill)

            if (!this.isStart) return //未开始不实际使用
            // 能级判断
            if (
              (DataManager.Instance.playerActor.buffs.has(BuffEnum.saiya) && skill.name.includes('波')) ||
              (DataManager.Instance.playerActor.buffs.has(BuffEnum.wall) && skill == skills['012'])
            ) {
              if (DataManager.Instance.actor1.power < itemIndex - 1) return //无法使用
            } else {
              if (DataManager.Instance.actor1.power < itemIndex) return //无法使用
            }

            if (cantUse(skill)) return //变灰的

            // 第二次按下
            if (this.activeSkill == skillNode) {
              // 排他
              this.skillNodes.forEach((node) => {
                node.getComponent(Sprite).spriteFrame = normalSprite
              })

              // 设置按钮为按下状态的样式
              skillNode.getComponent(Sprite).spriteFrame = activeSprite

              // 触发技能，执行逻辑
              skillNode.getComponent(Sprite).spriteFrame = normalSprite
              destroyPromt()

              this.handlerCheck(skillNode, { key, index }, itemIndex)
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
        skillNode.on(Input.EventType.TOUCH_CANCEL, this.handlerTouchEnd(skillNode, { key, index }, itemIndex))
      })
    })

    if (this.isStart) {
      this.updateSkillItem(DataManager.Instance.actor1.power)
    } else {
      this.updateSkillItem(4)
    }
  }
  handlerTouchEnd(skillNode, skillIndex: any, itemIndex) {
    return () => {
      if (this.dragNode) {
        if (this.entryHand) {
          this.entryHand = false
          // 旋转，缩放，下落
          tween(this.dragNode)
            .to(0.5, { scale: v3(0.1, 0.1, 1), eulerAngles: v3(0, 0, 360), position: this.downPoint.position })
            .call(() => {
              this.dragNode.destroy()
              this.dragNode = null

              // 触发选中效果
              this.handlerCheck(skillNode, skillIndex, itemIndex)
            })
            .start()
        } else {
          this.dragNode.destroy()
          this.dragNode = null
          // 因为设置为0 了，所以需要显示
          skillNode.getComponent(UIOpacity).opacity = 255
        }
      }
    }
  }

  // 处理选中技能， skillIndex.key和power是等价的
  async handlerCheck(skillNode: Node, skillIndex: any, power: number) {
    EventManager.Instance.emit(EventEnum.useSkill, skillIndex, power)

    if (DataManager.Instance.mode === 'single') {
      Ai.Instance.excute()
    } else if (DataManager.Instance.mode === 'network') {
      const res = await NetworkManager.Instance.callApi(ApiFunc.ApiUseSkill, {
        key: skillIndex.key,
        index: skillIndex.index,
        power,
      })
      console.log('使用技能', res)
    }

    this.isDisable = true
    // 除了选中的都变灰
    this.skillNodes.forEach((item) => {
      if (item == skillNode) return
      item.getComponent(UIOpacity).opacity = 100
    })
  }

  updateSkillItem(power: number) {
    console.log('当前能量, 所需能量', power, this)
    this.skillItemNodes.forEach((item, index) => {
      // 处理减少消耗
      console.log('power', power)

      if (power <= 2) {
        if (
          DataManager.Instance.playerActor.buffs?.has(BuffEnum.saiya) ||
          DataManager.Instance.playerActor.buffs?.has(BuffEnum.wall)
        ) {
          if (power >= index - 1) {
            item.getComponent(UIOpacity).opacity = 255
            item.getChildByName('Skills').children.forEach((skillItem, index2) => {
              if (power >= index) {
                skillItem.getComponent(UIOpacity).opacity = 255
              } else {
                if (
                  power >= index - 1 &&
                  (this.skills[index * 4 + index2].name?.includes('波') ||
                    this.skills[index * 4 + index2] == skills['012'])
                ) {
                  skillItem.getComponent(UIOpacity).opacity = 255
                } else {
                  setTimeout(() => {
                    skillItem.getComponent(UIOpacity).opacity = 100
                  }, 100)
                }
              }
            })
          } else {
            item.getComponent(UIOpacity).opacity = 100
          }

          return
        }
      }

      if (index > power) item.getComponent(UIOpacity).opacity = 100
      else item.getComponent(UIOpacity).opacity = 255
    })

    this.skillNodes.forEach((item, index) => {
      const skill = this.skills[index]
      setTimeout(() => {
        //处理禁用技能
        if (cantUse(skill)) {
          item.getComponent(UIOpacity).opacity = 100
        }
      }, 100)
    })
  }

  handlerNextTurn() {
    // 虎符校验，都结算完就进入下一回合
    if (!this.keys) this.keys = []
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

      // 如果生命归零，结束游戏
      // 判断最终显示平局还是其他
      if (DataManager.Instance.actor1.hp <= 0 || DataManager.Instance.actor2.hp <= 0) {
        const actor1 = DataManager.Instance.actor1
        const actor2 = DataManager.Instance.actor2
        let endTitle = '平局'
        if (
          DataManager.Instance.actor1.hp <= 0 &&
          DataManager.Instance.actor2.hp <= 0 &&
          (actor1.skill.skill.speed || actor2.skill.skill.speed)
        ) {
          if (actor1.skill.skill.speed && actor2.skill.skill.speed) {
            // 都是快速
            endTitle = '平局'
          }
          if (actor1.skill.skill.speed) {
            endTitle = '陷胜！'
          }
          if (actor2.skill.skill.speed) {
            endTitle = '惜败！'
          }
        } else {
          if (DataManager.Instance.actor1.hp >= 1) {
            endTitle = '胜利！'
          }
          if (DataManager.Instance.actor1.hp >= DataManager.Instance.actor1.hpMax / 2) {
            endTitle = '完胜！'
          }
          if (DataManager.Instance.actor2.hp >= 1) {
            endTitle = '败北！'
          }
          if (DataManager.Instance.actor2.hp >= DataManager.Instance.actor2.hpMax / 2) {
            endTitle = '惨败'
          }
        }
        DataManager.Instance.endTitle = endTitle

        EventManager.Instance.emit(EventEnum.gameOver)
      }

      DataManager.Instance.actors.forEach((actor) => {
        actor.skill?.onDestroy()
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

      console.log('当前轮次', DataManager.Instance.roomInfo.turn)
    }, 0.1 * DataManager.Instance.animalTime)
  }
}
