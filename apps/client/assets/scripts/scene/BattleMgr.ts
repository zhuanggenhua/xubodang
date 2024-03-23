import { _decorator, Color, Component, director, instantiate, Label, Node, Prefab, screen, UITransform } from 'cc'
import DataManager from '../global/DataManager'
import EventManager from '../global/EventManager'
import { EventEnum, PrefabPathEnum, SkillPathEnum } from '../enum'
import { ApiFunc, IActor, IPlayer } from '../common'
import NetworkManager from '../global/NetworkManager'
import { setPlayerName } from '../utils'
import { SkillItemManager } from '../ui/SkillItemManager'
import actors from '../config/actor'
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

  onLoad() {
    DataManager.Instance.stage = director.getScene().getChildByName('Canvas')
    NetworkManager.Instance.listenMsg(ApiFunc.MsgRoom, this.renderPlayers, this)
    // NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgGameStart, this.handleGameStart, this);

    // 渲染当前选中角色技能，默认是战士
    this.renderSkills(actors.soldier)
  }
  start() {
    this.bg = DataManager.Instance.stage.getChildByName('Bg')
    setPlayerName(this.bg.getChildByName('Name1').getComponent(Label), DataManager.Instance.player)
    this.hearts1 = this.bg.getChildByName('Hearts1')
    this.setHeart(this.hearts1)
    this.hearts2 = this.bg.getChildByName('Hearts2')
    this.renderPlayers()
  }

  renderPlayers({ room } = { room: DataManager.Instance.roomInfo }) {
    const players = room.players
    this.otherPlayer = players.find((p) => p.id !== DataManager.Instance.player.id)
    if (this.otherPlayer) {
      setPlayerName(this.bg.getChildByName('Name2').getComponent(Label), this.otherPlayer)
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

  setHeart(hearts: Node, count: number = DataManager.Instance.roomInfo?.life) {
    const prefab = DataManager.Instance.prefabMap.get('Heart')

    if (count > DataManager.Instance.roomInfo.life) count = DataManager.Instance.roomInfo.life
    if (count < 0) count = 0
    hearts.removeAllChildren()
    for (let i = 0; i < count; i++) {
      const heart = instantiate(prefab)
      heart.setParent(hearts)
    }
  }

  renderSkills = (actor: IActor) => {
    const skills = actor.skills
    Object.keys(skills).forEach((key) => {
      // 遍历每个能级
      const skillItemNode = this.skillContainer.children[key].getChildByName('Skills')
      skillItemNode.active = false
      
      if (!skillItemNode.getComponent(SkillItemManager)) skillItemNode.addComponent(SkillItemManager).init(skills[key])
      else skillItemNode.getComponent(SkillItemManager).init(skills[key])
      skillItemNode.active = true
    })
  }

  update(deltaTime: number) {}
}
