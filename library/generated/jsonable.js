"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jsonable = void 0;
// This file is generated.
var types_prime_1 = require("../source/types-prime");
var Jsonable;
(function (Jsonable) {
    Jsonable.parse = function (json) { return JSON.parse(json); };
    Jsonable.stringify = function (value) { return JSON.stringify(value); };
    Jsonable.isJsonableValue = function (value, listner) { return types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNull, types_prime_1.TypesPrime.isBoolean, types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isString)(value, listner); };
    Jsonable.isJsonableArray = function (value, listner) { return types_prime_1.TypesPrime.isArray(Jsonable.isJsonable)(value, listner); };
    Jsonable.isJsonableObject = function (value, listner) {
        return types_prime_1.TypesPrime.isDictionaryObject(Jsonable.isJsonable)(value, listner);
    };
    Jsonable.isJsonable = function (value, listner) { return types_prime_1.TypesPrime.isOr(Jsonable.isJsonableValue, Jsonable.isJsonableArray, Jsonable.isJsonableObject)(value, listner); };
})(Jsonable || (exports.Jsonable = Jsonable = {}));
//# sourceMappingURL=jsonable.js.map