System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Particle, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3e47cWZp/1GjYBvFIn2zd92", "Particle", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'instantiate', 'Node', 'Prefab', 'SpriteFrame']);

      _export("default", Particle = class Particle {
        constructor(node) {
          this.markedForDeletion = false;
          this.size = 0;
          this.speedX = 0;
          this.speedY = 0;
          this.x = 0;
          this.y = 0;
          this.color = null;
          this.node = node;
          this.x = this.node.position.x;
          this.y = this.node.position.y;
        }

        update() {
          this.move();
          this.destroyed();
        }

        move() {
          // 粒子的移动
          this.x -= this.speedX;
          this.y -= this.speedY;
        }

        destroyed() {
          // 粒子不断变小
          this.size *= 0.95;
          if (this.size < 0.5) this.markedForDeletion = true; //基于大小的清除
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=78e44b9e98f08d0cc1b19cc8280da66dd43f9677.js.map