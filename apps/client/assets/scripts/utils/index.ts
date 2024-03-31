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
export const sortSpriteFrame = (spriteFrame: Array<SpriteFrame>) => {
  return spriteFrame.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
}

export function isPlayer(id) {
  return DataManager.Instance.player.id === id
}

// 碰撞检测
export const checkCollision = (enemyNode, playerNode, type = 'rect') => {
  const enemyTran = enemyNode.getComponent(UITransform)
  const playerTran = playerNode.getComponent(UITransform)

  // 缩小碰撞盒
  const tempTran = {
    width: enemyTran.width / 1.4,
    height: enemyTran.height / 1.4,
  }
  const enemy = {
    x: enemyNode.position.x - tempTran.width / 2,
    y: enemyNode.position.y - tempTran.height / 2,
    width: tempTran.width,
    height: tempTran.height,
  }

  const player = {
    x: playerNode.position.x - tempTran.width / 2,
    y: playerNode.position.y - tempTran.height / 2,
    width: tempTran.width,
    height: tempTran.height,
  }

  // 画碰撞盒
  const context = DataManager.Instance.battleCanvas.graphics
  context.clear()
  context.rect(player.x, player.y, player.width, player.height)
  context.rect(enemy.x, enemy.y, enemy.width, enemy.height)
  context.stroke()
  

  if (type === 'rect') {
    // 矩形碰撞检测
    if (
      enemy.x < player.x + player.width &&
      enemy.x + enemy.width > player.x &&
      enemy.y < player.y + player.height &&
      enemy.y + enemy.height > player.y
    ) {
      return true
    } else {
      return false
    }
  } else if (type === 'circle') {
    // 圆形碰撞检测
    const dx = enemy.x + enemy.width / 2 - (player.x + player.width / 2)
    const dy = enemy.y + enemy.height / 2 - (player.y + player.height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy) // 计算距离
    if (distance < enemy.width / 3 + player.width / 3) {
      return true
    } else {
      return false
    }
  } else if (type === 'separation') {
    // 分离轴碰撞检测
    // 获取多边形的所有边的法线
    function getNormals(polygon) {
      let normals = []
      for (let i = 0; i < polygon.length; i++) {
        let p1 = polygon[i]
        let p2 = polygon[i + 1 == polygon.length ? 0 : i + 1]
        let edge = { x: p2.x - p1.x, y: p2.y - p1.y }
        let normal = { x: -edge.y, y: edge.x }
        normals.push(normal)
      }
      return normals
    }

    // 计算多边形在轴上的投影
    function project(polygon, axis) {
      let min = Infinity
      let max = -Infinity
      for (let i = 0; i < polygon.length; i++) {
        let dot = polygon[i].x * axis.x + polygon[i].y * axis.y
        if (dot < min) min = dot
        if (dot > max) max = dot
      }
      return { min, max }
    }

    // 检测两个多边形的投影是否有重叠
    function overlap(proj1, proj2) {
      return !(proj1.max < proj2.min || proj2.max < proj1.min)
    }

    // 碰撞检测
    function checkCollision(polygonA, polygonB) {
      let axes = getNormals(polygonA).concat(getNormals(polygonB))
      for (let i = 0; i < axes.length; i++) {
        let axis = axes[i]
        let proj1 = project(polygonA, axis)
        let proj2 = project(polygonB, axis)
        if (!overlap(proj1, proj2)) {
          return false
        }
      }
      return true // 所有轴都有重叠
    }

    let pillar = player
    // 计算旋转后的四个顶点坐标
    function rotatePoint(cx, cy, angle, px, py) {
      let s = Math.sin(angle)
      let c = Math.cos(angle)
      // translate point back to origin:
      px -= cx
      py -= cy
      // rotate point
      let xnew = px * c - py * s
      let ynew = px * s + py * c
      // translate point back:
      px = xnew + cx
      py = ynew + cy
      return { x: px, y: py }
    }
    function calculateRotatedPoints(x, y, x2, y2, lineH, deg) {
      let angle = (deg * Math.PI) / 180
      let w = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y))

      // 旋转前的四个顶点
      let p1 = { x, y: y - lineH / 2 }
      let p2 = { x: x + w, y: p1.y }
      let p3 = { x: x + w, y: y + lineH / 2 }
      let p4 = { x, y: p3.y }

      // 旋转所有四个顶点
      let rp1 = rotatePoint(x, y, angle, p1.x, p1.y)
      let rp2 = rotatePoint(x, y, angle, p2.x, p2.y)
      let rp3 = rotatePoint(x, y, angle, p3.x, p3.y)
      let rp4 = rotatePoint(x, y, angle, p4.x, p4.y)

      return [rp1, rp2, rp3, rp4]
    }

    // let pillarVertices = calculateRotatedPoints(pillar.x, pillar.y, pillar.x2, pillar.y2, pillar.lineH, pillar.deg)

    // let enemyVertices = [
    //   { x: enemy.x, y: enemy.y },
    //   { x: enemy.x, y: enemy.y + enemy.height },
    //   { x: enemy.x + enemy.width, y: enemy.y + enemy.height },
    //   { x: enemy.x + enemy.width, y: enemy.y },
    // ]
    // return checkCollision(pillarVertices, enemyVertices)
  }
}
