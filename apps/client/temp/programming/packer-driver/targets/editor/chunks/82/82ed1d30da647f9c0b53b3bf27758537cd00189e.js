System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ParticleMgr, LightParticle, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, blinkInterval, HomeMgr;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfParticleMgr(extras) {
    _reporterNs.report("ParticleMgr", "../particle/ParticleMgr", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLightParticle(extras) {
    _reporterNs.report("LightParticle", "../particle/LightParticle", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      ParticleMgr = _unresolved_2.default;
    }, function (_unresolved_3) {
      LightParticle = _unresolved_3.LightParticle;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dde21zvwz9AcZv0p6AdySwj", "HomeMgr", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'EventTouch', 'GradientRange', 'Graphics', 'instantiate', 'Node', 'ParticleSystem2D', 'Prefab', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);
      blinkInterval = 1; // 闪烁间隔时间（秒）

      _export("HomeMgr", HomeMgr = (_dec = ccclass('HomeMgr'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class HomeMgr extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "canvas", _descriptor, this);

          _initializerDefineProperty(this, "bg", _descriptor2, this);

          this.particleMgr = void 0;
        }

        onLoad() {
          this.particleMgr = this.canvas.addComponent(_crd && ParticleMgr === void 0 ? (_reportPossibleCrUseOfParticleMgr({
            error: Error()
          }), ParticleMgr) : ParticleMgr);
          this.particleMgr.init(_crd && LightParticle === void 0 ? (_reportPossibleCrUseOfLightParticle({
            error: Error()
          }), LightParticle) : LightParticle, {
            gap: 0.5 // max: 1,

          });
          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        onDestroy() {
          this.particleMgr.clear();
          this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        onTouchStart(event) {
          // 辉光聚拢效果
          const touch = event.touch;
          this.particleMgr.gather(touch.getLocation());
        }

        onTouchMove(event) {
          // 辉光聚拢效果
          const touch = event.touch;
          this.particleMgr.adsorb(touch.getLocation());
        }

        onTouchEnd() {
          this.particleMgr.offGather();
        }

        start() {}

        update(deltaTime) {
          this.particleMgr.update(deltaTime);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "canvas", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=82ed1d30da647f9c0b53b3bf27758537cd00189e.js.map