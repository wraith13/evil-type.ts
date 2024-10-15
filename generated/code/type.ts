// This file is generated.
import { EvilType } from "../../common/evil-type";
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
        indentUnit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "tab";
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
    export const isSchema = EvilType.Validator.isJust(schema);
    export const isCommentProperty = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is CommentProperty =>
        EvilType.Validator.isSpecificObject<CommentProperty>(commentPropertyValidatorObject)(value, listner);
    export const isTypeSchema = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is TypeSchema =>
        EvilType.Validator.isSpecificObject<TypeSchema>(typeSchemaValidatorObject)(value, listner);
    export const isOutputOptions = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is OutputOptions =>
        EvilType.Validator.isSpecificObject<OutputOptions>(outputOptionsValidatorObject)(value, listner);
    export const isSchemaOptions = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is SchemaOptions =>
        EvilType.Validator.isSpecificObject<SchemaOptions>(schemaOptionsValidatorObject)(value, listner);
    export const isIndentStyleType: EvilType.Validator.IsType<IndentStyleType> = EvilType.Validator.isEnum(indentStyleTypeMember);
    export const isValidatorOptionType: EvilType.Validator.IsType<ValidatorOptionType> = EvilType.Validator.isEnum(
        ["none","simple","full"] as const);
    export const isAlphaElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is AlphaElement =>
        EvilType.Validator.isSpecificObject<AlphaElement>(alphaElementValidatorObject)(value, listner);
    export const isAlphaDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is AlphaDefinition =>
        EvilType.Validator.isSpecificObject<AlphaDefinition>(alphaDefinitionValidatorObject)(value, listner);
    export const isImportDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is ImportDefinition =>
        EvilType.Validator.isSpecificObject<ImportDefinition>(importDefinitionValidatorObject)(value, listner);
    export const isDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is Definition =>
        EvilType.Validator.isOr(isCodeDefinition, isNamespaceDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition,
        isDictionaryDefinition)(value, listner);
    export const isDefinitionMap = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is DefinitionMap =>
        EvilType.Validator.isDictionaryObject(isDefinition)(value, listner);
    export const isCodeDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is CodeDefinition =>
        EvilType.Validator.isSpecificObject<CodeDefinition>(codeDefinitionValidatorObject)(value, listner);
    export const isNamespaceDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is NamespaceDefinition =>
        EvilType.Validator.isSpecificObject<NamespaceDefinition>(namespaceDefinitionValidatorObject)(value, listner);
    export const isValueDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is ValueDefinition =>
        EvilType.Validator.isSpecificObject<ValueDefinition>(valueDefinitionValidatorObject)(value, listner);
    export const isTypeDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is TypeDefinition =>
        EvilType.Validator.isSpecificObject<TypeDefinition>(typeDefinitionValidatorObject)(value, listner);
    export const isInterfaceDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is InterfaceDefinition =>
        EvilType.Validator.isSpecificObject<InterfaceDefinition>(interfaceDefinitionValidatorObject)(value, listner);
    export const isDictionaryDefinition = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is DictionaryDefinition =>
        EvilType.Validator.isSpecificObject<DictionaryDefinition>(dictionaryDefinitionValidatorObject)(value, listner);
    export const isArrayElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is ArrayElement =>
        EvilType.Validator.isSpecificObject<ArrayElement>(arrayElementValidatorObject)(value, listner);
    export const isOrElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is OrElement =>
        EvilType.Validator.isSpecificObject<OrElement>(orElementValidatorObject)(value, listner);
    export const isAndElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is AndElement =>
        EvilType.Validator.isSpecificObject<AndElement>(andElementValidatorObject)(value, listner);
    export const isLiteralElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is LiteralElement =>
        EvilType.Validator.isSpecificObject<LiteralElement>(literalElementValidatorObject)(value, listner);
    export const isReferElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is ReferElement =>
        EvilType.Validator.isSpecificObject<ReferElement>(referElementValidatorObject)(value, listner);
    export const isPrimitiveTypeEnum: EvilType.Validator.IsType<PrimitiveTypeEnum> = EvilType.Validator.isEnum(PrimitiveTypeEnumMembers);
    export const isPrimitiveTypeElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is PrimitiveTypeElement =>
        EvilType.Validator.isSpecificObject<PrimitiveTypeElement>(primitiveTypeElementValidatorObject)(value, listner);
    export const isType = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is Type => EvilType.Validator.isOr(
        isPrimitiveTypeElement, isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition,
        isDictionaryDefinition, isArrayElement, isOrElement, isAndElement, isLiteralElement)(value, listner);
    export const isEnumTypeElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is EnumTypeElement =>
        EvilType.Validator.isSpecificObject<EnumTypeElement>(enumTypeElementValidatorObject)(value, listner);
    export const isTypeofElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is TypeofElement =>
        EvilType.Validator.isSpecificObject<TypeofElement>(typeofElementValidatorObject)(value, listner);
    export const isItemofElement = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is ItemofElement =>
        EvilType.Validator.isSpecificObject<ItemofElement>(itemofElementValidatorObject)(value, listner);
    export const isTypeOrRefer = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is TypeOrRefer =>
        EvilType.Validator.isOr(isType, isReferElement)(value, listner);
    export const isTypeOrValue = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is TypeOrValue =>
        EvilType.Validator.isOr(isType, isValueDefinition)(value, listner);
    export const isTypeOrValueOfRefer = (value: unknown, listner?: EvilType.Validator.ErrorListener): value is TypeOrValueOfRefer =>
        EvilType.Validator.isOr(isTypeOrValue, isReferElement)(value, listner);
    export const commentPropertyValidatorObject: EvilType.Validator.ObjectValidator<CommentProperty> = ({ comment:
        EvilType.Validator.isOptional(EvilType.Validator.isArray(EvilType.Validator.isString)), });
    export const typeSchemaValidatorObject: EvilType.Validator.ObjectValidator<TypeSchema> = EvilType.Validator.mergeObjectValidator(
        commentPropertyValidatorObject, { $schema: isSchema, imports: EvilType.Validator.isOptional(EvilType.Validator.isArray(
        isImportDefinition)), defines: isDefinitionMap, options: isOutputOptions, });
    export const outputOptionsValidatorObject: EvilType.Validator.ObjectValidator<OutputOptions> = ({ outputFile:
        EvilType.Validator.isString, indentUnit: EvilType.Validator.isEnum([0,1,2,3,4,5,6,7,8,"tab"] as const), indentStyle:
        isIndentStyleType, validatorOption: isValidatorOptionType, maxLineLength: EvilType.Validator.isOptional(EvilType.Validator.isOr(
        EvilType.Validator.isNull, EvilType.Validator.isNumber)), schema: EvilType.Validator.isOptional(isSchemaOptions), });
    export const schemaOptionsValidatorObject: EvilType.Validator.ObjectValidator<SchemaOptions> = ({ outputFile:
        EvilType.Validator.isString, $id: EvilType.Validator.isString, $ref: EvilType.Validator.isOptional(EvilType.Validator.isString),
        externalReferMapping: EvilType.Validator.isOptional(EvilType.Validator.isDictionaryObject(EvilType.Validator.isString)), });
    export const alphaElementValidatorObject: EvilType.Validator.ObjectValidator<AlphaElement> = ({ $type: EvilType.Validator.isString, });
    export const alphaDefinitionValidatorObject: EvilType.Validator.ObjectValidator<AlphaDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaElementValidatorObject, commentPropertyValidatorObject, { export:
        EvilType.Validator.isOptional(EvilType.Validator.isBoolean), });
    export const importDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ImportDefinition> = ({ $type:
        EvilType.Validator.isJust("import" as const), target: EvilType.Validator.isString, from: EvilType.Validator.isString, });
    export const codeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<CodeDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilType.Validator.isJust("code" as const), tokens
        : EvilType.Validator.isArray(EvilType.Validator.isString), });
    export const namespaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<NamespaceDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilType.Validator.isJust("namespace" as const),
        members: isDefinitionMap, });
    export const valueDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ValueDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilType.Validator.isJust("value" as const), value
        : EvilType.Validator.isOr(isLiteralElement, isReferElement), validator: EvilType.Validator.isOptional(EvilType.Validator.isBoolean)
        , });
    export const typeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<TypeDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilType.Validator.isJust("type" as const), define
        : isTypeOrRefer, });
    export const interfaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<InterfaceDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilType.Validator.isJust("interface" as const),
        extends: EvilType.Validator.isOptional(EvilType.Validator.isArray(isReferElement)), members: EvilType.Validator.isDictionaryObject(
        isTypeOrRefer), additionalProperties: EvilType.Validator.isOptional(EvilType.Validator.isBoolean), });
    export const dictionaryDefinitionValidatorObject: EvilType.Validator.ObjectValidator<DictionaryDefinition> =
        EvilType.Validator.mergeObjectValidator(alphaDefinitionValidatorObject, { $type: EvilType.Validator.isJust("dictionary" as const),
        valueType: isTypeOrRefer, });
    export const arrayElementValidatorObject: EvilType.Validator.ObjectValidator<ArrayElement> = EvilType.Validator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilType.Validator.isJust("array" as const), items: isTypeOrRefer, });
    export const orElementValidatorObject: EvilType.Validator.ObjectValidator<OrElement> = EvilType.Validator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilType.Validator.isJust("or" as const), types: EvilType.Validator.isArray(isTypeOrRefer), }
        );
    export const andElementValidatorObject: EvilType.Validator.ObjectValidator<AndElement> = EvilType.Validator.mergeObjectValidator(
        alphaElementValidatorObject, { $type: EvilType.Validator.isJust("and" as const), types: EvilType.Validator.isArray(isTypeOrRefer),
        });
    export const literalElementValidatorObject: EvilType.Validator.ObjectValidator<LiteralElement> =
        EvilType.Validator.mergeObjectValidator(alphaElementValidatorObject, { $type: EvilType.Validator.isJust("literal" as const),
        literal: Jsonable.isJsonable, });
    export const referElementValidatorObject: EvilType.Validator.ObjectValidator<ReferElement> = ({ $ref: EvilType.Validator.isString, });
    export const primitiveTypeElementValidatorObject: EvilType.Validator.ObjectValidator<PrimitiveTypeElement> =
        EvilType.Validator.mergeObjectValidator(alphaElementValidatorObject, { $type: EvilType.Validator.isJust("primitive-type" as const),
        type: isPrimitiveTypeEnum, });
    export const enumTypeElementValidatorObject: EvilType.Validator.ObjectValidator<EnumTypeElement> = ({ $type: EvilType.Validator.isJust(
        "enum-type" as const), members: EvilType.Validator.isArray(EvilType.Validator.isOr(EvilType.Validator.isNull,
        EvilType.Validator.isBoolean, EvilType.Validator.isNumber, EvilType.Validator.isString)), });
    export const typeofElementValidatorObject: EvilType.Validator.ObjectValidator<TypeofElement> = ({ $type: EvilType.Validator.isJust(
        "typeof" as const), value: isReferElement, });
    export const itemofElementValidatorObject: EvilType.Validator.ObjectValidator<ItemofElement> = ({ $type: EvilType.Validator.isJust(
        "itemof" as const), value: isReferElement, });
}
