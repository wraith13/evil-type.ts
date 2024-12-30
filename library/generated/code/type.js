"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Jsonable = exports.EvilType = void 0;
// This file is generated.
var evil_type_1 = require("../../common/evil-type");
Object.defineProperty(exports, "EvilType", { enumerable: true, get: function () { return evil_type_1.EvilType; } });
var jsonable_1 = require("./jsonable");
Object.defineProperty(exports, "Jsonable", { enumerable: true, get: function () { return jsonable_1.Jsonable; } });
var Type;
(function (Type) {
    Type.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    Type.indentStyleTypeMember = ["allman", "egyptian"];
    Type.StringFormatMap = { "date-time": { "pattern": "^date-time$" }, "date": { "pattern": "^date$" }, "time": {
            "pattern": "^time$"
        }, "duration": {
            "pattern": "^P(?:\\d+W|(?:\\d+Y(?:\\d+M(?:\\d+D)?)?)|(?:\\d+M(?:\\d+D)?)|\\d+D)?(?:T(?:\\d+H(?:\\d+M(?:\\d+S)?)?)|(?:\\d+M(?:\\d+S)?)|\\d+S)?$",
            "tsPattern": ["P${string}T${string}", "P${string}", "PT${string}"]
        }, "email": { "pattern": "^[^@\\s]+@[^@\\s]+$", "tsPattern": [
                "${string}@${string}"
            ] }, "idn-email": { "pattern": "^[^@\\s]+@[^@\\s]+$", "tsPattern": ["${string}@${string}"] }, "hostname": {
            "pattern": "^\\S+$"
        }, "idn-hostname": { "pattern": "^\\S+$" }, "ipv4": { "pattern": "^ipv4$" }, "ipv6": { "pattern": "^ipv6$" },
        "uuid": { "pattern": "^uuid$" }, "uri": { "pattern": "^uri$" }, "uri-reference": { "pattern": "^uri-reference$" }, "iri": {
            "pattern": "^iri$"
        }, "iri-reference": { "pattern": "^iri-reference$" }, "uri-template": { "pattern": "^uri-template$" },
        "json-pointer": { "pattern": "^json-pointer$" }, "relative-json-pointer": { "pattern": "^relative-json-pointer$" }, "regex": {
            "pattern": "^.*$"
        } };
    Type.isSchema = evil_type_1.EvilType.Validator.isJust(Type.schema);
    Type.isCommentProperty = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.commentPropertyValidatorObject, {
        additionalProperties: false
    }); });
    Type.isCommonProperties = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.commonPropertiesValidatorObject, {
        additionalProperties: false
    }); });
    Type.isTypeSchema = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeSchemaValidatorObject, { additionalProperties: false }); });
    Type.isOutputOptions = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.outputOptionsValidatorObject, {
        additionalProperties: false
    }); });
    Type.isSchemaOptions = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.schemaOptionsValidatorObject, {
        additionalProperties: false
    }); });
    Type.isIndentStyleType = evil_type_1.EvilType.Validator.isEnum(Type.indentStyleTypeMember);
    Type.isValidatorOptionType = evil_type_1.EvilType.Validator.isEnum(["none", "simple",
        "full"]);
    Type.isAlphaElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isAlphaDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.alphaDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isImportDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.importDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isCodeDefinition, Type.isNamespaceDefinition, Type.isValueDefinition, Type.isTypeDefinition, Type.isInterfaceDefinition, Type.isDictionaryDefinition); });
    Type.isDefinitionMap = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isDictionaryObject(Type.isDefinition); });
    Type.isCodeDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.codeDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isNamespaceDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.namespaceDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isValueDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.valueDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isTypeDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isInterfaceDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.interfaceDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isDictionaryDefinition = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.dictionaryDefinitionValidatorObject, {
        additionalProperties: false
    }); });
    Type.isArrayElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.arrayElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isOrElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.orElementValidatorObject, { additionalProperties: false }); });
    Type.isAndElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.andElementValidatorObject, { additionalProperties: false }); });
    Type.isLiteralElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.literalElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isReferElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.referElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isNeverType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.neverTypeValidatorObject, { additionalProperties: false }); });
    Type.isAnyType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.anyTypeValidatorObject, { additionalProperties: false
    }); });
    Type.isUnknownType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.unknownTypeValidatorObject, { additionalProperties: false }); });
    Type.isNullType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.nullTypeValidatorObject, { additionalProperties: false }); });
    Type.isBooleanType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.booleanTypeValidatorObject, { additionalProperties: false }); });
    Type.isIntegerType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.integerTypeValidatorObject, { additionalProperties: false }); });
    Type.isNumberType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.numberTypeValidatorObject, { additionalProperties: false }); });
    Type.isBasicStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.basicStringTypeValidatorObject, {
        additionalProperties: false
    }); });
    Type.isPatternStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.patternStringTypeValidatorObject, {
        additionalProperties: false
    }); });
    Type.isFormatStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.formatStringTypeValidatorObject, {
        additionalProperties: false
    }); });
    Type.isStringType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isBasicStringType, Type.isPatternStringType, Type.isFormatStringType); });
    Type.isPrimitiveTypeElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isNeverType, Type.isAnyType, Type.isUnknownType, Type.isNullType, Type.isBooleanType, Type.isNumberType, Type.isIntegerType, Type.isStringType); });
    Type.isType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isPrimitiveTypeElement, Type.isTypeDefinition, Type.isEnumTypeElement, Type.isTypeofElement, Type.isKeyofElement, Type.isItemofElement, Type.isMemberofElement, Type.isInterfaceDefinition, Type.isDictionaryDefinition, Type.isArrayElement, Type.isOrElement, Type.isAndElement, Type.isLiteralElement); });
    Type.isEnumTypeElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.enumTypeElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isTypeofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.typeofElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isKeyofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.keyofElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isItemofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.itemofElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isMemberofElement = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.memberofElementValidatorObject, {
        additionalProperties: false
    }); });
    Type.isTypeOrRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isReferElement); });
    Type.isTypeOrValue = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isType, Type.isValueDefinition); });
    Type.isTypeOrValueOfRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isTypeOrValue, Type.isReferElement); });
    Type.isTypeOrLiteralOfRefer = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isOr(Type.isTypeOrRefer, Type.isLiteralElement); });
    Type.isStringFormatEntry = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.stringFormatEntryValidatorObject, {
        additionalProperties: false
    }); });
    Type.commentPropertyValidatorObject = ({ comment: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)), });
    Type.commonPropertiesValidatorObject = ({ default: evil_type_1.EvilType.Validator.isOptional(jsonable_1.Jsonable.isJsonable), title: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), description: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.typeSchemaValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commentPropertyValidatorObject, { $schema: Type.isSchema, imports: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isImportDefinition, { uniqueItems: true, })), defines: Type.isDefinitionMap, options: Type.isOutputOptions, });
    Type.outputOptionsValidatorObject = ({ outputFile: evil_type_1.EvilType.Validator.isString, indentUnit: evil_type_1.EvilType.Validator.isEnum([0, 1, 2, 3, 4, 5, 6, 7, 8, "tab"]), indentStyle: Type.isIndentStyleType, validatorOption: Type.isValidatorOptionType, safeNumber: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean),
        safeInteger: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), maxLineLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isInteger)), StringFormatMap: evil_type_1.EvilType.Validator.isOptional(({ "date-time": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), date: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), time: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), duration: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), email: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), "idn-email": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), hostname: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), "idn-hostname": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), ipv4: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), ipv6: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), uuid: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), uri: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), "uri-reference": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), iri: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), "iri-reference": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), "uri-template": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry),
            "json-pointer": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), "relative-json-pointer": evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), regex: evil_type_1.EvilType.Validator.isOptional(Type.isStringFormatEntry), })), default: evil_type_1.EvilType.Validator.isOptional(({
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
    Type.typeDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("type"), define: Type.isTypeOrRefer, validator: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.interfaceDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("interface"),
        extends: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(Type.isReferElement, { uniqueItems: true, })), members: evil_type_1.EvilType.Validator.isDictionaryObject(Type.isTypeOrRefer), additionalProperties: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.dictionaryDefinitionValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaDefinitionValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("dictionary"),
        keyin: evil_type_1.EvilType.Validator.isOptional(Type.isTypeOrRefer), optionality: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isEnum([
            "as-is", "partial", "required"
        ])), valueType: Type.isTypeOrRefer, additionalProperties: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.arrayElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("array"), items: Type.isTypeOrRefer, minItems: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedInteger({ minimum: 0, })), maxItems: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedInteger({ minimum: 0, })), uniqueItems: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.orElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("or"), types: evil_type_1.EvilType.Validator.isArray(Type.isTypeOrRefer, {
            uniqueItems: true,
        }), });
    Type.andElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.alphaElementValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("and"), types: evil_type_1.EvilType.Validator.isArray(Type.isTypeOrRefer, {
            uniqueItems: true,
        }), });
    Type.literalElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { const: jsonable_1.Jsonable.isJsonable, });
    Type.referElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { $ref: evil_type_1.EvilType.Validator.isString, });
    Type.neverTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("never"), });
    Type.anyTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("any"), });
    Type.unknownTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("unknown"), });
    Type.nullTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("null"), });
    Type.booleanTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("boolean"), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), });
    Type.integerTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("integer"), minimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isInteger), exclusiveMinimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isInteger), maximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isInteger), exclusiveMaximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isInteger), multipleOf: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedInteger({ exclusiveMinimum: 0,
        })), safeInteger: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isInteger), });
    Type.numberTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("number"), minimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isNumber), exclusiveMinimum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isNumber), maximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isNumber), exclusiveMaximum: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isNumber), multipleOf: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedNumber({ exclusiveMinimum: 0, })), safeNumber: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isNumber), });
    Type.basicStringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("string"),
        minLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedInteger({ minimum: 0, })), maxLength: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedInteger({ minimum: 0, })), default: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.patternStringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.basicStringTypeValidatorObject, { pattern: evil_type_1.EvilType.Validator.isString, tsPattern: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString, { minItems: 1, uniqueItems: true, })),
        regexpFlags: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.formatStringTypeValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.basicStringTypeValidatorObject, { format: evil_type_1.EvilType.Validator.isEnum(["date-time", "date",
            "time", "duration", "email", "idn-email", "hostname", "idn-hostname", "ipv4", "ipv6", "uuid", "uri", "uri-reference", "iri",
            "iri-reference", "uri-template", "json-pointer", "relative-json-pointer", "regex"]), regexpFlags: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
    Type.enumTypeElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("enum-type"),
        members: evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isNull, evil_type_1.EvilType.Validator.isBoolean, evil_type_1.EvilType.Validator.isNumber, evil_type_1.EvilType.Validator.isString), { uniqueItems: true, }), });
    Type.typeofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("typeof"), value: Type.isReferElement, });
    Type.keyofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("keyof"), value: evil_type_1.EvilType.Validator.isOr(Type.isTypeofElement, Type.isReferElement), });
    Type.itemofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("itemof"), value: Type.isReferElement, });
    Type.memberofElementValidatorObject = evil_type_1.EvilType.Validator.mergeObjectValidator(Type.commonPropertiesValidatorObject, { type: evil_type_1.EvilType.Validator.isJust("memberof"),
        value: Type.isReferElement, key: evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isString, evil_type_1.EvilType.Validator.isDetailedInteger({ minimum: 0,
        })), });
    Type.stringFormatEntryValidatorObject = ({ pattern: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isDetailedString({ pattern: "^.*$", format: "regex", }, "u")), tsPattern: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString, { minItems: 1, uniqueItems: true, })),
        regexpFlags: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isString), });
})(Type || (exports.Type = Type = {}));
//# sourceMappingURL=type.js.map