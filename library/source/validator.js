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
exports.EvilTypeValidator = void 0;
var error_1 = require("./error");
var EvilTypeValidator;
(function (EvilTypeValidator) {
    EvilTypeValidator.makeErrorListener = error_1.EvilTypeError.makeListener;
    EvilTypeValidator.isJust = function (target) { return function (value, listner) {
        return error_1.EvilTypeError.withErrorHandling(target === value, listner, function () { return error_1.EvilTypeError.valueToString(target); }, value);
    }; };
    EvilTypeValidator.isUndefined = EvilTypeValidator.isJust(undefined);
    EvilTypeValidator.isNull = EvilTypeValidator.isJust(null);
    EvilTypeValidator.isBoolean = function (value, listner) {
        return error_1.EvilTypeError.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
    };
    EvilTypeValidator.isNumber = function (value, listner) {
        return error_1.EvilTypeError.withErrorHandling("number" === typeof value, listner, "number", value);
    };
    EvilTypeValidator.isString = function (value, listner) {
        return error_1.EvilTypeError.withErrorHandling("string" === typeof value, listner, "string", value);
    };
    EvilTypeValidator.isObject = function (value) {
        return null !== value && "object" === typeof value && !Array.isArray(value);
    };
    EvilTypeValidator.isEnum = function (list) { return function (value, listner) {
        return error_1.EvilTypeError.withErrorHandling(list.includes(value), listner, function () { return list.map(function (i) { return error_1.EvilTypeError.valueToString(i); }).join(" | "); }, value);
    }; };
    EvilTypeValidator.isArray = function (isType) { return function (value, listner) {
        if (Array.isArray(value)) {
            var result = value.map(function (i) { return isType(i, listner); }).every(function (i) { return i; });
            if (listner) {
                if (result) {
                    error_1.EvilTypeError.setMatch(listner);
                }
                else {
                    error_1.EvilTypeError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else {
            return undefined !== listner && error_1.EvilTypeError.raiseError(listner, "array", value);
        }
    }; };
    EvilTypeValidator.makeOrTypeNameFromIsTypeList = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return isTypeList.map(function (i) { return error_1.EvilTypeError.getType(i); })
            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
            .filter(function (i, ix, list) { return ix === list.indexOf(i); });
    };
    EvilTypeValidator.getBestMatchErrors = function (listeners) {
        return listeners.map(function (listener) {
            return ({
                listener: listener,
                matchRate: error_1.EvilTypeError.getMatchRate(listener),
            });
        })
            .sort(function (a, b) {
            if (a.matchRate < b.matchRate) {
                return 1;
            }
            else if (b.matchRate < a.matchRate) {
                return -1;
            }
            else {
                return 0;
            }
        })
            .filter(function (i, _ix, list) { return i.matchRate === list[0].matchRate; })
            .map(function (i) { return i.listener; });
    };
    EvilTypeValidator.isOr = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return function (value, listner) {
            if (listner) {
                var resultList = isTypeList.map(function (i) {
                    var transactionListner = error_1.EvilTypeError.makeListener(listner.path);
                    var result = {
                        transactionListner: transactionListner,
                        result: i(value, transactionListner),
                    };
                    return result;
                });
                var success = resultList.filter(function (i) { return i.result; })[0];
                var result = Boolean(success);
                if (result) {
                    error_1.EvilTypeError.setMatch(listner);
                    //Object.entries(success.transactionListner.matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                }
                else {
                    var requiredType = EvilTypeValidator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                    if ((EvilTypeValidator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                        var bestMatchErrors = EvilTypeValidator.getBestMatchErrors(resultList.map(function (i) { return i.transactionListner; }));
                        var errors = bestMatchErrors.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                        var fullErrors = resultList.map(function (i) { return i.transactionListner; }).map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                        error_1.EvilTypeError.orErros(listner, isTypeList.length, errors, fullErrors);
                        if (errors.length <= 0) {
                            console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                        }
                        if (0 < bestMatchErrors.length) {
                            Object.entries(bestMatchErrors[0].matchRate).forEach(function (kv) { return listner.matchRate[kv[0]] = kv[1]; });
                            //EvilTypeError.setMatchRate(listner, EvilTypeError.getMatchRate(bestMatchErrors[0]));
                        }
                    }
                    else {
                        error_1.EvilTypeError.raiseError(listner, requiredType.join(" | "), value);
                    }
                }
                return result;
            }
            else {
                return isTypeList.some(function (i) { return i(value); });
            }
        };
    };
    EvilTypeValidator.isAnd = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return function (value, listner) {
            // このコードは現状、 isOr をコピーしただけのモックです。
            if (listner) {
                var resultList = isTypeList.map(function (i) {
                    var transactionListner = error_1.EvilTypeError.makeListener(listner.path);
                    var result = {
                        transactionListner: transactionListner,
                        result: i(value, transactionListner),
                    };
                    return result;
                });
                var result = resultList.every(function (i) { return i.result; });
                if (result) {
                    error_1.EvilTypeError.setMatch(listner);
                    //Object.entries(success.transactionListner.matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                }
                else {
                    var requiredType = EvilTypeValidator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                    if ((EvilTypeValidator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                        var transactionListners = resultList.map(function (i) { return i.transactionListner; });
                        var errors = transactionListners.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                        var fullErrors = resultList.map(function (i) { return i.transactionListner; }).map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                        error_1.EvilTypeError.andErros(listner, isTypeList.length, errors, fullErrors);
                        if (errors.length <= 0) {
                            console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                        }
                        if (0 < transactionListners.length) {
                            Object.entries(transactionListners[0].matchRate).forEach(function (kv) { return listner.matchRate[kv[0]] = kv[1]; });
                            //EvilTypeError.setMatchRate(listner, EvilTypeError.getMatchRate(bestMatchErrors[0]));
                        }
                    }
                    else {
                        error_1.EvilTypeError.raiseError(listner, requiredType.join(" & "), value);
                    }
                }
                return result;
            }
            else {
                return isTypeList.some(function (i) { return i(value); });
            }
        };
    };
    EvilTypeValidator.isOptionalKeyTypeGuard = function (value, listner) {
        return EvilTypeValidator.isSpecificObject({
            $type: EvilTypeValidator.isJust("optional-type-guard"),
            isType: function (value, listner) {
                return "function" === typeof value || (undefined !== listner && error_1.EvilTypeError.raiseError(listner, "function", value));
            },
        })(value, listner);
    };
    EvilTypeValidator.makeOptionalKeyTypeGuard = function (isType) {
        return ({
            $type: "optional-type-guard",
            isType: isType,
        });
    };
    EvilTypeValidator.invokeIsType = function (isType) {
        return "function" === typeof isType ? isType : EvilTypeValidator.isSpecificObject(isType);
    };
    EvilTypeValidator.isOptional = EvilTypeValidator.makeOptionalKeyTypeGuard;
    EvilTypeValidator.isOptionalMemberType = function (value, member, optionalTypeGuard, listner) {
        var result = !(member in value) || EvilTypeValidator.invokeIsType(optionalTypeGuard.isType)(value[member], listner);
        if (!result && listner) {
            var error = listner.errors.filter(function (i) { return i.path === listner.path; })[0];
            if (error) {
                error.requiredType = "never | " + error.requiredType;
            }
            else {
                listner.errors.filter(function (i) { return 0 === i.path.indexOf(listner.path) && "fragment" !== i.type; }).forEach(function (i) { return i.type = "fragment"; });
                listner.errors.push({
                    type: "fragment",
                    path: listner.path,
                    requiredType: "never",
                    actualValue: error_1.EvilTypeError.valueToString(value[member]),
                });
            }
        }
        return result;
    };
    EvilTypeValidator.isMemberType = function (value, member, isType, listner) {
        return EvilTypeValidator.isOptionalKeyTypeGuard(isType) ?
            EvilTypeValidator.isOptionalMemberType(value, member, isType, listner) :
            EvilTypeValidator.invokeIsType(isType)(value[member], listner);
    };
    EvilTypeValidator.mergeObjectValidator = function (target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        return Object.assign.apply(Object, __spreadArray([{}, target], sources, true));
    };
    // export const mergeObjectValidator = <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) =>
    //     Object.assign(...[{ }, target, ...sources]) as ObjectValidator<unknown>;
    EvilTypeValidator.isSpecificObject = function (memberValidator) { return function (value, listner) {
        if (EvilTypeValidator.isObject(value)) {
            var result = Object.entries("function" === typeof memberValidator ? memberValidator() : memberValidator).map(function (kv) { return EvilTypeValidator.isMemberType(value, kv[0], kv[1], error_1.EvilTypeError.nextListener(kv[0], listner)); })
                .every(function (i) { return i; });
            if (listner) {
                if (result) {
                    error_1.EvilTypeError.setMatch(listner);
                }
                else {
                    error_1.EvilTypeError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else {
            return undefined !== listner && error_1.EvilTypeError.raiseError(listner, "object", value);
        }
    }; };
    EvilTypeValidator.isDictionaryObject = function (isType) { return function (value, listner) {
        if (EvilTypeValidator.isObject(value)) {
            var result = Object.entries(value).map(function (kv) { return isType(kv[1], error_1.EvilTypeError.nextListener(kv[0], listner)); }).every(function (i) { return i; });
            if (listner) {
                if (result) {
                    error_1.EvilTypeError.setMatch(listner);
                }
                else {
                    error_1.EvilTypeError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else {
            return undefined !== listner && error_1.EvilTypeError.raiseError(listner, "object", value);
        }
    }; };
    // 現状ではこのコードで生成された型のエディタ上での入力保管や型検査が機能しなくなるので使い物にならない。
    // VS Coce + TypeScript の挙動がいまよりマシになったらこれベースのコードの採用を再検討
    // https://x.com/wraith13/status/1804464507755884969
    // export type GuardType<T> = T extends (value: unknown) => value is infer U ? U : never;
    // export type BuildInterface<T extends { [key: string]: (value: unknown) => value is any}> = { -readonly [key in keyof T]: GuardType<T[key]>; };
    // export const isSpecificObjectX = <T extends { [key: string]: (value: unknown) => value is any}>(memberSpecification: { [key: string]: ((v: unknown) => boolean) }) => (value: unknown): value is BuildInterface<T> =>
    //     isObject(value) &&
    //     Object.entries(memberSpecification).every
    //     (
    //         kv => kv[0].endsWith("?") ?
    //                 isMemberTypeOrUndefined<BuildInterface<T>>(value, kv[0].slice(0, -1) as keyof BuildInterface<T>, kv[1]):
    //                 isMemberType<BuildInterface<T>>(value, kv[0] as keyof BuildInterface<T>, kv[1])
    //     );
    // export const TypeOptionsTypeSource =
    // {
    //     indentUnit: isOr(isNumber, isJust("\t" as const)),
    //     indentStyle: isIndentStyleType,
    //     validatorOption: isValidatorOptionType,
    // } as const;
    // export type GenericTypeOptions = BuildInterface<typeof TypeOptionsTypeSource>;
    // export const isGenericTypeOptions = isSpecificObjectX(TypeOptionsTypeSource);
})(EvilTypeValidator || (exports.EvilTypeValidator = EvilTypeValidator = {}));
//# sourceMappingURL=validator.js.map