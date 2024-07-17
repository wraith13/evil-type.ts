"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
var Types;
(function (Types) {
    Types.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    Types.isJsonableValue = function (value) {
        return null === value ||
            "boolean" === typeof value ||
            "number" === typeof value ||
            "string" === typeof value;
    };
    Types.isJsonableObject = function (value) {
        return null !== value &&
            "object" === typeof value &&
            Object.values(value).filter(function (v) { return !Types.isJsonable(v); }).length <= 0;
    };
    Types.isJsonable = function (value) {
        return Types.isJsonableValue(value) ||
            (Array.isArray(value) && value.filter(function (v) { return !Types.isJsonable(v); }).length <= 0) ||
            Types.isJsonableObject(value);
    };
    Types.isJust = function (target) { return function (value) { return target === value; }; };
    Types.isUndefined = Types.isJust(undefined);
    Types.isNull = Types.isJust(null);
    Types.isBoolean = function (value) { return "boolean" === typeof value; };
    Types.isNumber = function (value) { return "number" === typeof value; };
    Types.isString = function (value) { return "string" === typeof value; };
    Types.isObject = function (value) { return null !== value && "object" === typeof value; };
    Types.isEnum = function (list) { return function (value) { return list.includes(value); }; };
    Types.isArray = function (isType) { return function (value) {
        return Array.isArray(value) && value.filter(function (i) { return !isType(i); }).length <= 0;
    }; };
    Types.isOr = function () {
        var isTypeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            isTypeList[_i] = arguments[_i];
        }
        return function (value) { return 0 < isTypeList.filter(function (i) { return i(value); }).length; };
    };
    Types.sss = {
        $type: "optional-type-guard",
        isType: Types.isNumber,
    };
    Types.isOptionalKeyTypeGuard = function (value) {
        return Types.isSpecificObject({
            $type: Types.isJust("optional-type-guard"),
            isType: function (value) { return "function" === typeof value; },
        })(value);
    };
    Types.makeOptionalKeyTypeGuard = function (isType) {
        return ({
            $type: "optional-type-guard",
            isType: isType,
        });
    };
    Types.isMemberType = function (value, member, isType) {
        return Types.isOptionalKeyTypeGuard(isType) ?
            (!(member in value) || isType.isType(value[member])) :
            (member in value && isType(value[member]));
    };
    Types.isMemberTypeOrUndefined = function (value, member, isType) {
        return !(member in value) || isType(value[member]);
    };
    // { [key in keyof ObjectType]: ((v: unknown) => v is ObjectType[key]) | OptionalKeyTypeGuard<ObjectType[key]> };
    Types.isSpecificObject = function (memberValidator) { return function (value) {
        return Types.isObject(value) &&
            Object.entries(memberValidator).filter(function (kv) { return !(kv[0].endsWith("?") ?
                Types.isMemberTypeOrUndefined(value, kv[0].slice(0, -1), kv[1]) :
                Types.isMemberType(value, kv[0], kv[1])); }).length <= 0;
    }; };
    Types.isDictionaryObject = function (isType) { return function (value) {
        return Types.isObject(value) && Object.values(value).filter(function (i) { return !isType(i); }).length <= 0;
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
    Types.isTypeSchema = function (value) {
        return Types.isSpecificObject({
            "$ref": Types.isJust(Types.schema),
            "defines": Types.isDictionaryObject(Types.isDefinition),
            "options": Types.isTypeOptions
        })(value);
    };
    Types.isReferElement = Types.isSpecificObject({
        "$ref": Types.isString,
    });
    Types.isModuleDefinition = function (value) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("module"),
        members: Types.isDictionaryObject(Types.isDefinition),
    })(value); };
    Types.isLiteralElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("literal"),
        literal: Types.isJsonable,
    })(value); };
    Types.isValueDefinition = function (value) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("value"),
        value: Types.isOr(Types.isLiteralElement, Types.isReferElement),
    })(value); };
    Types.isTypeofElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("typeof"),
        value: Types.isReferElement,
    })(value); };
    Types.PrimitiveTypeEnumMembers = ["undefined", "boolean", "number", "string"];
    Types.isPrimitiveTypeEnum = Types.isEnum(Types.PrimitiveTypeEnumMembers);
    Types.isPrimitiveTypeElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("primitive-type"),
        type: Types.isPrimitiveTypeEnum,
    })(value); };
    Types.isTypeDefinition = function (value) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("type"),
        define: Types.isTypeOrRefer,
    })(value); };
    Types.isInterfaceDefinition = function (value) { return Types.isSpecificObject({
        export: Types.makeOptionalKeyTypeGuard(Types.isBoolean),
        $type: Types.isJust("interface"),
        members: Types.isDictionaryObject(Types.isTypeOrRefer),
    })(value); };
    Types.isDictionaryElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("dictionary"),
        members: Types.isTypeOrRefer,
    })(value); };
    Types.isArrayElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("array"),
        items: Types.isTypeOrRefer,
    })(value); };
    Types.isOrElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("or"),
        types: Types.isArray(Types.isTypeOrRefer),
    })(value); };
    Types.isAndElement = function (value) { return Types.isSpecificObject({
        $type: Types.isJust("and"),
        types: Types.isArray(Types.isTypeOrRefer),
    })(value); };
    Types.isType = Types.isOr(Types.isPrimitiveTypeElement, Types.isTypeDefinition, Types.isTypeofElement, Types.isInterfaceDefinition, Types.isArrayElement, Types.isOrElement, Types.isAndElement);
    Types.isTypeOrValue = Types.isOr(Types.isType, Types.isValueDefinition, Types.isLiteralElement);
    Types.isTypeOrRefer = Types.isOr(Types.isType, Types.isReferElement);
    Types.isDefinition = Types.isOr(Types.isModuleDefinition, Types.isValueDefinition, Types.isTypeDefinition, Types.isInterfaceDefinition);
    Types.isDefineOrRefer = function (value) {
        return Types.isDefinition(value) || Types.isReferElement(value);
    };
})(Types || (exports.Types = Types = {}));
//# sourceMappingURL=types.js.map