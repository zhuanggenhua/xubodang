System.register(["__unresolved_0", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _cjsExports, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        // light library entry point.
        "use strict";

        module.exports = require("./src/index-light"); // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);
      }, () => ({
        './src/index-light': _req
      }));
    }
  };
});
//# sourceMappingURL=4ebfc21da1ff3bc112be0c4b173adc82c4879171.js.map