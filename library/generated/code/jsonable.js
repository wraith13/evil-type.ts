"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jsonable = void 0;
// This file is generated.
var validator_1 = require("../../source/validator");
var Jsonable;
(function (Jsonable) {
    Jsonable.parse = function (json) { return JSON.parse(json); };
    Jsonable.stringify = function (value, replacer, space) { return JSON.stringify(value, replacer, space); };
    Jsonable.isJsonableValue = function (value, listner) { return validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNull, validator_1.EvilTypeValidator.isBoolean, validator_1.EvilTypeValidator.isNumber, validator_1.EvilTypeValidator.isString)(value, listner); };
    Jsonable.isJsonableArray = function (value, listner) { return validator_1.EvilTypeValidator.isArray(Jsonable.isJsonable)(value, listner); };
    Jsonable.isJsonableObject = function (value, listner) {
        return validator_1.EvilTypeValidator.isDictionaryObject(Jsonable.isJsonable)(value, listner);
    };
    Jsonable.isJsonable = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Jsonable.isJsonableValue, Jsonable.isJsonableArray, Jsonable.isJsonableObject)(value, listner); };
})(Jsonable || (exports.Jsonable = Jsonable = {}));
//# sourceMappingURL=jsonable.js.map