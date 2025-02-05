// This file is generated.
import { EvilType } from "../../common/evil-type";
import { Jsonable } from "./jsonable";
export { EvilType, Jsonable };
export namespace Type
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#" as const;
    export interface CommentProperty
    {
        comment?: string[];
    }
    export interface CommonProperties
    {
        default?: Jsonable.Jsonable;
        title?: string;
        description?: string;
    }
    export interface TypeSchema extends CommentProperty
    {
        $schema: typeof schema;
        imports?: ImportDefinition[];
        defines: DefinitionMap;
        options: OutputOptions;
    }
    export interface OutputOptions
    {
        outputFile: string;
        indentUnit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "tab";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        safeNumber?: boolean;
        safeInteger?: boolean;
        maxLineLength?: null | number;
        StringFormatMap?: { [ key in keyof typeof StringFormatMap ] ?: StringFormatEntry; };
        default?: { export?: boolean; target?: DefinitionTarget; additionalProperties?: boolean; safeInteger?: boolean; safeNumber?: boolean; regexpFlags?:
            string; regexpTest?: string; };
        schema?: SchemaOptions;
    }
    export interface SchemaOptions
    {
        outputFile: string;
        $id?: string;
        $ref?: string;
        externalReferMapping?: { [ key: string ]: string; };
    }
    export const indentStyleTypeMember = [ "allman", "egyptian" ] as const;
    export type IndentStyleType = typeof indentStyleTypeMember[number];
    export type ValidatorOptionType = "none" | "simple" | "full";
    export interface AlphaElement extends CommonProperties
    {
        type: string;
    }
    export type DefinitionTarget = "none" | "typescript" | "json-schema" | "all";
    export interface AlphaDefinition extends AlphaElement, CommentProperty
    {
        export?: boolean;
        target?: DefinitionTarget;
    }
    export interface ImportDefinition
    {
        import: string;
        from: string;
    }
    export type Definition = CodeDefinition | NamespaceDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition | DictionaryDefinition;
    export type DefinitionMap =
    {
        [ key: string ]: Definition;
    }
    export interface CodeDefinition extends AlphaDefinition
    {
        type: "code";
        tokens: string[];
    }
    export interface NamespaceDefinition extends AlphaDefinition
    {
        type: "namespace";
        members: DefinitionMap;
    }
    export interface ValueDefinition extends AlphaDefinition
    {
        type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    export interface TypeDefinition extends AlphaDefinition
    {
        type: "type";
        define: TypeOrRefer;
        validator?: boolean;
    }
    export interface InterfaceDefinition extends AlphaDefinition
    {
        type: "interface";
        extends?: ReferElement[];
        members: { [ key: string ]: TypeOrRefer; };
        additionalProperties?: boolean;
    }
    export interface DictionaryDefinition extends AlphaDefinition
    {
        type: "dictionary";
        keyin?: TypeOrRefer;
        optionality?: "as-is" | "partial" | "required";
        valueType: TypeOrRefer;
        additionalProperties?: boolean;
    }
    export interface ArrayElement extends AlphaElement
    {
        type: "array";
        items: TypeOrRefer;
        minItems?: number;
        maxItems?: number;
        uniqueItems?: boolean;
    }
    export interface OrElement extends AlphaElement
    {
        type: "or";
        types: TypeOrRefer[];
    }
    export interface AndElement extends AlphaElement
    {
        type: "and";
        types: TypeOrRefer[];
    }
    export interface LiteralElement extends CommonProperties
    {
        const: Jsonable.Jsonable;
    }
    export interface ReferElement extends CommonProperties
    {
        $ref: string;
    }
    export interface NeverType extends CommonProperties
    {
        type: "never";
    }
    export interface AnyType extends CommonProperties
    {
        type: "any";
    }
    export interface UnknownType extends CommonProperties
    {
        type: "unknown";
    }
    export interface NullType extends CommonProperties
    {
        type: "null";
    }
    export interface BooleanType extends CommonProperties
    {
        type: "boolean";
        default?: boolean;
    }
    export interface IntegerType extends CommonProperties
    {
        type: "integer";
        minimum?: number;
        exclusiveMinimum?: number;
        maximum?: number;
        exclusiveMaximum?: number;
        multipleOf?: number;
        safeInteger?: boolean;
        default?: number;
    }
    export interface NumberType extends CommonProperties
    {
        type: "number";
        minimum?: number;
        exclusiveMinimum?: number;
        maximum?: number;
        exclusiveMaximum?: number;
        multipleOf?: number;
        safeNumber?: boolean;
        default?: number;
    }
    export interface BasicStringType extends CommonProperties
    {
        type: "string";
        minLength?: number;
        maxLength?: number;
        default?: string;
    }
    export interface PatternStringType extends BasicStringType
    {
        pattern: string;
        tsPattern?: string[];
        regexpFlags?: string;
        regexpTest?: string;
    }
    export interface FormatStringType extends BasicStringType
    {
        format: keyof typeof StringFormatMap;
        regexpFlags?: string;
    }
    export type StringType = BasicStringType | PatternStringType | FormatStringType;
    export type PrimitiveTypeElement = NeverType | AnyType | UnknownType | NullType | BooleanType | NumberType | IntegerType | StringType;
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | KeyofElement | ItemofElement | MemberofElement |
        InterfaceDefinition | DictionaryDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    export interface EnumTypeElement extends CommonProperties
    {
        type: "enum-type";
        members:(null | boolean | number | string)[];
    }
    export interface TypeofElement extends CommonProperties
    {
        type: "typeof";
        value: ReferElement;
    }
    export interface KeyofElement extends CommonProperties
    {
        type: "keyof";
        value: TypeofElement | ReferElement;
    }
    export interface ItemofElement extends CommonProperties
    {
        type: "itemof";
        value: ReferElement;
    }
    export interface MemberofElement extends CommonProperties
    {
        type: "memberof";
        value: ReferElement;
        key: string | number;
    }
    export type TypeOrRefer = Type | ReferElement;
    export type TypeOrValue = Type | ValueDefinition;
    export type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    export type TypeOrLiteralOfRefer = TypeOrRefer | LiteralElement;
    export const StringFormatMap = { "date-time": { "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}\\:\\d{2}\\:\\d{2}[+-]\\d{2}\\:\\d{2}$", "tsPattern": [
        "${number}-${number}-${number}T${number}:${number}:${number}${ \"+\" | \"-\" }${number}:${number}" ] }, "date": { "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
        "tsPattern": [ "${number}-${number}-${number}" ] }, "time": { "pattern": "^\\d{2}\\:\\d{2}\\:\\d{2}[+-]\\d{2}\\:\\d{2}$", "tsPattern": [
        "${number}:${number}:${number}${ \"+\" | \"-\" }${number}:${number}" ] }, "duration": {
        "pattern": "^P(?:\\d+W|(?:\\d+Y(?:\\d+M(?:\\d+D)?)?)|(?:\\d+M(?:\\d+D)?)|\\d+D)?(?:T(?:\\d+H(?:\\d+M(?:\\d+S)?)?)|(?:\\d+M(?:\\d+S)?)|\\d+S)?$",
        "tsPattern": [ "P${string}T${string}", "P${string}", "PT${string}" ] }, "email": {
        "pattern": "^(?:[\\x21-\\x3F]|[\\x41-\\x7E])+@(?:[\\x21-0x3F]|[\\x41-\\x7E])+\\.(?:[\\x21-\\x3F]|[\\x41-\\x7E])+$", "tsPattern": [
        "${string}@${string}.${string}" ] }, "idn-email": { "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "tsPattern": [ "${string}@${string}.${string}" ] },
        "hostname": { "pattern": "^(?:[\\x21-\\x3F]|[\\x41-\\x7E])+$" }, "idn-hostname": { "pattern": "^\\S+$" }, "ipv4": {
        "pattern": "^[12]?\\d{1,2}\\.[12]?\\d{1,2}\\.[12]?\\d{1,2}\\.[12]?\\d{1,2}$", "tsPattern": [ "${number}.${number}.${number}.${number}" ] }, "ipv6": {
        "pattern": "^(?=.*\\:.*\\:.*)(?!.*\\:{3}.*)(?!.*\\:{2}.*\\:{2}.*)(?!.*[0-9A-Fa-f]{5,}.*)(?:(?:(?=.*\\:\\:.*)(?:(?:[0-9A-Fa-f]{0,4}\\:){2,7}[0-9A-Fa-f]{0,4}|(?:[0-9A-Fa-f]{0,4}\\:){2,6}[12]?\\d{1,2}\\.[12]?\\d{1,2}\\.[12]?\\d{1,2}\\.[12]?\\d{1,2}))|(?:(?!.*\\:\\:.*)(?:(?:[0-9A-Fa-f]{1,4}\\:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}\\:){6}[12]?\\d{1,2}\\.[12]?\\d{1,2}\\.[12]?\\d{1,2}\\.[12]?\\d{1,2})))$",
        "tsPattern": [ "${string}:${string}:${string}" ] }, "uuid": {
        "pattern": "^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$", "tsPattern": [
        "${string}-${string}-${string}-${string}-${string}" ] }, "uri": {}, "uri-reference": {}, "iri": {}, "iri-reference": {}, "uri-template": {},
        "json-pointer": {}, "relative-json-pointer": {}, "regex": { "pattern": "^[[:regex:]]$" } } as const;
    export interface StringFormatEntry
    {
        pattern?: string;
        tsPattern?: string[];
        regexpFlags?: string;
        regexpTest?: string;
    }
    export const isSchema = EvilType.Validator.isJust(schema);
    export const isCommentProperty = EvilType.lazy(() => EvilType.Validator.isSpecificObject(commentPropertyValidatorObject, { additionalProperties: false }));
    export const isCommonProperties = EvilType.lazy(() => EvilType.Validator.isSpecificObject(commonPropertiesValidatorObject, { additionalProperties: false })
        );
    export const isTypeSchema = EvilType.lazy(() => EvilType.Validator.isSpecificObject(typeSchemaValidatorObject, { additionalProperties: false }));
    export const isOutputOptions = EvilType.lazy(() => EvilType.Validator.isSpecificObject(outputOptionsValidatorObject, { additionalProperties: false }));
    export const isSchemaOptions = EvilType.lazy(() => EvilType.Validator.isSpecificObject(schemaOptionsValidatorObject, { additionalProperties: false }));
    export const isIndentStyleType: EvilType.Validator.IsType<IndentStyleType> = EvilType.Validator.isEnum(indentStyleTypeMember);
    export const isValidatorOptionType: EvilType.Validator.IsType<ValidatorOptionType> = EvilType.Validator.isEnum([ "none", "simple", "full" ] as const);
    export const isAlphaElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(alphaElementValidatorObject, { additionalProperties: false }));
    export const isDefinitionTarget: EvilType.Validator.IsType<DefinitionTarget> = EvilType.Validator.isEnum([ "none", "typescript", "json-schema", "all" ] as
        const);
    export const isAlphaDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(alphaDefinitionValidatorObject, { additionalProperties: false }));
    export const isImportDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(importDefinitionValidatorObject, { additionalProperties: false })
        );
    export const isDefinition: EvilType.Validator.IsType<Definition> = EvilType.lazy(() => EvilType.Validator.isOr(isCodeDefinition, isNamespaceDefinition,
        isValueDefinition, isTypeDefinition, isInterfaceDefinition, isDictionaryDefinition));
    export const isDefinitionMap: EvilType.Validator.IsType<DefinitionMap> = EvilType.lazy(() => EvilType.Validator.isDictionaryObject(isDefinition));
    export const isCodeDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(codeDefinitionValidatorObject, { additionalProperties: false }));
    export const isNamespaceDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(namespaceDefinitionValidatorObject, { additionalProperties:
        false }));
    export const isValueDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(valueDefinitionValidatorObject, { additionalProperties: false }));
    export const isTypeDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(typeDefinitionValidatorObject, { additionalProperties: false }));
    export const isInterfaceDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(interfaceDefinitionValidatorObject, { additionalProperties:
        false }));
    export const isDictionaryDefinition = EvilType.lazy(() => EvilType.Validator.isSpecificObject(dictionaryDefinitionValidatorObject, { additionalProperties:
        false }));
    export const isArrayElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(arrayElementValidatorObject, { additionalProperties: false }));
    export const isOrElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(orElementValidatorObject, { additionalProperties: false }));
    export const isAndElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(andElementValidatorObject, { additionalProperties: false }));
    export const isLiteralElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(literalElementValidatorObject, { additionalProperties: false }));
    export const isReferElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(referElementValidatorObject, { additionalProperties: false }));
    export const isNeverType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(neverTypeValidatorObject, { additionalProperties: false }));
    export const isAnyType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(anyTypeValidatorObject, { additionalProperties: false }));
    export const isUnknownType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(unknownTypeValidatorObject, { additionalProperties: false }));
    export const isNullType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(nullTypeValidatorObject, { additionalProperties: false }));
    export const isBooleanType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(booleanTypeValidatorObject, { additionalProperties: false }));
    export const isIntegerType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(integerTypeValidatorObject, { additionalProperties: false }));
    export const isNumberType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(numberTypeValidatorObject, { additionalProperties: false }));
    export const isBasicStringType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(basicStringTypeValidatorObject, { additionalProperties: false }));
    export const isPatternStringType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(patternStringTypeValidatorObject, { additionalProperties: false
        }));
    export const isFormatStringType = EvilType.lazy(() => EvilType.Validator.isSpecificObject(formatStringTypeValidatorObject, { additionalProperties: false })
        );
    export const isStringType: EvilType.Validator.IsType<StringType> = EvilType.lazy(() => EvilType.Validator.isOr(isBasicStringType, isPatternStringType,
        isFormatStringType));
    export const isPrimitiveTypeElement: EvilType.Validator.IsType<PrimitiveTypeElement> = EvilType.lazy(() => EvilType.Validator.isOr(isNeverType, isAnyType,
        isUnknownType, isNullType, isBooleanType, isNumberType, isIntegerType, isStringType));
    export const isType: EvilType.Validator.IsType<Type> = EvilType.lazy(() => EvilType.Validator.isOr(isPrimitiveTypeElement, isTypeDefinition,
        isEnumTypeElement, isTypeofElement, isKeyofElement, isItemofElement, isMemberofElement, isInterfaceDefinition, isDictionaryDefinition, isArrayElement,
        isOrElement, isAndElement, isLiteralElement));
    export const isEnumTypeElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(enumTypeElementValidatorObject, { additionalProperties: false }));
    export const isTypeofElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(typeofElementValidatorObject, { additionalProperties: false }));
    export const isKeyofElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(keyofElementValidatorObject, { additionalProperties: false }));
    export const isItemofElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(itemofElementValidatorObject, { additionalProperties: false }));
    export const isMemberofElement = EvilType.lazy(() => EvilType.Validator.isSpecificObject(memberofElementValidatorObject, { additionalProperties: false }));
    export const isTypeOrRefer: EvilType.Validator.IsType<TypeOrRefer> = EvilType.lazy(() => EvilType.Validator.isOr(isType, isReferElement));
    export const isTypeOrValue: EvilType.Validator.IsType<TypeOrValue> = EvilType.lazy(() => EvilType.Validator.isOr(isType, isValueDefinition));
    export const isTypeOrValueOfRefer: EvilType.Validator.IsType<TypeOrValueOfRefer> = EvilType.lazy(() => EvilType.Validator.isOr(isTypeOrValue,
        isReferElement));
    export const isTypeOrLiteralOfRefer: EvilType.Validator.IsType<TypeOrLiteralOfRefer> = EvilType.lazy(() => EvilType.Validator.isOr(isTypeOrRefer,
        isLiteralElement));
    export const isStringFormatEntry = EvilType.lazy(() => EvilType.Validator.isSpecificObject(stringFormatEntryValidatorObject, { additionalProperties: false
        }));
    export const commentPropertyValidatorObject: EvilType.Validator.ObjectValidator<CommentProperty> = ({ comment: EvilType.Validator.isOptional(
        EvilType.Validator.isArray(EvilType.Validator.isString)), });
    export const commonPropertiesValidatorObject: EvilType.Validator.ObjectValidator<CommonProperties> = ({ default: EvilType.Validator.isOptional(
        Jsonable.isJsonable), title: EvilType.Validator.isOptional(EvilType.Validator.isString), description: EvilType.Validator.isOptional(
        EvilType.Validator.isString), });
    export const typeSchemaValidatorObject: EvilType.Validator.ObjectValidator<TypeSchema> = EvilType.Validator.mergeObjectValidator(
        commentPropertyValidatorObject, { $schema: isSchema, imports: EvilType.Validator.isOptional(EvilType.Validator.isArray(isImportDefinition, {
        uniqueItems:true, },)), defines: isDefinitionMap, options: isOutputOptions, });
    export const outputOptionsValidatorObject: EvilType.Validator.ObjectValidator<OutputOptions> = ({ outputFile: EvilType.Validator.isString, indentUnit:
        EvilType.Validator.isEnum([ 0, 1, 2, 3, 4, 5, 6, 7, 8, "tab" ] as const), indentStyle: isIndentStyleType, validatorOption: isValidatorOptionType,
        safeNumber: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), safeInteger: EvilType.Validator.isOptional(EvilType.Validator.isBoolean),
        maxLineLength: EvilType.Validator.isOptional(EvilType.Validator.isOr(EvilType.Validator.isNull, EvilType.Validator.isInteger)), StringFormatMap:
        EvilType.Validator.isOptional(({ "date-time": EvilType.Validator.isOptional(isStringFormatEntry), date: EvilType.Validator.isOptional(
        isStringFormatEntry), time: EvilType.Validator.isOptional(isStringFormatEntry), duration: EvilType.Validator.isOptional(isStringFormatEntry), email:
        EvilType.Validator.isOptional(isStringFormatEntry), "idn-email": EvilType.Validator.isOptional(isStringFormatEntry), hostname:
        EvilType.Validator.isOptional(isStringFormatEntry), "idn-hostname": EvilType.Validator.isOptional(isStringFormatEntry), ipv4:
        EvilType.Validator.isOptional(isStringFormatEntry), ipv6: EvilType.Validator.isOptional(isStringFormatEntry), uuid: EvilType.Validator.isOptional(
        isStringFormatEntry), uri: EvilType.Validator.isOptional(isStringFormatEntry), "uri-reference": EvilType.Validator.isOptional(isStringFormatEntry), iri
        : EvilType.Validator.isOptional(isStringFormatEntry), "iri-reference": EvilType.Validator.isOptional(isStringFormatEntry), "uri-template":
        EvilType.Validator.isOptional(isStringFormatEntry), "json-pointer": EvilType.Validator.isOptional(isStringFormatEntry), "relative-json-pointer":
        EvilType.Validator.isOptional(isStringFormatEntry), regex: EvilType.Validator.isOptional(isStringFormatEntry), })), default:
        EvilType.Validator.isOptional(({ export: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), target: EvilType.Validator.isOptional(
        isDefinitionTarget), additionalProperties: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), safeInteger: EvilType.Validator.isOptional(
        EvilType.Validator.isBoolean), safeNumber: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), regexpFlags: EvilType.Validator.isOptional(
        EvilType.Validator.isString), regexpTest: EvilType.Validator.isOptional(EvilType.Validator.isString), })), schema: EvilType.Validator.isOptional(
        isSchemaOptions), });
    export const schemaOptionsValidatorObject: EvilType.Validator.ObjectValidator<SchemaOptions> = ({ outputFile: EvilType.Validator.isString, $id:
        EvilType.Validator.isOptional(EvilType.Validator.isString), $ref: EvilType.Validator.isOptional(EvilType.Validator.isString), externalReferMapping:
        EvilType.Validator.isOptional(EvilType.Validator.isDictionaryObject(EvilType.Validator.isString)), });
    export const alphaElementValidatorObject: EvilType.Validator.ObjectValidator<AlphaElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isString, });
    export const alphaDefinitionValidatorObject: EvilType.Validator.ObjectValidator<AlphaDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaElementValidatorObject, commentPropertyValidatorObject, { export: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), target:
        EvilType.Validator.isOptional(isDefinitionTarget), });
    export const importDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ImportDefinition> = ({ import: EvilType.Validator.isString, from:
        EvilType.Validator.isString, });
    export const codeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<CodeDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { type: EvilType.Validator.isJust("code" as const), tokens: EvilType.Validator.isArray(EvilType.Validator.isString), });
    export const namespaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<NamespaceDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { type: EvilType.Validator.isJust("namespace" as const), members: isDefinitionMap, });
    export const valueDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ValueDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { type: EvilType.Validator.isJust("value" as const), value: EvilType.Validator.isOr(isLiteralElement, isReferElement),
        validator: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), });
    export const typeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<TypeDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { type: EvilType.Validator.isJust("type" as const), define: isTypeOrRefer, validator: EvilType.Validator.isOptional(
        EvilType.Validator.isBoolean), });
    export const interfaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<InterfaceDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { type: EvilType.Validator.isJust("interface" as const), extends: EvilType.Validator.isOptional(
        EvilType.Validator.isArray(isReferElement, { uniqueItems:true, },)), members: EvilType.Validator.isDictionaryObject(isTypeOrRefer),
        additionalProperties: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), });
    export const dictionaryDefinitionValidatorObject: EvilType.Validator.ObjectValidator<DictionaryDefinition> = EvilType.Validator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { type: EvilType.Validator.isJust("dictionary" as const), keyin: EvilType.Validator.isOptional(isTypeOrRefer),
        optionality: EvilType.Validator.isOptional(EvilType.Validator.isEnum([ "as-is", "partial", "required" ] as const)), valueType: isTypeOrRefer,
        additionalProperties: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), });
    export const arrayElementValidatorObject: EvilType.Validator.ObjectValidator<ArrayElement> = EvilType.Validator.mergeObjectValidator(
        alphaElementValidatorObject, { type: EvilType.Validator.isJust("array" as const), items: isTypeOrRefer, minItems: EvilType.Validator.isOptional(
        EvilType.Validator.isDetailedInteger({ minimum:0, })), maxItems: EvilType.Validator.isOptional(EvilType.Validator.isDetailedInteger({ minimum:0, })),
        uniqueItems: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), });
    export const orElementValidatorObject: EvilType.Validator.ObjectValidator<OrElement> = EvilType.Validator.mergeObjectValidator(alphaElementValidatorObject,
        { type: EvilType.Validator.isJust("or" as const), types: EvilType.Validator.isArray(isTypeOrRefer, { uniqueItems:true, },), });
    export const andElementValidatorObject: EvilType.Validator.ObjectValidator<AndElement> = EvilType.Validator.mergeObjectValidator(
        alphaElementValidatorObject, { type: EvilType.Validator.isJust("and" as const), types: EvilType.Validator.isArray(isTypeOrRefer, { uniqueItems:true, },
        ), });
    export const literalElementValidatorObject: EvilType.Validator.ObjectValidator<LiteralElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { const: Jsonable.isJsonable, });
    export const referElementValidatorObject: EvilType.Validator.ObjectValidator<ReferElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { $ref: EvilType.Validator.isString, });
    export const neverTypeValidatorObject: EvilType.Validator.ObjectValidator<NeverType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("never" as const), });
    export const anyTypeValidatorObject: EvilType.Validator.ObjectValidator<AnyType> = EvilType.Validator.mergeObjectValidator(commonPropertiesValidatorObject,
        { type: EvilType.Validator.isJust("any" as const), });
    export const unknownTypeValidatorObject: EvilType.Validator.ObjectValidator<UnknownType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("unknown" as const), });
    export const nullTypeValidatorObject: EvilType.Validator.ObjectValidator<NullType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("null" as const), });
    export const booleanTypeValidatorObject: EvilType.Validator.ObjectValidator<BooleanType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("boolean" as const), default: EvilType.Validator.isOptional(
        EvilType.Validator.isBoolean), });
    export const integerTypeValidatorObject: EvilType.Validator.ObjectValidator<IntegerType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("integer" as const), minimum: EvilType.Validator.isOptional(
        EvilType.Validator.isInteger), exclusiveMinimum: EvilType.Validator.isOptional(EvilType.Validator.isInteger), maximum: EvilType.Validator.isOptional(
        EvilType.Validator.isInteger), exclusiveMaximum: EvilType.Validator.isOptional(EvilType.Validator.isInteger), multipleOf: EvilType.Validator.isOptional
        (EvilType.Validator.isDetailedInteger({ exclusiveMinimum:0, })), safeInteger: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), default:
        EvilType.Validator.isOptional(EvilType.Validator.isInteger), });
    export const numberTypeValidatorObject: EvilType.Validator.ObjectValidator<NumberType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("number" as const), minimum: EvilType.Validator.isOptional(
        EvilType.Validator.isNumber), exclusiveMinimum: EvilType.Validator.isOptional(EvilType.Validator.isNumber), maximum: EvilType.Validator.isOptional(
        EvilType.Validator.isNumber), exclusiveMaximum: EvilType.Validator.isOptional(EvilType.Validator.isNumber), multipleOf: EvilType.Validator.isOptional(
        EvilType.Validator.isDetailedNumber({ exclusiveMinimum:0, })), safeNumber: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), default:
        EvilType.Validator.isOptional(EvilType.Validator.isNumber), });
    export const basicStringTypeValidatorObject: EvilType.Validator.ObjectValidator<BasicStringType> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("string" as const), minLength: EvilType.Validator.isOptional(
        EvilType.Validator.isDetailedInteger({ minimum:0, })), maxLength: EvilType.Validator.isOptional(EvilType.Validator.isDetailedInteger({ minimum:0, })),
        default: EvilType.Validator.isOptional(EvilType.Validator.isString), });
    export const patternStringTypeValidatorObject: EvilType.Validator.ObjectValidator<PatternStringType> = EvilType.Validator.mergeObjectValidator(
        basicStringTypeValidatorObject, { pattern: EvilType.Validator.isString, tsPattern: EvilType.Validator.isOptional(EvilType.Validator.isArray(
        EvilType.Validator.isString, { minItems:1, uniqueItems:true, },)), regexpFlags: EvilType.Validator.isOptional(EvilType.Validator.isString), regexpTest:
        EvilType.Validator.isOptional(EvilType.Validator.isString), });
    export const formatStringTypeValidatorObject: EvilType.Validator.ObjectValidator<FormatStringType> = EvilType.Validator.mergeObjectValidator(
        basicStringTypeValidatorObject, { format: EvilType.Validator.isEnum([ "date-time", "date", "time", "duration", "email", "idn-email", "hostname",
        "idn-hostname", "ipv4", "ipv6", "uuid", "uri", "uri-reference", "iri", "iri-reference", "uri-template", "json-pointer", "relative-json-pointer",
        "regex" ] as const), regexpFlags: EvilType.Validator.isOptional(EvilType.Validator.isString), });
    export const enumTypeElementValidatorObject: EvilType.Validator.ObjectValidator<EnumTypeElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("enum-type" as const), members: EvilType.Validator.isArray(EvilType.Validator.isOr(
        EvilType.Validator.isNull, EvilType.Validator.isBoolean, EvilType.Validator.isNumber, EvilType.Validator.isString), { uniqueItems:true, },), });
    export const typeofElementValidatorObject: EvilType.Validator.ObjectValidator<TypeofElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("typeof" as const), value: isReferElement, });
    export const keyofElementValidatorObject: EvilType.Validator.ObjectValidator<KeyofElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("keyof" as const), value: EvilType.Validator.isOr(isTypeofElement, isReferElement),
        });
    export const itemofElementValidatorObject: EvilType.Validator.ObjectValidator<ItemofElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("itemof" as const), value: isReferElement, });
    export const memberofElementValidatorObject: EvilType.Validator.ObjectValidator<MemberofElement> = EvilType.Validator.mergeObjectValidator(
        commonPropertiesValidatorObject, { type: EvilType.Validator.isJust("memberof" as const), value: isReferElement, key: EvilType.Validator.isOr(
        EvilType.Validator.isString, EvilType.Validator.isDetailedInteger({ minimum:0, })), });
    export const stringFormatEntryValidatorObject: EvilType.Validator.ObjectValidator<StringFormatEntry> = ({ pattern: EvilType.Validator.isOptional(
        EvilType.Validator.isDetailedString({ pattern:"^[[:regex:]]$", }, "u")), tsPattern: EvilType.Validator.isOptional(EvilType.Validator.isArray(
        EvilType.Validator.isString, { minItems:1, uniqueItems:true, },)), regexpFlags: EvilType.Validator.isOptional(EvilType.Validator.isString), regexpTest:
        EvilType.Validator.isOptional(EvilType.Validator.isString), });
}
