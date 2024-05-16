/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  game: {
    nested: {
      IPlayer: {
        fields: {
          id: {
            type: "string",
            id: 1
          },
          nickname: {
            type: "string",
            id: 2
          },
          godname: {
            type: "string",
            id: 3
          },
          rid: {
            type: "int32",
            id: 4
          },
          actorName: {
            type: "string",
            id: 5
          }
        }
      },
      LoginReq: {
        fields: {
          player: {
            type: "IPlayer",
            id: 1
          }
        }
      },
      LoginRes: {
        oneofs: {
          _state: {
            oneof: [
              "state"
            ]
          }
        },
        fields: {
          state: {
            type: "int32",
            id: 1,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      SignInReq: {
        fields: {}
      },
      SignInRes: {
        fields: {
          player: {
            type: "IPlayer",
            id: 1
          }
        }
      },
      IRoom: {
        fields: {
          id: {
            type: "int32",
            id: 1
          },
          roomName: {
            type: "string",
            id: 2
          },
          life: {
            type: "int32",
            id: 3
          },
          mode: {
            type: "string",
            id: 4
          },
          hasPwd: {
            type: "bool",
            id: 6
          },
          pwd: {
            type: "string",
            id: 7
          },
          turn: {
            type: "int32",
            id: 8
          },
          players: {
            rule: "repeated",
            type: "IPlayer",
            id: 5
          }
        }
      },
      RoomList: {
        fields: {
          rooms: {
            rule: "repeated",
            type: "IRoom",
            id: 1
          }
        }
      },
      MsgRoom: {
        fields: {
          room: {
            type: "IRoom",
            id: 1
          }
        }
      },
      ChooseActor: {
        fields: {
          id: {
            type: "string",
            id: 1
          },
          actor: {
            type: "string",
            id: 2
          }
        }
      },
      RoomCreateReq: {
        fields: {
          roomName: {
            type: "string",
            id: 1
          },
          pwd: {
            type: "string",
            id: 2
          },
          life: {
            type: "int32",
            id: 3
          },
          mode: {
            type: "string",
            id: 4
          }
        }
      },
      RoomCreateRes: {
        fields: {
          room: {
            type: "IRoom",
            id: 1
          }
        }
      },
      RoomListByNameReq: {
        fields: {
          roomName: {
            type: "string",
            id: 1
          }
        }
      },
      RoomListByNameRes: {
        fields: {}
      },
      ApiRoomJoinReq: {
        oneofs: {
          _pwd: {
            oneof: [
              "pwd"
            ]
          }
        },
        fields: {
          rid: {
            type: "int32",
            id: 1
          },
          pwd: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      ApiRoomJoinRes: {
        fields: {
          room: {
            type: "IRoom",
            id: 1
          },
          error: {
            type: "string",
            id: 2
          }
        }
      },
      ApiRoomLeaveReq: {
        fields: {}
      },
      ApiRoomLeaveRes: {
        fields: {}
      },
      ApiChooseActorReq: {
        fields: {
          actor: {
            type: "string",
            id: 1
          }
        }
      },
      ApiChooseActorRes: {
        fields: {}
      },
      EnterGameReq: {
        fields: {
          actor: {
            type: "string",
            id: 1
          }
        }
      },
      EnterGameRes: {
        fields: {}
      },
      ApiUseSkillReq: {
        fields: {
          key: {
            type: "int32",
            id: 1
          },
          index: {
            type: "int32",
            id: 2
          },
          power: {
            type: "int32",
            id: 3
          }
        }
      },
      ApiUseSkillRes: {
        fields: {}
      },
      UseSkill: {
        fields: {
          key: {
            type: "int32",
            id: 1
          },
          index: {
            type: "int32",
            id: 2
          },
          power: {
            type: "int32",
            id: 3
          },
          id: {
            type: "string",
            id: 4
          }
        }
      }
    }
  }
});

module.exports = $root;
