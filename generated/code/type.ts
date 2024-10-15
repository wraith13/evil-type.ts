// This file is generated.
import { EvilTypeValidator } from "../../source/validator";
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
    export const isCommentProperty = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is CommentProperty =>
        EvilTypeValidator.isSpecificObject<CommentProperty>(commentPropertyValidatorObject)(value, listner);
    export const isTypeSchema = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is TypeSchema =>
        EvilTypeValidator.isSpecificObject<TypeSchema>(typeSchemaValidatorObject)(value, listner);
    export const isOutputOptions = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is OutputOptions =>
        EvilTypeValidator.isSpecificObject<OutputOptions>(outputOptionsValidatorObject)(value, listner);
    export const isSchemaOptions = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is SchemaOptions =>
        EvilTypeValidator.isSpecificObject<SchemaOptions>(schemaOptionsValidatorObject)(value, listner);
    export const isIndentStyleType = EvilTypeValidator.isEnum(indentStyleTypeMember);
    export const isValidatorOptionType = EvilTypeValidator.isEnum(["none","simple","full"] as const);
    export const isAlphaElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is AlphaElement =>
        EvilTypeValidator.isSpecificObject<AlphaElement>(alphaElementValidatorObject)(value, listner);
    export const isAlphaDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is AlphaDefinition =>
        EvilTypeValidator.isSpecificObject<AlphaDefinition>(alphaDefinitionValidatorObject)(value, listner);
    export const isImportDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is ImportDefinition =>
        EvilTypeValidator.isSpecificObject<ImportDefinition>(importDefinitionValidatorObject)(value, listner);
    export const isDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is Definition => EvilTypeValidator.isOr(
        isCodeDefinition, isNamespaceDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition, isDictionaryDefinition)(value,
        listner);
    export const isDefinitionMap = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is DefinitionMap =>
        EvilTypeValidator.isDictionaryObject(isDefinition)(value, listner);
    export const isCodeDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is CodeDefinition =>
        EvilTypeValidator.isSpecificObject<CodeDefinition>(codeDefinitionValidatorObject)(value, listner);
    export const isNamespaceDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is NamespaceDefinition =>
        EvilTypeValidator.isSpecificObject<NamespaceDefinition>(namespaceDefinitionValidatorObject)(value, listner);
    export const isValueDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is ValueDefinition =>
        EvilTypeValidator.isSpecificObject<ValueDefinition>(valueDefinitionValidatorObject)(value, listner);
    export const isTypeDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is TypeDefinition =>
        EvilTypeValidator.isSpecificObject<TypeDefinition>(typeDefinitionValidatorObject)(value, listner);
    export const isInterfaceDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is InterfaceDefinition =>
        EvilTypeValidator.isSpecificObject<InterfaceDefinition>(interfaceDefinitionValidatorObject)(value, listner);
    export const isDictionaryDefinition = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is DictionaryDefinition =>
        EvilTypeValidator.isSpecificObject<DictionaryDefinition>(dictionaryDefinitionValidatorObject)(value, listner);
    export const isArrayElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is ArrayElement =>
        EvilTypeValidator.isSpecificObject<ArrayElement>(arrayElementValidatorObject)(value, listner);
    export const isOrElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is OrElement =>
        EvilTypeValidator.isSpecificObject<OrElement>(orElementValidatorObject)(value, listner);
    export const isAndElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is AndElement =>
        EvilTypeValidator.isSpecificObject<AndElement>(andElementValidatorObject)(value, listner);
    export const isLiteralElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is LiteralElement =>
        EvilTypeValidator.isSpecificObject<LiteralElement>(literalElementValidatorObject)(value, listner);
    export const isReferElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is ReferElement =>
        EvilTypeValidator.isSpecificObject<ReferElement>(referElementValidatorObject)(value, listner);
    export const isPrimitiveTypeEnum = EvilTypeValidator.isEnum(PrimitiveTypeEnumMembers);
    export const isPrimitiveTypeElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is PrimitiveTypeElement =>
        EvilTypeValidator.isSpecificObject<PrimitiveTypeElement>(primitiveTypeElementValidatorObject)(value, listner);
    export const isType = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is Type => EvilTypeValidator.isOr(
        isPrimitiveTypeElement, isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition,
        isDictionaryDefinition, isArrayElement, isOrElement, isAndElement, isLiteralElement)(value, listner);
    export const isEnumTypeElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is EnumTypeElement =>
        EvilTypeValidator.isSpecificObject<EnumTypeElement>(enumTypeElementValidatorObject)(value, listner);
    export const isTypeofElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is TypeofElement =>
        EvilTypeValidator.isSpecificObject<TypeofElement>(typeofElementValidatorObject)(value, listner);
    export const isItemofElement = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is ItemofElement =>
        EvilTypeValidator.isSpecificObject<ItemofElement>(itemofElementValidatorObject)(value, listner);
    export const isTypeOrRefer = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is TypeOrRefer =>
        EvilTypeValidator.isOr(isType, isReferElement)(value, listner);
    export const isTypeOrValue = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is TypeOrValue =>
        EvilTypeValidator.isOr(isType, isValueDefinition)(value, listner);
    export const isTypeOrValueOfRefer = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is TypeOrValueOfRefer =>
        EvilTypeValidator.isOr(isTypeOrValue, isReferElement)(value, listner);
    export const commentPropertyValidatorObject: EvilTypeValidator.ObjectValidator<CommentProperty> = ({ comment:
        EvilTypeValidator.isOptional(EvilTypeValidator.isArray(EvilTypeValidator.isString)), });
    export const typeSchemaValidatorObject: EvilTypeValidator.ObjectValidator<TypeSchema> = EvilTypeValidator.mergeObjectValidator(
        commentPropertyValidatorObject, { $schema: isSchema, imports: EvilTypeValidator.isOptional(EvilTypeValidator.isArray(
        isImportDefinition)), defines: isDefinitionMap, options: isOutputOptions, });
    export const outputOptionsValidatorObject: EvilTypeValidator.ObjectValidator<OutputOptions> = ({ outputFile: EvilTypeValidator.isString
        , indentUnit: EvilTypeValidator.isOr(EvilTypeValidator.isNumber, EvilTypeValidator.isJust("\t" as const)), indentStyle:
        isIndentStyleType, validatorOption: isValidatorOptionType, maxLineLength: EvilTypeValidator.isOptional(EvilTypeValidator.isOr(
        EvilTypeValidator.isNull, EvilTypeValidator.isNumber)), schema: EvilTypeValidator.isOptional(isSchemaOptions), });
    export const schemaOptionsValidatorObject: EvilTypeValidator.ObjectValidator<SchemaOptions> = ({ outputFile: EvilTypeValidator.isString
        , $id: EvilTypeValidator.isString, $ref: EvilTypeValidator.isOptional(EvilTypeValidator.isString), externalReferMapping:
        EvilTypeValidator.isOptional(EvilTypeValidator.isDictionaryObject(EvilTypeValidator.isString)), });
    export const alphaElementValidatorObject: EvilTypeValidator.ObjectValidator<AlphaElement> = ({ $type: EvilTypeValidator.isString, });
    export const alphaDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<AlphaDefinition> =
        EvilTypeValidator.mergeObjectValidator(alphaElementValidatorObject, commentPropertyValidatorObject, { export:
        EvilTypeValidator.isOptional(EvilTypeValidator.isBoolean), });
    export const importDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<ImportDefinition> = ({ $type: EvilTypeValidator.isJust(
        "import" as const), target: EvilTypeValidator.isString, from: EvilTypeValidator.isString, });
    export const codeDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<CodeDefinition> = EvilTypeValidator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { $type: EvilTypeValidator.isJust("code" as const), tokens: EvilTypeValidator.isArray(
        EvilTypeValidator.isString), });
    export const namespaceDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<NamespaceDefinition> =
        EvilTypeValidator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilTypeValidator.isJust("namespace" as const),
        members: isDefinitionMap, });
    export const valueDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<ValueDefinition> =
        EvilTypeValidator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilTypeValidator.isJust("value" as const), value:
        EvilTypeValidator.isOr(isLiteralElement, isReferElement), validator: EvilTypeValidator.isOptional(EvilTypeValidator.isBoolean), });
    export const typeDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<TypeDefinition> = EvilTypeValidator.mergeObjectValidator(
        alphaDefinitionValidatorObject, { $type: EvilTypeValidator.isJust("type" as const), define: isTypeOrRefer, });
    export const interfaceDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<InterfaceDefinition> =
        EvilTypeValidator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilTypeValidator.isJust("interface" as const),
        extends: EvilTypeValidator.isOptional(EvilTypeValidator.isArray(isReferElement)), members: EvilTypeValidator.isDictionaryObject(
        isTypeOrRefer), additionalProperties: EvilTypeValidator.isOptional(EvilTypeValidator.isBoolean), });
    export const dictionaryDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<DictionaryDefinition> =
        EvilTypeValidator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilTypeValidator.isJust("dictionary" as const),
        valueType: isTypeOrRefer, });
    export const arrayElementValidatorObject: EvilTypeValidator.ObjectValidator<ArrayElement> = EvilTypeValidator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilTypeValidator.isJust("array" as const), items: isTypeOrRefer, });
    export const orElementValidatorObject: EvilTypeValidator.ObjectValidator<OrElement> = EvilTypeValidator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilTypeValidator.isJust("or" as const), types: EvilTypeValidator.isArray(isTypeOrRefer), });
    export const andElementValidatorObject: EvilTypeValidator.ObjectValidator<AndElement> = EvilTypeValidator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilTypeValidator.isJust("and" as const), types: EvilTypeValidator.isArray(isTypeOrRefer), });
    export const literalElementValidatorObject: EvilTypeValidator.ObjectValidator<LiteralElement> = EvilTypeValidator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilTypeValidator.isJust("literal" as const), literal: Jsonable.isJsonable, });
    export const referElementValidatorObject: EvilTypeValidator.ObjectValidator<ReferElement> = ({ $ref: EvilTypeValidator.isString, });
    export const primitiveTypeElementValidatorObject: EvilTypeValidator.ObjectValidator<PrimitiveTypeElement> =
        EvilTypeValidator.mergeObjectValidator(alphaElementValidatorObject, { $type: EvilTypeValidator.isJust("primitive-type" as const),
        type: isPrimitiveTypeEnum, });
    export const enumTypeElementValidatorObject: EvilTypeValidator.ObjectValidator<EnumTypeElement> = ({ $type: EvilTypeValidator.isJust(
        "enum-type" as const), members: EvilTypeValidator.isArray(EvilTypeValidator.isOr(EvilTypeValidator.isNull,
        EvilTypeValidator.isBoolean, EvilTypeValidator.isNumber, EvilTypeValidator.isString)), });
    export const typeofElementValidatorObject: EvilTypeValidator.ObjectValidator<TypeofElement> = ({ $type: EvilTypeValidator.isJust(
        "typeof" as const), value: isReferElement, });
    export const itemofElementValidatorObject: EvilTypeValidator.ObjectValidator<ItemofElement> = ({ $type: EvilTypeValidator.isJust(
        "itemof" as const), value: isReferElement, });
}
