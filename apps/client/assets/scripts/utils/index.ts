import { UITransform, Node, Layers, instantiate, Label, Color } from 'cc'
import DataManager from '../global/DataManager'
import { PrefabPathEnum, TipEnum } from '../enum'
import { IPlayer } from '../common'

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
  }
}
export const destroyTip = (type: TipEnum = TipEnum.ErrTip) => {
  if (DataManager.Instance.stage.getChildByName(type)) DataManager.Instance.stage.getChildByName(type).destroy()
}

// 生成弹窗
export const createPopTip = (msg: string) => {}


