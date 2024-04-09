export enum TipEnum {
  ErrTip = 'ErrTip',
}

export enum FsmParamTypeEnum {
  Number = 'Number',
  Trigger = 'Trigger',
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
  onPower = 'onPower',
  powerFinal = 'powerFinal',
  defenseFinal = 'defenseFinal',
  missFinal = 'missFinal',
  specialFinal = 'specialFinal',
  renderSkills = 'renderSkills',
  createActor = 'createActor',
}

export enum PrefabPathEnum {
  Room = 'prefab/Room',
  ErrTip = 'prefab/ErrTip',
  Prompt = 'prefab/Prompt',
  Heart = 'prefab/Heart',
  Cloud = 'prefab/Cloud',
  Actor1 = 'prefab/Actor1',
  RoundShield = 'prefab/RoundShield',
  Crossbow = 'prefab/Crossbow',
  ActorIcon = 'prefab/ActorIcon',
}

export enum TexturePathEnum {
  ActorIdle = 'texture/actor/base/idle',
  ActorXu = 'texture/actor/base/xu',
  ActorRun = 'texture/actor/base/run',
  ActorKan = 'texture/actor/base/kan',
  ActorJump = 'texture/actor/base/jump',
  ActorCrossbow = 'texture/actor/soldier/Crossbow',
  ActorSpade = 'texture/actor/soldier/Spade',
  
  CrossbowIdle = 'texture/bullet/arrow',
}

export enum ParamsNameEnum {
  Idle = 'Idle',
  Run = 'Run',
  Attack = 'Attack',
  Xu = 'Xu',
  Kan = 'Kan',
  Jump = 'Jump',
  Crossbow = 'Crossbow',
  Spade = 'Spade',  
  ActiveSprite = 'ActiveSprite',
  HandNormal = 'HandNormal',
  HandXu = 'HandXu',
  HandTwo = 'HandTwo',
  HandFour = 'HandFour',
  HandCenter = 'HandCenter',
  RoundShieldFrame = 'RoundShieldFrame',  //生成盾牌的图片
  Dang = 'Dang',
  HeartShield = 'HeartShield',
  ShieldReflect = 'ShieldReflect',
  SpikedShield = 'SpikedShield',
  ShieldImpact = 'ShieldImpact',
  Spartan = 'Spartan',
  ShieldEchoes = 'ShieldEchoes',
  CrenulatedShield = 'CrenulatedShield',
  FloorHatch = 'FloorHatch',
  Enrage = 'Enrage',
  SwordTie = 'SwordTie',
  AncientSword = 'AncientSword',
  UnstableProjectile = 'UnstableProjectile',
  ShieldBash = 'ShieldBash',   
}

// 和技能相关的图片路径
export enum SkillPathEnum {
  ActiveSprite = 'fangkuang',
  NormalSprite = 'kuang',
  addBlack = 'addBlack',
  HandNormal = 'hand/hand-normal',
  HandXu = 'hand/hand-xu',
  HandTwo = 'hand/hand-two',
  HandFour = 'hand/hand-four',
  HandCenter = 'hand/hand-center',

  // 动态的盾牌图标
  RoundShieldFrame = 'shieldFrame/round-shield', 
  HeartShieldFrame = 'shieldFrame/heart-shield', 
  SpikedShieldFrame = 'shieldFrame/spiked-shield', 
  ShieldReflectFrame = 'shieldFrame/shield', 

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
  
  // 动漫人
  Wood = 'animeMan/wood',
  Dodging = 'animeMan/dodging',
  bo = 'animeMan/hypersonic-bolt',
  gengzongbo = 'animeMan/ink-swirl',
  RelationshipBounds = 'animeMan/relationship-bounds',
  tianzhao = 'animeMan/tianzhao',
  xielunyan = 'animeMan/paranoia',
  aura = 'animeMan/aura',
  qigong = 'animeMan/sinusoidal-beam',
  yuanqidan = 'animeMan/explosion-rays',
  weishou = 'animeMan/bubbling-beam',
  jiewangquan = 'animeMan/mighty-force',
  luoshengmen = 'animeMan/magic-gate',

  // 角色图标  根据key去找对应角色数据
  soldier = 'actor/soldier',
  animeMan = 'actor/animeMan',
  joker = 'actor/joker',
  me = 'actor/me',
}

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

export enum MissType{
  Round, //近战
  Bullet, //远程弹丸攻击
}

// 特殊技能
export enum Special {
  Reflect, //反射
}

