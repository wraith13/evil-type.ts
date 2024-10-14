"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
// This file is generated.
var validator_1 = require("../../source/validator");
var jsonable_1 = require("./jsonable");
var Type;
(function (Type) {
    Type.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    Type.indentStyleTypeMember = ["allman", "egyptian"];
    Type.PrimitiveTypeEnumMembers = ["null", "boolean", "number", "string"];
    Type.isSchema = validator_1.EvilTypeValidator.isJust(Type.schema);
    Type.getCommentPropertyValidator = function () { return ({ comment: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isArray(validator_1.EvilTypeValidator.isString)), }); };
    Type.isCommentProperty = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getCommentPropertyValidator())(value, listner);
    };
    Type.getTypeSchemaValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getCommentPropertyValidator(), { $schema: Type.isSchema, imports: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isArray(Type.isImportDefinition)), defines: Type.isDefinitionMap, options: Type.isOutputOptions, }); };
    Type.isTypeSchema = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getTypeSchemaValidator())(value, listner);
    };
    Type.getOutputOptionsValidator = function () { return ({ outputFile: validator_1.EvilTypeValidator.isString, indentUnit: validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNumber, validator_1.EvilTypeValidator.isJust("\t")),
        indentStyle: Type.isIndentStyleType, validatorOption: Type.isValidatorOptionType, maxLineLength: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNull, validator_1.EvilTypeValidator.isNumber)), schema: validator_1.EvilTypeValidator.isOptional(Type.isSchemaOptions), }); };
    Type.isOutputOptions = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getOutputOptionsValidator())(value, listner);
    };
    Type.getSchemaOptionsValidator = function () { return ({ outputFile: validator_1.EvilTypeValidator.isString, $id: validator_1.EvilTypeValidator.isString, $ref: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isString),
        externalReferMapping: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isDictionaryObject(validator_1.EvilTypeValidator.isString)), }); };
    Type.isSchemaOptions = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getSchemaOptionsValidator())(value, listner);
    };
    Type.isIndentStyleType = function (value, listner) {
        return validator_1.EvilTypeValidator.isEnum(Type.indentStyleTypeMember)(value, listner);
    };
    Type.isValidatorOptionType = function (value, listner) {
        return validator_1.EvilTypeValidator.isEnum(["none", "simple", "full"])(value, listner);
    };
    Type.getAlphaElementValidator = function () { return ({ $type: validator_1.EvilTypeValidator.isString, }); };
    Type.isAlphaElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getAlphaElementValidator())(value, listner);
    };
    Type.getAlphaDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaElementValidator(), Type.getCommentPropertyValidator(), { export: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isBoolean), }); };
    Type.isAlphaDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getAlphaDefinitionValidator())(value, listner);
    };
    Type.getImportDefinitionValidator = function () { return ({ $type: validator_1.EvilTypeValidator.isJust("import"), target: validator_1.EvilTypeValidator.isString, from: validator_1.EvilTypeValidator.isString, }); };
    Type.isImportDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getImportDefinitionValidator())(value, listner);
    };
    Type.isDefinition = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Type.isCodeDefinition, Type.isNamespaceDefinition, Type.isValueDefinition, Type.isTypeDefinition, Type.isInterfaceDefinition, Type.isDictionaryDefinition)(value, listner); };
    Type.isDefinitionMap = function (value, listner) {
        return validator_1.EvilTypeValidator.isDictionaryObject(Type.isDefinition)(value, listner);
    };
    Type.getCodeDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaDefinitionValidator(), { $type: validator_1.EvilTypeValidator.isJust("code"), tokens: validator_1.EvilTypeValidator.isArray(validator_1.EvilTypeValidator.isString), }); };
    Type.isCodeDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getCodeDefinitionValidator())(value, listner);
    };
    Type.getNamespaceDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaDefinitionValidator(), { $type: validator_1.EvilTypeValidator.isJust("namespace"), members: Type.isDefinitionMap, }); };
    Type.isNamespaceDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getNamespaceDefinitionValidator())(value, listner);
    };
    Type.getValueDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaDefinitionValidator(), { $type: validator_1.EvilTypeValidator.isJust("value"), value: validator_1.EvilTypeValidator.isOr(Type.isLiteralElement, Type.isReferElement), validator: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isBoolean), }); };
    Type.isValueDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getValueDefinitionValidator())(value, listner);
    };
    Type.getTypeDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaDefinitionValidator(), { $type: validator_1.EvilTypeValidator.isJust("type"), define: Type.isTypeOrRefer, }); };
    Type.isTypeDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getTypeDefinitionValidator())(value, listner);
    };
    Type.getInterfaceDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaDefinitionValidator(), { $type: validator_1.EvilTypeValidator.isJust("interface"), extends: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isArray(Type.isReferElement)), members: validator_1.EvilTypeValidator.isDictionaryObject(Type.isTypeOrRefer), additionalProperties: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isBoolean), }); };
    Type.isInterfaceDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getInterfaceDefinitionValidator())(value, listner);
    };
    Type.getDictionaryDefinitionValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaDefinitionValidator(), { $type: validator_1.EvilTypeValidator.isJust("dictionary"), valueType: Type.isTypeOrRefer, }); };
    Type.isDictionaryDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getDictionaryDefinitionValidator())(value, listner);
    };
    Type.getArrayElementValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaElementValidator(), { $type: validator_1.EvilTypeValidator.isJust("array"), items: Type.isTypeOrRefer, }); };
    Type.isArrayElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getArrayElementValidator())(value, listner);
    };
    Type.getOrElementValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaElementValidator(), { $type: validator_1.EvilTypeValidator.isJust("or"), types: validator_1.EvilTypeValidator.isArray(Type.isTypeOrRefer), }); };
    Type.isOrElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getOrElementValidator())(value, listner);
    };
    Type.getAndElementValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaElementValidator(), { $type: validator_1.EvilTypeValidator.isJust("and"), types: validator_1.EvilTypeValidator.isArray(Type.isTypeOrRefer), }); };
    Type.isAndElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getAndElementValidator())(value, listner);
    };
    Type.getLiteralElementValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaElementValidator(), { $type: validator_1.EvilTypeValidator.isJust("literal"), literal: jsonable_1.Jsonable.isJsonable, }); };
    Type.isLiteralElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getLiteralElementValidator())(value, listner);
    };
    Type.getReferElementValidator = function () { return ({ $ref: validator_1.EvilTypeValidator.isString, }); };
    Type.isReferElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getReferElementValidator())(value, listner);
    };
    Type.isPrimitiveTypeEnum = function (value, listner) {
        return validator_1.EvilTypeValidator.isEnum(Type.PrimitiveTypeEnumMembers)(value, listner);
    };
    Type.getPrimitiveTypeElementValidator = function () { return validator_1.EvilTypeValidator.mergeObjectValidator(Type.getAlphaElementValidator(), { $type: validator_1.EvilTypeValidator.isJust("primitive-type"), type: Type.isPrimitiveTypeEnum, }); };
    Type.isPrimitiveTypeElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getPrimitiveTypeElementValidator())(value, listner);
    };
    Type.isType = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Type.isPrimitiveTypeElement, Type.isTypeDefinition, Type.isEnumTypeElement, Type.isTypeofElement, Type.isItemofElement, Type.isInterfaceDefinition, Type.isDictionaryDefinition, Type.isArrayElement, Type.isOrElement, Type.isAndElement, Type.isLiteralElement)(value, listner); };
    Type.getEnumTypeElementValidator = function () { return ({ $type: validator_1.EvilTypeValidator.isJust("enum-type"), members: validator_1.EvilTypeValidator.isArray(validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNull, validator_1.EvilTypeValidator.isBoolean, validator_1.EvilTypeValidator.isNumber, validator_1.EvilTypeValidator.isString)), }); };
    Type.isEnumTypeElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getEnumTypeElementValidator())(value, listner);
    };
    Type.getTypeofElementValidator = function () { return ({ $type: validator_1.EvilTypeValidator.isJust("typeof"), value: Type.isReferElement, }); };
    Type.isTypeofElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getTypeofElementValidator())(value, listner);
    };
    Type.getItemofElementValidator = function () { return ({ $type: validator_1.EvilTypeValidator.isJust("itemof"), value: Type.isReferElement, }); };
    Type.isItemofElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.getItemofElementValidator())(value, listner);
    };
    Type.isTypeOrRefer = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Type.isType, Type.isReferElement)(value, listner); };
    Type.isTypeOrValue = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Type.isType, Type.isValueDefinition)(value, listner); };
    Type.isTypeOrValueOfRefer = function (value, listner) {
        return validator_1.EvilTypeValidator.isOr(Type.isTypeOrValue, Type.isReferElement)(value, listner);
    };
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=type.js.map