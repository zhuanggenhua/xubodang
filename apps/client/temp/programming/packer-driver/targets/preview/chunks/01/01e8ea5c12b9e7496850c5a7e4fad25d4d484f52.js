System.register([], function (_export, _context) {
  "use strict";

  var Singleton;

  _export("Singleton", void 0);

  return {
    setters: [],
    execute: function () {
      _export("Singleton", Singleton = class Singleton {
        static GetInstance() {
          if (this._instance === null) {
            this._instance = new this();
          }

          return this._instance;
        }

        constructor() {}

      });

      Singleton._instance = null;
    }
  };
});
//# sourceMappingURL=01e8ea5c12b9e7496850c5a7e4fad25d4d484f52.js.map