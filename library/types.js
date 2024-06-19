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
    Types.isTypeSchema = function (value) {
        return Types.isJsonableObject(value) &&
            "$ref" in value && "string" === typeof value.$ref &&
            "defines" in value && Types.isJsonableObject(value.defines) && Object.values(value.defines).filter(function (v) { return !Types.isDefine(v); }).length <= 0 &&
            "options" in value && Types.isTypeOptions(value.options);
    };
    Types.isValidatorOptionType = function (value) {
        return 0 <= ["none", "simple", "full",].indexOf(value);
    };
    Types.isTypeOptions = function (value) {
        return Types.isJsonableObject(value) &&
            "indentUnit" in value && ("number" === typeof value.indentUnit || "\t" === value.indentUnit) &&
            "indentStyle" in value && 0 <= ["allman", "egyptian"].indexOf(value.indentStyle) &&
            "validatorOption" in value && Types.isValidatorOptionType(value.validatorOption);
    };
    Types.isRefer = function (value) {
        return null !== value &&
            "object" === typeof value &&
            "$ref" in value && "string" === typeof value.$ref;
    };
    Types.isAlphaDefine = function (value) {
        return null !== value &&
            "object" === typeof value &&
            (!("export" in value) || "boolean" === typeof value.export) &&
            "$type" in value && "string" === typeof value.$type;
    };
    Types.isModuleDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "module" === value.$type &&
            "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).filter(function (v) { return !Types.isDefine(v); }).length <= 0;
    };
    Types.isValueDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "value" === value.$type &&
            "value" in value && Types.isJsonable(value);
    };
    Types.isPrimitiveTypeDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "primitive-type" === value.$type &&
            "define" in value && ("undefined" === value.define || "boolean" === value.define || "number" === value.define || "string" === value.define);
    };
    Types.isTypeDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "type" === value.$type &&
            "define" in value && Types.isTypeOrInterfaceOrRefer(value.define);
    };
    Types.isInterfaceDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "interface" === value.$type &&
            "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).filter(function (v) { return !Types.isTypeOrInterfaceOrRefer(v); }).length <= 0;
    };
    Types.isArrayDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "array" === value.$type &&
            "items" in value && Types.isTypeOrInterfaceOrRefer(value.items);
    };
    Types.isOrDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "or" === value.$type &&
            "types" in value && Array.isArray(value.types) && value.types.filter(function (i) { return !Types.isTypeOrInterfaceOrRefer(i); }).length <= 0;
    };
    Types.isAndDefine = function (value) {
        return Types.isAlphaDefine(value) &&
            "and" === value.$type &&
            "types" in value && Array.isArray(value.types) && value.types.filter(function (i) { return !Types.isTypeOrInterfaceOrRefer(i); }).length <= 0;
    };
    Types.isTypeOrInterface = function (value) {
        return Types.isPrimitiveTypeDefine(value) ||
            Types.isTypeDefine(value) ||
            Types.isInterfaceDefine(value) ||
            Types.isArrayDefine(value) ||
            Types.isOrDefine(value) ||
            Types.isAndDefine(value);
    };
    Types.isTypeOrInterfaceOrRefer = function (value) {
        return Types.isTypeOrInterface(value) || Types.isRefer(value);
    };
    Types.isDefine = function (value) {
        return Types.isModuleDefine(value) || Types.isValueDefine(value) || Types.isTypeOrInterface(value);
    };
    Types.isDefineOrRefer = function (value) {
        return Types.isDefine(value) || Types.isRefer(value);
    };
})(Types || (exports.Types = Types = {}));
//# sourceMappingURL=types.js.map