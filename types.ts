export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    export interface TypeSchema
    {
        $ref: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
        defines: { [key: string]: Define };
    }
    export interface BaseDefine
    {
        type: Define["type"];
    }
    export interface ModuleDefine extends BaseDefine
    {
        type: "module";
    }
    export interface ValueDefine extends BaseDefine
    {
        type: "value";
    }
    export interface TypeDefine extends BaseDefine
    {
        type: "type";
    }
    export interface InterfaceDefine extends BaseDefine
    {
        type: "interface";
    }
    export type Define = ModuleDefine | ValueDefine | TypeDefine | InterfaceDefine;
}
