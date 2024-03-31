export enum TipEnum {
  ErrTip = 'ErrTip',
}

export enum FsmParamTypeEnum {
  Number = 'Number',
  Trigger = 'Trigger',
}

export enum ParamsNameEnum {
  Idle = 'Idle',
  Run = 'Run',
  Attack = 'Attack',
  Xu = 'Xu',
  Kan = 'Kan',
  Jump = 'Jump',
}

export enum EntityStateEnum {
  Idle = 'Idle',
  Run = 'Run',
  Attack = 'Attack',
  Xu = 'Xu',
}

export enum EventEnum {
  WeaponShoot = 'WeaponShoot',
  BulletBorn = 'BulletBorn',
  ExplosionBorn = 'ExplosionBorn',
  RoomJoin = 'RoomJoin',
  RoomCreate = 'RoomCreate',
  GameStart = 'GameStart',
  GameEnd = 'GameEnd',
  ReConnect = 'ReConnect',
  useSkill = 'useSkill',
  updateSkillItem = 'updateSkillItem',
  handlerNextTurn = 'handlerNextTurn',
  SCREEN_SHAKE = 'SCREEN_SHAKE',
  attackFinal = 'attackFinal',
  updateHp = 'updateHp',
  powerFinal = 'powerFinal',
  defenseFinal = 'defenseFinal',
  missFinal = 'missFinal',
  onPower = 'onPower',
}

export enum PrefabPathEnum {
  Room = 'prefab/Room',
  ErrTip = 'prefab/ErrTip',
  Prompt = 'prefab/Prompt',
  Heart = 'prefab/Heart',
  Cloud = 'prefab/Cloud',
  Actor1 = 'prefab/Actor1',
  Actor2 = 'prefab/Actor2',
  RoundShield = 'prefab/RoundShield',
  // Weapon1 = 'prefab/Weapon1',
  // Weapon2 = 'prefab/Weapon2',
  // Bullet1 = 'prefab/Bullet1',
  // Bullet2 = 'prefab/Bullet2',
  // Explosion = 'prefab/Explosion',
  // ReConnect = 'prefab/ReConnect',
  // JoyStick = "prefab/JoyStick",
  // Shoot = "prefab/Shoot",
}

export enum TexturePathEnum {
  ActorIdle = 'texture/actor/base/idle',
  ActorXu = 'texture/actor/base/xu',
  ActorRun = 'texture/actor/base/run',
  ActorKan = 'texture/actor/base/kan',
  ActorJump = 'texture/actor/base/jump',
}
// Bullet1Idle = 'texture/bullet/bullet1',
// Bullet2Idle = 'texture/bullet/bullet2',
// ExplosionIdle = 'texture/explosion',

export enum SceneEnum {
  Home = 'Home',
  Loading = 'Loading',
  Battle = 'Battle',
  Hall = 'Hall',
}
export enum SHAKE_TYPE_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum SkillPathEnum {
  ActiveSprite = 'fangkuang',
  HandNormal = 'hand/hand-normal',
  HandXu = 'hand/hand-xu',
  HandTwo = 'hand/hand-two',
  HandFour = 'hand/hand-four',
  HandCenter = 'hand/hand-center',
  RoundShieldFrame = 'shieldFrame/round-shield',
  Xu = 'base/xu',
  Kan = 'base/kan',
  Jump = 'base/jump',
  Dang = 'base/round-shield',
  HeartShield = 'shield/heart-shield',
  Spade = 'shield/spade',
  Crossbow = 'shield/crossbow',
  ShieldReflect = 'shield/shield-reflect',
  SpikedShield = 'shield/spiked-shield',
  ShieldImpact = 'shield/shield-impact',
  Spartan = 'shield/spartan',
  ShieldEchoes = 'shield/shield-echoes',
  CrenulatedShield = 'shield/crenulated-shield',
  FloorHatch = 'shield/floor-hatch',
  Enrage = 'shield/enrage',
  SwordTie = 'shield/sword-tie',
  AncientSword = 'shield/ancient-sword',
  UnstableProjectile = 'shield/unstable-projectile',
  ShieldBash = 'shield/shield-bash',
}
