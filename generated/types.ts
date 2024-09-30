// This file is generated.;
import { TypesPrime } from "../source/types-prime.ts";
import { TypesError } from "../source/types-error.ts";
export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export interface TypeSchema
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
    }
    export const indentStyleTypeMember = ["allman","egyptian"] as const;
    export type IndentStyleType = typeof indentStyleTypeMember[number];
    export type ValidatorOptionType = "none" | "simple" | "full";
    export type JsonableValue = null | boolean | number | string;
    export type JsonableArray = Jsonable[];
    export type JsonableObject =
    {
        [key: string]: Jsonable;
    }
    export type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    export interface AlphaElement
    {
        $type: string;
    }
    export interface AlphaDefinition extends AlphaElement
    {
        export?: boolean;
    }
    export interface ImportDefinition
    {
        $type: "import";
        target: string;
        from: string;
    }
    export type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    export interface ModuleDefinition extends AlphaDefinition
    {
        $type: "module";
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
        define: TypeOrInterfaceOrRefer;
    }
    export interface InterfaceDefinition extends AlphaDefinition
    {
        $type: "interface";
        extends?: ReferElement[];
        members: { [key: string]: TypeOrInterfaceOrRefer, };
    }
    export interface DictionaryElement extends AlphaElement
    {
        $type: "dictionary";
        valueType: TypeOrInterfaceOrRefer;
    }
    export interface ArrayElement extends AlphaElement
    {
        $type: "array";
        valueType: TypeOrInterfaceOrRefer;
    }
    export interface OrElement extends AlphaElement
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export interface AndElement extends AlphaElement
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export interface LiteralElement extends AlphaElement
    {
        $type: "literal";
        literal: Jsonable;
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
        literal: PrimitiveTypeEnum;
    }
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition |
        DictionaryElement | ArrayElement | OrElement | AndElement | LiteralElement;
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
    export type TypeOrInterfaceOrRefer = Type | ReferElement;
    export const isSchema = (value: unknown, listner?: TypesError.Listener): value is typeof schema =>
        "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" === value;
    export const getTypeSchemaValidator = () => <TypesPrime.ObjectValidator<TypeSchema>>({ $ref: isSchema, imports: TypesPrime.isOptional(
        TypesPrime.isArray(isImportDefinition)), defines: TypesPrime.isDictionaryObject(isDefinition), options: isOutputOptions, });
    export const isTypeSchema = (value: unknown, listner?: TypesError.Listener): value is TypeSchema => null !== value &&
        "object" === typeof value && "$ref" in value && isSchema(value.$ref) &&(! ("imports" in value) || Array.isArray(value.imports) &&
        value.imports.every(i => isImportDefinition(i))) && "defines" in value && null !== value.defines &&
        "object" === typeof value.defines && Object.values(value.defines).every(i => isDefinition(i)) && "options" in value &&
        isOutputOptions(value.options);
    export const getOutputOptionsValidator = () => <TypesPrime.ObjectValidator<OutputOptions>>({ outputFile: TypesPrime.isOptional(
        TypesPrime.isString), indentUnit: TypesPrime.isOr(TypesPrime.isNumber, TypesPrime.isJust("\t")), indentStyle: isIndentStyleType,
        validatorOption: isValidatorOptionType, maxLineLength: TypesPrime.isOptional(TypesPrime.isOr(TypesPrime.isNull, TypesPrime.isNumber
        )), });
    export const isOutputOptions = (value: unknown, listner?: TypesError.Listener): value is OutputOptions => null !== value &&
        "object" === typeof value &&(! ("outputFile" in value) || "string" === typeof value.outputFile) && "indentUnit" in value &&(
        "number" === typeof value.indentUnit || "\t" === value.indentUnit) && "indentStyle" in value &&
        isIndentStyleType(value.indentStyle) && "validatorOption" in value && isValidatorOptionType(value.validatorOption) &&(
        ! ("maxLineLength" in value) ||("null" === value.maxLineLength || "number" === typeof value.maxLineLength));
    export const isIndentStyleType = (value: unknown, listner?: TypesError.Listener): value is IndentStyleType =>
        indentStyleTypeMember.includes(value as any);
    export const isValidatorOptionType = (value: unknown, listner?: TypesError.Listener): value is ValidatorOptionType =>
        ["none","simple","full"].includes(value as any);
    export const isJsonableValue = (value: unknown, listner?: TypesError.Listener): value is JsonableValue => "null" === value ||
        "boolean" === typeof value || "number" === typeof value || "string" === typeof value;
    export const isJsonableArray = (value: unknown, listner?: TypesError.Listener): value is JsonableArray => Array.isArray(value) &&
        value.every(i => isJsonable(i));
    export const isJsonableObject = (value: unknown, listner?: TypesError.Listener): value is JsonableObject => null !== value &&
        "object" === typeof value && Object.values(value).every(i => isJsonable(i));
    export const isJsonable = (value: unknown, listner?: TypesError.Listener): value is Jsonable => isJsonableValue(value) ||
        isJsonableArray(value) || isJsonableObject(value);
    export const getAlphaElementValidator = () => <TypesPrime.ObjectValidator<AlphaElement>>({ $type: TypesPrime.isString, });
    export const isAlphaElement = (value: unknown, listner?: TypesError.Listener): value is AlphaElement => null !== value &&
        "object" === typeof value && "$type" in value && "string" === typeof value.$type;
    export const getAlphaDefinitionValidator = () => <TypesPrime.ObjectValidator<AlphaDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { export: TypesPrime.isOptional(TypesPrime.isBoolean), });
    export const isAlphaDefinition = (value: unknown, listner?: TypesError.Listener): value is AlphaDefinition => isAlphaElement(value) &&(
        ! ("export" in value) || "boolean" === typeof value.export);
    export const getImportDefinitionValidator = () => <TypesPrime.ObjectValidator<ImportDefinition>>({ $type: TypesPrime.isJust("import"),
        target: TypesPrime.isString, from: TypesPrime.isString, });
    export const isImportDefinition = (value: unknown, listner?: TypesError.Listener): value is ImportDefinition => null !== value &&
        "object" === typeof value && "$type" in value && "import" === value.$type && "target" in value && "string" === typeof value.target
        && "from" in value && "string" === typeof value.from;
    export const isDefinition = (value: unknown, listner?: TypesError.Listener): value is Definition => isModuleDefinition(value) ||
        isValueDefinition(value) || isTypeDefinition(value) || isInterfaceDefinition(value);
    export const getModuleDefinitionValidator = () => <TypesPrime.ObjectValidator<ModuleDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("module"), members: TypesPrime.isDictionaryObject(isDefinition), });
    export const isModuleDefinition = (value: unknown, listner?: TypesError.Listener): value is ModuleDefinition =>
        isAlphaDefinition(value) && "$type" in value && "module" === value.$type && "members" in value && null !== value.members &&
        "object" === typeof value.members && Object.values(value.members).every(i => isDefinition(i));
    export const getValueDefinitionValidator = () => <TypesPrime.ObjectValidator<ValueDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("value"), value: TypesPrime.isOr(isLiteralElement, isReferElement),
        validator: TypesPrime.isOptional(TypesPrime.isBoolean), });
    export const isValueDefinition = (value: unknown, listner?: TypesError.Listener): value is ValueDefinition => isAlphaDefinition(value)
        && "$type" in value && "value" === value.$type && "value" in value &&(isLiteralElement(value.value) || isReferElement(value.value))
        &&(! ("validator" in value) || "boolean" === typeof value.validator);
    export const getTypeDefinitionValidator = () => <TypesPrime.ObjectValidator<TypeDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("type"), define: isTypeOrInterfaceOrRefer, });
    export const isTypeDefinition = (value: unknown, listner?: TypesError.Listener): value is TypeDefinition => isAlphaDefinition(value) &&
        "$type" in value && "type" === value.$type && "define" in value && isTypeOrInterfaceOrRefer(value.define);
    export const getInterfaceDefinitionValidator = () => <TypesPrime.ObjectValidator<InterfaceDefinition>> TypesPrime.mergeObjectValidator(
        getAlphaDefinitionValidator(), { $type: TypesPrime.isJust("interface"), extends: TypesPrime.isOptional(TypesPrime.isArray(
        isReferElement)), members: TypesPrime.isDictionaryObject(isTypeOrInterfaceOrRefer), });
    export const isInterfaceDefinition = (value: unknown, listner?: TypesError.Listener): value is InterfaceDefinition =>
        isAlphaDefinition(value) && "$type" in value && "interface" === value.$type &&(! ("extends" in value) ||
        Array.isArray(value.extends) && value.extends.every(i => isReferElement(i))) && "members" in value && null !== value.members &&
        "object" === typeof value.members && Object.values(value.members).every(i => isTypeOrInterfaceOrRefer(i));
    export const getDictionaryElementValidator = () => <TypesPrime.ObjectValidator<DictionaryElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("dictionary"), valueType: isTypeOrInterfaceOrRefer, });
    export const isDictionaryElement = (value: unknown, listner?: TypesError.Listener): value is DictionaryElement => isAlphaElement(value)
        && "$type" in value && "dictionary" === value.$type && "valueType" in value && isTypeOrInterfaceOrRefer(value.valueType);
    export const getArrayElementValidator = () => <TypesPrime.ObjectValidator<ArrayElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("array"), valueType: isTypeOrInterfaceOrRefer, });
    export const isArrayElement = (value: unknown, listner?: TypesError.Listener): value is ArrayElement => isAlphaElement(value) &&
        "$type" in value && "array" === value.$type && "valueType" in value && isTypeOrInterfaceOrRefer(value.valueType);
    export const getOrElementValidator = () => <TypesPrime.ObjectValidator<OrElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("or"), types: TypesPrime.isArray(isTypeOrInterfaceOrRefer), });
    export const isOrElement = (value: unknown, listner?: TypesError.Listener): value is OrElement => isAlphaElement(value) &&
        "$type" in value && "or" === value.$type && "types" in value && Array.isArray(value.types) && value.types.every(i =>
        isTypeOrInterfaceOrRefer(i));
    export const getAndElementValidator = () => <TypesPrime.ObjectValidator<AndElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("and"), types: TypesPrime.isArray(isTypeOrInterfaceOrRefer), });
    export const isAndElement = (value: unknown, listner?: TypesError.Listener): value is AndElement => isAlphaElement(value) &&
        "$type" in value && "and" === value.$type && "types" in value && Array.isArray(value.types) && value.types.every(i =>
        isTypeOrInterfaceOrRefer(i));
    export const getLiteralElementValidator = () => <TypesPrime.ObjectValidator<LiteralElement>> TypesPrime.mergeObjectValidator(
        getAlphaElementValidator(), { $type: TypesPrime.isJust("literal"), literal: isJsonable, });
    export const isLiteralElement = (value: unknown, listner?: TypesError.Listener): value is LiteralElement => isAlphaElement(value) &&
        "$type" in value && "literal" === value.$type && "literal" in value && isJsonable(value.literal);
    export const getReferElementValidator = () => <TypesPrime.ObjectValidator<ReferElement>>({ $ref: TypesPrime.isString, });
    export const isReferElement = (value: unknown, listner?: TypesError.Listener): value is ReferElement => null !== value &&
        "object" === typeof value && "$ref" in value && "string" === typeof value.$ref;
    export const isPrimitiveTypeEnum = (value: unknown, listner?: TypesError.Listener): value is PrimitiveTypeEnum =>
        PrimitiveTypeEnumMembers.includes(value as any);
    export const getPrimitiveTypeElementValidator = () => <TypesPrime.ObjectValidator<PrimitiveTypeElement>>
        TypesPrime.mergeObjectValidator(getAlphaElementValidator(), { $type: TypesPrime.isJust("primitive-type"), literal:
        isPrimitiveTypeEnum, });
    export const isPrimitiveTypeElement = (value: unknown, listner?: TypesError.Listener): value is PrimitiveTypeElement =>
        isAlphaElement(value) && "$type" in value && "primitive-type" === value.$type && "literal" in value &&
        isPrimitiveTypeEnum(value.literal);
    export const isType = (value: unknown, listner?: TypesError.Listener): value is Type => isPrimitiveTypeElement(value) ||
        isTypeDefinition(value) || isEnumTypeElement(value) || isTypeofElement(value) || isItemofElement(value) ||
        isInterfaceDefinition(value) || isDictionaryElement(value) || isArrayElement(value) || isOrElement(value) || isAndElement(value) ||
        isLiteralElement(value);
    export const getEnumTypeElementValidator = () => <TypesPrime.ObjectValidator<EnumTypeElement>>({ $type: TypesPrime.isJust("enum-type"),
        members: TypesPrime.isArray(TypesPrime.isOr(TypesPrime.isNull, TypesPrime.isBoolean, TypesPrime.isNumber, TypesPrime.isString)), });
    export const isEnumTypeElement = (value: unknown, listner?: TypesError.Listener): value is EnumTypeElement => null !== value &&
        "object" === typeof value && "$type" in value && "enum-type" === value.$type && "members" in value && Array.isArray(value.members)
        && value.members.every(i => "null" === i || "boolean" === typeof i || "number" === typeof i || "string" === typeof i);
    export const getTypeofElementValidator = () => <TypesPrime.ObjectValidator<TypeofElement>>({ $type: TypesPrime.isJust("typeof"), value:
        isReferElement, });
    export const isTypeofElement = (value: unknown, listner?: TypesError.Listener): value is TypeofElement => null !== value &&
        "object" === typeof value && "$type" in value && "typeof" === value.$type && "value" in value && isReferElement(value.value);
    export const getItemofElementValidator = () => <TypesPrime.ObjectValidator<ItemofElement>>({ $type: TypesPrime.isJust("itemof"), value:
        isReferElement, });
    export const isItemofElement = (value: unknown, listner?: TypesError.Listener): value is ItemofElement => null !== value &&
        "object" === typeof value && "$type" in value && "itemof" === value.$type && "value" in value && isReferElement(value.value);
    export const isTypeOrInterfaceOrRefer = (value: unknown, listner?: TypesError.Listener): value is TypeOrInterfaceOrRefer =>
        isType(value) || isReferElement(value);
}
