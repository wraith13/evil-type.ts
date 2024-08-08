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
exports.Types = void 0;
var jsonable_1 = require("./jsonable");
var typeerror_1 = require("./typeerror");
var Types;
(function (Types) {
    Types.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    Types.isJust = function (target) { return function (value, listner) {
        return target === value || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, typeerror_1.TypeError.valueToString(target), value));
    }; };
    Types.isUndefined = Types.isJust(undefined);
    Types.isNull = Types.isJust(null);
    Types.isBoolean = function (value, listner) {
        return "boolean" === typeof value || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, "boolean", value));
    };
    Types.isNumber = function (value, listner) {
        return "number" === typeof value || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, "number", value));
    };
    Types.isString = function (value, listner) {
        return "string" === typeof value || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, "string", value));
    };
    Types.isObject = function (value, listner) {
        return (null !== value && "object" === typeof value) || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, "object", value));
    };
    Types.isEnum = function (list) { return function (value, listner) {
        return list.includes(value) || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, list.map(function (i) { return typeerror_1.TypeError.valueToString(i); }).join(" | "), value));
    }; };
    Types.isArray = function (isType) { return function (value, listner) {
        return Array.isArray(value) && value.every(function (i) { return isType(i, listner); });
    }; };
    Types.makeOrTypeNameFromIsTypeList = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        var transactionListner = typeerror_1.TypeError.makeListener();
        isTypeList.some(function (i) { return i(undefined, transactionListner); });
        return transactionListner.errors
            .map(function (i) { return i.requiredType.split(" | "); })
            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
            .filter(function (i, ix, list) { return ix === list.indexOf(i); });
    };
    Types.getBestMatchErrors = function (listeners) {
        return __spreadArray([], listeners, true).sort(function (a, b) {
            var av = Math.max.apply(Math, a.errors.map(function (i) { return typeerror_1.TypeError.getPathDepth(i.path); }));
            var bv = Math.max.apply(Math, b.errors.map(function (i) { return typeerror_1.TypeError.getPathDepth(i.path); }));
            if (av < bv) {
                return 1;
            }
            else if (bv < av) {
                return -1;
            }
            else {
                var av2 = a.errors.length;
                var bv2 = b.errors.length;
                if (av2 < bv2) {
                    return -1;
                }
                else if (bv2 < av2) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        })[0];
    };
    Types.isOr = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return function (value, listner) {
            var _a;
            if (listner) {
                var resultList = isTypeList.map(function (i) {
                    var transactionListner = typeerror_1.TypeError.makeListener(listner.path);
                    var result = {
                        transactionListner: transactionListner,
                        result: i(value, transactionListner),
                    };
                    return result;
                });
                var result = resultList.some(function (i) { return i.result; });
                if (!result) {
                    var requiredType = Types.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                    if (Types.isObject(value) && requiredType.includes("object")) {
                        (_a = listner.errors).push.apply(_a, Types.getBestMatchErrors(resultList.map(function (i) { return i.transactionListner; })).errors);
                    }
                    else {
                        typeerror_1.TypeError.raiseError(listner, requiredType.join(" | "), value);
                    }
                }
                return result;
            }
            else {
                return isTypeList.some(function (i) { return i(value); });
            }
        };
    };
    Types.isOptionalKeyTypeGuard = function (value, listner) {
        return Types.isSpecificObject({
            $type: Types.isJust("optional-type-guard"),
            isType: function (value, listner) {
                return "function" === typeof value || (undefined !== listner && typeerror_1.TypeError.raiseError(listner, "function", value));
            },
        })(value, listner);
    };
    Types.makeOptionalKeyTypeGuard = function (isType) {
        return ({
            $type: "optional-type-guard",
            isType: isType,
        });
    };
    Types.isMemberType = function (value, member, isType, listner) {
        return Types.isOptionalKeyTypeGuard(isType) ?
            (!(member in value) || isType.isType(value[member], listner)) :
            (member in value && isType(value[member], listner));
    };
    Types.isMemberTypeOrUndefined = function (value, member, isType, listner) {
        return !(member in value) || isType(value[member], listner);
    };
    // { [key in keyof ObjectType]: ((v: unknown) => v is ObjectType[key]) | OptionalKeyTypeGuard<ObjectType[key]> };
    Types.isSpecificObject = function (memberValidator) { return function (value, listner) {
        return Types.isObject(value, listner) &&
            Object.entries(memberValidator).every(function (kv) { return kv[0].endsWith("?") ?
                Types.isMemberTypeOrUndefined(value, kv[0].slice(0, -1), kv[1], typeerror_1.TypeError.nextListener(kv[0], listner)) :
                Types.isMemberType(value, kv[0], kv[1], typeerror_1.TypeError.nextListener(kv[0], listner)); });
    }; };
    Types.isDictionaryObject = function (isType) { return function (value, listner) {
        return Types.isObject(value, listner) &&
            Object.entries(value).every(function (kv) { return isType(kv[1], typeerror_1.TypeError.nextListener(kv[0], listner)); });
    }; };
    Types.ValidatorOptionTypeMembers = ["none", "simple", "full",];
    Types.isValidatorOptionType = Types.isEnum(Types.ValidatorOptionTypeMembers);
    Types.IndentStyleMembers = ["allman", "egyptian",];
    Types.isIndentStyleType = Types.isEnum(Types.IndentStyleMembers);
    Types.isTypeOptions = Types.isSpecificObject({
        "indentUnit": Types.isOr(Types.isNumber, Types.isJust("\t")),
        "indentStyle": Types.isIndentStyleType,
        "validatorOption": Types.isValidatorOptionType,
    });
    Types.isTypeSchema = function (value, listner) {
        return Types.isSpecificObject({
            "$ref": Types.isJust(Types.schema),
            "defines": Types.isDictionaryObject(Types.isDefinition),
            "options": Types.isTypeOptions
        })(value, listner);
    };
    Types.isReferElement = Types.isSpecificObject({
        "$ref": Types.isString,
    });
    Types.isModuleDefinition = function (value, listner) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("module"),
        members: Types.isDictionaryObject(Types.isDefinition),
    })(value, listner); };
    Types.PrimitiveTypeEnumMembers = ["undefined", "boolean", "number", "string"];
    Types.isPrimitiveTypeEnum = Types.isEnum(Types.PrimitiveTypeEnumMembers);
    Types.isPrimitiveTypeElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("primitive-type"),
        type: Types.isPrimitiveTypeEnum,
    })(value, listner); };
    Types.isLiteralElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("literal"),
        literal: jsonable_1.Jsonable.isJsonable,
    })(value, listner); };
    Types.isValueDefinition = function (value, listner) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("value"),
        value: Types.isOr(Types.isLiteralElement, Types.isReferElement),
    })(value, listner); };
    Types.isTypeofElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("typeof"),
        value: Types.isReferElement,
    })(value, listner); };
    Types.isItemofElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("itemof"),
        value: Types.isReferElement,
    })(value, listner); };
    Types.isTypeDefinition = function (value, listner) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("type"),
        define: Types.isTypeOrRefer,
    })(value, listner); };
    Types.isEnumTypeElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("enum-type"),
        members: Types.isArray(Types.isOr(Types.isNumber, Types.isString)),
    })(value, listner); };
    Types.isInterfaceDefinition = function (value, listner) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("interface"),
        members: Types.isDictionaryObject(Types.isTypeOrRefer),
    })(value, listner); };
    Types.isDictionaryElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("dictionary"),
        members: Types.isTypeOrRefer,
    })(value, listner); };
    Types.isArrayElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("array"),
        items: Types.isTypeOrRefer,
    })(value, listner); };
    Types.isOrElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("or"),
        types: Types.isArray(Types.isTypeOrRefer),
    })(value, listner); };
    Types.isAndElement = function (value, listner) { return Types.isSpecificObject({
        $type: Types.isJust("and"),
        types: Types.isArray(Types.isTypeOrRefer),
    })(value, listner); };
    Types.isType = Types.isOr(Types.isPrimitiveTypeElement, Types.isTypeDefinition, Types.isEnumTypeElement, Types.isTypeofElement, Types.isItemofElement, Types.isInterfaceDefinition, Types.isArrayElement, Types.isOrElement, Types.isAndElement, Types.isLiteralElement);
    Types.isTypeOrValue = Types.isOr(Types.isType, Types.isValueDefinition);
    Types.isTypeOrRefer = Types.isOr(Types.isType, Types.isReferElement);
    Types.isDefinition = Types.isOr(Types.isModuleDefinition, Types.isValueDefinition, Types.isTypeDefinition, Types.isInterfaceDefinition);
    Types.isDefineOrRefer = Types.isOr(Types.isDefinition, Types.isReferElement);
})(Types || (exports.Types = Types = {}));
//# sourceMappingURL=types.js.map