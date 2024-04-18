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
  powerFinal = 'powerFinal',
  defenseFinal = 'defenseFinal',
  continueFinal = 'continueFinal',
  missFinal = 'missFinal',
  specialFinal = 'specialFinal',
  renderSkills = 'renderSkills',
  createActor = 'createActor',
  renderChart = 'renderChart',
  flicker = 'flicker',
  moveBack = 'moveBack',
  missSingle = 'missSingle',
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
  Sword = 'prefab/Sword',
  ActorIcon = 'prefab/ActorIcon',
  Buff = 'prefab/Buff',
  Wood = 'prefab/Wood',
  Bo = 'prefab/Bo',
  Fire = 'prefab/Fire',
  Sun = 'prefab/Sun',
  Yu = 'prefab/Yu',
}

export enum TexturePathEnum {
  ActorIdle = 'texture/actor/base/idle',
  ActorXu = 'texture/actor/base/xu',
  ActorRun = 'texture/actor/base/run',
  ActorKan = 'texture/actor/base/kan',
  ActorJump = 'texture/actor/base/jump',
  ActorCrossbow = 'texture/actor/soldier/Crossbow',
  ActorSpade = 'texture/actor/soldier/Spade',
  ActorShieldImpact = 'texture/actor/soldier/ciji',
  ActorAncientSwordAttack = 'texture/actor/soldier/gali',
  ActorAncientSwordIdle = 'texture/actor/soldier/galiIdle',

  ActorBo = 'texture/actor/animeMan/bo',
  ActorSun = 'texture/actor/animeMan/sun',
  ActorWuKong = 'texture/actor/animeMan/wukong',
  ActorQiGong = 'texture/actor/animeMan/qigong',
  Actorqigongpao = 'texture/actor/animeMan/qigongpao',
  Actorclone = 'texture/actor/animeMan/clone',
  Actoryuanqidan = 'texture/actor/animeMan/yuanqidan',
  Actormen = 'texture/actor/animeMan/men',

  // 子弹
  CrossbowIdle = 'texture/bullet/arrow',
  SwordIdle = 'texture/bullet/sword',
  BoIdle = 'texture/bullet/bo',
  YuIdle = 'texture/bullet/bo',
}

export enum ParamsNameEnum {
  Idle = 'Idle',
  Run = 'Run',
  Xu = 'Xu',
  Kan = 'Kan',
  Jump = 'Jump',
  Spade = 'Spade',
  Crossbow = 'Crossbow',
  ShieldImpact = 'ShieldImpact',
  AncientSwordAttack = 'AncientSwordAttack',
  AncientSwordIdle = 'AncientSwordIdle',

  Bo = 'Bo',
  Sun = 'Sun',
  WuKong = 'WuKong',
  QiGong = 'QiGong',
  qigongpao = 'qigongpao',
  clone = 'clone',
  yuanqidan = 'yuanqidan',
  men = 'men',
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
  qigongpao = 'animeMan/qigongpao',
  sun = 'animeMan/sun',
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

export enum MissType {
  Round, //近战
  Bullet, //远程弹丸攻击
  All,
  Single,
}

// 特殊技能
export enum Special {
  Reflect = '反射', //反射
  spartan = '斯巴达',
  gengzongbo = '追踪',
  fire = '火',
  sun = '打断',
  copy = '复制',
  qigongpao = '气功',
  saiya = '赛亚人',
  door = '门',
}
// 持续效果
export enum BuffEnum {
  spine = '尖刺', //尖刺
  solid = '坚固', //坚固
  blood = '吸血', //吸血
  retain = '护盾保留', //吸血
  trap = '陷阱', //吸血
  loopSword = '无限', //无限
  spartan = '斯巴达', //斯巴达
  fly = '滞空',
  shuangbei = '双倍',
  clone = '分身',
  saiya = '赛亚人',
}
