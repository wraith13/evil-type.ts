import { Jsonable } from "./jsonable";
import { TypesError } from "./types-error";
export declare namespace TypesPrime {
    const isJust: <T>(target: T) => (value: unknown, listner?: TypesError.Listener) => value is T;
    const isUndefined: (value: unknown, listner?: TypesError.Listener) => value is undefined;
    const isNull: (value: unknown, listner?: TypesError.Listener) => value is null;
    const isBoolean: (value: unknown, listner?: TypesError.Listener) => value is boolean;
    const isNumber: (value: unknown, listner?: TypesError.Listener) => value is number;
    const isString: (value: unknown, listner?: TypesError.Listener) => value is string;
    type ActualObject = Exclude<object, null>;
    const isObject: (value: unknown) => value is ActualObject;
    const isEnum: <T>(list: readonly T[]) => (value: unknown, listner?: TypesError.Listener) => value is T;
    const isArray: <T>(isType: (value: unknown, listner?: TypesError.Listener) => value is T) => (value: unknown, listner?: TypesError.Listener) => value is T[];
    const isJsonable: (value: unknown, listner?: TypesError.Listener) => value is Jsonable.Jsonable;
    const makeOrTypeNameFromIsTypeList: <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypesError.Listener) => value is T[K]); }) => string[];
    const getBestMatchErrors: (listeners: TypesError.Listener[]) => TypesError.Listener[];
    const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypesError.Listener) => value is T[K]); }) => (value: unknown, listner?: TypesError.Listener) => value is T[number];
    interface OptionalKeyTypeGuard<T> {
        $type: "optional-type-guard";
        isType: ((value: unknown, listner?: TypesError.Listener) => value is T) | ObjectValidator<T>;
    }
    const isOptionalKeyTypeGuard: (value: unknown, listner?: TypesError.Listener) => value is OptionalKeyTypeGuard<unknown>;
    const makeOptionalKeyTypeGuard: <T>(isType: (value: unknown, listner?: TypesError.Listener) => value is T) => OptionalKeyTypeGuard<T>;
    const invokeIsType: <T>(isType: ((value: unknown, listner?: TypesError.Listener) => value is T) | ObjectValidator<T>) => ((value: unknown, listner?: TypesError.Listener) => value is T) | ((value: unknown, listner?: TypesError.Listener) => value is object);
    const isOptional: <T>(isType: (value: unknown, listner?: TypesError.Listener) => value is T) => OptionalKeyTypeGuard<T>;
    const isOptionalMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalKeyTypeGuard<unknown>, listner?: TypesError.Listener) => boolean;
    const isMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown, listner?: TypesError.Listener) => boolean) | OptionalKeyTypeGuard<unknown>, listner?: TypesError.Listener) => boolean;
    type OptionalKeys<T> = {
        [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    } extends {
        [_ in keyof T]: infer U;
    } ? U : never;
    type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
    type NonOptionalKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
    type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
    type ObjectValidator<ObjectType> = {
        [key in NonOptionalKeys<ObjectType>]: ((v: unknown) => v is ObjectType[key]) | ObjectValidator<ObjectType[key]>;
    } & {
        [key in OptionalKeys<ObjectType>]: OptionalKeyTypeGuard<Exclude<ObjectType[key], undefined>>;
    };
    const margeObjectValidator: <A, B>(a: ObjectValidator<A>, b: ObjectValidator<B>) => Omit<ObjectValidator<A>, keyof B> & ObjectValidator<B>;
    const isSpecificObject: <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType> | (() => ObjectValidator<ObjectType>)) => (value: unknown, listner?: TypesError.Listener) => value is ObjectType;
    const isDictionaryObject: <MemberType>(isType: ((m: unknown, listner?: TypesError.Listener) => m is MemberType)) => (value: unknown, listner?: TypesError.Listener) => value is {
        [key: string]: MemberType;
    };
}
