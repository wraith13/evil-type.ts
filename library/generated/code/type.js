"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
// This file is generated.
var evil_type_1 = require("../../common/evil-type");
var jsonable_1 = require("./jsonable");
var Type;
(function (Type) {
    Type.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    Type.indentStyleTypeMember = ["allman", "egyptian"];
    Type.PrimitiveTypeEnumMembers = ["null", "boolean", "number", "string"];
    Type.isSchema = evil_type_1.EvilType.Validator.isJust(Type.schema);
    Type.isCommentProperty = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.commentPropertyValidatorObject)(value, listner);
    };
    Type.isTypeSchema = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeSchemaValidatorObject)(value, listner);
    };
    Type.isOutputOptions = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.outputOptionsValidatorObject)(value, listner);
    };
    Type.isSchemaOptions = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.schemaOptionsValidatorObject)(value, listner);
    };
    Type.isIndentStyleType = evil_type_1.EvilType.Validator.isEnum(Type.indentStyleTypeMember);
    Type.isValidatorOptionType = evil_type_1.EvilType.Validator.isEnum(["none", "simple", "full"]);
    Type.isAlphaElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaElementValidatorObject)(value, listner);
    };
    Type.isAlphaDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaDefinitionValidatorObject)(value, listner);
    };
    Type.isImportDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.importDefinitionValidatorObject)(value, listner);
    };
    Type.isDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isOr(Type.isCodeDefinition, Type.isNamespaceDefinition, Type.isValueDefinition, Type.isTypeDefinition, Type.isInterfaceDefinition, Type.isDictionaryDefinition)(value, listner);
    };
    Type.isDefinitionMap = function (value, listner) {
        return evil_type_1.EvilType.Validator.isDictionaryObject(Type.isDefinition)(value, listner);
    };
    Type.isCodeDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.codeDefinitionValidatorObject)(value, listner);
    };
    Type.isNamespaceDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.namespaceDefinitionValidatorObject)(value, listner);
    };
    Type.isValueDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.valueDefinitionValidatorObject)(value, listner);
    };
    Type.isTypeDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeDefinitionValidatorObject)(value, listner);
    };
    Type.isInterfaceDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.interfaceDefinitionValidatorObject)(value, listner);
    };
    Type.isDictionaryDefinition = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.dictionaryDefinitionValidatorObject)(value, listner);
    };
    Type.isArrayElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.arrayElementValidatorObject)(value, listner);
    };
    Type.isOrElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.orElementValidatorObject)(value, listner);
    };
    Type.isAndElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.andElementValidatorObject)(value, listner);
    };
    Type.isLiteralElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.literalElementValidatorObject)(value, listner);
    };
    Type.isReferElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.referElementValidatorObject)(value, listner);
    };
    Type.isPrimitiveTypeEnum = evil_type_1.EvilType.Validator.isEnum(Type.PrimitiveTypeEnumMembers);
    Type.isPrimitiveTypeElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.primitiveTypeElementValidatorObject)(value, listner);
    };
    Type.isType = function (value, listner) { return evil_type_1.EvilType.Validator.isOr(Type.isPrimitiveTypeElement, Type.isTypeDefinition, Type.isEnumTypeElement, Type.isTypeofElement, Type.isItemofElement, Type.isInterfaceDefinition, Type.isDictionaryDefinition, Type.isArrayElement, Type.isOrElement, Type.isAndElement, Type.isLiteralElement)(value, listner); };
    Type.isEnumTypeElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.enumTypeElementValidatorObject)(value, listner);
    };
    Type.isTypeofElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeofElementValidatorObject)(value, listner);
    };
    Type.isItemofElement = function (value, listner) {
        return evil_type_1.EvilType.Validator.isSpecificObject(Type.itemofElementValidatorObject)(value, listner);
    };
    Type.isTypeOrRefer = function (value, listner) {
        return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isReferElement)(value, listner);
    };
    Type.isTypeOrValue = function (value, listner) {
        return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isValueDefinition)(value, listner);
    };
    Type.isTypeOrValueOfRefer = function (value, listner) {
        return evil_type_1.EvilType.Validator.isOr(Type.isTypeOrValue, Type.isReferElement)(value, listner);
    };
    Type.commentPropertyValidatorObject = ({ comment: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)), });
    Type.typeSchemaValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commentPropertyValidatorObject, { $schema: Type.isSchema, imports: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isImportDefinition)), defines: Type.isDefinitionMap, options: Type.isOutputOptions, });
    Type.outputOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, indentUnit: evil_type_1.EvilType.Validator.isEnum([0, 1, 2, 3, 4, 5, 6, 7, 8, "tab"]), indentStyle: Type.isIndentStyleType, validatorOption: Type.isValidatorOptionType, maxLineLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isNumber)), schema: evil_type_1.EvilType.Validator.isOptional(Type.isSchemaOptions), });
    Type.schemaOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, $id: evil_type_1.EvilType.Validator.isString, $ref: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString),
        externalReferMapping: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDictionaryObject(evil_type_1.EvilType.Validator.isString)), });
    Type.alphaElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isString, });
    Type.alphaDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, Type.commentPropertyValidatorObject, { export: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.importDefinitionValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("import"), target: evil_type_1.EvilType.Validator.isString, from: evil_type_1.EvilType.Validator.isString, });
    Type.codeDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("code"), tokens: evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString), });
    Type.namespaceDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("namespace"),
        members: Type.isDefinitionMap, });
    Type.valueDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("value"), value: evil_type_1.EvilType.Validator.isOr(Type.isLiteralElement, Type.isReferElement), validator: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.typeDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("type"), define: Type.isTypeOrRefer, });
    Type.interfaceDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("interface"),
        extends: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isReferElement)), members: evil_type_1.EvilType.Validator.isDictionaryObject(Type.isTypeOrRefer), additionalProperties: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.dictionaryDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("dictionary"),
        valueType: Type.isTypeOrRefer, });
    Type.arrayElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("array"), items: Type.isTypeOrRefer, });
    Type.orElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("or"), types: evil_type_1.EvilType.Validator.isArray(Type.isTypeOrRefer), });
    Type.andElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("and"), types: evil_type_1.EvilType.Validator.isArray(Type.isTypeOrRefer), });
    Type.literalElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("literal"),
        literal: jsonable_1.Jsonable.isJsonable, });
    Type.referElementValidatorObject = ({ $ref: evil_type_1.EvilType.Validator.isString, });
    Type.primitiveTypeElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("primitive-type"),
        type: Type.isPrimitiveTypeEnum, });
    Type.enumTypeElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("enum-type"), members: evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isBoolean, evil_type_1.EvilType.Validator.isNumber, evil_type_1.EvilType.Validator.isString)), });
    Type.typeofElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("typeof"), value: Type.isReferElement, });
    Type.itemofElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("itemof"), value: Type.isReferElement, });
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=type.js.map