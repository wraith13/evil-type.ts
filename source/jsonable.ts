export module Jsonable
{
    export type JsonableValue = null | boolean | number | string;
    export const isJsonableValue = (value: unknown): value is JsonableValue =>
        null === value ||
        "boolean" === typeof value ||
        "number" === typeof value ||
        "string" === typeof value;
    export type JsonableArray = Jsonable[];
    export const isJsonableArray = (value: unknown): value is JsonableArray =>
        Array.isArray(value) &&
        value.every(v => isJsonable(v));
    export interface JsonableObject
    {
        [key: string]: Jsonable;
    }
    export const isJsonableObject = (value: unknown): value is JsonableObject =>
        null !== value &&
        "object" === typeof value &&
        Object.values(value).every(v => isJsonable(v));
    export type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    export const isJsonable = (value: unknown): value is Jsonable =>
        isJsonableValue(value) ||
        isJsonableArray(value) ||
        isJsonableObject(value);
    export const parse = (json: string): Jsonable => JSON.parse(json);
    export const stringify = (value: Jsonable): string => JSON.stringify(value);
    export type JsonablePartial<Target> = { [key in keyof Target]?: Target[key] } & JsonableObject;
}
