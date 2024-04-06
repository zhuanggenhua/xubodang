import { _decorator, Color, Component, Input, instantiate, Label, Node, Sprite, tween, UIOpacity, Vec3 } from 'cc'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { EventEnum } from '../enum'
import { ApiFunc, EntityTypeEnum, IActor, IPlayer, ISkill } from '../common'
import NetworkManager from '../global/NetworkManager'
import actors from '../config/actor'
import { SkillUiMgr } from '../ui/SkillUiMgr'
import { destroyPromt, isPlayer } from '../utils'
import { ActorManager } from '../entity/actor/ActorManager'
import Ai from '../ai/Ai'
import Skill from '../utils/Skill'
import { BattleCanvas } from '../ui/BattleCanvas'
import { ShakeManager } from '../utils/ShakeManager'
const { ccclass, property } = _decorator

@ccclass('BattleMgr')
export class BattleMgr extends Component {
  @property(Node)
  skillContainer: Node = null
  @property(Node)
  Battle: Node = null

  bg: Node
  hearts1: Node
  hearts2: Node

  onLoad() {
    DataManager.Instance.battleCanvas = this.Battle.getComponent(BattleCanvas)
    this.Battle.destroyAllChildren()
    this.Battle.addComponent(ShakeManager)

    NetworkManager.Instance.listenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
    // NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);
    EventManager.Instance.on(EventEnum.useSkill, this.useSkill, this)
    EventManager.Instance.on(EventEnum.updateHp, this.setHeart, this)
  }
  beforeDestroy() {
    EventManager.Instance.off(EventEnum.useSkill, this.useSkill, this)
    NetworkManager.Instance.unlistenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
  }
  async start() {
    await DataManager.Instance.loadRes() //temp
    this.bg = DataManager.Instance.stage.getChildByName('Bg')
    this.setPlayerName(this.bg.getChildByName('Name1').getComponent(Label), DataManager.Instance.player)

    this.hearts1 = this.bg.getChildByName('Hearts1')
    this.hearts2 = this.bg.getChildByName('Hearts2')
    this.setHeart()
    this.renderPlayers()

    // 渲染当前选中角色技能，默认是战士
    this.renderSkills(actors.soldier)
    // 点击任何地方都会隐藏提示框
    this.node.on(
      Input.EventType.TOUCH_START,
      () => {
        destroyPromt()
      },
      this,
    )
    // test
    this.createActor(EntityTypeEnum.Actor)
    if (DataManager.Instance.mode === 'single') {
      Ai.Instance.setActor('soldier')
      this.createActor(EntityTypeEnum.Actor, Ai.Instance.id)
    }
  }

  createActor(type, id: number = DataManager.Instance.player.id) {
    let prefab = DataManager.Instance.prefabMap.get('Actor1')
    const actor = instantiate(prefab)
    if (!isPlayer(id)) {
      // 左右翻转
      actor.setScale(new Vec3(-1, 1, 1))
    }
    actor.setParent(this.Battle)
    const actorMgr = actor.addComponent(ActorManager)

    actorMgr.init(id, type, DataManager.Instance.roomInfo?.life)
    DataManager.Instance.actors.set(id, actorMgr)
    if (DataManager.Instance.actors.size === 2) {
      this.startGame()
    }
  }
  startGame() {}

  useSkill(skill: ISkill, power: number, id: number = DataManager.Instance.player.id) {
    DataManager.Instance.actors.get(id).skill = new Skill(skill, id)
    DataManager.Instance.actors.get(id).power -= power

    // 两个角色都就绪才执行
    let ready = true
    DataManager.Instance.actors.forEach((actor) => {
      if (!actor.skill) {
        ready = false
      }
    })

    if (ready) {
      // test
      DataManager.Instance.actor1.skill.excute()
      DataManager.Instance.actor2.skill.excute()
      console.log(
        '当前能量',
        DataManager.Instance.actors.get(DataManager.Instance.player.id).power,
        DataManager.Instance.actor2.power,
      )
    }
  }

  //#region
  // 渲染其他玩家
  renderPlayers({ room } = { room: DataManager.Instance.roomInfo }) {
    if (DataManager.Instance.mode === 'network') {
      const players = room.players
      DataManager.Instance.otherPlayer = players.find((p) => p.id !== DataManager.Instance.player.id)
    } else if (DataManager.Instance.mode === 'single') {
      // 单人模式
      DataManager.Instance.otherPlayer = {
        id: Ai.Instance.id,
        nickname: '机器人',
      }
    }

    if (DataManager.Instance.otherPlayer) {
      this.setPlayerName(this.bg.getChildByName('Name2').getComponent(Label), DataManager.Instance.otherPlayer)
      this.setHeart(DataManager.Instance.otherPlayer.id)
      this.bg.getChildByName('Label').active = false
      this.bg.getChildByName('Name2').active = true
      this.hearts2.active = true
    } else {
      // 处理玩家离开
      this.bg.getChildByName('Label').active = true
      this.bg.getChildByName('Name2').active = false
      this.hearts2.active = false
      // 如果在战斗中，就要切换为ai操作
    }
  }
  setPlayerName(label: Label, player: IPlayer) {
    if (player?.godname && player?.godname !== '') {
      label.string = player?.godname
      // 神名是金色
      label.color = new Color('#FFD700')
    } else {
      label.string = player?.nickname
    }
  }

  setHeart(id: number = DataManager.Instance.player.id) {
    let hearts = null
    if (isPlayer(id)) {
      hearts = this.hearts1
    } else {
      hearts = this.hearts2
    }

    let count = DataManager.Instance.actors?.get(id)?.hp || DataManager.Instance.roomInfo?.life

    const prefab = DataManager.Instance.prefabMap.get('Heart')

    if (count > DataManager.Instance.roomInfo?.life) count = DataManager.Instance.roomInfo.life
    if (count < 0) count = 0
    hearts.removeAllChildren()
    for (let i = 0; i < count; i++) {
      const heart = instantiate(prefab)
      heart.setParent(hearts)
    }

    // 受伤闪烁
    if (DataManager.Instance.actors?.get(id)?.hp < DataManager.Instance.actors?.get(id)?.lastHp) {
      const opacity = hearts.getComponent(UIOpacity) || hearts.addComponent(UIOpacity)
      tween(opacity)
        .sequence(tween().to(0.1, { opacity: 0 }), tween().to(0.1, { opacity: 255 }))
        .start()
    }
    if (DataManager.Instance.actors?.get(id)?.lastHp) DataManager.Instance.actors.get(id).lastHp = count
  }

  renderSkills(actor: IActor) {
    this.skillContainer.getComponent(SkillUiMgr).init(JSON.parse(JSON.stringify(actor)))
  }
  // #endregion

  update(deltaTime: number) {}
}
