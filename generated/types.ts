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
    export type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    export interface ModuleDefinition
    {
        export?: boolean;
        $type: "module";
        members: { [key: string]: Definition };
    }
    export interface ValueDefinition
    {
        export?: boolean;
        $type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    export interface TypeDefinition
    {
        export?: boolean;
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export interface InterfaceDefinition
    {
        export?: boolean;
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer };
    }
    export const isSchema = (value: unknown): value is typeof schema => "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" === value;
    export const isTypeSchema = (value: unknown): value is TypeSchema => null !== value && "object" === typeof value && "$ref" in value && isSchema(value.$ref) && "defines" in value && null !== value.defines && "object" === typeof value.defines && Object.values(value.defines).every( i => isDefinition(i) ) && "options" in value && isOutputOptions(value.options);
    export const isOutputOptions = (value: unknown): value is OutputOptions => null !== value && "object" === typeof value && ( ! ("outputFile" in value) || "string" === typeof value.outputFile ) && "indentUnit" in value && ( "number" === typeof value.indentUnit || "\t" === value.indentUnit ) && "indentStyle" in value && isIndentStyleType(value.indentStyle) && "validatorOption" in value && isValidatorOptionType(value.validatorOption) && ( ! ("maxLineLength" in value) || ( "null" === value.maxLineLength || "number" === typeof value.maxLineLength ) );
    export const isIndentStyleType = (value: unknown): value is IndentStyleType => indentStyleTypeMember.includes(value as any);
    export const isValidatorOptionType = (value: unknown): value is ValidatorOptionType => ["none","simple","full"].includes(value as any);
    export const isDefinition = (value: unknown): value is Definition => isModuleDefinition(value) || isValueDefinition(value) || isTypeDefinition(value) || isInterfaceDefinition(value);
    export const isModuleDefinition = (value: unknown): value is ModuleDefinition => null !== value && "object" === typeof value && ( ! ("export" in value) || "boolean" === typeof value.export ) && "$type" in value && "module" === value.$type && "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).every( i => isDefinition(i) );
    export const isValueDefinition = (value: unknown): value is ValueDefinition => null !== value && "object" === typeof value && ( ! ("export" in value) || "boolean" === typeof value.export ) && "$type" in value && "value" === value.$type && "value" in value && ( isLiteralElement(value.value) || isReferElement(value.value) ) && ( ! ("validator" in value) || "boolean" === typeof value.validator );
    export const isTypeDefinition = (value: unknown): value is TypeDefinition => null !== value && "object" === typeof value && ( ! ("export" in value) || "boolean" === typeof value.export ) && "$type" in value && "type" === value.$type && "define" in value && isTypeOrInterfaceOrRefer(value.define);
    export const isInterfaceDefinition = (value: unknown): value is InterfaceDefinition => null !== value && "object" === typeof value && ( ! ("export" in value) || "boolean" === typeof value.export ) && "$type" in value && "interface" === value.$type && "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).every( i => isTypeOrInterfaceOrRefer(i) );
}
