System.register([], function (_export, _context) {
  "use strict";

  var InputTypeEnum, EntityTypeEnum, RpcFunc, ProtoPathEnum, ServerIdEnum, ReplicationEnum, ServerPort;
  return {
    setters: [],
    execute: function () {
      _export("InputTypeEnum", InputTypeEnum = /*#__PURE__*/function (InputTypeEnum) {
        InputTypeEnum[InputTypeEnum["ActorMove"] = 0] = "ActorMove";
        InputTypeEnum[InputTypeEnum["WeaponShoot"] = 1] = "WeaponShoot";
        InputTypeEnum[InputTypeEnum["TimePast"] = 2] = "TimePast";
        return InputTypeEnum;
      }({}));

      _export("EntityTypeEnum", EntityTypeEnum = /*#__PURE__*/function (EntityTypeEnum) {
        EntityTypeEnum["Map1"] = "Map1";
        EntityTypeEnum["Actor1"] = "Actor1";
        EntityTypeEnum["Actor2"] = "Actor2";
        EntityTypeEnum["Weapon1"] = "Weapon1";
        EntityTypeEnum["Weapon2"] = "Weapon2";
        EntityTypeEnum["Bullet1"] = "Bullet1";
        EntityTypeEnum["Bullet2"] = "Bullet2";
        EntityTypeEnum["Explosion"] = "Explosion";
        EntityTypeEnum["JoyStick"] = "JoyStick";
        EntityTypeEnum["Shoot"] = "Shoot";
        EntityTypeEnum["ReConnect"] = "ReConnect";
        return EntityTypeEnum;
      }({}));

      _export("RpcFunc", RpcFunc = /*#__PURE__*/function (RpcFunc) {
        RpcFunc[RpcFunc["enterGame"] = 0] = "enterGame";
        RpcFunc[RpcFunc["listActor"] = 1] = "listActor";
        RpcFunc[RpcFunc["createActor"] = 2] = "createActor";
        RpcFunc[RpcFunc["enterScene"] = 3] = "enterScene";
        RpcFunc[RpcFunc["changeScene"] = 4] = "changeScene";
        RpcFunc[RpcFunc["createReplication"] = 5] = "createReplication";
        RpcFunc[RpcFunc["leaveReplication"] = 6] = "leaveReplication";
        RpcFunc[RpcFunc["gap"] = 100] = "gap";
        RpcFunc[RpcFunc["inputFromClient"] = 101] = "inputFromClient";
        RpcFunc[RpcFunc["stateFromServer"] = 102] = "stateFromServer";
        return RpcFunc;
      }({}));

      _export("ProtoPathEnum", ProtoPathEnum = {
        [RpcFunc.enterGame]: {
          req: "game.EnterGameReq",
          res: "game.EnterGameRes"
        },
        [RpcFunc.listActor]: {
          req: "game.ListActorReq",
          res: "game.ListActorRes"
        },
        [RpcFunc.createActor]: {
          req: "game.CreateActorReq",
          res: "game.CreateActorRes"
        },
        [RpcFunc.enterScene]: {
          req: "game.EnterSceneReq",
          res: "game.EnterSceneRes"
        },
        [RpcFunc.changeScene]: {
          req: "game.ChangeSceneReq",
          res: "game.ChangeSceneRes"
        },
        [RpcFunc.createReplication]: {
          req: "game.CreateReplicationReq",
          res: "game.CreateReplicationRes"
        },
        [RpcFunc.leaveReplication]: {
          req: "game.LeaveReplicationReq",
          res: "game.LeaveReplicationRes"
        },
        [RpcFunc.gap]: "",
        [RpcFunc.inputFromClient]: "game.InputFromClient",
        [RpcFunc.stateFromServer]: "game.StateFromServer"
      });

      _export("ServerIdEnum", ServerIdEnum = /*#__PURE__*/function (ServerIdEnum) {
        ServerIdEnum[ServerIdEnum["Game"] = 0] = "Game";
        ServerIdEnum[ServerIdEnum["Gateway"] = 1] = "Gateway";
        ServerIdEnum[ServerIdEnum["ReplicationManager"] = 2] = "ReplicationManager";
        ServerIdEnum[ServerIdEnum["Scene1"] = 101] = "Scene1";
        ServerIdEnum[ServerIdEnum["Scene2"] = 102] = "Scene2";
        ServerIdEnum[ServerIdEnum["ReplicationInstance"] = 103] = "ReplicationInstance";
        return ServerIdEnum;
      }({}));

      _export("ReplicationEnum", ReplicationEnum = /*#__PURE__*/function (ReplicationEnum) {
        ReplicationEnum[ReplicationEnum["Replication1"] = 1] = "Replication1";
        return ReplicationEnum;
      }({}));

      _export("ServerPort", ServerPort = /*#__PURE__*/function (ServerPort) {
        ServerPort[ServerPort["AuthHttp"] = 3000] = "AuthHttp";
        ServerPort[ServerPort["AuthRpc"] = 3001] = "AuthRpc";
        ServerPort[ServerPort["Gateway"] = 4000] = "Gateway";
        ServerPort[ServerPort["Game"] = 5000] = "Game";
        return ServerPort;
      }({}));
    }
  };
});
//# sourceMappingURL=44305c2a791fe309049d1477e8ed05a17dd54bdc.js.map