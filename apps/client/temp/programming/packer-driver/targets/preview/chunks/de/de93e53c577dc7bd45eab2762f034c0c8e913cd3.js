System.register(["__unresolved_0"], function (_export, _context) {
  "use strict";

  var RpcFunc, ProtoPathEnum, getProtoPathByRpcFunc, deepClone;
  return {
    setters: [function (_unresolved_) {
      RpcFunc = _unresolved_.RpcFunc;
      ProtoPathEnum = _unresolved_.ProtoPathEnum;
    }],
    execute: function () {
      /***
       * 根据消息类型获取生成coder需要的path
       */
      _export("getProtoPathByRpcFunc", getProtoPathByRpcFunc = (name, type) => {
        //小于gap是api，否则是msg
        if (name < RpcFunc.gap) {
          return ProtoPathEnum[name][type];
        } else {
          return ProtoPathEnum[name];
        }
      });

      _export("deepClone", deepClone = obj => {
        if (typeof obj !== "object" || obj === null) {
          return obj;
        }

        var res = Array.isArray(obj) ? [] : {};

        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            res[key] = deepClone(obj[key]);
          }
        }

        return res;
      });
    }
  };
});
//# sourceMappingURL=de93e53c577dc7bd45eab2762f034c0c8e913cd3.js.map