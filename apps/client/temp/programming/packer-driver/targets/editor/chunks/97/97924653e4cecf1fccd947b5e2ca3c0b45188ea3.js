System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, Particle, LightParticle, _crd;

  function _reportPossibleCrUseOfParticle(extras) {
    _reporterNs.report("Particle", "./Particle", _context.meta, extras);
  }

  _export("LightParticle", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      Particle = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "24d4be65btGz6lvKjgMbJ+N", "LightParticle", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'instantiate', 'Node', 'Prefab', 'SpriteFrame']);

      // 光辉背景
      _export("LightParticle", LightParticle = class LightParticle extends (_crd && Particle === void 0 ? (_reportPossibleCrUseOfParticle({
        error: Error()
      }), Particle) : Particle) {
        constructor(node) {
          super(node);
          this.size = Math.random() * 10 + 10; // 粒子在宽度上散布

          this.x = this.x - this.size * 0.5;
          this.y = this.y - this.size * 0.5;
          this.speedX = Math.random(); //0-2

          this.speedY = Math.random() * 2 + 1; //1-3  --这是向上的

          this.color = new Color();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=97924653e4cecf1fccd947b5e2ca3c0b45188ea3.js.map