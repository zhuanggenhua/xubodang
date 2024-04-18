import { _decorator, Color, Component, Input, instantiate, Label, Node, Sprite, tween, UIOpacity, Vec3 } from 'cc'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { BuffEnum, EventEnum } from '../enum'
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
import { ChooseMgr } from '../ui/ChooseMgr'
import { RadarChart } from '../ui/RadarChart'
const { ccclass, property } = _decorator

@ccclass('BattleMgr')
export class BattleMgr extends Component {
  @property(Node)
  skillContainer: Node = null
  @property(Node)
  Battle: Node = null

  bg: Node
  choose: Node
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
    EventManager.Instance.on(EventEnum.renderSkills, this.renderSkills, this)
    EventManager.Instance.on(EventEnum.createActor, this.createActor, this)
  }
  beforeDestroy() {
    EventManager.Instance.off(EventEnum.useSkill, this.useSkill, this)
    EventManager.Instance.off(EventEnum.updateHp, this.setHeart, this)
    EventManager.Instance.off(EventEnum.renderSkills, this.renderSkills, this)
    EventManager.Instance.off(EventEnum.createActor, this.createActor, this)

    NetworkManager.Instance.unlistenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
  }
  async start() {
    // temp
    actors.me = {
      actorName: '崇高假身',
      skills: [],
    }
    await DataManager.Instance.loadRes() //temp
    this.bg = DataManager.Instance.stage.getChildByName('Bg')
    this.choose = this.bg.getChildByName('ChooseActor')
    this.choose.getChildByName('Graphics1').addComponent(RadarChart)
    this.choose.getChildByName('Graphics2').addComponent(RadarChart)
    this.choose.addComponent(ChooseMgr)

    this.setPlayerName(this.bg.getChildByName('Name1').getComponent(Label), DataManager.Instance.player)

    this.hearts1 = this.bg.getChildByName('Hearts1')
    this.hearts2 = this.bg.getChildByName('Hearts2')
    this.setHeart()
    this.renderPlayers()

    // 点击任何地方都会隐藏提示框
    this.node.on(
      Input.EventType.TOUCH_START,
      () => {
        destroyPromt()
      },
      this,
    )
    // test
    // 渲染当前选中角色技能，默认是战士
    // this.renderSkills(actors.soldier)
    this.renderSkills(actors.animeMan)
    this.createActor()
    if (DataManager.Instance.mode === 'single') {
      Ai.Instance.setActor('animeMan')
      // Ai.Instance.setActor('soldier')
      this.createActor(Ai.Instance.id)
    }
  }

  createActor(id: number = DataManager.Instance.player.id) {
    let prefab = DataManager.Instance.prefabMap.get('Actor1')
    const actor = instantiate(prefab)
    if (!isPlayer(id)) {
      // 左右翻转
      actor.setScale(new Vec3(-1, 1, 1))
    }
    actor.setParent(this.Battle)
    const actorMgr = actor.addComponent(ActorManager)

    actorMgr.init(id, EntityTypeEnum.Actor, DataManager.Instance.roomInfo?.life)
    DataManager.Instance.actors.set(id, actorMgr)
    if (DataManager.Instance.actors.size === 2) {
      this.startGame()
    }
  }
  startGame() {
    tween(this.choose.getComponent(UIOpacity))
      .to(0.5, { opacity: 0 })
      .call(() => {
        this.choose.active = false
      })
      .start()
    tween(this.Battle.parent.getComponent(UIOpacity)).to(0.5, { opacity: 255 }).start()

    this.skillContainer.getComponent(SkillUiMgr).startGame()
  }

  useSkill(skill: ISkill, power: number, id: number = DataManager.Instance.player.id) {
    DataManager.Instance.actors.get(id).skill = new Skill(skill, id)
    if (DataManager.Instance.actors.get(id).buffs.has(BuffEnum.saiya) && skill.name.includes('波')) {
      power--
    }
    DataManager.Instance.actors.get(id).power -= power
    console.log('释放后能量', power)

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

    let count = 0
    if (DataManager.Instance.actors?.get(id)) {
      count = DataManager.Instance.actors?.get(id)?.hp
    } else {
      count = DataManager.Instance.roomInfo?.life
    }

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
