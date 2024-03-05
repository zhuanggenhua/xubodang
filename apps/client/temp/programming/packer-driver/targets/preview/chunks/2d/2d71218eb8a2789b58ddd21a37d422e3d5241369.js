System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Singleton, DataManager, _crd, PLAYER_SPEED, BULLET_SPEED, WEAPON_DAMAGE, PLAYER_RADIUS, BULLET_RADIUS, mapW, mapH;

  function _reportPossibleCrUseOfIRoom(extras) {
    _reporterNs.report("IRoom", "../common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../common/base", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.Singleton;
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

      _export("mapW", mapW = 720);

      _export("mapH", mapH = 1280);

      _export("default", DataManager = class DataManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor() {
          super(...arguments);
          this.myPlayerId = 1;
          this.roomInfo = void 0;
          this.stage = void 0;
          // actorMap: Map<number, ActorManager> = new Map();
          this.prefabMap = new Map();
          this.textureMap = new Map();
        }

        static get Instance() {
          return super.GetInstance();
        } // bulletMap: Map<number, BulletManager> = new Map();
        // state: IState = {
        //   seed: 1, //伪随机种子
        // };
        // 执行动作
        // applyInput(input: IClientInput) {
        // }


      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2d71218eb8a2789b58ddd21a37d422e3d5241369.js.map