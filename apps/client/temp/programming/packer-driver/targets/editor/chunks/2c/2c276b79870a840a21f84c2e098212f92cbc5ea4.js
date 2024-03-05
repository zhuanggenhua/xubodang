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

        module.exports = encoder;

        var Enum = require("./enum"),
            types = require("./types"),
            util = require("./util");
        /**
         * Generates a partial message type encoder.
         * @param {Codegen} gen Codegen instance
         * @param {Field} field Reflected field
         * @param {number} fieldIndex Field index
         * @param {string} ref Variable reference
         * @returns {Codegen} Codegen instance
         * @ignore
         */


        function genTypePartial(gen, field, fieldIndex, ref) {
          return field.resolvedType.group ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
        }
        /**
         * Generates an encoder specific to the specified message type.
         * @param {Type} mtype Message type
         * @returns {Codegen} Codegen instance
         */


        function encoder(mtype) {
          /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
          var gen = util.codegen(["m", "w"], mtype.name + "$encode")("if(!w)")("w=Writer.create()");
          var i, ref; // "when a message is serialized its known fields should be written sequentially by field number"

          var fields =
          /* initializes */
          mtype.fieldsArray.slice().sort(util.compareFieldsById);

          for (var i = 0; i < fields.length; ++i) {
            var field = fields[i].resolve(),
                index = mtype._fieldsArray.indexOf(field),
                type = field.resolvedType instanceof Enum ? "int32" : field.type,
                wireType = types.basic[type];

            ref = "m" + util.safeProp(field.name); // Map fields

            if (field.map) {
              gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name) // !== undefined && !== null
              ("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
              if (wireType === undefined) gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref); // can't be groups
              else gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
              gen("}")("}"); // Repeated fields
            } else if (field.repeated) {
              gen("if(%s!=null&&%s.length){", ref, ref); // !== undefined && !== null
              // Packed repeated

              if (field.packed && types.packed[type] !== undefined) {
                gen("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type, ref)("w.ldelim()"); // Non-packed
              } else {
                gen("for(var i=0;i<%s.length;++i)", ref);
                if (wireType === undefined) genTypePartial(gen, field, index, ref + "[i]");else gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
              }

              gen("}"); // Non-repeated
            } else {
              if (field.optional) gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name); // !== undefined && !== null

              if (wireType === undefined) genTypePartial(gen, field, index, ref);else gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
            }
          }

          return gen("return w");
          /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
        } // #endregion ORIGINAL CODE


        _export("default", _cjsExports = module.exports);
      }, () => ({
        './enum': _req,
        './types': _req0,
        './util': _req1
      }));
    }
  };
});
//# sourceMappingURL=2c276b79870a840a21f84c2e098212f92cbc5ea4.js.map