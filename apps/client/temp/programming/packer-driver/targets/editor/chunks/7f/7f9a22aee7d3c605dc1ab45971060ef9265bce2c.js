System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, ParticleSystem, Particle, _crd;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3e47cWZp/1GjYBvFIn2zd92", "Particle", undefined);

      ParticleSystem = class ParticleSystem {
        constructor(markedForDeletion = false, size = 0, x = 0, y = 0, speedX = 0, speedY = 0) {
          this.markedForDeletion = markedForDeletion;
          this.size = size;
          this.x = x;
          this.y = y;
          this.speedX = speedX;
          this.speedY = speedY;
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

      };
      Particle = class Particle {
        constructor(markedForDeletion = false, size = 0, x = 0, y = 0, speedX = 0, speedY = 0) {
          this.markedForDeletion = markedForDeletion;
          this.size = size;
          this.x = x;
          this.y = y;
          this.speedX = speedX;
          this.speedY = speedY;
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

      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7f9a22aee7d3c605dc1ab45971060ef9265bce2c.js.map