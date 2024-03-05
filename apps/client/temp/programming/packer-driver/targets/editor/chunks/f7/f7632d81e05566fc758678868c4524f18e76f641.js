System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Graphics, UITransform, v2, v3, Star, _dec, _class, _crd, ccclass, property, skyCanvas;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Graphics = _cc.Graphics;
      UITransform = _cc.UITransform;
      v2 = _cc.v2;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "82abcdrLkdOjJxgMEXf0Dz1", "skyCanvas", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'Node', 'UITransform', 'v2', 'v3', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("skyCanvas", skyCanvas = (_dec = ccclass('skyCanvas'), _dec(_class = class skyCanvas extends Component {
        constructor(...args) {
          super(...args);
          this.graphics = null;
          this.stars = [];
          this.vp = v2(0, 0);
          this.fl = 0;
          this.starsNumber = 1500;
          this.speed = 0.0005;
          this.easing = 0.93;
          this.target = v2(0, 0);
        }

        onLoad() {
          this.graphics = this.getComponent(Graphics);
          const uiTransform = this.getComponent(UITransform);
          this.vp = v2(uiTransform.width / 2, uiTransform.height / 2);
          this.fl = uiTransform.width / 2;
          this.generateStars();
        }

        generateStars() {
          const uiTransform = this.getComponent(UITransform);

          for (let i = 0; i < this.starsNumber; i++) {
            let x = Math.random() * 2 * uiTransform.width - uiTransform.width;
            let y = Math.random() * 2 * uiTransform.height - uiTransform.height;
            let z = Math.random() * 1000 - 500;
            this.stars.push(new Star(x, y, z, this.vp, this.fl));
          }
        }

        update(dt) {
          this.graphics.clear();
          this.target.x *= this.easing;
          this.target.y *= this.easing;
          this.stars.forEach(star => {
            star.rotateX(this.target.x);
            star.rotateY(this.target.y);

            if (star.visible) {
              star.draw3D(this.graphics);
            }
          });
        }

      }) || _class));

      _export("default", Star = class Star {
        constructor(x, y, z, vp, fl) {
          this.pos = v3(0, 0, 0);
          this.scale = v2(1, 1);
          this.visible = false;
          this.vp = void 0;
          this.fl = void 0;
          this.pos = v3(x, y, z);
          this.vp = vp;
          this.fl = fl;
        }

        rotateX(angle) {
          let cos = Math.cos(angle);
          let sin = Math.sin(angle);
          let y = this.pos.y * cos - this.pos.z * sin;
          let z = this.pos.z * cos + this.pos.y * sin;
          this.pos.y = y;
          this.pos.z = z;
        }

        rotateY(angle) {
          let cos = Math.cos(angle);
          let sin = Math.sin(angle);
          let x = this.pos.x * cos - this.pos.z * sin;
          let z = this.pos.z * cos + this.pos.x * sin;
          this.pos.x = x;
          this.pos.z = z;
        }

        draw3D(graphics) {
          if (this.pos.z > -this.fl) {
            let scale = this.fl / (this.fl - this.pos.z);
            let x = this.vp.x + this.pos.x * scale;
            let y = this.vp.y + this.pos.y * scale;
            this.visible = true;
            graphics.fillRect(x, y, 2 * this.scale.x * scale, 2 * this.scale.y * scale);
          } else {
            this.visible = false;
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f7632d81e05566fc758678868c4524f18e76f641.js.map