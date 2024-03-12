/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  game: {
    nested: {
      EnterGameReq: {
        fields: {
          token: {
            type: "string",
            id: 1
          }
        }
      },
      EnterGameRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "EnterGameResData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      EnterGameResData: {
        fields: {
          account: {
            type: "string",
            id: 1
          }
        }
      },
      ListActorReq: {
        fields: {}
      },
      ListActorRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "ListActorResData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      ListActorResData: {
        fields: {
          actors: {
            rule: "repeated",
            type: "IActor",
            id: 1
          }
        }
      },
      CreateActorReq: {
        fields: {
          nickname: {
            type: "string",
            id: 1
          }
        }
      },
      CreateActorRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "CreateActorResData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      CreateActorResData: {
        fields: {}
      },
      EnterSceneReq: {
        fields: {
          actorId: {
            type: "int32",
            id: 1
          }
        }
      },
      EnterSceneRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "EnterSceneResData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      EnterSceneResData: {
        fields: {
          sceneId: {
            type: "int32",
            id: 1
          }
        }
      },
      ChangeSceneReq: {
        fields: {
          sceneId: {
            type: "int32",
            id: 1
          }
        }
      },
      ChangeSceneRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "ChangeSceneResData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      ChangeSceneResData: {
        fields: {}
      },
      CreateReplicationReq: {
        fields: {
          replicationType: {
            type: "int32",
            id: 1
          }
        }
      },
      CreateReplicationRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "CreateReplicationResData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      CreateReplicationResData: {
        fields: {}
      },
      LeaveReplicationReq: {
        fields: {}
      },
      LeaveReplicationRes: {
        oneofs: {
          _error: {
            oneof: [
              "error"
            ]
          }
        },
        fields: {
          data: {
            type: "LeaveReplicationReqData",
            id: 1
          },
          error: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      LeaveReplicationReqData: {
        fields: {
          sceneId: {
            type: "int32",
            id: 1
          }
        }
      },
      IActor: {
        fields: {
          id: {
            type: "int32",
            id: 1
          },
          nickname: {
            type: "string",
            id: 2
          },
          posX: {
            type: "float",
            id: 3
          },
          posY: {
            type: "float",
            id: 4
          },
          type: {
            type: "int32",
            id: 5
          },
          account: {
            type: "string",
            id: 6
          },
          sceneId: {
            type: "int32",
            id: 7
          }
        }
      },
      InputFromClient: {
        fields: {
          id: {
            type: "int32",
            id: 1
          },
          directionX: {
            type: "float",
            id: 2
          },
          directionY: {
            type: "float",
            id: 3
          },
          dt: {
            type: "float",
            id: 4
          }
        }
      },
      State: {
        fields: {
          actors: {
            rule: "repeated",
            type: "IActor",
            id: 1
          }
        }
      },
      StateFromServer: {
        fields: {
          state: {
            type: "State",
            id: 1
          },
          input: {
            rule: "repeated",
            type: "InputFromClient",
            id: 2
          }
        }
      }
    }
  }
});

module.exports = $root;
