System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, FsmParamTypeEnum, ParamsNameEnum, EntityStateEnum, EventEnum, PrefabPathEnum, TexturePathEnum, SceneEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7835c9GOF5CGJyNze/EzX72", "index", undefined);

      _export("FsmParamTypeEnum", FsmParamTypeEnum = /*#__PURE__*/function (FsmParamTypeEnum) {
        FsmParamTypeEnum["Number"] = "Number";
        FsmParamTypeEnum["Trigger"] = "Trigger";
        return FsmParamTypeEnum;
      }({}));

      _export("ParamsNameEnum", ParamsNameEnum = /*#__PURE__*/function (ParamsNameEnum) {
        ParamsNameEnum["Idle"] = "Idle";
        ParamsNameEnum["Run"] = "Run";
        ParamsNameEnum["Attack"] = "Attack";
        return ParamsNameEnum;
      }({}));

      _export("EntityStateEnum", EntityStateEnum = /*#__PURE__*/function (EntityStateEnum) {
        EntityStateEnum["Idle"] = "Idle";
        EntityStateEnum["Run"] = "Run";
        EntityStateEnum["Attack"] = "Attack";
        return EntityStateEnum;
      }({}));

      _export("EventEnum", EventEnum = /*#__PURE__*/function (EventEnum) {
        EventEnum["WeaponShoot"] = "WeaponShoot";
        EventEnum["BulletBorn"] = "BulletBorn";
        EventEnum["ExplosionBorn"] = "ExplosionBorn";
        EventEnum["RoomJoin"] = "RoomJoin";
        EventEnum["GameStart"] = "GameStart";
        EventEnum["GameEnd"] = "GameEnd";
        EventEnum["ClientSync"] = "ClientSync";
        EventEnum["ReConnect"] = "ReConnect";
        return EventEnum;
      }({}));

      _export("PrefabPathEnum", PrefabPathEnum = /*#__PURE__*/function (PrefabPathEnum) {
        PrefabPathEnum["Map1"] = "prefab/Map1";
        PrefabPathEnum["Actor1"] = "prefab/Actor";
        PrefabPathEnum["Actor2"] = "prefab/Actor";
        PrefabPathEnum["Weapon1"] = "prefab/Weapon1";
        PrefabPathEnum["Weapon2"] = "prefab/Weapon2";
        PrefabPathEnum["Bullet1"] = "prefab/Bullet1";
        PrefabPathEnum["Bullet2"] = "prefab/Bullet2";
        PrefabPathEnum["Explosion"] = "prefab/Explosion";
        PrefabPathEnum["ReConnect"] = "prefab/ReConnect";
        return PrefabPathEnum;
      }({}));

      _export("TexturePathEnum", TexturePathEnum = /*#__PURE__*/function (TexturePathEnum) {
        TexturePathEnum["Actor1Idle"] = "texture/actor/actor1/idle";
        TexturePathEnum["Actor1Run"] = "texture/actor/actor1/run";
        TexturePathEnum["Actor2Idle"] = "texture/actor/actor2/idle";
        TexturePathEnum["Actor2Run"] = "texture/actor/actor2/run";
        TexturePathEnum["Weapon1Idle"] = "texture/weapon/weapon1/idle";
        TexturePathEnum["Weapon1Attack"] = "texture/weapon/weapon1/attack";
        TexturePathEnum["Weapon2Idle"] = "texture/weapon/weapon2/idle";
        TexturePathEnum["Weapon2Attack"] = "texture/weapon/weapon2/attack";
        TexturePathEnum["Bullet1Idle"] = "texture/bullet/bullet1";
        TexturePathEnum["Bullet2Idle"] = "texture/bullet/bullet2";
        TexturePathEnum["ExplosionIdle"] = "texture/explosion";
        return TexturePathEnum;
      }({}));

      _export("SceneEnum", SceneEnum = /*#__PURE__*/function (SceneEnum) {
        SceneEnum["Login"] = "Login";
        SceneEnum["Hall"] = "Hall";
        SceneEnum["Room"] = "Room";
        SceneEnum["Battle"] = "Battle";
        return SceneEnum;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=93be2a043593ef7f8ec7c3e0eba571f5740183e1.js.map