"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jsonable = void 0;
// This file is generated.
var evil_type_1 = require("../../common/evil-type");
var Jsonable;
(function (Jsonable) {
    Jsonable.parse = function (json) { return JSON.parse(json); };
    Jsonable.stringify = function (value, replacer, space) { return JSON.stringify(value, replacer, space); };
    Jsonable.isJsonableValue = evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isBoolean, evil_type_1.EvilType.Validator.isNumber, evil_type_1.EvilType.Validator.isString);
    Jsonable.isJsonableArray = function (value, listner) {
        return evil_type_1.EvilType.Validator.isArray(Jsonable.isJsonable)(value, listner);
    };
    Jsonable.isJsonableObject = function (value, listner) {
        return evil_type_1.EvilType.Validator.isDictionaryObject(Jsonable.isJsonable)(value, listner);
    };
    Jsonable.isJsonable = function (value, listner) { return evil_type_1.EvilType.Validator.isOr(Jsonable.isJsonableValue, Jsonable.isJsonableArray, Jsonable.isJsonableObject)(value, listner); };
})(Jsonable || (exports.Jsonable = Jsonable = {}));
//# sourceMappingURL=jsonable.js.map