System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15", "__unresolved_16", "__unresolved_17", "__unresolved_18", "__unresolved_19"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _req1, _req2, _req3, _req4, _req5, _req6, _req7, _req8, _req9, _req10, _req11, _req12, _req13, _req14, _req15, _req16, _req17, _cjsExports, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }, function (_unresolved_3) {
      _req0 = _unresolved_3.__cjsMetaURL;
    }, function (_unresolved_4) {
      _req1 = _unresolved_4.__cjsMetaURL;
    }, function (_unresolved_5) {
      _req2 = _unresolved_5.__cjsMetaURL;
    }, function (_unresolved_6) {
      _req3 = _unresolved_6.__cjsMetaURL;
    }, function (_unresolved_7) {
      _req4 = _unresolved_7.__cjsMetaURL;
    }, function (_unresolved_8) {
      _req5 = _unresolved_8.__cjsMetaURL;
    }, function (_unresolved_9) {
      _req6 = _unresolved_9.__cjsMetaURL;
    }, function (_unresolved_10) {
      _req7 = _unresolved_10.__cjsMetaURL;
    }, function (_unresolved_11) {
      _req8 = _unresolved_11.__cjsMetaURL;
    }, function (_unresolved_12) {
      _req9 = _unresolved_12.__cjsMetaURL;
    }, function (_unresolved_13) {
      _req10 = _unresolved_13.__cjsMetaURL;
    }, function (_unresolved_14) {
      _req11 = _unresolved_14.__cjsMetaURL;
    }, function (_unresolved_15) {
      _req12 = _unresolved_15.__cjsMetaURL;
    }, function (_unresolved_16) {
      _req13 = _unresolved_16.__cjsMetaURL;
    }, function (_unresolved_17) {
      _req14 = _unresolved_17.__cjsMetaURL;
    }, function (_unresolved_18) {
      _req15 = _unresolved_18.__cjsMetaURL;
    }, function (_unresolved_19) {
      _req16 = _unresolved_19.__cjsMetaURL;
    }, function (_unresolved_20) {
      _req17 = _unresolved_20.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        var protobuf = module.exports = require("./index-minimal");

        protobuf.build = "light";
        /**
         * A node-style callback as used by {@link load} and {@link Root#load}.
         * @typedef LoadCallback
         * @type {function}
         * @param {Error|null} error Error, if any, otherwise `null`
         * @param {Root} [root] Root, if there hasn't been an error
         * @returns {undefined}
         */

        /**
         * Loads one or multiple .proto or preprocessed .json files into a common root namespace and calls the callback.
         * @param {string|string[]} filename One or multiple files to load
         * @param {Root} root Root namespace, defaults to create a new one if omitted.
         * @param {LoadCallback} callback Callback function
         * @returns {undefined}
         * @see {@link Root#load}
         */

        function load(filename, root, callback) {
          if (typeof root === "function") {
            callback = root;
            root = new protobuf.Root();
          } else if (!root) root = new protobuf.Root();

          return root.load(filename, callback);
        }
        /**
         * Loads one or multiple .proto or preprocessed .json files into a common root namespace and calls the callback.
         * @name load
         * @function
         * @param {string|string[]} filename One or multiple files to load
         * @param {LoadCallback} callback Callback function
         * @returns {undefined}
         * @see {@link Root#load}
         * @variation 2
         */
        // function load(filename:string, callback:LoadCallback):undefined

        /**
         * Loads one or multiple .proto or preprocessed .json files into a common root namespace and returns a promise.
         * @name load
         * @function
         * @param {string|string[]} filename One or multiple files to load
         * @param {Root} [root] Root namespace, defaults to create a new one if omitted.
         * @returns {Promise<Root>} Promise
         * @see {@link Root#load}
         * @variation 3
         */
        // function load(filename:string, [root:Root]):Promise<Root>


        protobuf.load = load;
        /**
         * Synchronously loads one or multiple .proto or preprocessed .json files into a common root namespace (node only).
         * @param {string|string[]} filename One or multiple files to load
         * @param {Root} [root] Root namespace, defaults to create a new one if omitted.
         * @returns {Root} Root namespace
         * @throws {Error} If synchronous fetching is not supported (i.e. in browsers) or if a file's syntax is invalid
         * @see {@link Root#loadSync}
         */

        function loadSync(filename, root) {
          if (!root) root = new protobuf.Root();
          return root.loadSync(filename);
        }

        protobuf.loadSync = loadSync; // Serialization

        protobuf.encoder = require("./encoder");
        protobuf.decoder = require("./decoder");
        protobuf.verifier = require("./verifier");
        protobuf.converter = require("./converter"); // Reflection

        protobuf.ReflectionObject = require("./object");
        protobuf.Namespace = require("./namespace");
        protobuf.Root = require("./root");
        protobuf.Enum = require("./enum");
        protobuf.Type = require("./type");
        protobuf.Field = require("./field");
        protobuf.OneOf = require("./oneof");
        protobuf.MapField = require("./mapfield");
        protobuf.Service = require("./service");
        protobuf.Method = require("./method"); // Runtime

        protobuf.Message = require("./message");
        protobuf.wrappers = require("./wrappers"); // Utility

        protobuf.types = require("./types");
        protobuf.util = require("./util"); // Set up possibly cyclic reflection dependencies

        protobuf.ReflectionObject._configure(protobuf.Root);

        protobuf.Namespace._configure(protobuf.Type, protobuf.Service, protobuf.Enum);

        protobuf.Root._configure(protobuf.Type);

        protobuf.Field._configure(protobuf.Type); // #endregion ORIGINAL CODE


        _export("default", _cjsExports = module.exports);
      }, () => ({
        './index-minimal': _req,
        './encoder': _req0,
        './decoder': _req1,
        './verifier': _req2,
        './converter': _req3,
        './object': _req4,
        './namespace': _req5,
        './root': _req6,
        './enum': _req7,
        './type': _req8,
        './field': _req9,
        './oneof': _req10,
        './mapfield': _req11,
        './service': _req12,
        './method': _req13,
        './message': _req14,
        './wrappers': _req15,
        './types': _req16,
        './util': _req17
      }));
    }
  };
});
//# sourceMappingURL=1a50435d2f67826ea1ff10113c75e1689c091492.js.map