import {
  _decorator,
  Color,
  Component,
  director,
  Input,
  instantiate,
  Label,
  Node,
  Prefab,
  screen,
  UITransform,
} from 'cc'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { EventEnum, PrefabPathEnum, SkillPathEnum } from '../enum'
import { ApiFunc, IActor, IPlayer } from '../common'
import NetworkManager from '../global/NetworkManager'
import actors from '../config/actor'
import { SkillUiMgr } from '../ui/SkillUiMgr'
const { ccclass, property } = _decorator

@ccclass('BattleMgr')
export class BattleMgr extends Component {
  @property(Node)
  skillContainer: Node = null
  @property(Node)
  prompt: Node = null

  bg: Node
  hearts1: Node
  hearts2: Node
  otherPlayer: IPlayer = null

  async onLoad() {
    await DataManager.Instance.loadRes() //temp

    NetworkManager.Instance.listenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
    // NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);

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
        const prompt = DataManager.Instance.stage.getChildByName('Prompt')
        if (prompt) prompt.active = false
      },
      this,
    )
    this.node.getChildByName('ScrollView').on(
      Input.EventType.TOUCH_START,
      () => {
        const prompt = DataManager.Instance.stage.getChildByName('Prompt')
        if (prompt) prompt.active = false
      },
      this,
    )
  }
  start() {}

  // 渲染其他玩家
  renderPlayers({ room } = { room: DataManager.Instance.roomInfo }) {    
    if (DataManager.Instance.mode === 'network') {
      const players = room.players
      this.otherPlayer = players.find((p) => p.id !== DataManager.Instance.player.id)
    } else if (DataManager.Instance.mode === 'single') {
      // 单人模式
      this.otherPlayer = {
        nickname: '机器人',
      }
    }

    if (this.otherPlayer) {
      this.setPlayerName(this.bg.getChildByName('Name2').getComponent(Label), this.otherPlayer)
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

  renderSkills = (actor: IActor) => {
    this.skillContainer.getComponent(SkillUiMgr).init(actor)
  }

  update(deltaTime: number) {}
}
