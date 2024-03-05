System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, instantiate, ParticleSystem2D, Prefab, mapH, mapW, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, blinkInterval, HomeMgr;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfmapH(extras) {
    _reporterNs.report("mapH", "../global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmapW(extras) {
    _reporterNs.report("mapW", "../global/DataManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
      ParticleSystem2D = _cc.ParticleSystem2D;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      mapH = _unresolved_2.mapH;
      mapW = _unresolved_2.mapW;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "332c813+dtILo26MFIhw80h", "HomeMgr", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'GradientRange', 'instantiate', 'Node', 'ParticleSystem', 'ParticleSystem2D', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);
      blinkInterval = 0.5; // 闪烁间隔时间（秒）

      _export("HomeMgr", HomeMgr = (_dec = ccclass('HomeMgr'), _dec2 = property(Prefab), _dec(_class = (_class2 = class HomeMgr extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bg_light", _descriptor, this);

          this.particleInstances = [];
        }

        onLoad() {
          this.particleInstances = []; // 存储生成的粒子对象引用

          var spacing = (_crd && mapW === void 0 ? (_reportPossibleCrUseOfmapW({
            error: Error()
          }), mapW) : mapW) / (10 + 1); // 计算粒子间的间距

          for (var i = 0; i < 10; i++) {
            // 假设生成10个粒子对象
            var particle = instantiate(this.bg_light); // 创建新的粒子实例
            // 设置粒子颜色为金色，稍微透明

            particle.getComponent(ParticleSystem2D).startColor = new Color(255, 215, 0, 0.5); // 金色，半透明

            particle.getComponent(ParticleSystem2D).endColor = new Color(255, 215, 0, 0); // 金色，完全透明

            this.node.addChild(particle); // 将新粒子添加到当前节点的子节点中

            this.particleInstances.push(particle); // 保存粒子实例的引用
            // 设置粒子对象的位置

            var posX = spacing * (i + 1) - (_crd && mapW === void 0 ? (_reportPossibleCrUseOfmapW({
              error: Error()
            }), mapW) : mapW) / 2; // 计算每个粒子的X坐标位置

            var posY = -(_crd && mapH === void 0 ? (_reportPossibleCrUseOfmapH({
              error: Error()
            }), mapH) : mapH) / 2; // 假设屏幕底部的Y坐标位置

            particle.setPosition(posX, posY);
          }
        }

        start() {
          this.schedule(this.blinkParticles, blinkInterval);
        }

        blinkParticles() {
          this.particleInstances.forEach(particle => {
            particle.active = !particle.active; // 切换粒子的可见性
          });
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bg_light", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=82ed1d30da647f9c0b53b3bf27758537cd00189e.js.map