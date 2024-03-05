System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, DataManager, _crd, PLAYER_SPEED, BULLET_SPEED, WEAPON_DAMAGE, PLAYER_RADIUS, BULLET_RADIUS, mapW, mapH;

  function _reportPossibleCrUseOfIClientInput(extras) {
    _reporterNs.report("IClientInput", "../Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIRoom(extras) {
    _reporterNs.report("IRoom", "../Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIState(extras) {
    _reporterNs.report("IState", "../Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfActorManager(extras) {
    _reporterNs.report("ActorManager", "../Entity/Actor/ActorManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBulletManager(extras) {
    _reporterNs.report("BulletManager", "../Entity/Bullet/BulletManager", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "33b5fEl/oFFu45InAIo7SjT", "DataManager", undefined);

      __checkObsolete__(['Prefab', 'SpriteFrame', 'Node']);

      PLAYER_SPEED = 100;
      BULLET_SPEED = 600;
      WEAPON_DAMAGE = 5;
      PLAYER_RADIUS = 50;
      BULLET_RADIUS = 10;
      mapW = 960;
      mapH = 640;

      _export("default", DataManager = class DataManager extends Singleton {
        constructor(...args) {
          super(...args);
          this.myPlayerId = 1;
          this.roomInfo = void 0;
          this.stage = void 0;
          this.actorMap = new Map();
          this.prefabMap = new Map();
          this.textureMap = new Map();
          // actorMap: Map<number, ActorManager> = new Map();
          this.bulletMap = new Map();
          this.state = {
            seed: 1 //伪随机种子

          };
        }

        static get Instance() {
          return super.GetInstance();
        }

        // 执行动作
        applyInput(input) {}

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=35ecb20387dfc0441ac958c24eee6de0b45ec5de.js.map