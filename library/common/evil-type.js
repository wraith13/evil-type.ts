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
exports.EvilType = void 0;
// Original: https://github.com/wraith13/evil-type.ts/blob/master/common/evil-type.ts
// License: BSL-1.0 ( https://github.com/wraith13/evil-type.ts/blob/master/LICENSE_1_0.txt )
var EvilType;
(function (EvilType) {
    EvilType.comparer = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (a, b) {
            for (var i = 0; i < args.length; ++i) {
                var focus = args[i];
                var af = focus(a);
                var bf = focus(b);
                if (af < bf) {
                    return -1;
                }
                if (bf < af) {
                    return 1;
                }
            }
            return 0;
        };
    };
    EvilType.lazy = function (invoker) {
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return invoker().apply(void 0, args);
        });
    };
    var Error;
    (function (Error) {
        Error.makeListener = function (path) {
            if (path === void 0) { path = ""; }
            return ({
                path: path,
                matchRate: {},
                errors: [],
            });
        };
        Error.nextListener = function (name, listner) {
            return (listner ?
                {
                    path: Error.makePath(listner.path, name),
                    matchRate: listner.matchRate,
                    errors: listner.errors,
                } :
                undefined);
        };
        Error.makePath = function (path, name) {
            var base = path.includes("#") ? path : "".concat(path, "#");
            var separator = base.endsWith("#") || "string" !== typeof name ? "" : ".";
            var tail = "string" === typeof name ? name : "[".concat(name, "]");
            return base + separator + tail;
        };
        Error.getPathDepth = function (path) {
            var valuePath = path.replace(/\[(\d+)\]/g, ".$1");
            return valuePath.split(/[#\.]/).filter(function (i) { return 0 < i.length; }).length;
        };
        Error.getType = function (isType) {
            var transactionListner = Error.makeListener();
            isType(undefined, transactionListner);
            return transactionListner.errors
                .map(function (i) { return i.requiredType.split(" | "); })
                .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                .filter(function (i, ix, list) { return ix === list.indexOf(i); });
        };
        Error.isMtached = function (matchRate) { return true === matchRate; };
        Error.matchRateToNumber = function (matchRate) {
            switch (matchRate) {
                case false:
                    return 0;
                case true:
                    return 1;
                default:
                    return matchRate;
            }
        };
        Error.setMatchRate = function (listner, matchRate) {
            if (listner) {
                listner.matchRate[listner.path] = matchRate;
            }
            return Error.isMtached(matchRate);
        };
        Error.getMatchRate = function (listner, path) {
            if (path === void 0) { path = listner.path; }
            if (path in listner.matchRate) {
                return listner.matchRate[path];
            }
            return Error.calculateMatchRate(listner, path);
        };
        Error.calculateMatchRate = function (listner, path) {
            if (path === void 0) { path = listner.path; }
            var depth = Error.getPathDepth(path);
            var childrenKeys = Object.keys(listner.matchRate)
                .filter(function (i) { return 0 === i.indexOf(path) && Error.getPathDepth(i) === depth + 1; });
            var length = childrenKeys.length;
            var sum = childrenKeys
                .map(function (i) { return listner.matchRate[i]; })
                .map(function (i) { return Error.matchRateToNumber(i); })
                .reduce(function (a, b) { return a + b; }, 0.0);
            var result = 0 < length ? sum / length : true;
            if (true === result || 1.0 <= result) {
                console.error("🦋 FIXME: \"MatchWithErrors\": " + JSON.stringify({ sum: sum, length: length, result: result, listner: listner }));
            }
            return listner.matchRate[path] = result;
        };
        Error.setMatch = function (listner) {
            if (listner) {
                var paths = Object.keys(listner.matchRate)
                    .filter(function (path) { return 0 === path.indexOf(listner.path); });
                if (paths.every(function (path) { return Error.isMtached(listner.matchRate[path]); })) {
                    paths.forEach(function (path) { return delete listner.matchRate[path]; });
                }
            }
            Error.setMatchRate(listner, true);
        };
        Error.raiseError = function (listner, requiredType, actualValue) {
            if (listner) {
                Error.setMatchRate(listner, false);
                listner.errors.push({
                    type: "solid",
                    path: listner.path,
                    requiredType: "string" === typeof requiredType ? requiredType : requiredType(),
                    actualValue: Error.valueToString(actualValue),
                });
            }
            return false;
        };
        Error.orErros = function (listner, modulus, errors, fullErrors) {
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
        Error.andErros = function (listner, errors) {
            var _a;
            var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
            (_a = listner.errors).push.apply(_a, paths.map(function (path) {
                return ({
                    type: errors.some(function (i) { return "solid" === i.type && i.path === path; }) ?
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
        Error.valueToString = function (value) {
            return undefined === value ? "undefined" : JSON.stringify(value);
        };
        Error.withErrorHandling = function (isMatchType, listner, requiredType, actualValue) {
            if (listner) {
                if (isMatchType) {
                    Error.setMatch(listner);
                }
                else {
                    Error.raiseError(listner, requiredType, actualValue);
                }
            }
            return isMatchType;
        };
    })(Error = EvilType.Error || (EvilType.Error = {}));
    var Validator;
    (function (Validator) {
        Validator.makeErrorListener = Error.makeListener;
        Validator.isJust = function (target) { return null !== target && "object" === typeof target ?
            function (value, listner) {
                return Error.withErrorHandling(JSON.stringify(target) === JSON.stringify(value), listner, function () { return Error.valueToString(target); }, value);
            } :
            function (value, listner) {
                return Error.withErrorHandling(target === value, listner, function () { return Error.valueToString(target); }, value);
            }; };
        Validator.isNever = function (value, listner) {
            return Error.withErrorHandling(false, listner, "never", value);
        };
        Validator.isUndefined = Validator.isJust(undefined);
        Validator.isUnknown = function (_value, _listner) { return true; };
        Validator.isAny = function (_value, _listner) { return true; };
        Validator.isNull = Validator.isJust(null);
        Validator.isBoolean = function (value, listner) {
            return Error.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
        };
        Validator.isInteger = function (value, listner) {
            return Error.withErrorHandling(Number.isInteger(value), listner, "integer", value);
        };
        Validator.isSafeInteger = function (value, listner) {
            return Error.withErrorHandling(Number.isSafeInteger(value), listner, "safe-integer", value);
        };
        Validator.isDetailedInteger = function (data, safeInteger) {
            var base = "safe" === safeInteger ? Validator.isSafeInteger : Validator.isInteger;
            if ([data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf].every(function (i) { return undefined === i; })) {
                return base;
            }
            else {
                var result = function (value, listner) { return Error.withErrorHandling(base(value) &&
                    (undefined === data.minimum || data.minimum <= value) &&
                    (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                    (undefined === data.maximum || value <= data.maximum) &&
                    (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                    (undefined === data.multipleOf || 0 === value % data.multipleOf), listner, function () {
                    var details = [];
                    if (undefined !== data.minimum) {
                        details.push("minimum:".concat(data.minimum));
                    }
                    if (undefined !== data.exclusiveMinimum) {
                        details.push("exclusiveMinimum:".concat(data.exclusiveMinimum));
                    }
                    if (undefined !== data.maximum) {
                        details.push("maximum:".concat(data.maximum));
                    }
                    if (undefined !== data.exclusiveMaximum) {
                        details.push("exclusiveMaximum:".concat(data.exclusiveMaximum));
                    }
                    if (undefined !== data.multipleOf) {
                        details.push("multipleOf:".concat(data.multipleOf));
                    }
                    return "".concat("safe" === safeInteger ? "safe-integer" : "integer", "(").concat(details.join(","), ")");
                }, value); };
                return result;
            }
        };
        Validator.isNumber = function (value, listner) {
            return Error.withErrorHandling("number" === typeof value, listner, "number", value);
        };
        Validator.isSafeNumber = function (value, listner) {
            return Error.withErrorHandling(Number.isFinite(value), listner, "safe-number", value);
        };
        Validator.isDetailedNumber = function (data, safeNumber) {
            var base = "safe" === safeNumber ? Validator.isSafeNumber : Validator.isNumber;
            if ([data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf].every(function (i) { return undefined === i; })) {
                return base;
            }
            else {
                var result = function (value, listner) { return Error.withErrorHandling(base(value) &&
                    (undefined === data.minimum || data.minimum <= value) &&
                    (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                    (undefined === data.maximum || value <= data.maximum) &&
                    (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                    (undefined === data.multipleOf || 0 === value % data.multipleOf), listner, function () {
                    var details = [];
                    if (undefined !== data.minimum) {
                        details.push("minimum:".concat(data.minimum));
                    }
                    if (undefined !== data.exclusiveMinimum) {
                        details.push("exclusiveMinimum:".concat(data.exclusiveMinimum));
                    }
                    if (undefined !== data.maximum) {
                        details.push("maximum:".concat(data.maximum));
                    }
                    if (undefined !== data.exclusiveMaximum) {
                        details.push("exclusiveMaximum:".concat(data.exclusiveMaximum));
                    }
                    if (undefined !== data.multipleOf) {
                        details.push("multipleOf:".concat(data.multipleOf));
                    }
                    return "".concat("safe" === safeNumber ? "safe-number" : "number", "(").concat(details.join(","), ")");
                }, value); };
                return result;
            }
        };
        Validator.isString = function (value, listner) {
            return Error.withErrorHandling("string" === typeof value, listner, "string", value);
        };
        Validator.makeStringTypeName = function (data) {
            var details = [];
            if (undefined !== data.minLength) {
                details.push("minLength:".concat(data.minLength));
            }
            if (undefined !== data.maxLength) {
                details.push("maxLength:".concat(data.maxLength));
            }
            if (undefined !== data.format) {
                details.push("format:".concat(data.format));
            }
            else if (undefined !== data.pattern) {
                details.push("pattern:".concat(data.pattern));
            }
            if (undefined !== data.regexpFlags) {
                details.push("regexpFlags:".concat(data.regexpFlags));
            }
            return "string(".concat(details.join(","), ")");
        };
        Validator.regexpTest = function (pattern, flags, text) {
            switch (pattern) {
                case "^[[:regex:]]$":
                    try {
                        new RegExp(text, flags);
                        return true;
                    }
                    catch (_a) {
                        return false;
                    }
                default:
                    return new RegExp(pattern, flags).test(text);
            }
        };
        Validator.isDetailedString = function (data, regexpFlags) {
            if ([data.minLength, data.maxLength, data.pattern, data.format].every(function (i) { return undefined === i; })) {
                return Validator.isString;
            }
            var pattern = data.pattern;
            var result = function (value, listner) {
                var _a, _b, _c;
                return Error.withErrorHandling("string" === typeof value &&
                    (undefined === data.minLength || data.minLength <= value.length) &&
                    (undefined === data.maxLength || value.length <= data.maxLength) &&
                    (undefined === pattern || ((_a = data.regexpTest) !== null && _a !== void 0 ? _a : Validator.regexpTest)(pattern, (_c = (_b = data.regexpFlags) !== null && _b !== void 0 ? _b : regexpFlags) !== null && _c !== void 0 ? _c : "u", value)), listner, function () { return Validator.makeStringTypeName(data); }, value);
            };
            return result;
        };
        Validator.isObject = function (value) {
            return null !== value && "object" === typeof value && !Array.isArray(value);
        };
        Validator.isEnum = function (list) {
            return function (value, listner) {
                return Error.withErrorHandling(list.includes(value), listner, function () { return list.map(function (i) { return Error.valueToString(i); }).join(" | "); }, value);
            };
        };
        Validator.isUniqueItems = function (list) {
            return list.map(function (i) { return JSON.stringify(i); }).every(function (i, ix, list) { return ix === list.indexOf(i); });
        };
        Validator.makeArrayTypeName = function (data) {
            var details = [];
            if (undefined !== (data === null || data === void 0 ? void 0 : data.minItems)) {
                details.push("minItems:".concat(data.minItems));
            }
            if (undefined !== (data === null || data === void 0 ? void 0 : data.maxItems)) {
                details.push("maxItems:".concat(data.maxItems));
            }
            if (true === (data === null || data === void 0 ? void 0 : data.uniqueItems)) {
                details.push("uniqueItems:".concat(data.uniqueItems));
            }
            return details.length <= 0 ? "array" : "array(".concat(details.join(","), ")");
        };
        Validator.isArray = function (isType, data) {
            return function (value, listner) {
                if (Array.isArray(value) &&
                    (undefined === (data === null || data === void 0 ? void 0 : data.minItems) || data.minItems <= value.length) &&
                    (undefined === (data === null || data === void 0 ? void 0 : data.maxItems) || value.length <= data.maxItems) &&
                    (true !== (data === null || data === void 0 ? void 0 : data.uniqueItems) || Validator.isUniqueItems(value))) {
                    var result = value.map(function (i) { return isType(i, listner); }).every(function (i) { return i; });
                    if (listner) {
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            Error.calculateMatchRate(listner);
                        }
                    }
                    return result;
                }
                else {
                    return undefined !== listner && Error.raiseError(listner, function () { return Validator.makeArrayTypeName(data); }, value);
                }
            };
        };
        Validator.makeOrTypeNameFromIsTypeList = function () {
            var isTypeList = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                isTypeList[_i] = arguments[_i];
            }
            return isTypeList.map(function (i) { return Error.getType(i); })
                .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                .filter(function (i, ix, list) { return ix === list.indexOf(i); });
        };
        Validator.getBestMatchErrors = function (listeners) {
            return listeners.map(function (listener) {
                return ({
                    listener: listener,
                    matchRate: Error.getMatchRate(listener),
                });
            })
                .sort(EvilType.comparer(function (i) { return -Error.matchRateToNumber(i.matchRate); }))
                .filter(function (i, _ix, list) { return i.matchRate === list[0].matchRate; })
                .map(function (i) { return i.listener; });
        };
        Validator.isOr = function () {
            var isTypeList = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                isTypeList[_i] = arguments[_i];
            }
            return function (value, listner) {
                if (listner) {
                    var resultList = isTypeList.map(function (i) {
                        var transactionListner = Error.makeListener(listner.path);
                        var result = {
                            transactionListner: transactionListner,
                            result: i(value, transactionListner),
                        };
                        return result;
                    });
                    var success = resultList.filter(function (i) { return i.result; })[0];
                    var result = Boolean(success);
                    if (result) {
                        Error.setMatch(listner);
                    }
                    else {
                        var requiredType = Validator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                        if ((Validator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                            var bestMatchErrors = Validator.getBestMatchErrors(resultList.map(function (i) { return i.transactionListner; }));
                            var errors = bestMatchErrors.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                            var fullErrors = resultList.map(function (i) { return i.transactionListner; }).map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                            Error.orErros(listner, isTypeList.length, errors, fullErrors);
                            if (errors.length <= 0) {
                                console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                            }
                            if (0 < bestMatchErrors.length) {
                                Object.entries(bestMatchErrors[0].matchRate).forEach(function (kv) { return listner.matchRate[kv[0]] = kv[1]; });
                            }
                        }
                        else {
                            Error.raiseError(listner, requiredType.join(" | "), value);
                        }
                    }
                    return result;
                }
                else {
                    return isTypeList.some(function (i) { return i(value); });
                }
            };
        };
        Validator.isAnd = function () {
            var isTypeList = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                isTypeList[_i] = arguments[_i];
            }
            return function (value, listner) {
                if (listner) {
                    var resultList = isTypeList.map(function (i) {
                        var transactionListner = Error.makeListener(listner.path);
                        var result = {
                            transactionListner: transactionListner,
                            result: i(value, transactionListner),
                        };
                        return result;
                    });
                    var result = resultList.every(function (i) { return i.result; });
                    if (result) {
                        Error.setMatch(listner);
                    }
                    else {
                        var requiredType = Validator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                        if ((Validator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                            var transactionListners_1 = resultList.map(function (i) { return i.transactionListner; });
                            var errors = transactionListners_1.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                            Error.andErros(listner, errors);
                            if (errors.length <= 0) {
                                console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                            }
                            if (0 < transactionListners_1.length) {
                                var paths = transactionListners_1
                                    .map(function (i) { return Object.keys(i.matchRate); })
                                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                                    .filter(function (i, ix, list) { return ix === list.indexOf(i); });
                                paths.forEach(function (path) {
                                    var matchRates = transactionListners_1.map(function (i) { return i.matchRate[path]; })
                                        .filter(function (i) { return undefined !== i; });
                                    if (matchRates.every(function (i) { return true === i; })) {
                                        listner.matchRate[path] = true;
                                    }
                                    else {
                                        listner.matchRate[path] = matchRates
                                            .map(function (i) { return Error.matchRateToNumber(i); })
                                            .reduce(function (a, b) { return a + b; }, 0)
                                            / matchRates.length;
                                    }
                                });
                            }
                        }
                        else {
                            Error.raiseError(listner, requiredType.join(" & "), value);
                        }
                    }
                    return result;
                }
                else {
                    return isTypeList.some(function (i) { return i(value); });
                }
            };
        };
        Validator.isNeverTypeGuard = function (value, listner) {
            return Validator.isSpecificObject({
                $type: Validator.isJust("never-type-guard"),
            })(value, listner);
        };
        Validator.isNeverMemberType = function (value, member, _neverTypeGuard, listner) {
            return !(member in value) || Validator.isNever(value[member], listner);
        };
        Validator.isOptionalTypeGuard = function (value, listner) {
            return Validator.isSpecificObject({
                $type: Validator.isJust("optional-type-guard"),
                isType: function (value, listner) {
                    return "function" === typeof value || (null !== value && "object" === typeof value) || (undefined !== listner && Error.raiseError(listner, "IsType<unknown> | ObjectValidator<unknown>", value));
                },
            })(value, listner);
        };
        Validator.makeOptionalTypeGuard = function (isType) {
            return ({
                $type: "optional-type-guard",
                isType: isType,
            });
        };
        Validator.invokeIsType = function (isType) {
            return "function" === typeof isType ? isType : Validator.isSpecificObject(isType);
        };
        Validator.isOptional = Validator.makeOptionalTypeGuard;
        Validator.isOptionalMemberType = function (value, member, optionalTypeGuard, listner) {
            var result = !(member in value) || Validator.invokeIsType(optionalTypeGuard.isType)(value[member], listner);
            if (!result && listner) {
                var error = listner.errors.filter(function (i) { return i.path === listner.path; })[0];
                if (error) {
                    error.requiredType = "never | " + error.requiredType;
                }
                else {
                    // Not wrong, but noisy!
                    // listner.errors.filter(i => 0 === i.path.indexOf(listner.path) && "fragment" !== i.type).forEach(i => i.type = "fragment");
                    // listner.errors.push
                    // ({
                    //     type: "fragment",
                    //     path: listner.path,
                    //     requiredType: "never",
                    //     actualValue: Error.valueToString((value as ObjectType)[member]),
                    // });
                }
            }
            return result;
        };
        Validator.isMemberType = function (value, member, isType, listner) {
            return Validator.isNeverTypeGuard(isType) ?
                Validator.isNeverMemberType(value, member, isType, listner) :
                Validator.isOptionalTypeGuard(isType) ?
                    Validator.isOptionalMemberType(value, member, isType, listner) :
                    Validator.invokeIsType(isType)(value[member], listner);
        };
        Validator.mergeObjectValidator = function (target) {
            var sources = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
            }
            return Object.assign.apply(Object, __spreadArray([{}, target], sources, true));
        };
        Validator.isSpecificObject = function (memberValidator, options) {
            return function (value, listner) {
                if (Validator.isObject(value)) {
                    var result = Object.entries("function" === typeof memberValidator ? memberValidator() : memberValidator).map(function (kv) { return Validator.isMemberType(value, kv[0], kv[1], Error.nextListener(kv[0], listner)); })
                        .every(function (i) { return i; });
                    if (false === (options === null || options === void 0 ? void 0 : options.additionalProperties)) {
                        var regularKeys_1 = Object.keys(memberValidator);
                        var additionalKeys = Object.keys(value)
                            .filter(function (key) { return !regularKeys_1.includes(key); });
                        if (additionalKeys.some(function (_) { return true; })) {
                            additionalKeys.map(function (key) { return Error.raiseError(Error.nextListener(key, listner), "never", value[key]); });
                            result = false;
                        }
                    }
                    if (listner) {
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            Error.calculateMatchRate(listner);
                        }
                    }
                    return result;
                }
                else {
                    return undefined !== listner && Error.raiseError(listner, "object", value);
                }
            };
        };
        Validator.isDictionaryObject = function (isType, keys, options) {
            return function (value, listner) {
                if (Validator.isObject(value)) {
                    var result = undefined === keys ?
                        Object.entries(value).map(function (kv) { return isType(kv[1], Error.nextListener(kv[0], listner)); }).every(function (i) { return i; }) :
                        keys.map(function (key) { return isType(value, Error.nextListener(key, listner)); }).every(function (i) { return i; });
                    if (undefined !== keys && false === (options === null || options === void 0 ? void 0 : options.additionalProperties)) {
                        var additionalKeys = Object.keys(value)
                            .filter(function (key) { return !keys.includes(key); });
                        if (additionalKeys.some(function (_) { return true; })) {
                            additionalKeys.map(function (key) { return Error.raiseError(Error.nextListener(key, listner), "never", value[key]); });
                            result = false;
                        }
                    }
                    if (listner) {
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            Error.calculateMatchRate(listner);
                        }
                    }
                    return result;
                }
                else {
                    return undefined !== listner && Error.raiseError(listner, "object", value);
                }
            };
        };
    })(Validator = EvilType.Validator || (EvilType.Validator = {}));
})(EvilType || (exports.EvilType = EvilType = {}));
//# sourceMappingURL=evil-type.js.map