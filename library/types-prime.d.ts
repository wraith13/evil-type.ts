import { Jsonable } from "./jsonable";
import { TypeError } from "./typeerror";
export declare namespace TypesPrime {
    const isJust: <T>(target: T) => (value: unknown, listner?: TypeError.Listener) => value is T;
    const isUndefined: (value: unknown, listner?: TypeError.Listener) => value is undefined;
    const isNull: (value: unknown, listner?: TypeError.Listener) => value is null;
    const isBoolean: (value: unknown, listner?: TypeError.Listener) => value is boolean;
    const isNumber: (value: unknown, listner?: TypeError.Listener) => value is number;
    const isString: (value: unknown, listner?: TypeError.Listener) => value is string;
    type ActualObject = Exclude<object, null>;
    const isObject: (value: unknown) => value is object;
    const isEnum: <T>(list: readonly T[]) => (value: unknown, listner?: TypeError.Listener) => value is T;
    const isArray: <T>(isType: (value: unknown, listner?: TypeError.Listener) => value is T) => (value: unknown, listner?: TypeError.Listener) => value is T[];
    const isJsonable: (value: unknown, listner?: TypeError.Listener) => value is Jsonable.Jsonable;
    const makeOrTypeNameFromIsTypeList: <T extends any[]>(...isTypeList: { [K in keyof T]: (value: unknown, listner?: TypeError.Listener) => value is T[K]; }) => string[];
    const getBestMatchErrors: (listeners: TypeError.Listener[]) => TypeError.Listener[];
    const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: (value: unknown, listner?: TypeError.Listener) => value is T[K]; }) => (value: unknown, listner?: TypeError.Listener) => value is T[number];
    interface OptionalKeyTypeGuard<T> {
        $type: "optional-type-guard";
        isType: (value: unknown, listner?: TypeError.Listener) => value is T;
    }
    const isOptionalKeyTypeGuard: (value: unknown, listner?: TypeError.Listener) => value is OptionalKeyTypeGuard<unknown>;
    const makeOptionalKeyTypeGuard: <T>(isType: (value: unknown, listner?: TypeError.Listener) => value is T) => OptionalKeyTypeGuard<T>;
    const isOptionalMemberType: <ObjectType extends object>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalKeyTypeGuard<unknown>, listner?: TypeError.Listener) => boolean;
    const isMemberType: <ObjectType extends object>(value: ActualObject, member: keyof ObjectType, isType: OptionalKeyTypeGuard<unknown> | ((v: unknown, listner?: TypeError.Listener) => boolean), listner?: TypeError.Listener) => boolean;
    type OptionalKeys<T> = {
        [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    } extends {
        [_ in keyof T]: infer U;
    } ? U : never;
    type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
    type NonOptionalKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
    type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
    type ObjectValidator<ObjectType> = {
        [key in NonOptionalKeys<ObjectType>]: ((v: unknown) => v is ObjectType[key]);
    } & {
        [key in OptionalKeys<ObjectType>]: OptionalKeyTypeGuard<Exclude<ObjectType[key], undefined>>;
    };
    const isSpecificObject: <ObjectType extends object>(memberValidator: ObjectValidator<ObjectType>) => (value: unknown, listner?: TypeError.Listener) => value is ObjectType;
    const isDictionaryObject: <MemberType>(isType: (m: unknown, listner?: TypeError.Listener) => m is MemberType) => (value: unknown, listner?: TypeError.Listener) => value is {
        [key: string]: MemberType;
    };
}
