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

    // 克隆原始SpriteFrame并调整其rect属性以显示上半部分
    const topSpriteFrame = originalSpriteFrame.clone()
    topSpriteFrame.rect = new Rect(originalX, originalY + originalHeight / 2, originalWidth, originalHeight / 2)

    // 克隆原始SpriteFrame并调整其rect属性以显示下半部分
    const bottomSpriteFrame = originalSpriteFrame.clone()
    bottomSpriteFrame.rect = new Rect(originalX, originalY, originalWidth, originalHeight / 2)

    // 这里才是下半部分
    // 创建上半部分的节点并设置SpriteFrame
    const topNode = new Node()
    const topTran = topNode.addComponent(UITransform)
    topTran.setContentSize(tran.width, tran.height / 2)
    const topSprite = topNode.addComponent(Sprite)
    topSprite.color = sprite.color
    topSprite.sizeMode = Sprite.SizeMode.CUSTOM
    topSprite.spriteFrame = topSpriteFrame
    this.node.parent!.addChild(topNode)
    topNode.setPosition(this.node.position.x, this.node.position.y - topTran.height / 2)

    // 创建下半部分的节点并设置SpriteFrame
    const bottomNode = new Node()
    const bottomTran = bottomNode.addComponent(UITransform)
    bottomTran.setContentSize(tran.width, tran.height / 2)
    const bottomSprite = bottomNode.addComponent(Sprite)
    bottomSprite.color = sprite.color
    bottomSprite.sizeMode = Sprite.SizeMode.CUSTOM
    bottomSprite.spriteFrame = bottomSpriteFrame
    this.node.parent!.addChild(bottomNode)
    bottomNode.setPosition(this.node.position.x, this.node.position.y + bottomTran.height / 2)

    // 可以选择隐藏原始节点
    this.node.destroy()

    // 上下移动
    tween(topNode)
      .to(0.5, { position: new Vec3(topNode.position.x, topNode.position.y - topTran.height / 4) }, { easing: 'cubicIn' })
      .call(() => {
        topNode.destroy()
      })
      .start()
    tween(bottomNode)
      .to(
        0.5,
        { position: new Vec3(bottomNode.position.x, bottomNode.position.y + topTran.height / 4) },
        { easing: 'cubicIn' },
      )
      .call(() => {
        bottomNode.destroy()
      })
      .start()
  }
}
