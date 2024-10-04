// This file is generated.
import { TypesPrime } from "../source/types-prime.ts";
import { TypesError } from "../source/types-error.ts";
export module Jsonable
{
    export type JsonableValue = null | boolean | number | string;
    export type JsonableArray = Jsonable[];
    export type JsonableObject =
    {
        [key: string]: Jsonable;
    }
    export type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    export const parse = (json: string): Jsonable => JSON.parse(json);
    export const isJsonableValue = (value: unknown, listner?: TypesError.Listener): value is JsonableValue => TypesPrime.isOr(
        TypesPrime.isNull, TypesPrime.isBoolean, TypesPrime.isNumber, TypesPrime.isString)(value, listner);
    export const isJsonableArray = (value: unknown, listner?: TypesError.Listener): value is JsonableArray => TypesPrime.isArray(isJsonable
        )(value, listner);
    export const isJsonableObject = (value: unknown, listner?: TypesError.Listener): value is JsonableObject =>
        TypesPrime.isDictionaryObject(isJsonable)(value, listner);
    export const isJsonable = (value: unknown, listner?: TypesError.Listener): value is Jsonable => TypesPrime.isOr(isJsonableValue,
        isJsonableArray, isJsonableObject)(value, listner);
}
