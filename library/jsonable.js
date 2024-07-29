"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jsonable = void 0;
var Jsonable;
(function (Jsonable) {
    Jsonable.isJsonableValue = function (value) {
        return null === value ||
            "boolean" === typeof value ||
            "number" === typeof value ||
            "string" === typeof value;
    };
    Jsonable.isJsonableArray = function (value) {
        return Array.isArray(value) &&
            !value.some(function (v) { return !Jsonable.isJsonable(v); });
    };
    Jsonable.isJsonableObject = function (value) {
        return null !== value &&
            "object" === typeof value &&
            Object.values(value).filter(function (v) { return !Jsonable.isJsonable(v); }).length <= 0;
    };
    Jsonable.isJsonable = function (value) {
        return Jsonable.isJsonableValue(value) ||
            Jsonable.isJsonableArray(value) ||
            Jsonable.isJsonableObject(value);
    };
    Jsonable.parse = function (json) { return JSON.parse(json); };
    Jsonable.stringify = function (value) { return JSON.stringify(value); };
})(Jsonable || (exports.Jsonable = Jsonable = {}));
//# sourceMappingURL=jsonable.js.map