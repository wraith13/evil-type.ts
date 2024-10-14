import { EvilTypeError } from "./error";
export declare namespace EvilTypeValidator {
    const isJust: <T>(target: T) => (value: unknown, listner?: EvilTypeError.Listener) => value is T;
    const isUndefined: (value: unknown, listner?: EvilTypeError.Listener) => value is undefined;
    const isNull: (value: unknown, listner?: EvilTypeError.Listener) => value is null;
    const isBoolean: (value: unknown, listner?: EvilTypeError.Listener) => value is boolean;
    const isNumber: (value: unknown, listner?: EvilTypeError.Listener) => value is number;
    const isString: (value: unknown, listner?: EvilTypeError.Listener) => value is string;
    type ActualObject = Exclude<object, null>;
    const isObject: (value: unknown) => value is ActualObject;
    const isEnum: <T>(list: readonly T[]) => (value: unknown, listner?: EvilTypeError.Listener) => value is T;
    const isArray: <T>(isType: (value: unknown, listner?: EvilTypeError.Listener) => value is T) => (value: unknown, listner?: EvilTypeError.Listener) => value is T[];
    const makeOrTypeNameFromIsTypeList: <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: EvilTypeError.Listener) => value is T[K]); }) => string[];
    const getBestMatchErrors: (listeners: EvilTypeError.Listener[]) => EvilTypeError.Listener[];
    const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: EvilTypeError.Listener) => value is T[K]); }) => (value: unknown, listner?: EvilTypeError.Listener) => value is T[number];
    type OrTypeToAndType<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
    const isAnd: <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: EvilTypeError.Listener) => value is T[K]); }) => (value: unknown, listner?: EvilTypeError.Listener) => value is OrTypeToAndType<T[number]>;
    interface OptionalKeyTypeGuard<T> {
        $type: "optional-type-guard";
        isType: ((value: unknown, listner?: EvilTypeError.Listener) => value is T) | ObjectValidator<T>;
    }
    const isOptionalKeyTypeGuard: (value: unknown, listner?: EvilTypeError.Listener) => value is OptionalKeyTypeGuard<unknown>;
    const makeOptionalKeyTypeGuard: <T>(isType: (value: unknown, listner?: EvilTypeError.Listener) => value is T) => OptionalKeyTypeGuard<T>;
    const invokeIsType: <T>(isType: ((value: unknown, listner?: EvilTypeError.Listener) => value is T) | ObjectValidator<T>) => ((value: unknown, listner?: EvilTypeError.Listener) => value is T) | ((value: unknown, listner?: EvilTypeError.Listener) => value is object);
    const isOptional: <T>(isType: (value: unknown, listner?: EvilTypeError.Listener) => value is T) => OptionalKeyTypeGuard<T>;
    const isOptionalMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalKeyTypeGuard<unknown>, listner?: EvilTypeError.Listener) => boolean;
    const isMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown, listner?: EvilTypeError.Listener) => boolean) | OptionalKeyTypeGuard<unknown>, listner?: EvilTypeError.Listener) => boolean;
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
    type MergeType<A, B> = Omit<A, keyof B> & B;
    type MergeMultipleType<A, B extends any[]> = B extends [infer Head, ...infer Tail] ? MergeMultipleType<MergeType<A, Head>, Tail> : A;
    const mergeObjectValidator: <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) => MergeMultipleType<ObjectValidator<A>, B>;
    const isSpecificObject: <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType> | (() => ObjectValidator<ObjectType>)) => (value: unknown, listner?: EvilTypeError.Listener) => value is ObjectType;
    const isDictionaryObject: <MemberType>(isType: ((m: unknown, listner?: EvilTypeError.Listener) => m is MemberType)) => (value: unknown, listner?: EvilTypeError.Listener) => value is {
        [key: string]: MemberType;
    };
}
