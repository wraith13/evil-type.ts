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
    Type.isCommentProperty = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.commentPropertyValidatorObject)(value, listner);
    };
    Type.isTypeSchema = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.typeSchemaValidatorObject)(value, listner);
    };
    Type.isOutputOptions = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.outputOptionsValidatorObject)(value, listner);
    };
    Type.isSchemaOptions = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.schemaOptionsValidatorObject)(value, listner);
    };
    Type.isIndentStyleType = validator_1.EvilTypeValidator.isEnum(Type.indentStyleTypeMember);
    Type.isValidatorOptionType = validator_1.EvilTypeValidator.isEnum(["none", "simple", "full"]);
    Type.isAlphaElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.alphaElementValidatorObject)(value, listner);
    };
    Type.isAlphaDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.alphaDefinitionValidatorObject)(value, listner);
    };
    Type.isImportDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.importDefinitionValidatorObject)(value, listner);
    };
    Type.isDefinition = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Type.isCodeDefinition, Type.isNamespaceDefinition, Type.isValueDefinition, Type.isTypeDefinition, Type.isInterfaceDefinition, Type.isDictionaryDefinition)(value, listner); };
    Type.isDefinitionMap = function (value, listner) {
        return validator_1.EvilTypeValidator.isDictionaryObject(Type.isDefinition)(value, listner);
    };
    Type.isCodeDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.codeDefinitionValidatorObject)(value, listner);
    };
    Type.isNamespaceDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.namespaceDefinitionValidatorObject)(value, listner);
    };
    Type.isValueDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.valueDefinitionValidatorObject)(value, listner);
    };
    Type.isTypeDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.typeDefinitionValidatorObject)(value, listner);
    };
    Type.isInterfaceDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.interfaceDefinitionValidatorObject)(value, listner);
    };
    Type.isDictionaryDefinition = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.dictionaryDefinitionValidatorObject)(value, listner);
    };
    Type.isArrayElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.arrayElementValidatorObject)(value, listner);
    };
    Type.isOrElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.orElementValidatorObject)(value, listner);
    };
    Type.isAndElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.andElementValidatorObject)(value, listner);
    };
    Type.isLiteralElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.literalElementValidatorObject)(value, listner);
    };
    Type.isReferElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.referElementValidatorObject)(value, listner);
    };
    Type.isPrimitiveTypeEnum = validator_1.EvilTypeValidator.isEnum(Type.PrimitiveTypeEnumMembers);
    Type.isPrimitiveTypeElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.primitiveTypeElementValidatorObject)(value, listner);
    };
    Type.isType = function (value, listner) { return validator_1.EvilTypeValidator.isOr(Type.isPrimitiveTypeElement, Type.isTypeDefinition, Type.isEnumTypeElement, Type.isTypeofElement, Type.isItemofElement, Type.isInterfaceDefinition, Type.isDictionaryDefinition, Type.isArrayElement, Type.isOrElement, Type.isAndElement, Type.isLiteralElement)(value, listner); };
    Type.isEnumTypeElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.enumTypeElementValidatorObject)(value, listner);
    };
    Type.isTypeofElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.typeofElementValidatorObject)(value, listner);
    };
    Type.isItemofElement = function (value, listner) {
        return validator_1.EvilTypeValidator.isSpecificObject(Type.itemofElementValidatorObject)(value, listner);
    };
    Type.isTypeOrRefer = function (value, listner) {
        return validator_1.EvilTypeValidator.isOr(Type.isType, Type.isReferElement)(value, listner);
    };
    Type.isTypeOrValue = function (value, listner) {
        return validator_1.EvilTypeValidator.isOr(Type.isType, Type.isValueDefinition)(value, listner);
    };
    Type.isTypeOrValueOfRefer = function (value, listner) {
        return validator_1.EvilTypeValidator.isOr(Type.isTypeOrValue, Type.isReferElement)(value, listner);
    };
    Type.commentPropertyValidatorObject = ({ comment: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isArray(validator_1.EvilTypeValidator.isString)), });
    Type.typeSchemaValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.commentPropertyValidatorObject, { $schema: Type.isSchema, imports: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isArray(Type.isImportDefinition)), defines: Type.isDefinitionMap, options: Type.isOutputOptions, });
    Type.outputOptionsValidatorObject = ({ outputFile: validator_1.EvilTypeValidator.isString,
        indentUnit: validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNumber, validator_1.EvilTypeValidator.isJust("\t")), indentStyle: Type.isIndentStyleType, validatorOption: Type.isValidatorOptionType, maxLineLength: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNull, validator_1.EvilTypeValidator.isNumber)), schema: validator_1.EvilTypeValidator.isOptional(Type.isSchemaOptions), });
    Type.schemaOptionsValidatorObject = ({ outputFile: validator_1.EvilTypeValidator.isString,
        $id: validator_1.EvilTypeValidator.isString, $ref: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isString), externalReferMapping: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isDictionaryObject(validator_1.EvilTypeValidator.isString)), });
    Type.alphaElementValidatorObject = ({ $type: validator_1.EvilTypeValidator.isString, });
    Type.alphaDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaElementValidatorObject, Type.commentPropertyValidatorObject, { export: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isBoolean), });
    Type.importDefinitionValidatorObject = ({ $type: validator_1.EvilTypeValidator.isJust("import"), target: validator_1.EvilTypeValidator.isString, from: validator_1.EvilTypeValidator.isString, });
    Type.codeDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("code"), tokens: validator_1.EvilTypeValidator.isArray(validator_1.EvilTypeValidator.isString), });
    Type.namespaceDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("namespace"),
        members: Type.isDefinitionMap, });
    Type.valueDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("value"), value: validator_1.EvilTypeValidator.isOr(Type.isLiteralElement, Type.isReferElement), validator: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isBoolean), });
    Type.typeDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("type"), define: Type.isTypeOrRefer, });
    Type.interfaceDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("interface"),
        extends: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isArray(Type.isReferElement)), members: validator_1.EvilTypeValidator.isDictionaryObject(Type.isTypeOrRefer), additionalProperties: validator_1.EvilTypeValidator.isOptional(validator_1.EvilTypeValidator.isBoolean), });
    Type.dictionaryDefinitionValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("dictionary"),
        valueType: Type.isTypeOrRefer, });
    Type.arrayElementValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("array"), items: Type.isTypeOrRefer, });
    Type.orElementValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("or"), types: validator_1.EvilTypeValidator.isArray(Type.isTypeOrRefer), });
    Type.andElementValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("and"), types: validator_1.EvilTypeValidator.isArray(Type.isTypeOrRefer), });
    Type.literalElementValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("literal"), literal: jsonable_1.Jsonable.isJsonable, });
    Type.referElementValidatorObject = ({ $ref: validator_1.EvilTypeValidator.isString, });
    Type.primitiveTypeElementValidatorObject = validator_1.EvilTypeValidator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: validator_1.EvilTypeValidator.isJust("primitive-type"),
        type: Type.isPrimitiveTypeEnum, });
    Type.enumTypeElementValidatorObject = ({ $type: validator_1.EvilTypeValidator.isJust("enum-type"), members: validator_1.EvilTypeValidator.isArray(validator_1.EvilTypeValidator.isOr(validator_1.EvilTypeValidator.isNull, validator_1.EvilTypeValidator.isBoolean, validator_1.EvilTypeValidator.isNumber, validator_1.EvilTypeValidator.isString)), });
    Type.typeofElementValidatorObject = ({ $type: validator_1.EvilTypeValidator.isJust("typeof"), value: Type.isReferElement, });
    Type.itemofElementValidatorObject = ({ $type: validator_1.EvilTypeValidator.isJust("itemof"), value: Type.isReferElement, });
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=type.js.map