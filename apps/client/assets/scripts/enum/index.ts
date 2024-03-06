
export enum FsmParamTypeEnum {
    Number = "Number",
    Trigger = "Trigger",
  }
  
  export enum ParamsNameEnum {
    Idle = "Idle",
    Run = "Run",
    Attack = "Attack",
  }
  
  export enum EntityStateEnum {
    Idle = "Idle",
    Run = "Run",
    Attack = "Attack",
  }
  
  export enum EventEnum {
    WeaponShoot = "WeaponShoot",
    BulletBorn = "BulletBorn",
    ExplosionBorn = "ExplosionBorn",
    RoomJoin = "RoomJoin",
    GameStart = "GameStart",
    GameEnd = "GameEnd",
    ClientSync = "ClientSync",
    ReConnect = "ReConnect",
  }
  
  export enum PrefabPathEnum {
    Map1 = "prefab/Map1",
    Actor1 = "prefab/Actor",
    Actor2 = "prefab/Actor",
    Weapon1 = "prefab/Weapon1",
    Weapon2 = "prefab/Weapon2",
    Bullet1 = "prefab/Bullet1",
    Bullet2 = "prefab/Bullet2",
    Explosion = "prefab/Explosion",
    ReConnect = "prefab/ReConnect",
    // JoyStick = "prefab/JoyStick",
    // Shoot = "prefab/Shoot",
  }
  
  export enum TexturePathEnum {
    Actor1Idle = "texture/actor/actor1/idle",
    Actor1Run = "texture/actor/actor1/run",
    Actor2Idle = "texture/actor/actor2/idle",
    Actor2Run = "texture/actor/actor2/run",
    Weapon1Idle = "texture/weapon/weapon1/idle",
    Weapon1Attack = "texture/weapon/weapon1/attack",
    Weapon2Idle = "texture/weapon/weapon2/idle",
    Weapon2Attack = "texture/weapon/weapon2/attack",
    Bullet1Idle = "texture/bullet/bullet1",
    Bullet2Idle = "texture/bullet/bullet2",
    ExplosionIdle = "texture/explosion",
  }
  
  export enum SceneEnum {
    Login = "Login",
    Hall = "Hall",
    Room = "Room",
    Battle = "Battle",
  }