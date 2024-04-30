import { isPlayer, setPrefab } from './index'
import { EntityTypeEnum, ISkill } from '../common'
import { BuffEnum, EventEnum, MissType, ParamsNameEnum, SkillPathEnum, Special } from '../enum'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { ActorManager } from '../entity/actor/ActorManager'
import { Component, instantiate, Node, v3 } from 'cc'
import { Wall } from '../particle/Wall'
import ParticleMgr from '../particle/ParticleMgr'
import actors from '../config/actor'
import skills from '../config/skills'

/**
 * 添加技能：
 * 在TexturePathEnum配置资源路径
 * 在ActorStateMachine配置新State状态机
 */
// 执行器，用于拆分数据结算
export default class Skill extends Component {
  get otherSkill() {
    if (isPlayer(this.id)) {
      return DataManager.Instance.actor2.skill
    } else {
      return DataManager.Instance.actor1.skill
    }
  }
  get actor() {
    return DataManager.Instance.actors.get(this.id)
  }
  get otherActor() {
    return DataManager.Instance.actors.get(this.otherSkill.id)
  }

  setSkillState() {
    if (!this.skill.animal) return
    // 确保SkillPathEnum和ParamsNameEnum 的key是一致的
    console.log('设置状态', this.skill.animal, ParamsNameEnum[this.getKeyByValue(this.skill.particle)])
    this.actor.state = this.skill.animal
  }
  // temp 临时获取key
  getKeyByValue(value, object = SkillPathEnum) {
    return Object.keys(object).find((key) => object[key] === value)
  }

  // 保存原始伤害，用于事后恢复
  damage: number
  defense: number
  power: number
  constructor(public skill: ISkill, public id: number) {
    super()
  }
  onDestroy() {
    this.skill.defense = this.defense
    this.skill.power = this.power
    this.skill.damage = this.damage
    // 在对象销毁前取消事件注册
    EventManager.Instance.off(EventEnum.powerFinal, this.powerFinal, this)
    EventManager.Instance.off(EventEnum.attackFinal, this.attackFinal, this)
    EventManager.Instance.off(EventEnum.defenseFinal, this.defenseFinal, this)
    EventManager.Instance.off(EventEnum.missFinal, this.missFinal, this)
    EventManager.Instance.off(EventEnum.continueFinal, this.continueFinal, this)
    EventManager.Instance.off(EventEnum.specialFinal, this.specialFinal, this)
  }

  excute() {
    // 两个角色使用同一个技能，会错乱
    this.skill = JSON.parse(JSON.stringify(this.skill))
    this.tigerLength = this.skill.type.length
    this.defense = this.skill.defense
    this.power = this.skill.power
    this.damage = this.skill.damage

    if (this.actor.buffs.has(BuffEnum.loopSword)) {
      this.tigerLength++
      this.actor.shoot(this.otherActor, EntityTypeEnum.Sword, () => {
        console.log('飞剑结束')
        const skill: ISkill = { damage: 1, range: ['0', '1'], type: [1] }
        // 处理闪避
        if (!this.miss()) {
          // 盾牌碎裂
          console.log('伤害', skill.damage)
          const damage = this.otherActor.shieldBreak(skill.damage || 0)
          console.log('最终伤害', damage)

          this.otherActor.hp -= damage

          // 盾牌碎裂,等动画播完再下回合
          if (damage >= 0 && this.otherActor.shields.length > 0) {
            this.scheduleOnce(() => {
              this.tiger()
            }, 0.1 * DataManager.Instance.animalTime)
            return
          }
        }

        this.tiger()
      })
    }

    if (this.skill.special === Special.copy) {
      this.actor.node.getChildByName('eyes').active = true
      this.scheduleOnce(() => {
        this.actor.node.getChildByName('eyes').active = false
      }, 0.1 * DataManager.Instance.animalTime)
      this.skill = this.otherSkill.skill
    }

    if (this.actor.buffs.has(BuffEnum.clone)) {
      if (this.actor.actorClone[0]) {
        this.skill.power += this.skill.power
        this.skill.damage += this.skill.damage
        this.skill.defense += this.skill.defense
      }
      if (this.actor.actorClone[1]) {
        this.skill.power += this.skill.power
        this.skill.damage += this.skill.damage
        this.skill.defense += this.skill.defense
      }
    }

    this.skill.type.forEach((type) => {
      switch (type) {
        case 0:
          EventManager.Instance.on(EventEnum.powerFinal, this.powerFinal, this)
          this.powerHandler()
          break
        case 1:
          // 用命令模式加队列，也可以达到分步骤执行效果
          EventManager.Instance.on(EventEnum.attackFinal, this.attackFinal, this)
          setTimeout(() => {
            this.attackHandler()
          })
          break
        case 2:
          EventManager.Instance.on(EventEnum.defenseFinal, this.defenseFinal, this)
          this.defenseHandler()
          break
        case 3:
          EventManager.Instance.on(EventEnum.missFinal, this.missFinal, this)
          this.missHandler()
          break
        case 4:
          EventManager.Instance.on(EventEnum.continueFinal, this.continueFinal, this)
          this.continueHandler()
          break
        case 5:
          EventManager.Instance.on(EventEnum.specialFinal, this.specialFinal, this)
          this.specialHandler()
          break
      }
    })
  }
  // 虎符  在这里等所有动作执行完进入下一轮
  tigerLength: number = 0
  tiger() {
    this.tigerLength--
    if (this.tigerLength === 0) {
      console.log('下一轮', this.tigerLength)
      EventManager.Instance.emit(EventEnum.handlerNextTurn)
    }
  }

  // 在动画后结算伤害
  attackFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('attack结束', this.actor.id, this.skill.damage)

      const otherActor = this.otherActor
      switch (this.otherSkill.skill.missType) {
        case MissType.Single:
          otherActor.state = ParamsNameEnum.clone
          // 替身动画
          EventManager.Instance.emit(EventEnum.missSingle, otherActor)
      }

      if (otherActor.buffs.has(BuffEnum.door) && otherActor.doorHp > 0 && this.skill.special !== Special.qigongpao) {
        const damage = this.skill.damage
        this.skill.damage -= otherActor.doorHp
        otherActor.doorHp -= damage
        if (this.skill.damage < 0) this.skill.damage = 0
        EventManager.Instance.emit(EventEnum.onDoorDefense, otherActor, otherActor.doorHp)
      }

      // 处理闪避
      if (!this.miss()) {
        // 盾牌碎裂
        console.log('伤害', this.skill.damage)
        let damage

        if (this.skill.pierce) {
          // 穿透，直接造成伤害
          this.otherActor.hp -= this.skill.damage
          this.tiger()
          return
        } else {
          // 计算护盾
          damage = this.otherActor.shieldBreak(this.skill.damage || 0, this.skill.broken || 0)
        }
        // 分身
        if (this.otherActor.buffs.has(BuffEnum.clone) && damage > 0) {
          if (this.otherActor.actorClone[0]) {
            const otherActor = this.otherActor.actorClone[0]
            otherActor.getComponent(ActorManager).state = ParamsNameEnum.clone
            this.otherActor.actorClone[0] = null
            this.scheduleOnce(() => {
              otherActor.destroy()
            }, 0.1 * DataManager.Instance.animalTime)
            damage -= 1
          }
          if (this.otherActor.actorClone[1] && damage > 0) {
            const otherActor = this.otherActor.actorClone[1]
            otherActor.getComponent(ActorManager).state = ParamsNameEnum.clone
            this.otherActor.actorClone[1] = null
            this.scheduleOnce(() => {
              otherActor.destroy()
            }, 0.1 * DataManager.Instance.animalTime)
            damage -= 1
          }
        }

        console.log('最终伤害', damage)
        this.otherActor.hp -= damage
        // 吸血
        if (this.actor.buffs.has(BuffEnum.blood) && !this.skill.longrang) {
          if (this.skill.damage > 0 && !this.miss()) {
            this.actor.hp += this.skill.damage
          }
        }

        if (damage > 0) {
          if (this.skill.animal == ParamsNameEnum.AncientSwordIdle) {
            // 没有动画，用闪白将就下
            EventManager.Instance.emit(EventEnum.flicker, this.actor.otherActor)
            EventManager.Instance.emit(EventEnum.moveBack, this.actor.otherActor, 200, 0)
          }
          if (this.skill.animal == ParamsNameEnum.QiGong) {
            EventManager.Instance.emit(EventEnum.moveBack, this.otherActor, 200, 0)
            this.scheduleOnce(() => {
              this.tiger()
            }, 0.2 * DataManager.Instance.animalTime)
            return
          }
        }

        // 盾牌碎裂,等动画播完再下回合
        if (damage >= 0 && this.otherActor.shields.length > 0) {
          this.scheduleOnce(() => {
            this.tiger()
          }, 0.1 * DataManager.Instance.animalTime)
          return
        }
      }

      this.tiger()
    }
  }

  // 判断是否被闪避
  miss() {
    // 闪避所有
    if (this.otherSkill.skill.missType === MissType.All) {
      return true
    }
    // 不可被闪避
    if (this.skill.special === Special.gengzongbo) {
      return false
    }
    // 闪避弹丸类型
    // if (this.skill.bullet && this.otherSkill.skill.missType === MissType.Bullet) {
    //   return true
    // }

    let tag = true

    // 单范围闪避
    switch (this.otherSkill.skill.missType) {
      case MissType.Bullet:
        if (!this.skill.longrang) break
      case MissType.Single:
        this.skill.range.forEach((range) => {
          if (range.length > 1) tag = false
        })
        return tag //不判断基本情况
    }

    // 默认只能打地面
    if (!this.skill.range) this.skill.range = ['0']
    if (this.actor.buffs.has(BuffEnum.fly)) this.skill.range.push('1')
    this.skill.range.forEach((range) => {
      let location = this.otherActor.location || '0'
      if (range.includes(location)) {
        //只要包含了，就没有被闪避，当然在missType后判断
        tag = false
      }
    })

    return tag
  }
  powerFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('power结束', this.actor.id)
      if (isPlayer(this.id))
        EventManager.Instance.emit(EventEnum.updateSkillItem, DataManager.Instance.actors.get(this.id).power)
      this.tiger()
    }
  }
  defenseFinal(actor: ActorManager, damage) {
    if (actor === this.actor) {
      console.log('defense结束', this.actor.id)
      this.tiger()
    }
  }
  missFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('miss结束', this.actor.id)
      this.tiger()
    }
  }
  continueFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('continue结束', this.actor.id)
      this.tiger()
    }
  }
  specialFinal(actor: ActorManager) {
    if (actor === this.actor) {
      console.log('special结束', this.actor.id)
      this.tiger()
    }
  }

  //   每拥有的一种类型都对应一种处理, 等动画执行触发结算时，都是修正好的数值了
  // 蓄力
  powerHandler() {
    const power = this.skill.power
    if (this.actor.power < 6) {
      this.actor.power += power
    }

    this.setSkillState()
  }
  defenseHandler() {
    // 在角色面前生成盾牌
    if (this.skill.shield) {
      this.actor.generateShield(this.skill.shield, this.skill)
    }

    if (this.skill.buff && this.skill.buff?.indexOf(BuffEnum.door) != -1) {
      // EventManager.Instance.emit(EventEnum.onDoorDefense, this.actor, 0)
      this.actor.doorHp = 6
      this.setSkillState()
      return
    }

    // 直接防御结束
    EventManager.Instance.emit(EventEnum.defenseFinal, this.actor)
  }
  attackHandler() {
    if (this.skill.special === Special.qigongpao) {
      this.setSkillState()
    }

    if (this.skill.special === Special.fire) {
      this.actor.node.getChildByName('eyes').active = true
      this.scheduleOnce(() => {
        let fire
        if (this.otherActor.isMove) {
          fire = setPrefab('Fire', this.otherActor.node)
        } else {
          fire = setPrefab('Fire', this.otherActor.node.parent)
          fire.setPosition(this.otherActor.node.position)
        }
        this.scheduleOnce(() => {
          fire.destroy()
          this.actor.node.getChildByName('eyes').active = false
          EventManager.Instance.emit(EventEnum.attackFinal, this.actor)
        }, 0.2 * DataManager.Instance.animalTime)
      }, 0.1 * DataManager.Instance.animalTime)
      return
    }

    // 伤害修正
    // 城墙对弓弩强化
    if (this.actor.buffs.has(BuffEnum.wall) && this.skill.bullet === EntityTypeEnum.Crossbow) {
      let count = 0
      this.otherActor.node.children.forEach((child) => {
        if (child.name === 'Crossbow') {
          count++
        }
      })
      this.skill.damage += count
    }
    if (this.actor.buffs.has(BuffEnum.saiya) && this.skill.name.includes('龟波气功')) {
      this.skill.damage += 2
    }
    if (this.actor.buffs.has(BuffEnum.spartan)) {
      this.skill.damage += 1
    }
    if (this.actor.buffs.has(BuffEnum.shuangbei)) {
      this.skill.damage *= 2
      this.actor.hp--
    }

    if (this.skill.special === Special.earth) {
      this.skill.damage = this.otherActor.hp
    }

    // 防御计算，因为不一定防御，写在防御逻辑里无法触发
    // 防御效果+1
    if (this.otherActor.buffs.has(BuffEnum.spartan)) {
      this.skill.damage -= 1
    }
    // 城墙对远程防御+1
    if (this.otherActor.buffs.has(BuffEnum.wall) && this.skill.longrang) {
      this.skill.damage -= 1
    }

    if (this.skill.special === Special.sun) {
      this.setSkillState()
      this.scheduleOnce(() => {
        // 太阳特效
        const sun = setPrefab('Sun', this.actor.node)
        this.scheduleOnce(() => {
          sun.destroy()
          this.actor.move(this.otherActor, () => {
            this.actor.state = ParamsNameEnum.Kan
          })
        }, 0.2 * DataManager.Instance.animalTime)
      }, 0.1 * DataManager.Instance.animalTime)
      return
    }

    // 远程弹丸
    if (this.skill.bullet) {
      if (this.skill.speed === 1) {
        // 快速攻击（一般是射击）  立即触发动画
        this.setSkillState()
        this.actor.shoot(this.otherActor, this.skill.bullet)
        return
      }
    }

    // 近距离
    if (this.skill.target === 1) {
      // 目标是自己
      DataManager.Instance.actor1.hp -= this.skill.damage
      this.tiger()
      return
    } else {
      if (!this.skill.longrang) {
        // if (!this.otherSkill.skill.location || this.otherSkill.skill.location == 0) {
        // 近战攻击，进入移动  反正就两个角色，不用事件系统更方便

        this.actor.move(this.otherActor, () => {
          this.setSkillState()
        })
      } else {
        //慢速远程
        this.setSkillState()
      }
    }
  }
  missHandler() {
    // 闪避的时机
    if (this.otherSkill.skill.animal == ParamsNameEnum.QiGong) {
      this.scheduleOnce(() => {
        this.setSkillState()
      }, 0.2 * DataManager.Instance.animalTime)
    } else {
      this.setSkillState()
    }
    if (this.skill.location) this.actor.location = this.skill.location
    switch (this.skill.missType) {
      case MissType.Single:
      case MissType.All:
        EventManager.Instance.emit(EventEnum.missFinal, this.actor)
    }
    if (this.skill.buff?.indexOf(BuffEnum.wall) !== -1) {
      EventManager.Instance.emit(EventEnum.missFinal, this.actor)
    }
  }
  continueHandler() {
    // 城墙不重复
    if (this.skill.buff?.indexOf(BuffEnum.wall) !== -1 && this.actor.buffs.has(BuffEnum.wall)) {
      EventManager.Instance.emit(EventEnum.continueFinal, this.actor)
      return
    }
    this.actor.setBuffer(this.skill)

    if (this.skill.buff?.indexOf(BuffEnum.wall) !== -1) {
      // 找到十字弩并修改
      let nu = skills['012']
      nu.desc = '裂伤：造成对方身上箭支数量的额外伤害'
      // 重新渲染
      EventManager.Instance.emit(EventEnum.renderSkills, this.actor.actor)
      // 画城墙
      const canvas = this.actor.node.getChildByName('canvas4')
      const particleMgr = canvas.getComponent(ParticleMgr) || canvas.addComponent(ParticleMgr)
      particleMgr.init(Wall, {
        max: 1,
        other: {
          actor: this.actor,
        },
      })
    }

    if (this.skill.buff?.indexOf(BuffEnum.saiya) !== -1) {
      this.setSkillState()
    }

    if (this.skill.buff?.indexOf(BuffEnum.clone) !== -1) {
      if (this.actor.actorClone[0]) {
        this.actor.actorClone[0].destroy()
        this.actor.actorClone[0] = null
      }
      if (this.actor.actorClone[1]) {
        this.actor.actorClone[1].destroy()
        this.actor.actorClone[1] = null
      }

      let clone1 = instantiate<Node>(this.actor.node)
      clone1.setParent(this.actor.node)
      clone1.setPosition(v3(0, 0))
      clone1.getComponent(ActorManager).isClone = true
      clone1.getComponent(ActorManager).init(this.actor.id, EntityTypeEnum.Actor, 1, this.actor.actor)
      this.actor.actorClone[0] = clone1
      let clone2 = instantiate<Node>(this.actor.node)
      clone2.setParent(this.actor.node)
      clone2.setPosition(v3(0, 0))
      clone2.getComponent(ActorManager).isClone = true
      clone2.getComponent(ActorManager).init(this.actor.id, EntityTypeEnum.Actor, 1, this.actor.actor)
      this.actor.actorClone[1] = clone2

      this.setSkillState()
    }

    if (this.skill.buff?.indexOf(BuffEnum.trap) !== -1) {
      this.setSkillState()
    }
  }
  specialHandler() {
    switch (this.skill.special) {
      case Special.Reflect:
        //bullet存在就代表是远程弹丸攻击
        if (this.otherSkill.skill.bullet) {
          // 这里让盾墙只能保留普通护盾
          EventManager.Instance.on(EventEnum.attackFinal, this.attackFinal, this)
        } else {
          EventManager.Instance.emit(EventEnum.specialFinal, this.actor)
        }
        break
      case Special.spartan:
        this.actor.node.getChildByName('solider').active = true
      case Special.saiya:
        this.actor.node.getChildByName('saiya').active = true
      // this.actor.
      default:
        // 没有特殊情况直接结束
        EventManager.Instance.emit(EventEnum.specialFinal, this.actor)
        break
    }
  }

  reset() {
    this.powerHandler = null
    this.defenseHandler = null
    this.attackHandler = null
    this.missHandler = null
    this.specialHandler = null
  }
}
