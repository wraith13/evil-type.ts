export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export interface TypeSchema
    {
        $ref: typeof schema;
        imports?: ImportDefinition[];
        defines: { [key: string]: Definition };
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
    export interface JsonableObject
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
        members: { [key: string]: Definition };
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
        members: { [key: string]: TypeOrInterfaceOrRefer };
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
        members: ( null | boolean | number | string )[];
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
    export const isSchema = (value: unknown): value is typeof schema =>
        "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" === value;
    export const isTypeSchema = (value: unknown): value is TypeSchema => null !== value && "object" === typeof value && "$ref" in value &&
        isSchema(value.$ref) && ( ! ("imports" in value) || Array.isArray(value.imports) && value.imports.every( i => isImportDefinition(i)
        ) ) && "defines" in value && null !== value.defines && "object" === typeof value.defines && Object.values(value.defines).every(
        i => isDefinition(i) ) && "options" in value && isOutputOptions(value.options);
    export const isOutputOptions = (value: unknown): value is OutputOptions => null !== value && "object" === typeof value && (
        ! ("outputFile" in value) || "string" === typeof value.outputFile ) && "indentUnit" in value && (
        "number" === typeof value.indentUnit || "\t" === value.indentUnit ) && "indentStyle" in value &&
        isIndentStyleType(value.indentStyle) && "validatorOption" in value && isValidatorOptionType(value.validatorOption) && (
        ! ("maxLineLength" in value) || ( "null" === value.maxLineLength || "number" === typeof value.maxLineLength ) );
    export const isIndentStyleType = (value: unknown): value is IndentStyleType => indentStyleTypeMember.includes(value as any);
    export const isValidatorOptionType = (value: unknown): value is ValidatorOptionType => ["none","simple","full"].includes(value as any);
    export const isJsonableValue = (value: unknown): value is JsonableValue => "null" === value || "boolean" === typeof value ||
        "number" === typeof value || "string" === typeof value;
    export const isJsonableArray = (value: unknown): value is JsonableArray => Array.isArray(value) && value.every( i => isJsonable(i) );
    export const isJsonableObject = (value: unknown): value is JsonableObject => null !== value && "object" === typeof value &&
        Object.values(value).every( i => isJsonable(i) );
    export const isJsonable = (value: unknown): value is Jsonable => isJsonableValue(value) || isJsonableArray(value) ||
        isJsonableObject(value);
    export const isAlphaElement = (value: unknown): value is AlphaElement => null !== value && "object" === typeof value &&
        "$type" in value && "string" === typeof value.$type;
    export const isAlphaDefinition = (value: unknown): value is AlphaDefinition => isAlphaElement(value) && ( ! ("export" in value) ||
        "boolean" === typeof value.export );
    export const isImportDefinition = (value: unknown): value is ImportDefinition => null !== value && "object" === typeof value &&
        "$type" in value && "import" === value.$type && "target" in value && "string" === typeof value.target && "from" in value &&
        "string" === typeof value.from;
    export const isDefinition = (value: unknown): value is Definition => isModuleDefinition(value) || isValueDefinition(value) ||
        isTypeDefinition(value) || isInterfaceDefinition(value);
    export const isModuleDefinition = (value: unknown): value is ModuleDefinition => isAlphaDefinition(value) && "$type" in value &&
        "module" === value.$type && "members" in value && null !== value.members && "object" === typeof value.members &&
        Object.values(value.members).every( i => isDefinition(i) );
    export const isValueDefinition = (value: unknown): value is ValueDefinition => isAlphaDefinition(value) && "$type" in value && "value"
        === value.$type && "value" in value && ( isLiteralElement(value.value) || isReferElement(value.value) ) && (
        ! ("validator" in value) || "boolean" === typeof value.validator );
    export const isTypeDefinition = (value: unknown): value is TypeDefinition => isAlphaDefinition(value) && "$type" in value && "type" ===
        value.$type && "define" in value && isTypeOrInterfaceOrRefer(value.define);
    export const isInterfaceDefinition = (value: unknown): value is InterfaceDefinition => isAlphaDefinition(value) && "$type" in value &&
        "interface" === value.$type && ( ! ("extends" in value) || Array.isArray(value.extends) && value.extends.every( i =>
        isReferElement(i) ) ) && "members" in value && null !== value.members && "object" === typeof value.members &&
        Object.values(value.members).every( i => isTypeOrInterfaceOrRefer(i) );
    export const isDictionaryElement = (value: unknown): value is DictionaryElement => isAlphaElement(value) && "$type" in value &&
        "dictionary" === value.$type && "valueType" in value && isTypeOrInterfaceOrRefer(value.valueType);
    export const isArrayElement = (value: unknown): value is ArrayElement => isAlphaElement(value) && "$type" in value && "array" ===
        value.$type && "valueType" in value && isTypeOrInterfaceOrRefer(value.valueType);
    export const isOrElement = (value: unknown): value is OrElement => isAlphaElement(value) && "$type" in value && "or" === value.$type &&
        "types" in value && Array.isArray(value.types) && value.types.every( i => isTypeOrInterfaceOrRefer(i) );
    export const isAndElement = (value: unknown): value is AndElement => isAlphaElement(value) && "$type" in value && "and" === value.$type
        && "types" in value && Array.isArray(value.types) && value.types.every( i => isTypeOrInterfaceOrRefer(i) );
    export const isLiteralElement = (value: unknown): value is LiteralElement => isAlphaElement(value) && "$type" in value && "literal" ===
        value.$type && "literal" in value && isJsonable(value.literal);
    export const isReferElement = (value: unknown): value is ReferElement => null !== value && "object" === typeof value && "$ref" in value
        && "string" === typeof value.$ref;
    export const isPrimitiveTypeEnum = (value: unknown): value is PrimitiveTypeEnum => PrimitiveTypeEnumMembers.includes(value as any);
    export const isPrimitiveTypeElement = (value: unknown): value is PrimitiveTypeElement => isAlphaElement(value) && "$type" in value &&
        "primitive-type" === value.$type && "literal" in value && isPrimitiveTypeEnum(value.literal);
    export const isType = (value: unknown): value is Type => isPrimitiveTypeElement(value) || isTypeDefinition(value) ||
        isEnumTypeElement(value) || isTypeofElement(value) || isItemofElement(value) || isInterfaceDefinition(value) ||
        isDictionaryElement(value) || isArrayElement(value) || isOrElement(value) || isAndElement(value) || isLiteralElement(value);
    export const isEnumTypeElement = (value: unknown): value is EnumTypeElement => null !== value && "object" === typeof value &&
        "$type" in value && "enum-type" === value.$type && "members" in value && Array.isArray(value.members) && value.members.every( i =>
        "null" === i || "boolean" === typeof i || "number" === typeof i || "string" === typeof i );
    export const isTypeofElement = (value: unknown): value is TypeofElement => null !== value && "object" === typeof value &&
        "$type" in value && "typeof" === value.$type && "value" in value && isReferElement(value.value);
    export const isItemofElement = (value: unknown): value is ItemofElement => null !== value && "object" === typeof value &&
        "$type" in value && "itemof" === value.$type && "value" in value && isReferElement(value.value);
    export const isTypeOrInterfaceOrRefer = (value: unknown): value is TypeOrInterfaceOrRefer => isType(value) || isReferElement(value);
}
