"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
// This file is generated.
var types_prime_1 = require("../source/types-prime");
var jsonable_1 = require("./jsonable");
var Types;
(function (Types) {
    Types.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    Types.indentStyleTypeMember = ["allman", "egyptian"];
    Types.PrimitiveTypeEnumMembers = ["null", "boolean", "number", "string"];
    Types.isSchema = types_prime_1.TypesPrime.isJust(Types.schema);
    Types.getCommentPropertyValidator = function () { return ({ comment: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString)), }); };
    Types.isCommentProperty = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getCommentPropertyValidator())(value, listner);
    };
    Types.getTypeSchemaValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getCommentPropertyValidator(), { $ref: Types.isSchema, imports: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(Types.isImportDefinition)), defines: types_prime_1.TypesPrime.isDictionaryObject(Types.isDefinition), options: Types.isOutputOptions, }); };
    Types.isTypeSchema = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getTypeSchemaValidator())(value, listner);
    };
    Types.getOutputOptionsValidator = function () { return ({ outputFile: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isString), indentUnit: types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isJust("\t")), indentStyle: Types.isIndentStyleType,
        validatorOption: Types.isValidatorOptionType, maxLineLength: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNull, types_prime_1.TypesPrime.isNumber)), schema: types_prime_1.TypesPrime.isOptional(Types.isSchemaOptions), }); };
    Types.isOutputOptions = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getOutputOptionsValidator())(value, listner);
    };
    Types.getSchemaOptionsValidator = function () { return ({ outputFile: types_prime_1.TypesPrime.isString, id: types_prime_1.TypesPrime.isString, }); };
    Types.isSchemaOptions = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getSchemaOptionsValidator())(value, listner);
    };
    Types.isIndentStyleType = function (value, listner) { return types_prime_1.TypesPrime.isEnum(Types.indentStyleTypeMember)(value, listner); };
    Types.isValidatorOptionType = function (value, listner) { return types_prime_1.TypesPrime.isEnum(["none", "simple", "full"])(value, listner); };
    Types.getAlphaElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isString, }); };
    Types.isAlphaElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getAlphaElementValidator())(value, listner);
    };
    Types.getAlphaDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), Types.getCommentPropertyValidator(), { export: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean), }); };
    Types.isAlphaDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getAlphaDefinitionValidator())(value, listner);
    };
    Types.getImportDefinitionValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("import"),
        target: types_prime_1.TypesPrime.isString, from: types_prime_1.TypesPrime.isString, }); };
    Types.isImportDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getImportDefinitionValidator())(value, listner);
    };
    Types.isDefinition = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isCodeDefinition, Types.isNamespaceDefinition, Types.isValueDefinition, Types.isTypeDefinition, Types.isInterfaceDefinition, Types.isDictionaryDefinition)(value, listner); };
    Types.getCodeDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("code"), tokens: types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString), }); };
    Types.isCodeDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getCodeDefinitionValidator())(value, listner);
    };
    Types.getNamespaceDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("namespace"), members: types_prime_1.TypesPrime.isDictionaryObject(Types.isDefinition), }); };
    Types.isNamespaceDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getNamespaceDefinitionValidator())(value, listner);
    };
    Types.getValueDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("value"), value: types_prime_1.TypesPrime.isOr(Types.isLiteralElement, Types.isReferElement),
        validator: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean), }); };
    Types.isValueDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getValueDefinitionValidator())(value, listner);
    };
    Types.getTypeDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("type"), define: Types.isTypeOrRefer, }); };
    Types.isTypeDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getTypeDefinitionValidator())(value, listner);
    };
    Types.getInterfaceDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("interface"), extends: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(Types.isReferElement)), members: types_prime_1.TypesPrime.isDictionaryObject(Types.isTypeOrRefer), }); };
    Types.isInterfaceDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getInterfaceDefinitionValidator())(value, listner);
    };
    Types.getDictionaryDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("dictionary"), valueType: Types.isTypeOrRefer,
    }); };
    Types.isDictionaryDefinition = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getDictionaryDefinitionValidator())(value, listner);
    };
    Types.getArrayElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("array"), items: Types.isTypeOrRefer, }); };
    Types.isArrayElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getArrayElementValidator())(value, listner);
    };
    Types.getOrElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("or"), types: types_prime_1.TypesPrime.isArray(Types.isTypeOrRefer), }); };
    Types.isOrElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getOrElementValidator())(value, listner);
    };
    Types.getAndElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("and"), types: types_prime_1.TypesPrime.isArray(Types.isTypeOrRefer), }); };
    Types.isAndElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getAndElementValidator())(value, listner);
    };
    Types.getLiteralElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("literal"), literal: jsonable_1.Jsonable.isJsonable, }); };
    Types.isLiteralElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getLiteralElementValidator())(value, listner);
    };
    Types.getReferElementValidator = function () { return ({ $ref: types_prime_1.TypesPrime.isString, }); };
    Types.isReferElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getReferElementValidator())(value, listner);
    };
    Types.isPrimitiveTypeEnum = function (value, listner) { return types_prime_1.TypesPrime.isEnum(Types.PrimitiveTypeEnumMembers)(value, listner); };
    Types.getPrimitiveTypeElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("primitive-type"), type: Types.isPrimitiveTypeEnum,
    }); };
    Types.isPrimitiveTypeElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getPrimitiveTypeElementValidator())(value, listner);
    };
    Types.isType = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isPrimitiveTypeElement, Types.isTypeDefinition, Types.isEnumTypeElement, Types.isTypeofElement, Types.isItemofElement, Types.isInterfaceDefinition, Types.isDictionaryDefinition, Types.isArrayElement, Types.isOrElement, Types.isAndElement, Types.isLiteralElement)(value, listner); };
    Types.getEnumTypeElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("enum-type"),
        members: types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNull, types_prime_1.TypesPrime.isBoolean, types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isString)), }); };
    Types.isEnumTypeElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getEnumTypeElementValidator())(value, listner);
    };
    Types.getTypeofElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("typeof"), value: Types.isReferElement, }); };
    Types.isTypeofElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getTypeofElementValidator())(value, listner);
    };
    Types.getItemofElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("itemof"), value: Types.isReferElement, }); };
    Types.isItemofElement = function (value, listner) {
        return types_prime_1.TypesPrime.isSpecificObject(Types.getItemofElementValidator())(value, listner);
    };
    Types.isTypeOrRefer = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isType, Types.isReferElement)(value, listner); };
    Types.isTypeOrValue = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isType, Types.isValueDefinition)(value, listner); };
    Types.isTypeOrValueOfRefer = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isTypeOrValue, Types.isReferElement)(value, listner); };
})(Types || (exports.Types = Types = {}));
//# sourceMappingURL=types.js.map