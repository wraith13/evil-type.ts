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
exports.TypesPrime = void 0;
var jsonable_1 = require("./jsonable");
var types_error_1 = require("./types-error");
var TypesPrime;
(function (TypesPrime) {
    TypesPrime.isJust = function (target) { return function (value, listner) {
        return types_error_1.TypesError.withErrorHandling(target === value, listner, function () { return types_error_1.TypesError.valueToString(target); }, value);
    }; };
    TypesPrime.isUndefined = TypesPrime.isJust(undefined);
    TypesPrime.isNull = TypesPrime.isJust(null);
    TypesPrime.isBoolean = function (value, listner) {
        return types_error_1.TypesError.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
    };
    TypesPrime.isNumber = function (value, listner) {
        return types_error_1.TypesError.withErrorHandling("number" === typeof value, listner, "number", value);
    };
    TypesPrime.isString = function (value, listner) {
        return types_error_1.TypesError.withErrorHandling("string" === typeof value, listner, "string", value);
    };
    TypesPrime.isObject = function (value) {
        return null !== value && "object" === typeof value && !Array.isArray(value);
    };
    TypesPrime.isEnum = function (list) { return function (value, listner) {
        return types_error_1.TypesError.withErrorHandling(list.includes(value), listner, function () { return list.map(function (i) { return types_error_1.TypesError.valueToString(i); }).join(" | "); }, value);
    }; };
    TypesPrime.isArray = function (isType) { return function (value, listner) {
        if (Array.isArray(value)) {
            var result = value.map(function (i) { return isType(i, listner); }).every(function (i) { return i; });
            if (listner) {
                if (result) {
                    types_error_1.TypesError.setMatch(listner);
                }
                else {
                    types_error_1.TypesError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else {
            return undefined !== listner && types_error_1.TypesError.raiseError(listner, "array", value);
        }
    }; };
    TypesPrime.isJsonable = function (value, listner) {
        return types_error_1.TypesError.withErrorHandling(jsonable_1.Jsonable.isJsonable(value), listner, "jsonable", value);
    };
    TypesPrime.makeOrTypeNameFromIsTypeList = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return isTypeList.map(function (i) { return types_error_1.TypesError.getType(i); })
            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
            .filter(function (i, ix, list) { return ix === list.indexOf(i); });
    };
    TypesPrime.getBestMatchErrors = function (listeners) {
        return listeners.map(function (listener) {
            return ({
                listener: listener,
                matchRate: types_error_1.TypesError.getMatchRate(listener),
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
    TypesPrime.isOr = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return function (value, listner) {
            if (listner) {
                var resultList = isTypeList.map(function (i) {
                    var transactionListner = types_error_1.TypesError.makeListener(listner.path);
                    var result = {
                        transactionListner: transactionListner,
                        result: i(value, transactionListner),
                    };
                    return result;
                });
                var success = resultList.filter(function (i) { return i.result; })[0];
                var result = Boolean(success);
                if (result) {
                    types_error_1.TypesError.setMatch(listner);
                    //Object.entries(success.transactionListner.matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                }
                else {
                    var requiredType = TypesPrime.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                    if ((TypesPrime.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                        var bestMatchErrors = TypesPrime.getBestMatchErrors(resultList.map(function (i) { return i.transactionListner; }));
                        var errors = bestMatchErrors.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                        var fullErrors = resultList.map(function (i) { return i.transactionListner; }).map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                        types_error_1.TypesError.aggregateErros(listner, isTypeList.length, errors, fullErrors);
                        if (errors.length <= 0) {
                            console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                        }
                        if (0 < bestMatchErrors.length) {
                            Object.entries(bestMatchErrors[0].matchRate).forEach(function (kv) { return listner.matchRate[kv[0]] = kv[1]; });
                            //TypeError.setMatchRate(listner, TypeError.getMatchRate(bestMatchErrors[0]));
                        }
                    }
                    else {
                        types_error_1.TypesError.raiseError(listner, requiredType.join(" | "), value);
                    }
                }
                return result;
            }
            else {
                return isTypeList.some(function (i) { return i(value); });
            }
        };
    };
    TypesPrime.isOptionalKeyTypeGuard = function (value, listner) {
        return TypesPrime.isSpecificObject({
            $type: TypesPrime.isJust("optional-type-guard"),
            isType: function (value, listner) {
                return "function" === typeof value || (undefined !== listner && types_error_1.TypesError.raiseError(listner, "function", value));
            },
        })(value, listner);
    };
    TypesPrime.makeOptionalKeyTypeGuard = function (isType) {
        return ({
            $type: "optional-type-guard",
            isType: isType,
        });
    };
    TypesPrime.invokeIsType = function (isType) {
        return "function" === typeof isType ? isType : TypesPrime.isSpecificObject(isType);
    };
    TypesPrime.isOptional = TypesPrime.makeOptionalKeyTypeGuard;
    TypesPrime.isOptionalMemberType = function (value, member, optionalTypeGuard, listner) {
        var result = !(member in value) || TypesPrime.invokeIsType(optionalTypeGuard.isType)(value[member], listner);
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
                    actualValue: types_error_1.TypesError.valueToString(value[member]),
                });
            }
        }
        return result;
    };
    TypesPrime.isMemberType = function (value, member, isType, listner) {
        return TypesPrime.isOptionalKeyTypeGuard(isType) ?
            TypesPrime.isOptionalMemberType(value, member, isType, listner) :
            TypesPrime.invokeIsType(isType)(value[member], listner);
    };
    // { [key in keyof ObjectType]: ((v: unknown) => v is ObjectType[key]) | OptionalKeyTypeGuard<ObjectType[key]> };
    TypesPrime.margeObjectValidator = function (a, b) {
        return Object.assign({}, a, b);
    };
    TypesPrime.isSpecificObject = function (memberValidator) { return function (value, listner) {
        if (TypesPrime.isObject(value)) {
            var result = Object.entries("function" === typeof memberValidator ? memberValidator() : memberValidator).map(function (kv) { return TypesPrime.isMemberType(value, kv[0], kv[1], types_error_1.TypesError.nextListener(kv[0], listner)); })
                .every(function (i) { return i; });
            if (listner) {
                if (result) {
                    types_error_1.TypesError.setMatch(listner);
                }
                else {
                    types_error_1.TypesError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else {
            return undefined !== listner && types_error_1.TypesError.raiseError(listner, "object", value);
        }
    }; };
    TypesPrime.isDictionaryObject = function (isType) { return function (value, listner) {
        if (TypesPrime.isObject(value)) {
            var result = Object.entries(value).map(function (kv) { return isType(kv[1], types_error_1.TypesError.nextListener(kv[0], listner)); }).every(function (i) { return i; });
            if (listner) {
                if (result) {
                    types_error_1.TypesError.setMatch(listner);
                }
                else {
                    types_error_1.TypesError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else {
            return undefined !== listner && types_error_1.TypesError.raiseError(listner, "object", value);
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
})(TypesPrime || (exports.TypesPrime = TypesPrime = {}));
//# sourceMappingURL=types-prime.js.map