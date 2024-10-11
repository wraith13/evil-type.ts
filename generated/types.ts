// This file is generated.
import { TypesPrime } from "../source/types-prime";
import { TypesError } from "../source/types-error";
import { Jsonable } from "./jsonable";
export namespace Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export interface CommentProperty
    {
        comment?: string[];
    }
    export interface TypeSchema extends CommentProperty
    {
        $ref: typeof schema;
        imports?: ImportDefinition[];
        defines: { [key: string]: Definition, };
        options: OutputOptions;
    }
    export interface OutputOptions
    {
        outputFile?: string;
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
        schema?: SchemaOptions;
    }
    export interface SchemaOptions
    {
        outputFile: string;
        id: string;
        $ref?: string;
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
    export interface CodeDefinition extends AlphaDefinition
    {
        $type: "code";
        tokens: string[];
    }
    export interface NamespaceDefinition extends AlphaDefinition
    {
        $type: "namespace";
        members: { [key: string]: Definition, };
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
    export const isSchema = TypesPrime.isJust(schema);
    export const getCommentPropertyValidator = () => <TypesPrime.ObjectValidator<CommentProperty>>({ comment: TypesPrime.isOptional(
        TypesPrime.isArray(TypesPrime.isString)), });
    export const isCommentProperty = (value: unknown, listner?: TypesError.Listener): value is CommentProperty =>
        TypesPrime.isSpecificObject<CommentProperty>(getCommentPropertyValidator())(value, listner);
    export const getTypeSchemaValidator = () => <TypesPrime.ObjectValidator<TypeSchema>> TypesPrime.mergeObjectValidator(
        getCommentPropertyValidator(), { $ref: isSchema, imports: TypesPrime.isOptional(TypesPrime.isArray(isImportDefinition)), defines:
        TypesPrime.isDictionaryObject(isDefinition), options: isOutputOptions, });
    export const isTypeSchema = (value: unknown, listner?: TypesError.Listener): value is TypeSchema =>
        TypesPrime.isSpecificObject<TypeSchema>(getTypeSchemaValidator())(value, listner);
    export const getOutputOptionsValidator = () => <TypesPrime.ObjectValidator<OutputOptions>>({ outputFile: TypesPrime.isOptional(
        TypesPrime.isString), indentUnit: TypesPrime.isOr(TypesPrime.isNumber, TypesPrime.isJust("\t")), indentStyle: isIndentStyleType,
        validatorOption: isValidatorOptionType, maxLineLength: TypesPrime.isOptional(TypesPrime.isOr(TypesPrime.isNull, TypesPrime.isNumber
        )), schema: TypesPrime.isOptional(isSchemaOptions), });
    export const isOutputOptions = (value: unknown, listner?: TypesError.Listener): value is OutputOptions =>
        TypesPrime.isSpecificObject<OutputOptions>(getOutputOptionsValidator())(value, listner);
    export const getSchemaOptionsValidator = () => <TypesPrime.ObjectValidator<SchemaOptions>>({ outputFile: TypesPrime.isString, id:
        TypesPrime.isString, $ref: TypesPrime.isOptional(TypesPrime.isString), });
    export const isSchemaOptions = (value: unknown, listner?: TypesError.Listener): value is SchemaOptions =>
        TypesPrime.isSpecificObject<SchemaOptions>(getSchemaOptionsValidator())(value, listner);
    export const isIndentStyleType = (value: unknown, listner?: TypesError.Listener): value is IndentStyleType => TypesPrime.isEnum(
        indentStyleTypeMember)(value, listner);
    export const isValidatorOptionType = (value: unknown, listner?: TypesError.Listener): value is ValidatorOptionType => TypesPrime.isEnum
        (["none","simple","full"])(value, listner);
    export const getAlphaElementValidator = () => <TypesPrime.ObjectValidator<AlphaElement>>({ $type: TypesPrime.isString, });
    export const isAlphaElement = (value: unknown, listner?: TypesError.Listener): value is AlphaElement =>
        TypesPrime.isSpecificObject<AlphaElement>(getAlphaElementValidator())(value, listner);
    export const getAlphaDefinitionValidator = () => <TypesPrime.ObjectValidator<AlphaDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), getCommentPropertyValidator(), { export: TypesPrime.isOptional(TypesPrime.isBoolean), });
    export const isAlphaDefinition = (value: unknown, listner?: TypesError.Listener): value is AlphaDefinition =>
        TypesPrime.isSpecificObject<AlphaDefinition>(getAlphaDefinitionValidator())(value, listner);
    export const getImportDefinitionValidator = () => <TypesPrime.ObjectValidator<ImportDefinition>>({ $type: TypesPrime.isJust("import"),
        target: TypesPrime.isString, from: TypesPrime.isString, });
    export const isImportDefinition = (value: unknown, listner?: TypesError.Listener): value is ImportDefinition =>
        TypesPrime.isSpecificObject<ImportDefinition>(getImportDefinitionValidator())(value, listner);
    export const isDefinition = (value: unknown, listner?: TypesError.Listener): value is Definition => TypesPrime.isOr(isCodeDefinition,
        isNamespaceDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition, isDictionaryDefinition)(value, listner);
    export const getCodeDefinitionValidator = () => <TypesPrime.ObjectValidator<CodeDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("code"), tokens: TypesPrime.isArray(TypesPrime.isString), });
    export const isCodeDefinition = (value: unknown, listner?: TypesError.Listener): value is CodeDefinition =>
        TypesPrime.isSpecificObject<CodeDefinition>(getCodeDefinitionValidator())(value, listner);
    export const getNamespaceDefinitionValidator = () => <TypesPrime.ObjectValidator<NamespaceDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("namespace"), members: TypesPrime.isDictionaryObject(isDefinition), });
    export const isNamespaceDefinition = (value: unknown, listner?: TypesError.Listener): value is NamespaceDefinition =>
        TypesPrime.isSpecificObject<NamespaceDefinition>(getNamespaceDefinitionValidator())(value, listner);
    export const getValueDefinitionValidator = () => <TypesPrime.ObjectValidator<ValueDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("value"), value: TypesPrime.isOr(isLiteralElement, isReferElement),
        validator: TypesPrime.isOptional(TypesPrime.isBoolean), });
    export const isValueDefinition = (value: unknown, listner?: TypesError.Listener): value is ValueDefinition =>
        TypesPrime.isSpecificObject<ValueDefinition>(getValueDefinitionValidator())(value, listner);
    export const getTypeDefinitionValidator = () => <TypesPrime.ObjectValidator<TypeDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("type"), define: isTypeOrRefer, });
    export const isTypeDefinition = (value: unknown, listner?: TypesError.Listener): value is TypeDefinition =>
        TypesPrime.isSpecificObject<TypeDefinition>(getTypeDefinitionValidator())(value, listner);
    export const getInterfaceDefinitionValidator = () => <TypesPrime.ObjectValidator<InterfaceDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("interface"), extends: TypesPrime.isOptional(TypesPrime.isArray(
        isReferElement)), members: TypesPrime.isDictionaryObject(isTypeOrRefer), });
    export const isInterfaceDefinition = (value: unknown, listner?: TypesError.Listener): value is InterfaceDefinition =>
        TypesPrime.isSpecificObject<InterfaceDefinition>(getInterfaceDefinitionValidator())(value, listner);
    export const getDictionaryDefinitionValidator = () => <TypesPrime.ObjectValidator<DictionaryDefinition>>
        TypesPrime.mergeObjectValidator(getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("dictionary"), valueType: isTypeOrRefer,
        });
    export const isDictionaryDefinition = (value: unknown, listner?: TypesError.Listener): value is DictionaryDefinition =>
        TypesPrime.isSpecificObject<DictionaryDefinition>(getDictionaryDefinitionValidator())(value, listner);
    export const getArrayElementValidator = () => <TypesPrime.ObjectValidator<ArrayElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("array"), items: isTypeOrRefer, });
    export const isArrayElement = (value: unknown, listner?: TypesError.Listener): value is ArrayElement =>
        TypesPrime.isSpecificObject<ArrayElement>(getArrayElementValidator())(value, listner);
    export const getOrElementValidator = () => <TypesPrime.ObjectValidator<OrElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("or"), types: TypesPrime.isArray(isTypeOrRefer), });
    export const isOrElement = (value: unknown, listner?: TypesError.Listener): value is OrElement =>
        TypesPrime.isSpecificObject<OrElement>(getOrElementValidator())(value, listner);
    export const getAndElementValidator = () => <TypesPrime.ObjectValidator<AndElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("and"), types: TypesPrime.isArray(isTypeOrRefer), });
    export const isAndElement = (value: unknown, listner?: TypesError.Listener): value is AndElement =>
        TypesPrime.isSpecificObject<AndElement>(getAndElementValidator())(value, listner);
    export const getLiteralElementValidator = () => <TypesPrime.ObjectValidator<LiteralElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("literal"), literal: Jsonable.isJsonable, });
    export const isLiteralElement = (value: unknown, listner?: TypesError.Listener): value is LiteralElement =>
        TypesPrime.isSpecificObject<LiteralElement>(getLiteralElementValidator())(value, listner);
    export const getReferElementValidator = () => <TypesPrime.ObjectValidator<ReferElement>>({ $ref: TypesPrime.isString, });
    export const isReferElement = (value: unknown, listner?: TypesError.Listener): value is ReferElement =>
        TypesPrime.isSpecificObject<ReferElement>(getReferElementValidator())(value, listner);
    export const isPrimitiveTypeEnum = (value: unknown, listner?: TypesError.Listener): value is PrimitiveTypeEnum => TypesPrime.isEnum(
        PrimitiveTypeEnumMembers)(value, listner);
    export const getPrimitiveTypeElementValidator = () => <TypesPrime.ObjectValidator<PrimitiveTypeElement>>
        TypesPrime.mergeObjectValidator(getAlphaElementValidator(), { $type: TypesPrime.isJust("primitive-type"), type: isPrimitiveTypeEnum
        , });
    export const isPrimitiveTypeElement = (value: unknown, listner?: TypesError.Listener): value is PrimitiveTypeElement =>
        TypesPrime.isSpecificObject<PrimitiveTypeElement>(getPrimitiveTypeElementValidator())(value, listner);
    export const isType = (value: unknown, listner?: TypesError.Listener): value is Type => TypesPrime.isOr(isPrimitiveTypeElement,
        isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition, isDictionaryDefinition,
        isArrayElement, isOrElement, isAndElement, isLiteralElement)(value, listner);
    export const getEnumTypeElementValidator = () => <TypesPrime.ObjectValidator<EnumTypeElement>>({ $type: TypesPrime.isJust("enum-type"),
        members: TypesPrime.isArray(TypesPrime.isOr(TypesPrime.isNull, TypesPrime.isBoolean, TypesPrime.isNumber, TypesPrime.isString)), });
    export const isEnumTypeElement = (value: unknown, listner?: TypesError.Listener): value is EnumTypeElement =>
        TypesPrime.isSpecificObject<EnumTypeElement>(getEnumTypeElementValidator())(value, listner);
    export const getTypeofElementValidator = () => <TypesPrime.ObjectValidator<TypeofElement>>({ $type: TypesPrime.isJust("typeof"), value:
        isReferElement, });
    export const isTypeofElement = (value: unknown, listner?: TypesError.Listener): value is TypeofElement =>
        TypesPrime.isSpecificObject<TypeofElement>(getTypeofElementValidator())(value, listner);
    export const getItemofElementValidator = () => <TypesPrime.ObjectValidator<ItemofElement>>({ $type: TypesPrime.isJust("itemof"), value:
        isReferElement, });
    export const isItemofElement = (value: unknown, listner?: TypesError.Listener): value is ItemofElement =>
        TypesPrime.isSpecificObject<ItemofElement>(getItemofElementValidator())(value, listner);
    export const isTypeOrRefer = (value: unknown, listner?: TypesError.Listener): value is TypeOrRefer => TypesPrime.isOr(isType,
        isReferElement)(value, listner);
    export const isTypeOrValue = (value: unknown, listner?: TypesError.Listener): value is TypeOrValue => TypesPrime.isOr(isType,
        isValueDefinition)(value, listner);
    export const isTypeOrValueOfRefer = (value: unknown, listner?: TypesError.Listener): value is TypeOrValueOfRefer => TypesPrime.isOr(
        isTypeOrValue, isReferElement)(value, listner);
}
