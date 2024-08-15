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
            matchRate: {},
            errors: [],
        });
    };
    TypeError.nextListener = function (name, listner) {
        return listner ?
            {
                path: TypeError.makePath(listner.path, name),
                matchRate: listner.matchRate,
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
    TypeError.setMatchRate = function (listner, matchRate) {
        if (listner) {
            listner.matchRate[listner.path] = matchRate;
        }
        return 1.0 <= matchRate;
    };
    TypeError.getMatchRate = function (listner, path) {
        if (path === void 0) { path = listner.path; }
        if (path in listner.matchRate) {
            return listner.matchRate[path];
        }
        return TypeError.calculateMatchRate(listner, path);
    };
    TypeError.calculateMatchRate = function (listner, path) {
        if (path === void 0) { path = listner.path; }
        var depth = TypeError.getPathDepth(path);
        var childrenKeys = Object.keys(listner.matchRate).filter(function (i) { return 0 === i.indexOf(path) && TypeError.getPathDepth(i) === depth + 1; });
        var length = childrenKeys.length;
        var sum = childrenKeys.map(function (i) { return listner.matchRate[i]; }).reduce(function (a, b) { return a + b; }, 0.0);
        var result = 0 < length ? sum / length : 1.0;
        if (1.0 <= result) {
            console.error("🦋 FIXME: \"MatchWithErrors\": " + JSON.stringify({ sum: sum, length: length, result: result, listner: listner }));
        }
        return listner.matchRate[path] = result;
    };
    TypeError.setMatch = function (listner) { return TypeError.setMatchRate(listner, 1.0); };
    TypeError.raiseError = function (listner, requiredType, actualValue) {
        TypeError.setMatchRate(listner, 0.0);
        listner.errors.push({
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType : requiredType(),
            actualValue: TypeError.valueToString(actualValue),
        });
        return false;
    };
    TypeError.valueToString = function (value) {
        return undefined === value ? "undefined" : JSON.stringify(value);
    };
    TypeError.withErrorHandling = function (isMatchType, listner, requiredType, actualValue) {
        if (listner) {
            if (isMatchType) {
                TypeError.setMatch(listner);
            }
            else {
                TypeError.raiseError(listner, requiredType, actualValue);
            }
        }
        return isMatchType;
    };
})(TypeError || (exports.TypeError = TypeError = {}));
//# sourceMappingURL=typeerror.js.map