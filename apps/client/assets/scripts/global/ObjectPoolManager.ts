import { director, instantiate, Node } from 'cc';
import DataManager from './DataManager';
import { EntityTypeEnum } from '../common';
import { Singleton } from '../common/base';

export default class ObjectPoolManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ObjectPoolManager>();
  }

  private objectPool: Node = null;
  private map: Map<EntityTypeEnum, Node[]> = new Map();

  private getContainerName(objectName: EntityTypeEnum) {
    return objectName + 'Pool';
  }

  reset() {
    this.objectPool = null;
    this.map.clear();
  }

  get(objectName: EntityTypeEnum) {
    // 对象池节点初始化
    if (this.objectPool === null) {
      this.objectPool = new Node('ObjectPool');
      this.objectPool.setParent(DataManager.Instance.stage || director.getScene());
    }

    // 实体对象列表初始化
    if (!this.map.has(objectName)) {
      this.map.set(objectName, []);
      const container = new Node(this.getContainerName(objectName));
      container.setParent(this.objectPool);
    }

    let node: Node;
    const nodes = this.map.get(objectName);

    if (!nodes.length) {
      // 具体实体初始化
      const prefab = DataManager.Instance.prefabMap.get(objectName);
      node = instantiate(prefab);
      node.name = objectName;
      node.setParent(this.objectPool.getChildByName(this.getContainerName(objectName)));
    } else {
      // 对象池有直接拿来用
      node = nodes.pop();
    }
    node.active = true;
    return node;
  }

  //   归还对象
  ret(object: Node) {
    object.active = false;
    const objectName = object.name as EntityTypeEnum;
    this.map.get(objectName).push(object);
  }
}
