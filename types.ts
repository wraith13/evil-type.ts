export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    export interface TypeSchema
    {
        $ref: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
        defines: { [key: string]: Define; };
    }
    export interface BaseDefine
    {
        $type: $type;
    }
    export interface ModuleDefine extends BaseDefine
    {
        $type: "module";
        members: { [key: string]: Define; };
    }
    export interface ValueDefine<ValueType> extends BaseDefine
    {
        $type: "value";
        value: ValueType;
    }
    export interface TypeDefine extends BaseDefine
    {
        $type: "type";
        define: TypeOfInterface;
    }
    export interface InterfaceDefine extends BaseDefine
    {
        $type: "interface";
        members: { [key: string]: TypeOfInterface; };
    }
    export type $type = Define["$type"];
    export type TypeOfInterface = TypeDefine | InterfaceDefine;
    export type Define = ModuleDefine | ValueDefine<any> | TypeOfInterface;
}
