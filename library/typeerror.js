"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeError = void 0;
var TypeError;
(function (TypeError) {
    TypeError.makeListener = function (path) {
        if (path === void 0) { path = ""; }
        return ({
            path: path,
            errors: [],
        });
    };
    TypeError.nextListener = function (name, listner) {
        return listner ?
            {
                path: TypeError.makePath(listner.path, name),
                errors: listner.errors,
            } :
            undefined;
    };
    TypeError.makePath = function (path, name) {
        return "string" === typeof name ?
            "".concat(path, ".").concat(name) :
            "".concat(path, "[").concat(name, "]");
    };
    TypeError.getPathDepth = function (path) {
        return path.split(".").length + path.split("[").length - 2;
    };
    TypeError.raiseError = function (listner, requiredType, actualValue) {
        listner.errors.push({
            path: listner.path,
            requiredType: requiredType,
            actualValue: TypeError.valueToString(actualValue),
        });
        return false;
    };
    TypeError.valueToString = function (value) {
        return undefined === value ? "undefined" : JSON.stringify(value);
    };
})(TypeError || (exports.TypeError = TypeError = {}));
//# sourceMappingURL=typeerror.js.map