"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    TypeError.getType = function (isType) {
        var transactionListner = TypeError.makeListener();
        isType(undefined, transactionListner);
        return transactionListner.errors
            .map(function (i) { return i.requiredType.split(" | "); })
            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
            .filter(function (i, ix, list) { return ix === list.indexOf(i); });
    };
    TypeError.raiseError = function (listner, requiredType, actualValue) {
        listner.errors.push({
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType : TypeError.getType(requiredType).join(" | "),
            actualValue: TypeError.valueToString(actualValue),
        });
        return false;
    };
    TypeError.valueToString = function (value) {
        return undefined === value ? "undefined" : JSON.stringify(value);
    };
})(TypeError || (exports.TypeError = TypeError = {}));
//# sourceMappingURL=typeerror.js.map