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
exports.TypesError = void 0;
var TypesError;
(function (TypesError) {
    TypesError.makeListener = function (path) {
        if (path === void 0) { path = ""; }
        return ({
            path: path,
            matchRate: {},
            errors: [],
        });
    };
    TypesError.nextListener = function (name, listner) {
        return listner ?
            {
                path: TypesError.makePath(listner.path, name),
                matchRate: listner.matchRate,
                errors: listner.errors,
            } :
            undefined;
    };
    TypesError.makePath = function (path, name) {
        var base = path.includes("#") ? path : "".concat(path, "#");
        var separator = base.endsWith("#") || "string" !== typeof name ? "" : ".";
        var tail = "string" === typeof name ? name : "[".concat(name, "]");
        return base + separator + tail;
    };
    TypesError.getPathDepth = function (path) {
        var valuePath = path.replace(/[^#]*#/, "#");
        return valuePath.split(/[#\.\[]/).filter(function (i) { return 0 < i.length; }).length;
    };
    TypesError.getType = function (isType) {
        var transactionListner = TypesError.makeListener();
        isType(undefined, transactionListner);
        return transactionListner.errors
            .map(function (i) { return i.requiredType.split(" | "); })
            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
            .filter(function (i, ix, list) { return ix === list.indexOf(i); });
    };
    TypesError.isMtached = function (matchRate) { return true === matchRate; };
    TypesError.matchRateToNumber = function (matchRate) {
        switch (matchRate) {
            case false:
                return 0;
            case true:
                return 1;
            default:
                return matchRate;
        }
    };
    TypesError.setMatchRate = function (listner, matchRate) {
        if (listner) {
            listner.matchRate[listner.path] = matchRate;
        }
        return TypesError.isMtached(matchRate);
    };
    TypesError.getMatchRate = function (listner, path) {
        if (path === void 0) { path = listner.path; }
        if (path in listner.matchRate) {
            return listner.matchRate[path];
        }
        return TypesError.calculateMatchRate(listner, path);
    };
    TypesError.calculateMatchRate = function (listner, path) {
        if (path === void 0) { path = listner.path; }
        var depth = TypesError.getPathDepth(path);
        var childrenKeys = Object.keys(listner.matchRate)
            .filter(function (i) { return 0 === i.indexOf(path) && TypesError.getPathDepth(i) === depth + 1; });
        var length = childrenKeys.length;
        var sum = childrenKeys
            .map(function (i) { return listner.matchRate[i]; })
            .map(function (i) { return TypesError.matchRateToNumber(i); })
            .reduce(function (a, b) { return a + b; }, 0.0);
        var result = 0 < length ? sum / length : true;
        if (true === result || 1.0 <= result) {
            console.error("🦋 FIXME: \"MatchWithErrors\": " + JSON.stringify({ sum: sum, length: length, result: result, listner: listner }));
        }
        return listner.matchRate[path] = result;
    };
    TypesError.setMatch = function (listner) {
        if (listner) {
            var paths = Object.keys(listner.matchRate)
                .filter(function (path) { return 0 === path.indexOf(listner.path); });
            if (paths.every(function (path) { return TypesError.isMtached(listner.matchRate[path]); })) {
                paths.forEach(function (path) { return delete listner.matchRate[path]; });
            }
        }
        TypesError.setMatchRate(listner, true);
    };
    TypesError.raiseError = function (listner, requiredType, actualValue) {
        TypesError.setMatchRate(listner, false);
        listner.errors.push({
            type: "solid",
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType : requiredType(),
            actualValue: TypesError.valueToString(actualValue),
        });
        return false;
    };
    TypesError.orErros = function (listner, modulus, errors, fullErrors) {
        var _a;
        var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
        (_a = listner.errors).push.apply(_a, paths.map(function (path) {
            return ({
                type: modulus <= fullErrors.filter(function (i) { return "solid" === i.type && i.path === path; }).length ?
                    "solid" :
                    "fragment",
                path: path,
                requiredType: errors
                    .filter(function (i) { return i.path === path; })
                    .map(function (i) { return i.requiredType; })
                    .map(function (i) { return i.split(" | "); })
                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                    .filter(function (i, ix, list) { return ix === list.indexOf(i); })
                    .join(" | "),
                actualValue: errors.filter(function (i) { return i.path === path; }).map(function (i) { return i.actualValue; })[0],
            });
        }));
    };
    TypesError.andErros = function (listner, modulus, errors, fullErrors) {
        var _a;
        // このコードは現状、 orErros をコピーしただけのモックです。
        var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
        (_a = listner.errors).push.apply(_a, paths.map(function (path) {
            return ({
                type: modulus <= fullErrors.filter(function (i) { return "solid" === i.type && i.path === path; }).length ?
                    "solid" :
                    "fragment",
                path: path,
                requiredType: errors
                    .filter(function (i) { return i.path === path; })
                    .map(function (i) { return i.requiredType; })
                    .map(function (i) { return i.split(" & "); })
                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                    .filter(function (i, ix, list) { return ix === list.indexOf(i); })
                    .join(" & "),
                actualValue: errors.filter(function (i) { return i.path === path; }).map(function (i) { return i.actualValue; })[0],
            });
        }));
    };
    TypesError.valueToString = function (value) {
        return undefined === value ? "undefined" : JSON.stringify(value);
    };
    TypesError.withErrorHandling = function (isMatchType, listner, requiredType, actualValue) {
        if (listner) {
            if (isMatchType) {
                TypesError.setMatch(listner);
            }
            else {
                TypesError.raiseError(listner, requiredType, actualValue);
            }
        }
        return isMatchType;
    };
})(TypesError || (exports.TypesError = TypesError = {}));
//# sourceMappingURL=types-error.js.map