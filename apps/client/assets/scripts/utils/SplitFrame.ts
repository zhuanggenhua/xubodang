import {
  _decorator,
  Component,
  Sprite,
  UITransform,
  v2,
  Node,
  Rect,
  tween,
  Vec3,
  SpriteFrame,
  Texture2D,
  instantiate,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('SplitFrame')
export default class SplitFrame extends Component {
  init() {
    this.splitImage()
  }

  splitImage() {
    const tran = this.node.getComponent(UITransform)
    const sprite: Sprite = this.node.getComponent(Sprite)!
    const originalSpriteFrame: SpriteFrame = sprite.spriteFrame!
  
    // 获取原始SpriteFrame的尺寸
    const originalWidth = originalSpriteFrame.rect.width
    const originalHeight = originalSpriteFrame.rect.height
    const originalX = originalSpriteFrame.rect.x
    const originalY = originalSpriteFrame.rect.y
  
    // 克隆原始SpriteFrame并调整其rect属性以显示左半部分
    const leftSpriteFrame = originalSpriteFrame.clone()
    leftSpriteFrame.rect = new Rect(originalX, originalY, originalWidth / 2, originalHeight)
  
    // 克隆原始SpriteFrame并调整其rect属性以显示右半部分
    const rightSpriteFrame = originalSpriteFrame.clone()
    rightSpriteFrame.rect = new Rect(originalX + originalWidth / 2, originalY, originalWidth / 2, originalHeight)
  
    // 创建左半部分的节点并设置SpriteFrame
    const leftNode = new Node()
    const leftTran = leftNode.addComponent(UITransform)
    leftTran.setContentSize(tran.width / 2, tran.height)
    const leftSprite = leftNode.addComponent(Sprite)
    leftSprite.color = sprite.color
    leftSprite.sizeMode = Sprite.SizeMode.CUSTOM
    leftSprite.spriteFrame = leftSpriteFrame
    this.node.parent!.addChild(leftNode)
    leftNode.setPosition(this.node.position.x - leftTran.width / 2, this.node.position.y)
  
    // 创建右半部分的节点并设置SpriteFrame
    const rightNode = new Node()
    const rightTran = rightNode.addComponent(UITransform)
    rightTran.setContentSize(tran.width / 2, tran.height)
    const rightSprite = rightNode.addComponent(Sprite)
    rightSprite.color = sprite.color
    rightSprite.sizeMode = Sprite.SizeMode.CUSTOM
    rightSprite.spriteFrame = rightSpriteFrame
    this.node.parent!.addChild(rightNode)
    rightNode.setPosition(this.node.position.x + rightTran.width / 2, this.node.position.y)
  
    // 可以选择隐藏原始节点
    this.node.destroy()
  
    // 左右移动
    tween(leftNode)
      .to(0.1, { position: new Vec3(leftNode.position.x - leftTran.width / 5, leftNode.position.y) }, { easing: 'cubicIn' })
      .call(() => {
        leftNode.destroy()
      })
      .start()
    tween(rightNode)
      .to(
        0.1,
        { position: new Vec3(rightNode.position.x + rightTran.width / 5, rightNode.position.y) },
        { easing: 'cubicIn' },
      )
      .call(() => {
        rightNode.destroy()
      })
      .start()
  }
}
