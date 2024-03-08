import { UITransform, Node, Layers } from 'cc'

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
