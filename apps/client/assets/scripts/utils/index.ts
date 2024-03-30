import { UITransform, Node, Layers, instantiate, Label, Vec3, SpriteFrame } from 'cc'
import DataManager from '../global/DataManager'
import { TipEnum } from '../enum'
import { ISkill } from '../common'

export * from './biz'

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const createUINode = (name: string = 'node') => {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  // 设置层级
  node.layer = Layers.Enum.UI_2D
  // 设置锚点到左上角 --根据设计图来的
  //   transform.setAnchorPoint(0, 1)

  return node
}

// 生成错误弹窗
export const createErrorTip = (msg: string) => {
  if (!DataManager.Instance.stage.getChildByName('ErrTip')) {
    const prefab = DataManager.Instance.prefabMap.get('ErrTip')

    const node = instantiate(prefab)
    node.getChildByName('Tip').getChildByName('Label').getComponent(Label).string = msg
    node.setParent(DataManager.Instance.stage)
  } else {
    DataManager.Instance.stage
      .getChildByName('ErrTip')
      .getChildByName('Tip')
      .getChildByName('Label')
      .getComponent(Label).string = msg

    DataManager.Instance.stage.getChildByName('ErrTip').active = true
  }
}
export const destroyTip = (type: TipEnum = TipEnum.ErrTip) => {
  if (DataManager.Instance.stage.getChildByName(type)) DataManager.Instance.stage.getChildByName(type).active = false
}

export const rangMap = {
  0: '地面',
  1: '天空',
  2: '地下',
}

// 生成提示
export const createPrompt = (skillNode: Node, skill: ISkill) => {
  let node = DataManager.Instance.stage.getChildByName('Prompt')
  if (!node) {
    const prefab = DataManager.Instance.prefabMap.get('Prompt')
    node = instantiate(prefab)
    node.setParent(DataManager.Instance.stage)
  }

  node.getChildByName('Name').getComponent(Label).string = skill.name
  node.getChildByName('Desc').getComponent(Label).string = skill.desc
  const skillDesc = node.getChildByName('SkillDesc')
  skillDesc.getChildByName('Attack').getChildByName('Label').getComponent(Label).string =
    skill.damage?.toString() || '0'
  skillDesc.getChildByName('Sheild').getChildByName('Label').getComponent(Label).string =
    skill.defense?.toString() || '0'

  let range = '无'
  if (skill.range?.length === 1) range = rangMap[skill.range[0]]
  if (skill.range?.length === 2) range = `${rangMap[skill.range[0]]}-${rangMap[skill.range[1]]}`
  if (skill.range?.length === 3) range = '全范围'
  if (skill.type.indexOf(4) !== -1) range = '自身' //持续效果默认自身
  if (skill.target === 1) range = '自身'

  skillDesc.getChildByName('Range').getChildByName('Label').getComponent(Label).string = range

  skillDesc.getChildByName('Speed').getChildByName('Label').getComponent(Label).string = skill.speed === 0 ? '慢' : '快'

  let effect = '效果：无'
  if (skill.pierce) effect += '、穿透'
  if (skill.type.indexOf(4) !== -1) effect += '、持续'
  if (effect.length > 4) effect = effect.replace('无、', '')
  node.getChildByName('Effect').getComponent(Label).string = effect

  // 位置
  const transform = skillNode.getComponent(UITransform)
  const worldPos = new Vec3(0, 0, 0)
  skillNode.getWorldPosition(worldPos)

  // 获取按钮节点转场景相对坐标
  const scenePos = DataManager.Instance.stage.getComponent(UITransform).convertToNodeSpaceAR(worldPos)
  node.setPosition(scenePos.x, scenePos.y + transform.height / 2)

  node.active = true
}
export const destroyPromt = () => {
  if (DataManager.Instance.stage.getChildByName('Prompt'))
    DataManager.Instance.stage.getChildByName('Prompt').active = false
}

const INDEX_REG = /\((\d+)\)/
const getNumberWithinString = (str: string) => parseInt(str.match(INDEX_REG)?.[1] || '0')
export const sortSpriteFrame = (spriteFrame: Array<SpriteFrame>) =>
  spriteFrame.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))

export function isPlayer(id) {
  return DataManager.Instance.player.id === id
}
