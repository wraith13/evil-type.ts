export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export interface TypeSchema
    {
        $ref: typeof schema;
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
    export interface AlphaElement
    {
        $type: string;
    }
    export interface AlphaDefinition extends AlphaElement
    {
        export?: boolean;
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
        extends?: ReferElement [];
        members: { [key: string]: TypeOrInterfaceOrRefer };
    }
    export const isSchema = (value: unknown): value is typeof schema => "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" === value;
    export const isTypeSchema = (value: unknown): value is TypeSchema => null !== value && "object" === typeof value && "$ref" in value && isSchema(value.$ref) && "defines" in value && null !== value.defines && "object" === typeof value.defines && Object.values(value.defines).every( i => isDefinition(i) ) && "options" in value && isOutputOptions(value.options);
    export const isOutputOptions = (value: unknown): value is OutputOptions => null !== value && "object" === typeof value && ( ! ("outputFile" in value) || "string" === typeof value.outputFile ) && "indentUnit" in value && ( "number" === typeof value.indentUnit || "\t" === value.indentUnit ) && "indentStyle" in value && isIndentStyleType(value.indentStyle) && "validatorOption" in value && isValidatorOptionType(value.validatorOption) && ( ! ("maxLineLength" in value) || ( "null" === value.maxLineLength || "number" === typeof value.maxLineLength ) );
    export const isIndentStyleType = (value: unknown): value is IndentStyleType => indentStyleTypeMember.includes(value as any);
    export const isValidatorOptionType = (value: unknown): value is ValidatorOptionType => ["none","simple","full"].includes(value as any);
    export const isAlphaElement = (value: unknown): value is AlphaElement => null !== value && "object" === typeof value && "$type" in value && "string" === typeof value.$type;
    export const isAlphaDefinition = (value: unknown): value is AlphaDefinition => isAlphaElement(value) && ( ! ("export" in value) || "boolean" === typeof value.export );
    export const isDefinition = (value: unknown): value is Definition => isModuleDefinition(value) || isValueDefinition(value) || isTypeDefinition(value) || isInterfaceDefinition(value);
    export const isModuleDefinition = (value: unknown): value is ModuleDefinition => isAlphaDefinition(value) && "$type" in value && "module" === value.$type && "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).every( i => isDefinition(i) );
    export const isValueDefinition = (value: unknown): value is ValueDefinition => isAlphaDefinition(value) && "$type" in value && "value" === value.$type && "value" in value && ( isLiteralElement(value.value) || isReferElement(value.value) ) && ( ! ("validator" in value) || "boolean" === typeof value.validator );
    export const isTypeDefinition = (value: unknown): value is TypeDefinition => isAlphaDefinition(value) && "$type" in value && "type" === value.$type && "define" in value && isTypeOrInterfaceOrRefer(value.define);
    export const isInterfaceDefinition = (value: unknown): value is InterfaceDefinition => isAlphaDefinition(value) && "$type" in value && "interface" === value.$type && ( ! ("extends" in value) || Array.isArray(value.extends) && value.extends.every( i => isReferElement(i) ) ) && "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).every( i => isTypeOrInterfaceOrRefer(i) );
}
