// This file is generated.
import { EvilTypeValidator } from "../../source/validator";
import { EvilTypeError } from "../../source/error";
import { Jsonable } from "./jsonable";
export namespace Type
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#" as const;
    export interface CommentProperty
    {
        comment?: string[];
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
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
        schema?: SchemaOptions;
    }
    export interface SchemaOptions
    {
        outputFile: string;
        $id: string;
        $ref?: string;
        externalReferMapping?: { [key: string]: string, };
    }
    export const indentStyleTypeMember = ["allman","egyptian"] as const;
    export type IndentStyleType = typeof indentStyleTypeMember[number];
    export type ValidatorOptionType = "none" | "simple" | "full";
    export interface AlphaElement
    {
        $type: string;
    }
    export interface AlphaDefinition extends AlphaElement, CommentProperty
    {
        export?: boolean;
    }
    export interface ImportDefinition
    {
        $type: "import";
        target: string;
        from: string;
    }
    export type Definition = CodeDefinition | NamespaceDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition |
        DictionaryDefinition;
    export type DefinitionMap =
    {
        [key: string]: Definition;
    }
    export interface CodeDefinition extends AlphaDefinition
    {
        $type: "code";
        tokens: string[];
    }
    export interface NamespaceDefinition extends AlphaDefinition
    {
        $type: "namespace";
        members: DefinitionMap;
    }
    export interface ValueDefinition extends AlphaDefinition
    {
        $type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    export interface TypeDefinition extends AlphaDefinition
    {
        $type: "type";
        define: TypeOrRefer;
    }
    export interface InterfaceDefinition extends AlphaDefinition
    {
        $type: "interface";
        extends?: ReferElement[];
        members: { [key: string]: TypeOrRefer, };
        additionalProperties?: boolean;
    }
    export interface DictionaryDefinition extends AlphaDefinition
    {
        $type: "dictionary";
        valueType: TypeOrRefer;
    }
    export interface ArrayElement extends AlphaElement
    {
        $type: "array";
        items: TypeOrRefer;
    }
    export interface OrElement extends AlphaElement
    {
        $type: "or";
        types: TypeOrRefer[];
    }
    export interface AndElement extends AlphaElement
    {
        $type: "and";
        types: TypeOrRefer[];
    }
    export interface LiteralElement extends AlphaElement
    {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    export interface ReferElement
    {
        $ref: string;
    }
    export const PrimitiveTypeEnumMembers = ["null","boolean","number","string"] as const;
    export type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    export interface PrimitiveTypeElement extends AlphaElement
    {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition |
        DictionaryDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    export interface EnumTypeElement
    {
        $type: "enum-type";
        members:(null | boolean | number | string)[];
    }
    export interface TypeofElement
    {
        $type: "typeof";
        value: ReferElement;
    }
    export interface ItemofElement
    {
        $type: "itemof";
        value: ReferElement;
    }
    export type TypeOrRefer = Type | ReferElement;
    export type TypeOrValue = Type | ValueDefinition;
    export type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    export const isSchema = EvilTypeValidator.isJust(schema);
    export const getCommentPropertyValidator = () => <EvilTypeValidator.ObjectValidator<CommentProperty>>({ comment:
        EvilTypeValidator.isOptional(EvilTypeValidator.isArray(EvilTypeValidator.isString)), });
    export const isCommentProperty = (value: unknown, listner?: EvilTypeError.Listener): value is CommentProperty =>
        EvilTypeValidator.isSpecificObject<CommentProperty>(getCommentPropertyValidator())(value, listner);
    export const getTypeSchemaValidator = () => <EvilTypeValidator.ObjectValidator<TypeSchema>> EvilTypeValidator.mergeObjectValidator(
        getCommentPropertyValidator(), { $schema: isSchema, imports: EvilTypeValidator.isOptional(EvilTypeValidator.isArray(
        isImportDefinition)), defines: isDefinitionMap, options: isOutputOptions, });
    export const isTypeSchema = (value: unknown, listner?: EvilTypeError.Listener): value is TypeSchema =>
        EvilTypeValidator.isSpecificObject<TypeSchema>(getTypeSchemaValidator())(value, listner);
    export const getOutputOptionsValidator = () => <EvilTypeValidator.ObjectValidator<OutputOptions>>({ outputFile:
        EvilTypeValidator.isString, indentUnit: EvilTypeValidator.isOr(EvilTypeValidator.isNumber, EvilTypeValidator.isJust("\t")),
        indentStyle: isIndentStyleType, validatorOption: isValidatorOptionType, maxLineLength: EvilTypeValidator.isOptional(
        EvilTypeValidator.isOr(EvilTypeValidator.isNull, EvilTypeValidator.isNumber)), schema: EvilTypeValidator.isOptional(isSchemaOptions
        ), });
    export const isOutputOptions = (value: unknown, listner?: EvilTypeError.Listener): value is OutputOptions =>
        EvilTypeValidator.isSpecificObject<OutputOptions>(getOutputOptionsValidator())(value, listner);
    export const getSchemaOptionsValidator = () => <EvilTypeValidator.ObjectValidator<SchemaOptions>>({ outputFile:
        EvilTypeValidator.isString, $id: EvilTypeValidator.isString, $ref: EvilTypeValidator.isOptional(EvilTypeValidator.isString),
        externalReferMapping: EvilTypeValidator.isOptional(EvilTypeValidator.isDictionaryObject(EvilTypeValidator.isString)), });
    export const isSchemaOptions = (value: unknown, listner?: EvilTypeError.Listener): value is SchemaOptions =>
        EvilTypeValidator.isSpecificObject<SchemaOptions>(getSchemaOptionsValidator())(value, listner);
    export const isIndentStyleType = (value: unknown, listner?: EvilTypeError.Listener): value is IndentStyleType =>
        EvilTypeValidator.isEnum(indentStyleTypeMember)(value, listner);
    export const isValidatorOptionType = (value: unknown, listner?: EvilTypeError.Listener): value is ValidatorOptionType =>
        EvilTypeValidator.isEnum(["none","simple","full"])(value, listner);
    export const getAlphaElementValidator = () => <EvilTypeValidator.ObjectValidator<AlphaElement>>({ $type: EvilTypeValidator.isString, });
    export const isAlphaElement = (value: unknown, listner?: EvilTypeError.Listener): value is AlphaElement =>
        EvilTypeValidator.isSpecificObject<AlphaElement>(getAlphaElementValidator())(value, listner);
    export const getAlphaDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<AlphaDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaElementValidator(), getCommentPropertyValidator(), { export:
        EvilTypeValidator.isOptional(EvilTypeValidator.isBoolean), });
    export const isAlphaDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is AlphaDefinition =>
        EvilTypeValidator.isSpecificObject<AlphaDefinition>(getAlphaDefinitionValidator())(value, listner);
    export const getImportDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<ImportDefinition>>({ $type:
        EvilTypeValidator.isJust("import"), target: EvilTypeValidator.isString, from: EvilTypeValidator.isString, });
    export const isImportDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is ImportDefinition =>
        EvilTypeValidator.isSpecificObject<ImportDefinition>(getImportDefinitionValidator())(value, listner);
    export const isDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is Definition => EvilTypeValidator.isOr(
        isCodeDefinition, isNamespaceDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition, isDictionaryDefinition)(value,
        listner);
    export const isDefinitionMap = (value: unknown, listner?: EvilTypeError.Listener): value is DefinitionMap =>
        EvilTypeValidator.isDictionaryObject(isDefinition)(value, listner);
    export const getCodeDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<CodeDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: EvilTypeValidator.isJust("code"), tokens:
        EvilTypeValidator.isArray(EvilTypeValidator.isString), });
    export const isCodeDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is CodeDefinition =>
        EvilTypeValidator.isSpecificObject<CodeDefinition>(getCodeDefinitionValidator())(value, listner);
    export const getNamespaceDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<NamespaceDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: EvilTypeValidator.isJust("namespace"), members:
        isDefinitionMap, });
    export const isNamespaceDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is NamespaceDefinition =>
        EvilTypeValidator.isSpecificObject<NamespaceDefinition>(getNamespaceDefinitionValidator())(value, listner);
    export const getValueDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<ValueDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: EvilTypeValidator.isJust("value"), value:
        EvilTypeValidator.isOr(isLiteralElement, isReferElement), validator: EvilTypeValidator.isOptional(EvilTypeValidator.isBoolean), });
    export const isValueDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is ValueDefinition =>
        EvilTypeValidator.isSpecificObject<ValueDefinition>(getValueDefinitionValidator())(value, listner);
    export const getTypeDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<TypeDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: EvilTypeValidator.isJust("type"), define:
        isTypeOrRefer, });
    export const isTypeDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is TypeDefinition =>
        EvilTypeValidator.isSpecificObject<TypeDefinition>(getTypeDefinitionValidator())(value, listner);
    export const getInterfaceDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<InterfaceDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: EvilTypeValidator.isJust("interface"), extends:
        EvilTypeValidator.isOptional(EvilTypeValidator.isArray(isReferElement)), members: EvilTypeValidator.isDictionaryObject(
        isTypeOrRefer), additionalProperties: EvilTypeValidator.isOptional(EvilTypeValidator.isBoolean), });
    export const isInterfaceDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is InterfaceDefinition =>
        EvilTypeValidator.isSpecificObject<InterfaceDefinition>(getInterfaceDefinitionValidator())(value, listner);
    export const getDictionaryDefinitionValidator = () => <EvilTypeValidator.ObjectValidator<DictionaryDefinition>>
        EvilTypeValidator.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: EvilTypeValidator.isJust("dictionary"), valueType:
        isTypeOrRefer, });
    export const isDictionaryDefinition = (value: unknown, listner?: EvilTypeError.Listener): value is DictionaryDefinition =>
        EvilTypeValidator.isSpecificObject<DictionaryDefinition>(getDictionaryDefinitionValidator())(value, listner);
    export const getArrayElementValidator = () => <EvilTypeValidator.ObjectValidator<ArrayElement>> EvilTypeValidator.mergeObjectValidator(
        getAlphaElementValidator(), { $type: EvilTypeValidator.isJust("array"), items: isTypeOrRefer, });
    export const isArrayElement = (value: unknown, listner?: EvilTypeError.Listener): value is ArrayElement =>
        EvilTypeValidator.isSpecificObject<ArrayElement>(getArrayElementValidator())(value, listner);
    export const getOrElementValidator = () => <EvilTypeValidator.ObjectValidator<OrElement>> EvilTypeValidator.mergeObjectValidator(
        getAlphaElementValidator(), { $type: EvilTypeValidator.isJust("or"), types: EvilTypeValidator.isArray(isTypeOrRefer), });
    export const isOrElement = (value: unknown, listner?: EvilTypeError.Listener): value is OrElement =>
        EvilTypeValidator.isSpecificObject<OrElement>(getOrElementValidator())(value, listner);
    export const getAndElementValidator = () => <EvilTypeValidator.ObjectValidator<AndElement>> EvilTypeValidator.mergeObjectValidator(
        getAlphaElementValidator(), { $type: EvilTypeValidator.isJust("and"), types: EvilTypeValidator.isArray(isTypeOrRefer), });
    export const isAndElement = (value: unknown, listner?: EvilTypeError.Listener): value is AndElement =>
        EvilTypeValidator.isSpecificObject<AndElement>(getAndElementValidator())(value, listner);
    export const getLiteralElementValidator = () => <EvilTypeValidator.ObjectValidator<LiteralElement>>
        EvilTypeValidator.mergeObjectValidator(getAlphaElementValidator(), { $type: EvilTypeValidator.isJust("literal"), literal:
        Jsonable.isJsonable, });
    export const isLiteralElement = (value: unknown, listner?: EvilTypeError.Listener): value is LiteralElement =>
        EvilTypeValidator.isSpecificObject<LiteralElement>(getLiteralElementValidator())(value, listner);
    export const getReferElementValidator = () => <EvilTypeValidator.ObjectValidator<ReferElement>>({ $ref: EvilTypeValidator.isString, });
    export const isReferElement = (value: unknown, listner?: EvilTypeError.Listener): value is ReferElement =>
        EvilTypeValidator.isSpecificObject<ReferElement>(getReferElementValidator())(value, listner);
    export const isPrimitiveTypeEnum = (value: unknown, listner?: EvilTypeError.Listener): value is PrimitiveTypeEnum =>
        EvilTypeValidator.isEnum(PrimitiveTypeEnumMembers)(value, listner);
    export const getPrimitiveTypeElementValidator = () => <EvilTypeValidator.ObjectValidator<PrimitiveTypeElement>>
        EvilTypeValidator.mergeObjectValidator(getAlphaElementValidator(), { $type: EvilTypeValidator.isJust("primitive-type"), type:
        isPrimitiveTypeEnum, });
    export const isPrimitiveTypeElement = (value: unknown, listner?: EvilTypeError.Listener): value is PrimitiveTypeElement =>
        EvilTypeValidator.isSpecificObject<PrimitiveTypeElement>(getPrimitiveTypeElementValidator())(value, listner);
    export const isType = (value: unknown, listner?: EvilTypeError.Listener): value is Type => EvilTypeValidator.isOr(
        isPrimitiveTypeElement, isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition,
        isDictionaryDefinition, isArrayElement, isOrElement, isAndElement, isLiteralElement)(value, listner);
    export const getEnumTypeElementValidator = () => <EvilTypeValidator.ObjectValidator<EnumTypeElement>>({ $type: EvilTypeValidator.isJust
        ("enum-type"), members: EvilTypeValidator.isArray(EvilTypeValidator.isOr(EvilTypeValidator.isNull, EvilTypeValidator.isBoolean,
        EvilTypeValidator.isNumber, EvilTypeValidator.isString)), });
    export const isEnumTypeElement = (value: unknown, listner?: EvilTypeError.Listener): value is EnumTypeElement =>
        EvilTypeValidator.isSpecificObject<EnumTypeElement>(getEnumTypeElementValidator())(value, listner);
    export const getTypeofElementValidator = () => <EvilTypeValidator.ObjectValidator<TypeofElement>>({ $type: EvilTypeValidator.isJust(
        "typeof"), value: isReferElement, });
    export const isTypeofElement = (value: unknown, listner?: EvilTypeError.Listener): value is TypeofElement =>
        EvilTypeValidator.isSpecificObject<TypeofElement>(getTypeofElementValidator())(value, listner);
    export const getItemofElementValidator = () => <EvilTypeValidator.ObjectValidator<ItemofElement>>({ $type: EvilTypeValidator.isJust(
        "itemof"), value: isReferElement, });
    export const isItemofElement = (value: unknown, listner?: EvilTypeError.Listener): value is ItemofElement =>
        EvilTypeValidator.isSpecificObject<ItemofElement>(getItemofElementValidator())(value, listner);
    export const isTypeOrRefer = (value: unknown, listner?: EvilTypeError.Listener): value is TypeOrRefer => EvilTypeValidator.isOr(isType,
        isReferElement)(value, listner);
    export const isTypeOrValue = (value: unknown, listner?: EvilTypeError.Listener): value is TypeOrValue => EvilTypeValidator.isOr(isType,
        isValueDefinition)(value, listner);
    export const isTypeOrValueOfRefer = (value: unknown, listner?: EvilTypeError.Listener): value is TypeOrValueOfRefer =>
        EvilTypeValidator.isOr(isTypeOrValue, isReferElement)(value, listner);
}
