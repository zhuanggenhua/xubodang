System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, getRandomNumber;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dfbd2QXTqlKLqZlH6kUYDHg", "tool", undefined);

      _export("getRandomNumber", getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ddd90354a2cf65796e4d2c42e1be8e7a2a091cf0.js.map