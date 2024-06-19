export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    export type JsonableValue = null | boolean | number | string;
    export const isJsonableValue = (value: unknown): value is JsonableValue =>
        null === value ||
        "boolean" === typeof value ||
        "number" === typeof value ||
        "string" === typeof value;
    export interface JsonableObject
    {
        [key: string]: Jsonable;
    }
    export const isJsonableObject = (value: unknown): value is JsonableObject =>
        null !== value &&
        "object" === typeof value &&
        Object.values(value).filter(v => ! isJsonable(v)).length <= 0;
    export type Jsonable = JsonableValue | Jsonable[] | JsonableObject;
    export const isJsonable = (value: unknown): value is Jsonable =>
        isJsonableValue(value) ||
        (Array.isArray(value) && value.filter(v => ! isJsonable(v)).length <= 0) ||
        isJsonableObject(value);
    export type JsonablePartial<Target> = { [key in keyof Target]?: Target[key] } & JsonableObject;
    export interface TypeSchema
    {
        $ref: typeof schema;
        defines: { [key: string]: Define; };
        options: TypeOptions;
    }
    export const isTypeSchema = (value: unknown): value is TypeSchema =>
        isJsonableObject(value) &&
        "$ref" in value && "string" === typeof value.$ref &&
        "defines" in value && isJsonableObject(value.defines) && Object.values(value.defines).filter(v => ! isDefine(v)).length <= 0 &&
        "options" in value && isTypeOptions(value.options);
    export type ValidatorOptionType = "none" | "simple" | "full";
    export const isValidatorOptionType = (value: unknown): value is ValidatorOptionType =>
        0 <= [ "none", "simple", "full", ].indexOf(value as ValidatorOptionType);
    export interface TypeOptions
    {
        indentUnit: number | "\t";
        indentStyle: "allman" | "egyptian";
        validatorOption: ValidatorOptionType;
    }
    export const isTypeOptions = (value: unknown): value is TypeOptions =>
        isJsonableObject(value) &&
        "indentUnit" in value && ("number" === typeof value.indentUnit || "\t" === value.indentUnit) &&
        "indentStyle" in value && 0 <= [ "allman", "egyptian" ].indexOf(value.indentStyle as TypeOptions["indentStyle"]) &&
        "validatorOption" in value && isValidatorOptionType(value.validatorOption);
    export type FilePath = string;
    export interface Refer
    {
        $ref: string;
    }
    export const isRefer = (value: unknown): value is Refer =>
        null !== value &&
        "object" === typeof value &&
        "$ref" in value && "string" === typeof value.$ref;
    export interface AlphaDefine
    {
        export?: boolean;
        $type: string;
    }
    export const isAlphaDefine = (value: unknown): value is AlphaDefine =>
        null !== value &&
        "object" === typeof value &&
        (! ("export" in value) || "boolean" === typeof value.export) &&
        "$type" in value && "string" === typeof value.$type;
    export interface ModuleDefine extends AlphaDefine
    {
        $type: "module";
        members: { [key: string]: Define; };
    }
    export const isModuleDefine = (value: unknown): value is AlphaDefine =>
        isAlphaDefine(value) &&
        "module" === value.$type &&
        "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).filter(v => ! isDefine(v)).length <= 0;
    export interface ValueDefine extends AlphaDefine
    {
        $type: "value";
        value: Jsonable;
    }
    export const isValueDefine = (value: unknown): value is ValueDefine =>
        isAlphaDefine(value) &&
        "value" === value.$type &&
        "value" in value && isJsonable(value);
    export interface PrimitiveTypeDefine extends AlphaDefine
    {
        $type: "primitive-type";
        define: "undefined" | "boolean" | "number" | "string";
    }
    export const isPrimitiveTypeDefine = (value: unknown): value is PrimitiveTypeDefine =>
        isAlphaDefine(value) &&
        "primitive-type" === value.$type &&
        "define" in value && ("undefined" === value.define || "boolean" === value.define || "number" === value.define || "string" === value.define);
    export interface TypeDefine extends AlphaDefine
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export const isTypeDefine = (value: unknown): value is TypeDefine =>
        isAlphaDefine(value) &&
        "type" === value.$type &&
        "define" in value && isTypeOrInterfaceOrRefer(value.define);
    export interface InterfaceDefine extends AlphaDefine
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer; };
    }
    export const isInterfaceDefine = (value: unknown): value is InterfaceDefine =>
        isAlphaDefine(value) &&
        "interface" === value.$type &&
        "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).filter(v => ! isTypeOrInterfaceOrRefer(v)).length <= 0;
    export interface ArrayDefine extends AlphaDefine
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export const isArrayDefine = (value: unknown): value is ArrayDefine =>
        isAlphaDefine(value) &&
        "array" === value.$type &&
        "items" in value && isTypeOrInterfaceOrRefer(value.items);
    export interface OrDefine extends AlphaDefine
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isOrDefine = (value: unknown): value is OrDefine =>
        isAlphaDefine(value) &&
        "or" === value.$type &&
        "types" in value && Array.isArray(value.types) && value.types.filter(i => ! isTypeOrInterfaceOrRefer(i)).length <= 0;
    export interface AndDefine extends AlphaDefine
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isAndDefine = (value: unknown): value is AndDefine =>
        isAlphaDefine(value) &&
        "and" === value.$type &&
        "types" in value && Array.isArray(value.types) && value.types.filter(i => ! isTypeOrInterfaceOrRefer(i)).length <= 0;
    export type TypeOrInterface = PrimitiveTypeDefine | TypeDefine | InterfaceDefine | ArrayDefine | OrDefine | AndDefine;
    export type ValueOrTypeOfInterface = ValueDefine | TypeOrInterface;
    export type ValueOrTypeOfInterfaceOrRefer = ValueOrTypeOfInterface | Refer;
    export const isTypeOrInterface = (value: unknown): value is TypeOrInterface =>
        isPrimitiveTypeDefine(value) ||
        isTypeDefine(value) ||
        isInterfaceDefine(value) ||
        isArrayDefine(value) ||
        isOrDefine(value) ||
        isAndDefine(value);
    export type TypeOrInterfaceOrRefer = TypeOrInterface | Refer;
    export const isTypeOrInterfaceOrRefer = (value: unknown): value is TypeOrInterfaceOrRefer =>
        isTypeOrInterface(value) || isRefer(value);
    export type Define = ModuleDefine | ValueDefine | TypeOrInterface;
    export const isDefine = (value: unknown): value is Define =>
        isModuleDefine(value) || isValueDefine(value) || isTypeOrInterface(value);
    export type DefineOrRefer = Define | Refer;
    export const isDefineOrRefer = (value: unknown): value is DefineOrRefer =>
        isDefine(value) || isRefer(value);
}
