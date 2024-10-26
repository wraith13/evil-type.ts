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
    Type.StringFormatMap = { "date-time": "^date-time$", "date": "^date$", "time": "^time$", "duration": "^duration$",
        "email": "^email$", "idn-email": "^idn-email$", "hostname": "^hostname$", "idn-hostname": "^idn-hostname$", "ipv4": "^ipv4$",
        "ipv6": "^ipv6$", "uuid": "^uuid$", "uri": "^uri$", "uri-reference": "^uri-reference$", "iri": "^iri$",
        "iri-reference": "^iri-reference$", "uri-template": "^uri-template$", "json-pointer": "^json-pointer$",
        "relative-json-pointer": "^relative-json-pointer$", "regex": "^regex$" };
    Type.isSchema = evil_type_1.EvilType.Validator.isJust(Type.schema);
    Type.isCommentProperty = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.commentPropertyValidatorObject, false); });
    Type.isCommonProperties = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.commonPropertiesValidatorObject, false); });
    Type.isTypeSchema = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeSchemaValidatorObject, false); });
    Type.isOutputOptions = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.outputOptionsValidatorObject, false); });
    Type.isSchemaOptions = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.schemaOptionsValidatorObject, false); });
    Type.isIndentStyleType = evil_type_1.EvilType.Validator.isEnum(Type.indentStyleTypeMember);
    Type.isValidatorOptionType = evil_type_1.EvilType.Validator.isEnum(["none", "simple",
        "full"]);
    Type.isAlphaElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaElementValidatorObject, false); });
    Type.isAlphaDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaDefinitionValidatorObject, false); });
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
    Type.isNeverType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.neverTypeValidatorObject, false); });
    Type.isAnyType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.anyTypeValidatorObject, false); });
    Type.isUnknownType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.unknownTypeValidatorObject, false); });
    Type.isNullType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.nullTypeValidatorObject, false); });
    Type.isBooleanType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.booleanTypeValidatorObject, false); });
    Type.isIntegerType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.integerTypeValidatorObject, false); });
    Type.isNumberType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.numberTypeValidatorObject, false); });
    Type.isBasicStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.basicStringTypeValidatorObject, false); });
    Type.isPatternStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.patternStringTypeValidatorObject, false); });
    Type.isFormatStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.formatStringTypeValidatorObject, false); });
    Type.isStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isBasicStringType, Type.isPatternStringType, Type.isFormatStringType); });
    Type.isPrimitiveTypeElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isNeverType, Type.isAnyType, Type.isUnknownType, Type.isNullType, Type.isBooleanType, Type.isNumberType, Type.isIntegerType, Type.isStringType); });
    Type.isType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isPrimitiveTypeElement, Type.isTypeDefinition, Type.isEnumTypeElement, Type.isTypeofElement, Type.isKeyofElement, Type.isItemofElement, Type.isInterfaceDefinition, Type.isDictionaryDefinition, Type.isArrayElement, Type.isOrElement, Type.isAndElement, Type.isLiteralElement); });
    Type.isEnumTypeElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.enumTypeElementValidatorObject, false); });
    Type.isTypeofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeofElementValidatorObject, false); });
    Type.isKeyofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.keyofElementValidatorObject, false); });
    Type.isItemofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.itemofElementValidatorObject, false); });
    Type.isTypeOrRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isReferElement); });
    Type.isTypeOrValue = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isValueDefinition); });
    Type.isTypeOrValueOfRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isTypeOrValue, Type.isReferElement); });
    Type.isTypeOrLiteralOfRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isTypeOrRefer, Type.isLiteralElement); });
    Type.commentPropertyValidatorObject = ({ comment: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)), });
    Type.commonPropertiesValidatorObject = ({ default: evil_type_1.EvilType.Validator.isOptional(jsonable_1.Jsonable.isJsonable), title: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), description: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.typeSchemaValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commentPropertyValidatorObject, { $schema: Type.isSchema, imports: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isImportDefinition)), defines: Type.isDefinitionMap, options: Type.isOutputOptions, });
    Type.outputOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, indentUnit: evil_type_1.EvilType.Validator.isEnum([0, 1, 2, 3, 4, 5, 6, 7, 8, "tab"]), indentStyle: Type.isIndentStyleType, validatorOption: Type.isValidatorOptionType, safeNumber: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean),
        safeInteger: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), maxLineLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isSafeInteger)), default: evil_type_1.EvilType.Validator.isOptional(({
            export: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), additionalProperties: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), safeInteger: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), safeNumber: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), regexpFlags: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString),
        })), schema: evil_type_1.EvilType.Validator.isOptional(Type.isSchemaOptions), });
    Type.schemaOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, $id: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), $ref: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), externalReferMapping: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDictionaryObject(evil_type_1.EvilType.Validator.isString)), });
    Type.alphaElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isString, });
    Type.alphaDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, Type.commentPropertyValidatorObject, { export: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.importDefinitionValidatorObject = ({ import: evil_type_1.EvilType.Validator.isString, from: evil_type_1.EvilType.Validator.isString, });
    Type.codeDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("code"), tokens: evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString), });
    Type.namespaceDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("namespace"),
        members: Type.isDefinitionMap, });
    Type.valueDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("value"), value: evil_type_1.EvilType.Validator.isOr(Type.isLiteralElement, Type.isReferElement), validator: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.typeDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("type"), define: Type.isTypeOrRefer, });
    Type.interfaceDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("interface"),
        extends: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isReferElement)), members: evil_type_1.EvilType.Validator.isDictionaryObject(Type.isTypeOrRefer), additionalProperties: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.dictionaryDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("dictionary"),
        keyin: evil_type_1.EvilType.Validator.isOptional(Type.isTypeOrRefer), valueType: Type.isTypeOrRefer, additionalProperties: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.arrayElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("array"), items: Type.isTypeOrRefer, minItems: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailInteger({ minimum: 0, }, true)), maxItems: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailInteger({ minimum: 0, }, true)), uniqueItems: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.orElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("or"), types: evil_type_1.EvilType.Validator.isArray(Type.isTypeOrRefer), });
    Type.andElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("and"), types: evil_type_1.EvilType.Validator.isArray(Type.isTypeOrRefer), });
    Type.literalElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { const: jsonable_1.Jsonable.isJsonable, });
    Type.referElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $ref: evil_type_1.EvilType.Validator.isString, });
    Type.neverTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("never"), });
    Type.anyTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("any"), });
    Type.unknownTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("unknown"), });
    Type.nullTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("null"), });
    Type.booleanTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("boolean"), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.integerTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("integer"), minimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeInteger), exclusiveMinimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeInteger), maximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeInteger), exclusiveMaximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeInteger), multipleOf: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeInteger), safeInteger: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeInteger), });
    Type.numberTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("number"), minimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), exclusiveMinimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), maximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), exclusiveMaximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), multipleOf: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), safeNumber: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isSafeNumber), });
    Type.basicStringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("string"),
        minLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailInteger({ minimum: 0, }, true)), maxLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailInteger({ minimum: 0, }, true)), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.patternStringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.basicStringTypeValidatorObject, { pattern: evil_type_1.EvilType.Validator.isString, regexpFlags: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.formatStringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.basicStringTypeValidatorObject, { format: evil_type_1.EvilType.Validator.isEnum(["date-time", "date",
            "time", "duration", "email", "idn-email", "hostname", "idn-hostname", "ipv4", "ipv6", "uuid", "uri", "uri-reference", "iri",
            "iri-reference", "uri-template", "json-pointer", "relative-json-pointer", "regex"]), regexpFlags: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.enumTypeElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("enum-type"),
        members: evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isBoolean, evil_type_1.EvilType.Validator.isSafeNumber, evil_type_1.EvilType.Validator.isString)), });
    Type.typeofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("typeof"), value: Type.isReferElement, });
    Type.keyofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("keyof"), value: evil_type_1.EvilType.Validator.isOr(Type.isTypeofElement, Type.isReferElement), });
    Type.itemofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("itemof"), value: Type.isReferElement, });
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=type.js.map