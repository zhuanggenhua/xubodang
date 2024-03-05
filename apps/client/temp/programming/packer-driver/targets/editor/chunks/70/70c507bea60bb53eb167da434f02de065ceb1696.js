System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2", "@protobufjs/codegen", "@protobufjs/fetch", "@protobufjs/path", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _req1, _req2, _req3, _req4, _req5, _req6, _cjsExports, __cjsMetaURL;

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _cjsLoader = _unresolved_.default;
    }, function (_unresolved_2) {
      _req = _unresolved_2.__cjsMetaURL;
    }, function (_unresolved_3) {
      _req0 = _unresolved_3.__cjsMetaURL;
    }, function (_protobufjsCodegen) {
      _req1 = _protobufjsCodegen.__cjsMetaURL;
    }, function (_protobufjsFetch) {
      _req2 = _protobufjsFetch.__cjsMetaURL;
    }, function (_protobufjsPath) {
      _req3 = _protobufjsPath.__cjsMetaURL;
    }, function (_unresolved_4) {
      _req4 = _unresolved_4.__cjsMetaURL;
    }, function (_unresolved_5) {
      _req5 = _unresolved_5.__cjsMetaURL;
    }, function (_unresolved_6) {
      _req6 = _unresolved_6.__cjsMetaURL;
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";
        /**
         * Various utility functions.
         * @namespace
         */

        var util = module.exports = require("./util/minimal");

        var roots = require("./roots");

        var Type, // cyclic
        Enum;
        util.codegen = require("@protobufjs/codegen");
        util.fetch = require("@protobufjs/fetch");
        util.path = require("@protobufjs/path");
        /**
         * Node's fs module if available.
         * @type {Object.<string,*>}
         */

        util.fs = util.inquire("fs");
        /**
         * Converts an object's values to an array.
         * @param {Object.<string,*>} object Object to convert
         * @returns {Array.<*>} Converted array
         */

        util.toArray = function toArray(object) {
          if (object) {
            var keys = Object.keys(object),
                array = new Array(keys.length),
                index = 0;

            while (index < keys.length) array[index] = object[keys[index++]];

            return array;
          }

          return [];
        };
        /**
         * Converts an array of keys immediately followed by their respective value to an object, omitting undefined values.
         * @param {Array.<*>} array Array to convert
         * @returns {Object.<string,*>} Converted object
         */


        util.toObject = function toObject(array) {
          var object = {},
              index = 0;

          while (index < array.length) {
            var key = array[index++],
                val = array[index++];
            if (val !== undefined) object[key] = val;
          }

          return object;
        };

        var safePropBackslashRe = /\\/g,
            safePropQuoteRe = /"/g;
        /**
         * Tests whether the specified name is a reserved word in JS.
         * @param {string} name Name to test
         * @returns {boolean} `true` if reserved, otherwise `false`
         */

        util.isReserved = function isReserved(name) {
          return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
        };
        /**
         * Returns a safe property accessor for the specified property name.
         * @param {string} prop Property name
         * @returns {string} Safe accessor
         */


        util.safeProp = function safeProp(prop) {
          if (!/^[$\w_]+$/.test(prop) || util.isReserved(prop)) return "[\"" + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, "\\\"") + "\"]";
          return "." + prop;
        };
        /**
         * Converts the first character of a string to upper case.
         * @param {string} str String to convert
         * @returns {string} Converted string
         */


        util.ucFirst = function ucFirst(str) {
          return str.charAt(0).toUpperCase() + str.substring(1);
        };

        var camelCaseRe = /_([a-z])/g;
        /**
         * Converts a string to camel case.
         * @param {string} str String to convert
         * @returns {string} Converted string
         */

        util.camelCase = function camelCase(str) {
          return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function ($0, $1) {
            return $1.toUpperCase();
          });
        };
        /**
         * Compares reflected fields by id.
         * @param {Field} a First field
         * @param {Field} b Second field
         * @returns {number} Comparison value
         */


        util.compareFieldsById = function compareFieldsById(a, b) {
          return a.id - b.id;
        };
        /**
         * Decorator helper for types (TypeScript).
         * @param {Constructor<T>} ctor Constructor function
         * @param {string} [typeName] Type name, defaults to the constructor's name
         * @returns {Type} Reflected type
         * @template T extends Message<T>
         * @property {Root} root Decorators root
         */


        util.decorateType = function decorateType(ctor, typeName) {
          /* istanbul ignore if */
          if (ctor.$type) {
            if (typeName && ctor.$type.name !== typeName) {
              util.decorateRoot.remove(ctor.$type);
              ctor.$type.name = typeName;
              util.decorateRoot.add(ctor.$type);
            }

            return ctor.$type;
          }
          /* istanbul ignore next */


          if (!Type) Type = require("./type");
          var type = new Type(typeName || ctor.name);
          util.decorateRoot.add(type);
          type.ctor = ctor; // sets up .encode, .decode etc.

          Object.defineProperty(ctor, "$type", {
            value: type,
            enumerable: false
          });
          Object.defineProperty(ctor.prototype, "$type", {
            value: type,
            enumerable: false
          });
          return type;
        };

        var decorateEnumIndex = 0;
        /**
         * Decorator helper for enums (TypeScript).
         * @param {Object} object Enum object
         * @returns {Enum} Reflected enum
         */

        util.decorateEnum = function decorateEnum(object) {
          /* istanbul ignore if */
          if (object.$type) return object.$type;
          /* istanbul ignore next */

          if (!Enum) Enum = require("./enum");
          var enm = new Enum("Enum" + decorateEnumIndex++, object);
          util.decorateRoot.add(enm);
          Object.defineProperty(object, "$type", {
            value: enm,
            enumerable: false
          });
          return enm;
        };
        /**
         * Sets the value of a property by property path. If a value already exists, it is turned to an array
         * @param {Object.<string,*>} dst Destination object
         * @param {string} path dot '.' delimited path of the property to set
         * @param {Object} value the value to set
         * @returns {Object.<string,*>} Destination object
         */


        util.setProperty = function setProperty(dst, path, value) {
          function setProp(dst, path, value) {
            var part = path.shift();

            if (part === "__proto__" || part === "prototype") {
              return dst;
            }

            if (path.length > 0) {
              dst[part] = setProp(dst[part] || {}, path, value);
            } else {
              var prevValue = dst[part];
              if (prevValue) value = [].concat(prevValue).concat(value);
              dst[part] = value;
            }

            return dst;
          }

          if (typeof dst !== "object") throw TypeError("dst must be an object");
          if (!path) throw TypeError("path must be specified");
          path = path.split(".");
          return setProp(dst, path, value);
        };
        /**
         * Decorator root (TypeScript).
         * @name util.decorateRoot
         * @type {Root}
         * @readonly
         */


        Object.defineProperty(util, "decorateRoot", {
          get: function () {
            return roots["decorated"] || (roots["decorated"] = new (require("./root"))());
          }
        }); // #endregion ORIGINAL CODE

        _export("default", _cjsExports = module.exports);
      }, () => ({
        './util/minimal': _req,
        './roots': _req0,
        '@protobufjs/codegen': _req1,
        '@protobufjs/fetch': _req2,
        '@protobufjs/path': _req3,
        './type': _req4,
        './enum': _req5,
        './root': _req6
      }));
    }
  };
});
//# sourceMappingURL=70c507bea60bb53eb167da434f02de065ceb1696.js.map