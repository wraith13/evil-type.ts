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
    Type.isSchema = evil_type_1.EvilType.Validator.isJust(Type.schema);
    Type.isCommentProperty = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.commentPropertyValidatorObject); });
    Type.isCommonProperties = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.commonPropertiesValidatorObject); });
    Type.isTypeSchema = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeSchemaValidatorObject, false); });
    Type.isOutputOptions = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.outputOptionsValidatorObject, false); });
    Type.isSchemaOptions = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.schemaOptionsValidatorObject, false); });
    Type.isIndentStyleType = evil_type_1.EvilType.Validator.isEnum(Type.indentStyleTypeMember);
    Type.isValidatorOptionType = evil_type_1.EvilType.Validator.isEnum(["none", "simple", "full"]);
    Type.isAlphaElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaElementValidatorObject); });
    Type.isAlphaDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaDefinitionValidatorObject); });
    Type.isImportDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.importDefinitionValidatorObject, false); });
    Type.isDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isCodeDefinition, Type.isNamespaceDefinition, Type.isValueDefinition, Type.isTypeDefinition, Type.isInterfaceDefinition, Type.isDictionaryDefinition); });
    Type.isDefinitionMap = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isDictionaryObject(Type.isDefinition); });
    Type.isCodeDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.codeDefinitionValidatorObject, false); });
    Type.isNamespaceDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.namespaceDefinitionValidatorObject, false); });
    Type.isValueDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.valueDefinitionValidatorObject, false); });
    Type.isTypeDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeDefinitionValidatorObject, false); });
    Type.isInterfaceDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.interfaceDefinitionValidatorObject, false); });
    Type.isDictionaryDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.dictionaryDefinitionValidatorObject, false); });
    Type.isArrayElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.arrayElementValidatorObject, false); });
    Type.isOrElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.orElementValidatorObject, false); });
    Type.isAndElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.andElementValidatorObject, false); });
    Type.isLiteralElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.literalElementValidatorObject, false); });
    Type.isReferElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.referElementValidatorObject, false); });
    var isNullType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(nullTypeValidatorObject, false); });
    var isBooleanType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(booleanTypeValidatorObject, false); });
    var isNumberType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(numberTypeValidatorObject, false); });
    var isIntegerType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(integerTypeValidatorObject, false); });
    var isStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(stringTypeValidatorObject, false); });
    Type.isPrimitiveTypeElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(isNullType, isBooleanType, isNumberType, isIntegerType, isStringType); });
    Type.isType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isPrimitiveTypeElement, Type.isTypeDefinition, Type.isEnumTypeElement, Type.isTypeofElement, Type.isItemofElement, Type.isInterfaceDefinition, Type.isDictionaryDefinition, Type.isArrayElement, Type.isOrElement, Type.isAndElement, Type.isLiteralElement); });
    Type.isEnumTypeElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.enumTypeElementValidatorObject, false); });
    Type.isTypeofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeofElementValidatorObject, false); });
    Type.isItemofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.itemofElementValidatorObject, false); });
    Type.isTypeOrRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isReferElement); });
    Type.isTypeOrValue = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isValueDefinition); });
    Type.isTypeOrValueOfRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isTypeOrValue, Type.isReferElement); });
    Type.commentPropertyValidatorObject = ({ comment: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)), });
    Type.commonPropertiesValidatorObject = ({ title: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), description: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString),
    });
    Type.typeSchemaValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commentPropertyValidatorObject, { $schema: Type.isSchema, imports: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isImportDefinition)), defines: Type.isDefinitionMap, options: Type.isOutputOptions, });
    Type.outputOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, indentUnit: evil_type_1.EvilType.Validator.isEnum([0, 1, 2, 3, 4, 5, 6, 7, 8, "tab"]), indentStyle: Type.isIndentStyleType, validatorOption: Type.isValidatorOptionType, maxLineLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isInteger)), schema: evil_type_1.EvilType.Validator.isOptional(Type.isSchemaOptions), });
    Type.schemaOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, $id: evil_type_1.EvilType.Validator.isString, $ref: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString),
        externalReferMapping: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDictionaryObject(evil_type_1.EvilType.Validator.isString)), });
    Type.alphaElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $type: evil_type_1.EvilType.Validator.isString, });
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
    Type.referElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $ref: evil_type_1.EvilType.Validator.isString, });
    var nullTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("primitive-type"), type: evil_type_1.EvilType.Validator.isJust("null"), });
    var booleanTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("primitive-type"), type: evil_type_1.EvilType.Validator.isJust("boolean"), });
    var numberTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("primitive-type"), type: evil_type_1.EvilType.Validator.isJust("number"), });
    var integerTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("primitive-type"), type: evil_type_1.EvilType.Validator.isJust("integer"), });
    var stringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $type: evil_type_1.EvilType.Validator.isJust("primitive-type"), type: evil_type_1.EvilType.Validator.isJust("string"), pattern: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.enumTypeElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("enum-type"), members: evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isBoolean, evil_type_1.EvilType.Validator.isNumber, evil_type_1.EvilType.Validator.isString)), title: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), description: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.typeofElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("typeof"), value: Type.isReferElement, title: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), description: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.itemofElementValidatorObject = ({ $type: evil_type_1.EvilType.Validator.isJust("itemof"), value: Type.isReferElement, title: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), description: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=type.js.map