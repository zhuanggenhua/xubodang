import {
  _decorator,
  Color,
  Component,
  Input,
  instantiate,
  Label,
  Node,
} from 'cc'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { EventEnum } from '../enum'
import { ApiFunc, IActor, IPlayer, ISkill } from '../common'
import NetworkManager from '../global/NetworkManager'
import actors from '../config/actor'
import { SkillUiMgr } from '../ui/SkillUiMgr'
import { destroyPromt, isPlayer } from '../utils'
import { ActorManager } from '../entity/actor/ActorManager'
import Ai from '../ai/Ai'
import Skill from '../utils/Skill'
import { BattleCanvas } from '../ui/BattleCanvas'
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

  async onLoad() {
    await DataManager.Instance.loadRes() //temp

    DataManager.Instance.battle = this.Battle.getComponent(BattleCanvas)

    NetworkManager.Instance.listenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
    // NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);
    EventManager.Instance.on(EventEnum.useSkill, this.useSkill, this)

    this.bg = DataManager.Instance.stage.getChildByName('Bg')
    this.setPlayerName(this.bg.getChildByName('Name1').getComponent(Label), DataManager.Instance.player)
    this.hearts1 = this.bg.getChildByName('Hearts1')
    this.setHeart(this.hearts1)
    this.hearts2 = this.bg.getChildByName('Hearts2')
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
  }
  beforeDestroy() {
    EventManager.Instance.off(EventEnum.useSkill, this.useSkill, this)
    NetworkManager.Instance.unlistenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
  }
  start() {
    // test
    this.createActor('soldier')
    if (DataManager.Instance.mode === 'single') {
      Ai.Instance.setActor('soldier')
      this.createActor('soldier', Ai.Instance.id)
    }
  }

  createActor(type, id: number = DataManager.Instance.player.id) {
    let prefab = null
    if (isPlayer(id)) {
      prefab = DataManager.Instance.prefabMap.get('Actor1')
    } else {
      prefab = DataManager.Instance.prefabMap.get('Actor2')
    }
    const actor = instantiate(prefab)
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
      DataManager.Instance.actor1.skill.powerHandler()
      DataManager.Instance.actor2.skill.powerHandler()
      console.log(
        DataManager.Instance.actors.get(DataManager.Instance.player.id).power,
        DataManager.Instance.actor2.power,
      )

      EventManager.Instance.emit(EventEnum.handlerNextTurn)
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
      this.setHeart(this.hearts2)
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

  setHeart(hearts: Node, count: number = DataManager.Instance.roomInfo?.life) {
    const prefab = DataManager.Instance.prefabMap.get('Heart')

    if (count > DataManager.Instance.roomInfo?.life) count = DataManager.Instance.roomInfo.life
    if (count < 0) count = 0
    hearts.removeAllChildren()
    for (let i = 0; i < count; i++) {
      const heart = instantiate(prefab)
      heart.setParent(hearts)
    }
  }

  renderSkills(actor: IActor) {
    this.skillContainer.getComponent(SkillUiMgr).init(JSON.parse(JSON.stringify(actor)))
  }
  // #endregion

  update(deltaTime: number) {}
}

