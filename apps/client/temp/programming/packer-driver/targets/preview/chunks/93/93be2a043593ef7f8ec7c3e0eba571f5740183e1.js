System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, TipEnum, FsmParamTypeEnum, ParamsNameEnum, EntityStateEnum, EventEnum, PrefabPathEnum, TexturePathEnum, SceneEnum, SkillPathEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7835c9GOF5CGJyNze/EzX72", "index", undefined);

      _export("TipEnum", TipEnum = /*#__PURE__*/function (TipEnum) {
        TipEnum["ErrTip"] = "ErrTip";
        return TipEnum;
      }({}));

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
        EventEnum["RoomCreate"] = "RoomCreate";
        EventEnum["GameStart"] = "GameStart";
        EventEnum["GameEnd"] = "GameEnd";
        EventEnum["ReConnect"] = "ReConnect";
        return EventEnum;
      }({}));

      _export("PrefabPathEnum", PrefabPathEnum = /*#__PURE__*/function (PrefabPathEnum) {
        PrefabPathEnum["Room"] = "prefab/Room";
        PrefabPathEnum["ErrTip"] = "prefab/ErrTip";
        PrefabPathEnum["Prompt"] = "prefab/Prompt";
        PrefabPathEnum["Heart"] = "prefab/Heart";
        return PrefabPathEnum;
      }({}));

      _export("TexturePathEnum", TexturePathEnum = /*#__PURE__*/function (TexturePathEnum) {
        return TexturePathEnum;
      }({})); // Actor1Idle = 'texture/actor/actor1/idle',
      // Actor1Run = 'texture/actor/actor1/run',
      // Actor2Idle = 'texture/actor/actor2/idle',
      // Actor2Run = 'texture/actor/actor2/run',
      // Weapon1Idle = 'texture/weapon/weapon1/idle',
      // Weapon1Attack = 'texture/weapon/weapon1/attack',
      // Weapon2Idle = 'texture/weapon/weapon2/idle',
      // Weapon2Attack = 'texture/weapon/weapon2/attack',
      // Bullet1Idle = 'texture/bullet/bullet1',
      // Bullet2Idle = 'texture/bullet/bullet2',
      // ExplosionIdle = 'texture/explosion',


      _export("SceneEnum", SceneEnum = /*#__PURE__*/function (SceneEnum) {
        SceneEnum["Home"] = "Home";
        SceneEnum["Loading"] = "Loading";
        SceneEnum["Battle"] = "Battle";
        SceneEnum["Hall"] = "Hall";
        return SceneEnum;
      }({}));

      _export("SkillPathEnum", SkillPathEnum = /*#__PURE__*/function (SkillPathEnum) {
        SkillPathEnum["xu"] = "base/xu";
        SkillPathEnum["kan"] = "base/kan";
        SkillPathEnum["jump"] = "base/jump";
        SkillPathEnum["dang"] = "base/round-shield";
        SkillPathEnum["heartShield"] = "shield/heart-shield";
        SkillPathEnum["spade"] = "shield/spade";
        SkillPathEnum["crossbow"] = "shield/crossbow";
        SkillPathEnum["shieldReflect"] = "shield/shield-reflect";
        SkillPathEnum["spikedShield"] = "shield/spiked-shield";
        SkillPathEnum["shieldImpact"] = "shield/shield-impact";
        SkillPathEnum["spartan"] = "shield/spartan";
        SkillPathEnum["shieldEchoes"] = "shield/shield-echoes";
        SkillPathEnum["crenulatedShield"] = "shield/crenulated-shield";
        SkillPathEnum["floorHatch"] = "shield/floor-hatch";
        SkillPathEnum["enrage"] = "shield/enrage";
        SkillPathEnum["swordTie"] = "shield/sword-tie";
        SkillPathEnum["ancientSword"] = "shield/ancient-sword";
        SkillPathEnum["unstableProjectile"] = "shield/unstable-projectile";
        SkillPathEnum["shieldBash"] = "shield/shield-bash";
        return SkillPathEnum;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=93be2a043593ef7f8ec7c3e0eba571f5740183e1.js.map