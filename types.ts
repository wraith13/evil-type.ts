export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    export type JsonableValue = null | boolean | number | string;
    export interface JsonableObject
    {
        [key: string]: Jsonable;
    }
    export type Jsonable = JsonableValue | Jsonable[] | JsonableObject;
    export type JsonablePartial<Target> = { [key in keyof Target]?: Target[key] } & JsonableObject;
    export interface TypeSchema
    {
        $ref: typeof schema;
        defines: { [key: string]: Define; };
        options: TypeOptions;
    }
    export type ValidatorOptionType = "none" | "simple" | "full";
    export interface TypeOptions
    {
        indentUnit: number | "\t";
        indentStyle: "allman" | "egyptian";
        ValidatorOption: ValidatorOptionType;
    }
    export type FilePath = string;
    export interface Refer
    {
        $ref: string;
    }
    export const isRefer = (value: unknown): value is Refer =>
        null !== value &&
        "object" === typeof value &&
        "$ref" in value &&
        "string" === typeof value.$ref;
    export interface AlphaDefine
    {
        export?: boolean;
        $type: string;
    }
    export interface ModuleDefine extends AlphaDefine
    {
        $type: "module";
        members: { [key: string]: Define; };
    }
    export interface ValueDefine extends AlphaDefine
    {
        $type: "value";
        value: Jsonable;
    }
    export interface PrimitiveTypeDefine extends AlphaDefine
    {
        $type: "primitive-type";
        define: "undefined" | "boolean" | "number" | "string";
    }
    export interface TypeDefine extends AlphaDefine
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export interface InterfaceDefine extends AlphaDefine
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer; };
    }
    export interface ArrayDefine extends AlphaDefine
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export interface OrDefine extends AlphaDefine
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export interface AndDefine extends AlphaDefine
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export type TypeOrInterface = PrimitiveTypeDefine | TypeDefine | InterfaceDefine | ValueDefine | ArrayDefine | OrDefine | AndDefine;
    export type TypeOrInterfaceOrRefer = TypeOrInterface | Refer;
    export type Define = ModuleDefine | ValueDefine | TypeOrInterface;
}
