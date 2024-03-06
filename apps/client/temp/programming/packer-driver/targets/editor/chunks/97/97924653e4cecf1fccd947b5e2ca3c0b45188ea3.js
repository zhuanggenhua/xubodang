System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, tween, Particle, getRandomNumber, mapH, mapW, LightParticle, _crd;

  function _reportPossibleCrUseOfParticle(extras) {
    _reporterNs.report("Particle", "./Particle", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetRandomNumber(extras) {
    _reporterNs.report("getRandomNumber", "../utils/tool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmapH(extras) {
    _reporterNs.report("mapH", "../global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmapW(extras) {
    _reporterNs.report("mapW", "../global/DataManager", _context.meta, extras);
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
      tween = _cc.tween;
    }, function (_unresolved_2) {
      Particle = _unresolved_2.default;
    }, function (_unresolved_3) {
      getRandomNumber = _unresolved_3.getRandomNumber;
    }, function (_unresolved_4) {
      mapH = _unresolved_4.mapH;
      mapW = _unresolved_4.mapW;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5465aWhPQ5DBZeTMcSImGYV", "LightParticle", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Graphics', 'instantiate', 'Node', 'Prefab', 'SpriteFrame', 'tween', 'Tween', 'Vec3']);

      // 光辉背景
      _export("LightParticle", LightParticle = class LightParticle extends (_crd && Particle === void 0 ? (_reportPossibleCrUseOfParticle({
        error: Error()
      }), Particle) : Particle) {
        constructor() {
          super();
          this.color2 = void 0;
          this.alpha = void 0;
          this.flickerDuration = void 0;
          this.flickerTimer = void 0;
          this.flickerSpeed = void 0;
          this.flickerTween = void 0;
          this.flickerTween2 = void 0;
          this.angle = void 0;
          this.va = void 0;
          this.curve = void 0;
          this.borthX = void 0;
          this.size = (_crd && getRandomNumber === void 0 ? (_reportPossibleCrUseOfgetRandomNumber({
            error: Error()
          }), getRandomNumber) : getRandomNumber)(5, 7); // 粒子在宽度上散布

          this.borthX = (_crd && getRandomNumber === void 0 ? (_reportPossibleCrUseOfgetRandomNumber({
            error: Error()
          }), getRandomNumber) : getRandomNumber)(0, _crd && mapW === void 0 ? (_reportPossibleCrUseOfmapW({
            error: Error()
          }), mapW) : mapW);
          this.y = this.y;
          console.log('??', this.x);
          this.speedY = Math.random() * 20 + 40; //1-3  --这是向上的
          // 移动方式：基于sin

          this.angle = 0; // 速度

          this.va = Math.random() * 10 + 20; // 2 ~ 4
          // 上下浮动范围的随机值  0.2 -- 0.3  --> 0.1 ~ 0.45

          this.curve = Math.random() * 0.4; // this.color = new Color(255, 242, 0, 200) // 金色

          this.color = new Color(255, 250, 101, 200); // 中金色
          // 背景光环

          this.color2 = new Color(255, 247, 153, 100); // 淡金色
          // 创建一个循环的 tween 来改变 alpha 值，包含闪烁完成后的延时

          const delay = Math.random() * 0.5 + 1;
          this.flickerTween = tween(this.color).to(0.5, {
            a: 0
          }, {
            easing: 'sineInOut'
          }).to(0.5, {
            a: 200
          }, {
            easing: 'sineInOut'
          }).delay(delay) // 闪烁完成后，延时1秒
          // 确保to按顺序执行
          .union().repeatForever().start();
          this.flickerTween2 = tween(this.color2).to(0.5, {
            a: 0
          }, {
            easing: 'sineInOut'
          }).to(0.5, {
            a: 100
          }, {
            easing: 'sineInOut'
          }).delay(delay) // 闪烁完成后，延时1秒
          // 确保to按顺序执行
          .union().repeatForever().start();
        }

        update(dt) {
          super.update(dt);
        }

        move(dt) {
          // 粒子的移动
          this.y += this.speedY * dt;
          this.angle += this.va * dt; // 基于sin函数图像的移动方式

          const diffX = Math.sin(this.angle * Math.PI / 180) * (_crd && mapW === void 0 ? (_reportPossibleCrUseOfmapW({
            error: Error()
          }), mapW) : mapW) * this.curve * 0.5;
          this.x = this.borthX + diffX;
          console.log('???', diffX);
        }

        draw(graphics) {
          graphics.fillColor = this.color2;
          graphics.rect(this.x + 2, this.y + 2, this.size, this.size);
          graphics.fill();
          graphics.fillColor = this.color;
          graphics.rect(this.x, this.y, this.size, this.size);
          graphics.fill();
        }

        destroyed() {
          if (this.y > (_crd && mapH === void 0 ? (_reportPossibleCrUseOfmapH({
            error: Error()
          }), mapH) : mapH)) {
            this.markedForDeletion = true;
            this.flickerTween.stop(); // 在对象被销毁时，停止并清理 tween
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=97924653e4cecf1fccd947b5e2ca3c0b45188ea3.js.map