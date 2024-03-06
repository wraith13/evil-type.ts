export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    export interface TypeSchema
    {
        $ref: typeof schema;
        defines: { [key: string]: Define; };
    }
    export interface Refer
    {
        $ref: string;
    }
    export interface AlphaDefine
    {
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
        value: unknown;
    }
    export interface TypeDefine extends AlphaDefine
    {
        $type: "type";
        define: TypeOrInterface;
    }
    export interface InterfaceDefine extends AlphaDefine
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterface; };
    }
    export type TypeOrInterface = TypeDefine | InterfaceDefine | ValueDefine;
    export type TypeOrInterfaceOrRefer = TypeOrInterface | Refer;
    export type Define = ModuleDefine | ValueDefine | TypeOrInterface;
}
