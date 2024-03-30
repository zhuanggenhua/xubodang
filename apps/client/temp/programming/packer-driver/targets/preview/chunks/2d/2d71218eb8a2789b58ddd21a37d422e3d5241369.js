System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Prefab, SpriteFrame, director, view, Singleton, PrefabPathEnum, SkillPathEnum, TexturePathEnum, ResourceManager, getSkillPath, DataManager, _crd, PLAYER_SPEED, BULLET_SPEED, WEAPON_DAMAGE, PLAYER_RADIUS, BULLET_RADIUS, mapW, mapH;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfIPlayer(extras) {
    _reporterNs.report("IPlayer", "../common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIRoom(extras) {
    _reporterNs.report("IRoom", "../common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../common/base", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPrefabPathEnum(extras) {
    _reporterNs.report("PrefabPathEnum", "../enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSkillPathEnum(extras) {
    _reporterNs.report("SkillPathEnum", "../enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTexturePathEnum(extras) {
    _reporterNs.report("TexturePathEnum", "../enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "./ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetSkillPath(extras) {
    _reporterNs.report("getSkillPath", "../utils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfActorManager(extras) {
    _reporterNs.report("ActorManager", "../entity/actor/ActorManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCanvas(extras) {
    _reporterNs.report("BattleCanvas", "../ui/BattleCanvas", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Prefab = _cc.Prefab;
      SpriteFrame = _cc.SpriteFrame;
      director = _cc.director;
      view = _cc.view;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.Singleton;
    }, function (_unresolved_3) {
      PrefabPathEnum = _unresolved_3.PrefabPathEnum;
      SkillPathEnum = _unresolved_3.SkillPathEnum;
      TexturePathEnum = _unresolved_3.TexturePathEnum;
    }, function (_unresolved_4) {
      ResourceManager = _unresolved_4.ResourceManager;
    }, function (_unresolved_5) {
      getSkillPath = _unresolved_5.getSkillPath;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f3a50IPeU9FqKFr/UCCSiVN", "DataManager", undefined);

      __checkObsolete__(['Prefab', 'SpriteFrame', 'Node', 'director', 'view']);

      PLAYER_SPEED = 100;
      BULLET_SPEED = 600;
      WEAPON_DAMAGE = 5;
      PLAYER_RADIUS = 50;
      BULLET_RADIUS = 10; // 设计图尺寸

      _export("mapW", mapW = view.getVisibleSize().width);

      _export("mapH", mapH = view.getVisibleSize().height); // export const mapW = 720;
      // export const mapH = 1280;


      _export("default", DataManager = class DataManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor() {
          super(...arguments);
          this.mode = 'single';
          this.setting = null;
          this.player = {
            id: 1,
            nickname: '游客'
          };
          this.otherPlayer = null;
          this.roomInfo = {
            life: 5,
            turn: 0
          };
          this.stage = director.getScene().getChildByName('Canvas');
          this.battle = null;
          // actorMap: Map<number, ActorManager> = new Map();
          this.prefabMap = new Map();
          this.textureMap = new Map();
          this.skillMap = new Map();
          this.actors = new Map();
        }

        static get Instance() {
          return super.GetInstance();
        }

        // bulletMap: Map<number, BulletManager> = new Map();
        // actor1 表示玩家  2表示对方
        get actor1() {
          return this.actors.get(this.player.id);
        }

        get actor2() {
          return this.actors.get(this.otherPlayer.id);
        }

        loadRes() {
          return _asyncToGenerator(function* () {
            var list = []; // 注意取得时候不能用枚举，懒得改了

            var _loop = function* _loop(type) {
              var p = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
                error: Error()
              }), ResourceManager) : ResourceManager).Instance.loadRes((_crd && PrefabPathEnum === void 0 ? (_reportPossibleCrUseOfPrefabPathEnum({
                error: Error()
              }), PrefabPathEnum) : PrefabPathEnum)[type], Prefab).then(prefab => {
                DataManager.Instance.prefabMap.set(type, prefab);
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
                DataManager.Instance.textureMap.set(_type, spriteFrames);
              });
              list.push(p);
            };

            for (var _type in _crd && TexturePathEnum === void 0 ? (_reportPossibleCrUseOfTexturePathEnum({
              error: Error()
            }), TexturePathEnum) : TexturePathEnum) {
              yield* _loop2(_type);
            }

            var _loop3 = function* _loop3(_type2) {
              var p = (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
                error: Error()
              }), ResourceManager) : ResourceManager).Instance.loadRes((_crd && getSkillPath === void 0 ? (_reportPossibleCrUseOfgetSkillPath({
                error: Error()
              }), getSkillPath) : getSkillPath)((_crd && SkillPathEnum === void 0 ? (_reportPossibleCrUseOfSkillPathEnum({
                error: Error()
              }), SkillPathEnum) : SkillPathEnum)[_type2]), SpriteFrame).then(spriteFrame => {
                DataManager.Instance.skillMap.set((_crd && SkillPathEnum === void 0 ? (_reportPossibleCrUseOfSkillPathEnum({
                  error: Error()
                }), SkillPathEnum) : SkillPathEnum)[_type2], spriteFrame);
              });
              list.push(p);
            };

            for (var _type2 in _crd && SkillPathEnum === void 0 ? (_reportPossibleCrUseOfSkillPathEnum({
              error: Error()
            }), SkillPathEnum) : SkillPathEnum) {
              yield* _loop3(_type2);
            }

            yield Promise.all(list);
          })();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2d71218eb8a2789b58ddd21a37d422e3d5241369.js.map