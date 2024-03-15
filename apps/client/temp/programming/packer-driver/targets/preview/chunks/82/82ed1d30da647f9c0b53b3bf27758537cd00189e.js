System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, SpriteFrame, DataManager, ParticleMgr, LightParticle, FaderManager, PrefabPathEnum, TexturePathEnum, ResourceManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, HomeMgr;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfParticleMgr(extras) {
    _reporterNs.report("ParticleMgr", "../particle/ParticleMgr", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLightParticle(extras) {
    _reporterNs.report("LightParticle", "../particle/LightParticle", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFaderManager(extras) {
    _reporterNs.report("FaderManager", "../global/FaderManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabPathEnum(extras) {
    _reporterNs.report("PrefabPathEnum", "../enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTexturePathEnum(extras) {
    _reporterNs.report("TexturePathEnum", "../enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "../global/ResourceManager", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.default;
    }, function (_unresolved_3) {
      ParticleMgr = _unresolved_3.default;
    }, function (_unresolved_4) {
      LightParticle = _unresolved_4.LightParticle;
    }, function (_unresolved_5) {
      FaderManager = _unresolved_5.default;
    }, function (_unresolved_6) {
      PrefabPathEnum = _unresolved_6.PrefabPathEnum;
      TexturePathEnum = _unresolved_6.TexturePathEnum;
    }, function (_unresolved_7) {
      ResourceManager = _unresolved_7.ResourceManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dde21zvwz9AcZv0p6AdySwj", "HomeMgr", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'EventTouch', 'GradientRange', 'Graphics', 'instantiate', 'Node', 'ParticleSystem2D', 'Prefab', 'SpriteFrame', 'sys', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HomeMgr", HomeMgr = (_dec = ccclass('HomeMgr'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class HomeMgr extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "canvas", _descriptor, this);

          _initializerDefineProperty(this, "bg", _descriptor2, this);

          this.particleMgr = void 0;
        }

        onLoad() {
          this.loadRes();
          (_crd && FaderManager === void 0 ? (_reportPossibleCrUseOfFaderManager({
            error: Error()
          }), FaderManager) : FaderManager).Instance.fadeOut(1000);
          this.particleMgr = this.canvas.addComponent(_crd && ParticleMgr === void 0 ? (_reportPossibleCrUseOfParticleMgr({
            error: Error()
          }), ParticleMgr) : ParticleMgr);
          this.particleMgr.init(_crd && LightParticle === void 0 ? (_reportPossibleCrUseOfLightParticle({
            error: Error()
          }), LightParticle) : LightParticle, {
            gap: 0.5 // max: 1,

          }); // this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)

          this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        } // 加载资源


        loadRes() {
          return _asyncToGenerator(function* () {
            var list = [];

            var _loop = function* _loop(type) {
              var p = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
                error: Error()
              }), ResourceManager) : ResourceManager).Instance.loadRes((_crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
                error: Error()
              }), PrefabPathEnum) : PrefabPathEnum)[type], Prefab).then(prefab => {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.prefabMap.set(type, prefab);
              });
              list.push(p);
            };

            for (var type in _crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
              error: Error()
            }), PrefabPathEnum) : PrefabPathEnum) {
              yield* _loop(type);
            }

            var _loop2 = function* _loop2(_type) {
              var p = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
                error: Error()
              }), ResourceManager) : ResourceManager).Instance.loadDir((_crd && TexturePathEnum === void 0 ? (_reportPossibleCrUseOfTexturePathEnum({
                error: Error()
              }), TexturePathEnum) : TexturePathEnum)[_type], SpriteFrame).then(spriteFrames => {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.textureMap.set(_type, spriteFrames);
              });
              list.push(p);
            };

            for (var _type in _crd && TexturePathEnum === void 0 ? (_reportPossibleCrUseOfTexturePathEnum({
              error: Error()
            }), TexturePathEnum) : TexturePathEnum) {
              yield* _loop2(_type);
            }

            yield Promise.all(list);
          })();
        }

        onDestroy() {
          this.particleMgr.clear(); // this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)

          this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        onTouchMove(event) {
          // 辉光聚拢效果
          var touch = event.touch;
          this.particleMgr.gather(touch.getLocation());
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
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec3], {
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