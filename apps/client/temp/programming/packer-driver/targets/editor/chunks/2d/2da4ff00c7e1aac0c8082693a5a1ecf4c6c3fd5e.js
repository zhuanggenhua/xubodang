System.register(["__unresolved_0", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _cjsLoader, _req, _req0, _req1, _req2, _cjsExports, __cjsMetaURL;

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
    }],
    execute: function () {
      _export("__cjsMetaURL", __cjsMetaURL = _context.meta.url);

      _cjsLoader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        // #region ORIGINAL CODE
        "use strict";

        module.exports = Service; // extends Namespace

        var Namespace = require("./namespace");

        ((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";

        var Method = require("./method"),
            util = require("./util"),
            rpc = require("./rpc");
        /**
         * Constructs a new service instance.
         * @classdesc Reflected service.
         * @extends NamespaceBase
         * @constructor
         * @param {string} name Service name
         * @param {Object.<string,*>} [options] Service options
         * @throws {TypeError} If arguments are invalid
         */


        function Service(name, options) {
          Namespace.call(this, name, options);
          /**
           * Service methods.
           * @type {Object.<string,Method>}
           */

          this.methods = {}; // toJSON, marker

          /**
           * Cached methods as an array.
           * @type {Method[]|null}
           * @private
           */

          this._methodsArray = null;
        }
        /**
         * Service descriptor.
         * @interface IService
         * @extends INamespace
         * @property {Object.<string,IMethod>} methods Method descriptors
         */

        /**
         * Constructs a service from a service descriptor.
         * @param {string} name Service name
         * @param {IService} json Service descriptor
         * @returns {Service} Created service
         * @throws {TypeError} If arguments are invalid
         */


        Service.fromJSON = function fromJSON(name, json) {
          var service = new Service(name, json.options);
          /* istanbul ignore else */

          if (json.methods) for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i) service.add(Method.fromJSON(names[i], json.methods[names[i]]));
          if (json.nested) service.addJSON(json.nested);
          service.comment = json.comment;
          return service;
        };
        /**
         * Converts this service to a service descriptor.
         * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
         * @returns {IService} Service descriptor
         */


        Service.prototype.toJSON = function toJSON(toJSONOptions) {
          var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
          var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
          return util.toObject(["options", inherited && inherited.options || undefined, "methods", Namespace.arrayToJSON(this.methodsArray, toJSONOptions) ||
          /* istanbul ignore next */
          {}, "nested", inherited && inherited.nested || undefined, "comment", keepComments ? this.comment : undefined]);
        };
        /**
         * Methods of this service as an array for iteration.
         * @name Service#methodsArray
         * @type {Method[]}
         * @readonly
         */


        Object.defineProperty(Service.prototype, "methodsArray", {
          get: function () {
            return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
          }
        });

        function clearCache(service) {
          service._methodsArray = null;
          return service;
        }
        /**
         * @override
         */


        Service.prototype.get = function get(name) {
          return this.methods[name] || Namespace.prototype.get.call(this, name);
        };
        /**
         * @override
         */


        Service.prototype.resolveAll = function resolveAll() {
          var methods = this.methodsArray;

          for (var i = 0; i < methods.length; ++i) methods[i].resolve();

          return Namespace.prototype.resolve.call(this);
        };
        /**
         * @override
         */


        Service.prototype.add = function add(object) {
          /* istanbul ignore if */
          if (this.get(object.name)) throw Error("duplicate name '" + object.name + "' in " + this);

          if (object instanceof Method) {
            this.methods[object.name] = object;
            object.parent = this;
            return clearCache(this);
          }

          return Namespace.prototype.add.call(this, object);
        };
        /**
         * @override
         */


        Service.prototype.remove = function remove(object) {
          if (object instanceof Method) {
            /* istanbul ignore if */
            if (this.methods[object.name] !== object) throw Error(object + " is not a member of " + this);
            delete this.methods[object.name];
            object.parent = null;
            return clearCache(this);
          }

          return Namespace.prototype.remove.call(this, object);
        };
        /**
         * Creates a runtime service using the specified rpc implementation.
         * @param {RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {rpc.Service} RPC service. Useful where requests and/or responses are streamed.
         */


        Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
          var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);

          for (var i = 0, method; i <
          /* initializes */
          this.methodsArray.length; ++i) {
            var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
            rpcService[methodName] = util.codegen(["r", "c"], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
              m: method,
              q: method.resolvedRequestType.ctor,
              s: method.resolvedResponseType.ctor
            });
          }

          return rpcService;
        }; // #endregion ORIGINAL CODE


        _export("default", _cjsExports = module.exports);
      }, () => ({
        './namespace': _req,
        './method': _req0,
        './util': _req1,
        './rpc': _req2
      }));
    }
  };
});
//# sourceMappingURL=2da4ff00c7e1aac0c8082693a5a1ecf4c6c3fd5e.js.map