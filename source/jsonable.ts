export module Jsonable
{
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
    export const parse = (json: string): Jsonable => JSON.parse(json);
    export const stringify = (value: Jsonable): string => JSON.stringify(value);
}
