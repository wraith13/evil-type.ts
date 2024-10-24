export declare namespace EvilType {
    const comparer: <Item, T extends ((i: Item) => any)[]>(...args: T) => (a: Item, b: Item) => 0 | 1 | -1;
    const lazy: <T extends (...args: any[]) => any>(invoker: () => T) => T;
    namespace Error {
        interface Item {
            type: "solid" | "fragment";
            path: string;
            requiredType: string;
            actualValue: string;
        }
        interface Listener {
            path: string;
            matchRate: {
                [path: string]: boolean | number;
            };
            errors: Item[];
        }
        const makeListener: (path?: string) => Listener;
        const nextListener: <T extends Listener | undefined>(name: string | number, listner: T) => T;
        const makePath: (path: string, name: string | number) => string;
        const getPathDepth: (path: string) => number;
        const getType: (isType: ((v: unknown, listner?: Listener) => boolean)) => string[];
        const isMtached: (matchRate: boolean | number) => matchRate is true;
        const matchRateToNumber: (matchRate: boolean | number) => number;
        const setMatchRate: (listner: Listener | undefined, matchRate: boolean | number) => matchRate is true;
        const getMatchRate: (listner: Listener, path?: string) => number | boolean;
        const calculateMatchRate: (listner: Listener, path?: string) => number | true;
        const setMatch: (listner: Listener | undefined) => void;
        const raiseError: (listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) => boolean;
        const orErros: (listner: Listener, modulus: number, errors: Item[], fullErrors: Item[]) => void;
        const andErros: (listner: Listener, errors: Item[]) => void;
        const valueToString: (value: unknown) => string;
        const withErrorHandling: (isMatchType: boolean, listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) => boolean;
    }
    namespace Validator {
        type ErrorListener = Error.Listener;
        const makeErrorListener: (path?: string) => Error.Listener;
        type IsType<T> = (value: unknown, listner?: ErrorListener) => value is T;
        const isJust: <T>(target: T) => (value: unknown, listner?: ErrorListener) => value is T;
        const isNever: (value: unknown, listner?: ErrorListener) => value is never;
        const isUndefined: (value: unknown, listner?: ErrorListener) => value is undefined;
        const isUnknown: (_value: unknown, _listner?: ErrorListener) => _value is unknown;
        const isAny: (_value: unknown, _listner?: ErrorListener) => _value is any;
        const isNull: (value: unknown, listner?: ErrorListener) => value is null;
        const isBoolean: (value: unknown, listner?: ErrorListener) => value is boolean;
        const isNumber: (value: unknown, listner?: ErrorListener) => value is number;
        const isInteger: (value: unknown, listner?: ErrorListener) => value is number;
        const isString: (value: unknown, listner?: ErrorListener) => value is string;
        const isDetailString: (data: {
            minLength?: number;
            maxLength?: number;
            pattern?: string;
            format?: string;
            regexpFlags?: string;
        }, regexpFlags?: string) => IsType<string>;
        type ActualObject = Exclude<object, null>;
        const isObject: (value: unknown) => value is ActualObject;
        const isEnum: <T>(list: readonly T[]) => (value: unknown, listner?: ErrorListener) => value is T;
        const isArray: <T>(isType: IsType<T>) => (value: unknown, listner?: ErrorListener) => value is T[];
        const makeOrTypeNameFromIsTypeList: <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) => string[];
        const getBestMatchErrors: (listeners: ErrorListener[]) => Error.Listener[];
        const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) => (value: unknown, listner?: ErrorListener) => value is T[number];
        type OrTypeToAndType<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
        const isAnd: <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) => (value: unknown, listner?: ErrorListener) => value is OrTypeToAndType<T[number]>;
        interface NeverTypeGuard {
            $type: "never-type-guard";
        }
        const isNeverTypeGuard: (value: unknown, listner?: ErrorListener) => value is NeverTypeGuard;
        const isNeverMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, _neverTypeGuard: NeverTypeGuard, listner?: ErrorListener) => boolean;
        interface OptionalTypeGuard<T> {
            $type: "optional-type-guard";
            isType: IsType<T> | ObjectValidator<T>;
        }
        const isOptionalTypeGuard: (value: unknown, listner?: ErrorListener) => value is OptionalTypeGuard<unknown>;
        const makeOptionalTypeGuard: <T>(isType: IsType<T> | ObjectValidator<T>) => OptionalTypeGuard<T>;
        const invokeIsType: <T>(isType: IsType<T> | ObjectValidator<T>) => IsType<T> | ((value: unknown, listner?: ErrorListener) => value is object);
        const isOptional: <T>(isType: IsType<T> | ObjectValidator<T>) => OptionalTypeGuard<T>;
        const isOptionalMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalTypeGuard<unknown>, listner?: ErrorListener) => boolean;
        const isMemberType: <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: IsType<unknown> | OptionalTypeGuard<unknown>, listner?: ErrorListener) => boolean;
        type NeverKeys<T> = {
            [K in keyof T]: T[K] extends never ? K : never;
        }[keyof T];
        type OptionalKeys<T> = Exclude<{
            [K in keyof T]: T extends Record<K, T[K]> ? never : K;
        } extends {
            [_ in keyof T]: infer U;
        } ? U : never, NeverKeys<T>>;
        type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
        type NonOptionalKeys<T> = Exclude<keyof T, NeverKeys<T> | OptionalKeys<T>>;
        type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
        type ObjectValidator<ObjectType> = {
            [key in NeverKeys<ObjectType>]: NeverTypeGuard;
        } & {
            [key in NonOptionalKeys<ObjectType>]: IsType<ObjectType[key]> | ObjectValidator<ObjectType[key]>;
        } & {
            [key in OptionalKeys<ObjectType>]: OptionalTypeGuard<Exclude<ObjectType[key], undefined>>;
        };
        type MergeType<A, B> = Omit<A, keyof B> & B;
        type MergeMultipleType<A, B extends any[]> = B extends [infer Head, ...infer Tail] ? MergeMultipleType<MergeType<A, Head>, Tail> : B extends [infer Last] ? MergeType<A, Last> : A;
        const mergeObjectValidator: <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) => MergeMultipleType<ObjectValidator<A>, B>;
        const isSpecificObject: <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType> | (() => ObjectValidator<ObjectType>), additionalProperties?: boolean) => (value: unknown, listner?: ErrorListener) => value is ObjectType;
        const isDictionaryObject: <MemberType, Keys extends string>(isType: IsType<MemberType>, keys?: Keys[], additionalProperties?: boolean) => (value: unknown, listner?: ErrorListener) => value is { [key in Keys]: MemberType; };
    }
}
