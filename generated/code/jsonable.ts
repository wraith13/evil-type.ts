// This file is generated.
import { EvilTypeValidator } from "../../source/validator";
export namespace Jsonable
{
    export type JsonableValue = null | boolean | number | string;
    export type JsonableArray = Jsonable[];
    export type JsonableObject =
    {
        [key: string]: Jsonable;
    }
    export type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    export const parse = (json: string): Jsonable => JSON.parse(json);
    export const stringify =
        (value: Jsonable, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, space?: string | number):
        string => JSON.stringify(value, replacer as any, space);
    export type JsonablePartial<Target extends JsonableObject> = { [key in keyof Target]?: Target[key] } & JsonableObject;
    export const isJsonableValue = EvilTypeValidator.isOr(EvilTypeValidator.isNull, EvilTypeValidator.isBoolean, EvilTypeValidator.isNumber
        , EvilTypeValidator.isString);
    export const isJsonableArray = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is JsonableArray =>
        EvilTypeValidator.isArray(isJsonable)(value, listner);
    export const isJsonableObject = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is JsonableObject =>
        EvilTypeValidator.isDictionaryObject(isJsonable)(value, listner);
    export const isJsonable = (value: unknown, listner?: EvilTypeValidator.ErrorListener): value is Jsonable => EvilTypeValidator.isOr(
        isJsonableValue, isJsonableArray, isJsonableObject)(value, listner);
}
