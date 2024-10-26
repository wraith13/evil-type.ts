// This file is generated.
import { EvilType } from "../../common/evil-type";
export namespace Jsonable
{
    export type JsonableValue = null | boolean | number | string;
    export type JsonableArray = Jsonable[];
    export type JsonableObject =
    {
        [ key: string ]: Jsonable;
    }
    export type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    export const parse = (json: string): Jsonable => JSON.parse(json);
    export const stringify =
        (value: Jsonable, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, space?: string | number):
        string => JSON.stringify(value, replacer as any, space);
    export type JsonablePartial<Target extends JsonableObject> = { [key in keyof Target]?: Target[key] } & JsonableObject;
    export const isJsonableValue: EvilType.Validator.IsType<JsonableValue> = EvilType.Validator.isOr(EvilType.Validator.isNull,
        EvilType.Validator.isBoolean, EvilType.Validator.isSafeNumber, EvilType.Validator.isString);
    export const isJsonableArray: EvilType.Validator.IsType<JsonableArray> = EvilType.lazy(() => EvilType.Validator.isArray(isJsonable));
    export const isJsonableObject: EvilType.Validator.IsType<JsonableObject> = EvilType.lazy(() => EvilType.Validator.isDictionaryObject(
        isJsonable));
    export const isJsonable: EvilType.Validator.IsType<Jsonable> = EvilType.lazy(() => EvilType.Validator.isOr(isJsonableValue,
        isJsonableArray, isJsonableObject));
}
