"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
var types_prime_1 = require("./types-prime");
var Types;
(function (Types) {
    Types.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    Types.ValidatorOptionTypeMembers = ["none", "simple", "full",];
    Types.isValidatorOptionType = types_prime_1.TypesPrime.isEnum(Types.ValidatorOptionTypeMembers);
    Types.IndentStyleMembers = ["allman", "egyptian",];
    Types.isIndentStyleType = types_prime_1.TypesPrime.isEnum(Types.IndentStyleMembers);
    Types.isOutputOptions = types_prime_1.TypesPrime.isSpecificObject({
        "outputFile": types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isString),
        "indentUnit": types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isJust("\t")),
        "indentStyle": Types.isIndentStyleType,
        "validatorOption": Types.isValidatorOptionType,
        "maxLineLength": types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNull, types_prime_1.TypesPrime.isNumber)),
    });
    Types.getCommentPropertyValidator = function () {
        return ({
            comment: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString)),
        });
    };
    Types.isCommentProperty = types_prime_1.TypesPrime.isSpecificObject(Types.getCommentPropertyValidator);
    Types.getTypeSchemaValidator = function () { return Object.assign(Types.getCommentPropertyValidator(), {
        $ref: types_prime_1.TypesPrime.isJust(Types.schema),
        imports: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(Types.isImportDefinition)),
        defines: types_prime_1.TypesPrime.isDictionaryObject(Types.isDefinition),
        options: Types.isOutputOptions,
    }); };
    Types.isTypeSchema = types_prime_1.TypesPrime.isSpecificObject(Types.getTypeSchemaValidator);
    Types.isReferElement = types_prime_1.TypesPrime.isSpecificObject({
        "$ref": types_prime_1.TypesPrime.isString,
    });
    Types.isImportDefinition = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("import"),
        target: types_prime_1.TypesPrime.isString,
        from: types_prime_1.TypesPrime.isString,
    })(value, listner); };
    Types.isModuleDefinition = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        comment: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString)),
        export: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean),
        $type: types_prime_1.TypesPrime.isJust("module"),
        members: types_prime_1.TypesPrime.isDictionaryObject(Types.isDefinition),
    })(value, listner); };
    Types.PrimitiveTypeEnumMembers = ["null", "boolean", "number", "string"];
    Types.isPrimitiveTypeEnum = types_prime_1.TypesPrime.isEnum(Types.PrimitiveTypeEnumMembers);
    Types.isPrimitiveTypeElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("primitive-type"),
        type: Types.isPrimitiveTypeEnum,
    })(value, listner); };
    Types.isLiteralElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("literal"),
        literal: types_prime_1.TypesPrime.isJsonable,
    })(value, listner); };
    Types.isValueDefinition = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        comment: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString)),
        export: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean),
        $type: types_prime_1.TypesPrime.isJust("value"),
        value: types_prime_1.TypesPrime.isOr(Types.isLiteralElement, Types.isReferElement),
        validator: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean),
    })(value, listner); };
    Types.isTypeofElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("typeof"),
        value: Types.isReferElement,
    })(value, listner); };
    Types.isItemofElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("itemof"),
        value: Types.isReferElement,
    })(value, listner); };
    Types.isTypeDefinition = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        comment: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString)),
        export: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean),
        $type: types_prime_1.TypesPrime.isJust("type"),
        define: Types.isTypeOrRefer,
    })(value, listner); };
    Types.isEnumTypeElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("enum-type"),
        members: types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isNumber, types_prime_1.TypesPrime.isString)),
    })(value, listner); };
    Types.isInterfaceDefinition = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        comment: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(types_prime_1.TypesPrime.isString)),
        export: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isBoolean),
        $type: types_prime_1.TypesPrime.isJust("interface"),
        extends: types_prime_1.TypesPrime.isOptional(types_prime_1.TypesPrime.isArray(Types.isReferElement)),
        members: types_prime_1.TypesPrime.isOr(types_prime_1.TypesPrime.isDictionaryObject(Types.isTypeOrRefer), Types.isDictionaryElement),
    })(value, listner); };
    Types.isDictionaryElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("dictionary"),
        valueType: Types.isTypeOrRefer,
    })(value, listner); };
    Types.isArrayElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("array"),
        items: Types.isTypeOrRefer,
    })(value, listner); };
    Types.isOrElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("or"),
        types: types_prime_1.TypesPrime.isArray(Types.isTypeOrRefer),
    })(value, listner); };
    Types.isAndElement = function (value, listner) { return types_prime_1.TypesPrime.isSpecificObject({
        $type: types_prime_1.TypesPrime.isJust("and"),
        types: types_prime_1.TypesPrime.isArray(Types.isTypeOrRefer),
    })(value, listner); };
    Types.isType = types_prime_1.TypesPrime.isOr(Types.isPrimitiveTypeElement, Types.isTypeDefinition, Types.isEnumTypeElement, Types.isTypeofElement, Types.isItemofElement, Types.isInterfaceDefinition, Types.isDictionaryElement, Types.isArrayElement, Types.isOrElement, Types.isAndElement, Types.isLiteralElement);
    Types.isTypeOrValue = types_prime_1.TypesPrime.isOr(Types.isType, Types.isValueDefinition);
    Types.isTypeOrRefer = types_prime_1.TypesPrime.isOr(Types.isType, Types.isReferElement);
    Types.isDefinition = types_prime_1.TypesPrime.isOr(Types.isModuleDefinition, Types.isValueDefinition, Types.isTypeDefinition, Types.isInterfaceDefinition);
    Types.isDefineOrRefer = types_prime_1.TypesPrime.isOr(Types.isDefinition, Types.isReferElement);
})(Types || (exports.Types = Types = {}));
//# sourceMappingURL=types.js.map