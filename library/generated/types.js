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
    Types.isCommentProperty = types_prime_1.TypesPrime.isSpecificObject(Types.getCommentPropertyValidator());
    Types.getTypeSchemaValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getCommentPropertyValidator(), { $ref: Types.isSchema, imports: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(Types.isImportDefinition)), defines: types_prime_1.TypesPrime.isDictionaryObject(Types.isDefinition), options: Types.isOutputOptions, }); };
    Types.isTypeSchema = types_prime_1.TypesPrime.isSpecificObject(Types.getTypeSchemaValidator());
    Types.getOutputOptionsValidator = function () { return ({ outputFile: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isString), indentUnit: types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isJust("\t")), indentStyle: Types.isIndentStyleType,
        validatorOption: Types.isValidatorOptionType, maxLineLength: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNull, types_prime_1.TypesPrime.isNumber)), }); };
    Types.isOutputOptions = types_prime_1.TypesPrime.isSpecificObject(Types.getOutputOptionsValidator());
    Types.isIndentStyleType = function (value, listner) { return types_prime_1.TypesPrime.isEnum(Types.indentStyleTypeMember)(value, listner); };
    Types.isValidatorOptionType = function (value, listner) { return types_prime_1.TypesPrime.isEnum(["none", "simple", "full"])(value, listner); };
    Types.getAlphaElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isString, }); };
    Types.isAlphaElement = types_prime_1.TypesPrime.isSpecificObject(Types.getAlphaElementValidator());
    Types.getAlphaDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), Types.getCommentPropertyValidator(), { export: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean), }); };
    Types.isAlphaDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getAlphaDefinitionValidator());
    Types.getImportDefinitionValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("import"),
        target: types_prime_1.TypesPrime.isString, from: types_prime_1.TypesPrime.isString, }); };
    Types.isImportDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getImportDefinitionValidator());
    Types.isDefinition = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isCodeDefinition, Types.isNamespaceDefinition, Types.isValueDefinition, Types.isTypeDefinition, Types.isInterfaceDefinition, Types.isDictionaryDefinition)(value, listner); };
    Types.getCodeDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("code"), tokens: types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString), }); };
    Types.isCodeDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getCodeDefinitionValidator());
    Types.getNamespaceDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("namespace"), members: types_prime_1.TypesPrime.isDictionaryObject(Types.isDefinition), }); };
    Types.isNamespaceDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getNamespaceDefinitionValidator());
    Types.getValueDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("value"), value: types_prime_1.TypesPrime.isOr(Types.isLiteralElement, Types.isReferElement),
        validator: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean), }); };
    Types.isValueDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getValueDefinitionValidator());
    Types.getTypeDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("type"), define: Types.isTypeOrRefer, }); };
    Types.isTypeDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getTypeDefinitionValidator());
    Types.getInterfaceDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("interface"), extends: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(Types.isReferElement)), members: types_prime_1.TypesPrime.isDictionaryObject(Types.isTypeOrRefer), }); };
    Types.isInterfaceDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getInterfaceDefinitionValidator());
    Types.getDictionaryDefinitionValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaDefinitionValidator(), { $type: types_prime_1.TypesPrime.isJust("dictionary"), valueType: Types.isTypeOrRefer,
    }); };
    Types.isDictionaryDefinition = types_prime_1.TypesPrime.isSpecificObject(Types.getDictionaryDefinitionValidator());
    Types.getArrayElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("array"), items: Types.isTypeOrRefer, }); };
    Types.isArrayElement = types_prime_1.TypesPrime.isSpecificObject(Types.getArrayElementValidator());
    Types.getOrElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("or"), types: types_prime_1.TypesPrime.isArray(Types.isTypeOrRefer), }); };
    Types.isOrElement = types_prime_1.TypesPrime.isSpecificObject(Types.getOrElementValidator());
    Types.getAndElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("and"), types: types_prime_1.TypesPrime.isArray(Types.isTypeOrRefer), }); };
    Types.isAndElement = types_prime_1.TypesPrime.isSpecificObject(Types.getAndElementValidator());
    Types.getLiteralElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("literal"), literal: jsonable_1.Jsonable.isJsonable, }); };
    Types.isLiteralElement = types_prime_1.TypesPrime.isSpecificObject(Types.getLiteralElementValidator());
    Types.getReferElementValidator = function () { return ({ $ref: types_prime_1.TypesPrime.isString, }); };
    Types.isReferElement = types_prime_1.TypesPrime.isSpecificObject(Types.getReferElementValidator());
    Types.isPrimitiveTypeEnum = function (value, listner) { return types_prime_1.TypesPrime.isEnum(Types.PrimitiveTypeEnumMembers)(value, listner); };
    Types.getPrimitiveTypeElementValidator = function () { return types_prime_1.TypesPrime.mergeObjectValidator(Types.getAlphaElementValidator(), { $type: types_prime_1.TypesPrime.isJust("primitive-type"), type: Types.isPrimitiveTypeEnum,
    }); };
    Types.isPrimitiveTypeElement = types_prime_1.TypesPrime.isSpecificObject(Types.getPrimitiveTypeElementValidator());
    Types.isType = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isPrimitiveTypeElement, Types.isTypeDefinition, Types.isEnumTypeElement, Types.isTypeofElement, Types.isItemofElement, Types.isInterfaceDefinition, Types.isDictionaryDefinition, Types.isArrayElement, Types.isOrElement, Types.isAndElement, Types.isLiteralElement)(value, listner); };
    Types.getEnumTypeElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("enum-type"),
        members: types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNull, types_prime_1.TypesPrime.isBoolean, types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isString)), }); };
    Types.isEnumTypeElement = types_prime_1.TypesPrime.isSpecificObject(Types.getEnumTypeElementValidator());
    Types.getTypeofElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("typeof"), value: Types.isReferElement, }); };
    Types.isTypeofElement = types_prime_1.TypesPrime.isSpecificObject(Types.getTypeofElementValidator());
    Types.getItemofElementValidator = function () { return ({ $type: types_prime_1.TypesPrime.isJust("itemof"), value: Types.isReferElement, }); };
    Types.isItemofElement = types_prime_1.TypesPrime.isSpecificObject(Types.getItemofElementValidator());
    Types.isTypeOrRefer = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isType, Types.isReferElement)(value, listner); };
    Types.isTypeOrValue = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isType, Types.isValueDefinition)(value, listner); };
    Types.isTypeOrValueOfRefer = function (value, listner) { return types_prime_1.TypesPrime.isOr(Types.isTypeOrValue, Types.isReferElement)(value, listner); };
})(Types || (exports.Types = Types = {}));
//# sourceMappingURL=types.js.map