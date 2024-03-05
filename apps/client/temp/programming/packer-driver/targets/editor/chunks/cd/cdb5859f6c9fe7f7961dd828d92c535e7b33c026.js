System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _req1, _cjsExports, __cjsMetaURL;

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
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        module.exports = MapField; // extends Field

        var Field = require("./field");

        ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";

        var types = require("./types"),
            util = require("./util");
        /**
         * Constructs a new map field instance.
         * @classdesc Reflected map field.
         * @extends FieldBase
         * @constructor
         * @param {string} name Unique name within its namespace
         * @param {number} id Unique id within its namespace
         * @param {string} keyType Key type
         * @param {string} type Value type
         * @param {Object.<string,*>} [options] Declared options
         * @param {string} [comment] Comment associated with this field
         */


        function MapField(name, id, keyType, type, options, comment) {
          Field.call(this, name, id, type, undefined, undefined, options, comment);
          /* istanbul ignore if */

          if (!util.isString(keyType)) throw TypeError("keyType must be a string");
          /**
           * Key type.
           * @type {string}
           */

          this.keyType = keyType; // toJSON, marker

          /**
           * Resolved key type if not a basic type.
           * @type {ReflectionObject|null}
           */

          this.resolvedKeyType = null; // Overrides Field#map

          this.map = true;
        }
        /**
         * Map field descriptor.
         * @interface IMapField
         * @extends {IField}
         * @property {string} keyType Key type
         */

        /**
         * Extension map field descriptor.
         * @interface IExtensionMapField
         * @extends IMapField
         * @property {string} extend Extended type
         */

        /**
         * Constructs a map field from a map field descriptor.
         * @param {string} name Field name
         * @param {IMapField} json Map field descriptor
         * @returns {MapField} Created map field
         * @throws {TypeError} If arguments are invalid
         */


        MapField.fromJSON = function fromJSON(name, json) {
          return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
        };
        /**
         * Converts this map field to a map field descriptor.
         * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
         * @returns {IMapField} Map field descriptor
         */


        MapField.prototype.toJSON = function toJSON(toJSONOptions) {
          var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
          return util.toObject(["keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", keepComments ? this.comment : undefined]);
        };
        /**
         * @override
         */


        MapField.prototype.resolve = function resolve() {
          if (this.resolved) return this; // Besides a value type, map fields have a key type that may be "any scalar type except for floating point types and bytes"

          if (types.mapKey[this.keyType] === undefined) throw Error("invalid key type: " + this.keyType);
          return Field.prototype.resolve.call(this);
        };
        /**
         * Map field decorator (TypeScript).
         * @name MapField.d
         * @function
         * @param {number} fieldId Field id
         * @param {"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"bool"|"string"} fieldKeyType Field key type
         * @param {"double"|"float"|"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"bool"|"string"|"bytes"|Object|Constructor<{}>} fieldValueType Field value type
         * @returns {FieldDecorator} Decorator function
         * @template T extends { [key: string]: number | Long | string | boolean | Uint8Array | Buffer | number[] | Message<{}> }
         */


        MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
          // submessage value: decorate the submessage and use its name as the type
          if (typeof fieldValueType === "function") fieldValueType = util.decorateType(fieldValueType).name; // enum reference value: create a reflected copy of the enum and keep reuseing it
          else if (fieldValueType && typeof fieldValueType === "object") fieldValueType = util.decorateEnum(fieldValueType).name;
          return function mapFieldDecorator(prototype, fieldName) {
            util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
          };
        }; // #endregion ORIGINAL CODE


        _export("default", _cjsExports = module.exports);
      }, () => ({
        './field': _req,
        './types': _req0,
        './util': _req1
      }));
    }
  };
});
//# sourceMappingURL=cdb5859f6c9fe7f7961dd828d92c535e7b33c026.js.map