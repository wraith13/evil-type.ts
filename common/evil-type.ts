// Original: https://github.com/wraith13/evil-type.ts/blob/master/common/evil-type.ts
// License: BSL-1.0 ( https://github.com/wraith13/evil-type.ts/blob/master/LICENSE_1_0.txt )
export namespace EvilType
{
    export const comparer = <Item, T extends ((i: Item) => any)[]>(...args: T) =>
        (a: Item, b: Item) =>
        {
            for(let i = 0; i < args.length; ++i)
            {
                const focus = args[i];
                const af = focus(a);
                const bf = focus(b);
                if (af < bf)
                {
                    return -1;
                }
                if (bf < af)
                {
                    return 1;
                }
            }
            return 0;
        };
    export const lazy = <T extends (...args: any[]) => any>(invoker: () => T) =>
        ((...args: Parameters<T>): ReturnType<T> => invoker()(...args)) as T;
    export namespace Error
    {
        export interface Item
        {
            type: "solid" | "fragment";
            path: string;
            requiredType: string;
            actualValue: string;
        }
        export interface Listener
        {
            path: string;
            matchRate: { [path: string]: boolean | number; }; // true: matched, false: error, number: rate
            errors: Item[];
        }
        export const makeListener = (path: string = ""): Listener =>
        ({
            path,
            matchRate: { },
            errors: [ ],
        });
        export const nextListener = <T extends Listener | undefined>(name: string | number, listner: T): T =>
            (
                listner ?
                {
                    path: makePath(listner.path, name),
                    matchRate: listner.matchRate,
                    errors: listner.errors,
                }:
                undefined
            ) as T;
        export const makePath = (path: string, name: string | number) =>
        {
            const base = path.includes("#") ? path: `${path}#`;
            const separator = base.endsWith("#") || "string" !== typeof name ? "": ".";
            const tail = "string" === typeof name ? name: `[${name}]`;
            return base +separator +tail;
        };
        export const getPathDepth = (path: string) =>
        {
            const valuePath = path.replace(/[^#]*#/, "#").replace(/\[(\d+)\]/g, ".$1");
            return valuePath.split(/[#\.]/).filter(i => 0 < i.length).length;
        };
        export const getType = (isType: ((v: unknown, listner?: Listener) => boolean)) =>
        {
            const transactionListner = makeListener();
            isType(undefined, transactionListner);
            return transactionListner.errors
                .map(i => i.requiredType.split(" | "))
                .reduce((a, b) => [...a, ...b], [])
                .filter((i, ix, list) => ix === list.indexOf(i));
        };
        export const isMtached = (matchRate: boolean | number) => true === matchRate;
        export const matchRateToNumber = (matchRate: boolean | number): number =>
        {
            switch(matchRate)
            {
            case false:
                return 0;
            case true:
                return 1;
            default:
                return matchRate;
            }
        };
        export const setMatchRate = (listner: Listener | undefined, matchRate: boolean | number) =>
        {
            if (listner)
            {
                listner.matchRate[listner.path] = matchRate;
            }
            return isMtached(matchRate);
        };
        export const getMatchRate = (listner: Listener, path: string = listner.path) =>
        {
            if (path in listner.matchRate)
            {
                return listner.matchRate[path];
            }
            return calculateMatchRate(listner, path);
        };
        export const calculateMatchRate = (listner: Listener, path: string = listner.path) =>
        {
            const depth = getPathDepth(path);
            const childrenKeys = Object.keys(listner.matchRate)
                .filter(i => 0 === i.indexOf(path) && getPathDepth(i) === depth +1);
            const length = childrenKeys.length;
            const sum = childrenKeys
                .map(i => listner.matchRate[i])
                .map(i => matchRateToNumber(i))
                .reduce((a, b) => a +b, 0.0);
            const result = 0 < length ? sum /length: true;
            if (true === result || 1.0 <= result)
            {
                console.error("🦋 FIXME: \"MatchWithErrors\": " +JSON.stringify({ sum, length, result, listner}));
            }
            return listner.matchRate[path] = result;
        };
        export const setMatch = (listner: Listener | undefined) =>
        {
            if (listner)
            {
                const paths = Object.keys(listner.matchRate)
                    .filter(path => 0 === path.indexOf(listner.path));
                if (paths.every(path => isMtached(listner.matchRate[path])))
                {
                    paths.forEach(path => delete listner.matchRate[path]);
                }
            }
            setMatchRate(listner, true);
        };
        export const raiseError = (listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) =>
        {
            if (listner)
            {
                setMatchRate(listner, false);
                listner.errors.push
                ({
                    type: "solid",
                    path: listner.path,
                    requiredType: "string" === typeof requiredType ? requiredType: requiredType(),
                    actualValue: valueToString(actualValue),
                });
            }
            return false;
        };
        export const orErros = (listner: Listener, modulus: number, errors: Item[], fullErrors: Item[]) =>
        {
            const paths = errors.map(i => i.path).filter((i, ix, list) => ix === list.indexOf(i));
            listner.errors.push
            (
                ...paths.map
                (
                    path =>
                    ({
                        type: modulus <= fullErrors.filter(i => "solid" === i.type && i.path === path).length ?
                            "solid" as const:
                            "fragment" as const,
                        path,
                        requiredType: errors
                            .filter(i => i.path === path)
                            .map(i => i.requiredType)
                            .map(i => i.split(" | "))
                            .reduce((a, b) => [...a, ...b], [])
                            .filter((i, ix, list) => ix === list.indexOf(i))
                            .join(" | "),
                        actualValue: errors.filter(i => i.path === path).map(i => i.actualValue)[0],
                    })
                )
            );
        };
        export const andErros = (listner: Listener, errors: Item[]) =>
        {
            const paths = errors.map(i => i.path).filter((i, ix, list) => ix === list.indexOf(i));
            listner.errors.push
            (
                ...paths.map
                (
                    path =>
                    ({
                        type: errors.some(i => "solid" === i.type && i.path === path) ?
                            "solid" as const:
                            "fragment" as const,
                        path,
                        requiredType: errors
                            .filter(i => i.path === path)
                            .map(i => i.requiredType)
                            .map(i => i.split(" & "))
                            .reduce((a, b) => [...a, ...b], [])
                            .filter((i, ix, list) => ix === list.indexOf(i))
                            .join(" & "),
                        actualValue: errors.filter(i => i.path === path).map(i => i.actualValue)[0],
                    })
                )
            );
        };
        export const valueToString = (value: unknown) =>
            undefined === value ? "undefined": JSON.stringify(value);
        export const withErrorHandling = (isMatchType: boolean, listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) =>
        {
            if (listner)
            {
                if (isMatchType)
                {
                    setMatch(listner);
                }
                else
                {
                    raiseError(listner, requiredType, actualValue);
                }
            }
            return isMatchType;
        };
    }
    export namespace Validator
    {
        export type ErrorListener = Error.Listener;
        export const makeErrorListener = Error.makeListener;
        export type IsType<T> = (value: unknown, listner?: ErrorListener) => value is T;
        export const isJust = <T>(target: T) => null !== target && "object" === typeof target ?
            (value: unknown, listner?: ErrorListener): value is T =>
                Error.withErrorHandling(JSON.stringify(target) === JSON.stringify(value), listner, () => Error.valueToString(target), value):
            (value: unknown, listner?: ErrorListener): value is T =>
                Error.withErrorHandling(target === value, listner, () => Error.valueToString(target), value);
        export const isNever = (value: unknown, listner?: ErrorListener): value is never =>
            Error.withErrorHandling(false, listner, "never", value);
        export const isUndefined = isJust(undefined);
        export const isUnknown = (_value: unknown, _listner?: ErrorListener): _value is unknown => true;
        export const isAny = (_value: unknown, _listner?: ErrorListener): _value is any => true;
        export const isNull = isJust(null);
        export const isBoolean = (value: unknown, listner?: ErrorListener): value is boolean =>
            Error.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
        export const isInteger = (value: unknown, listner?: ErrorListener): value is number =>
            Error.withErrorHandling(Number.isInteger(value), listner, "integer", value);
        export const isSafeInteger = (value: unknown, listner?: ErrorListener): value is number =>
            Error.withErrorHandling(Number.isSafeInteger(value), listner, "safe-integer", value);
        export const isDetailedInteger = (data: { minimum?: number; exclusiveMinimum?: number; maximum?: number; exclusiveMaximum?: number; multipleOf?: number; }, safeInteger?: "safe"): IsType<number> =>
        {
            const base = "safe" === safeInteger ? isSafeInteger: isInteger;
            if ([ data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf ].every(i => undefined === i))
            {
                return base;
            }
            else
            {
                const result = (value: unknown, listner?: ErrorListener): value is number => Error.withErrorHandling
                (
                    base(value) &&
                    (undefined === data.minimum || data.minimum <= value) &&
                    (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                    (undefined === data.maximum || value <= data.maximum) &&
                    (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                    (undefined === data.multipleOf || 0 === value % data.multipleOf),
                    listner,
                    () =>
                    {
                        const details: string[] = [];
                        if (undefined !== data.minimum)
                        {
                            details.push(`minimum:${data.minimum}`);
                        }
                        if (undefined !== data.exclusiveMinimum)
                        {
                            details.push(`exclusiveMinimum:${data.exclusiveMinimum}`);
                        }
                        if (undefined !== data.maximum)
                        {
                            details.push(`maximum:${data.maximum}`);
                        }
                        if (undefined !== data.exclusiveMaximum)
                        {
                            details.push(`exclusiveMaximum:${data.exclusiveMaximum}`);
                        }
                        if (undefined !== data.multipleOf)
                        {
                            details.push(`multipleOf:${data.multipleOf}`);
                        }
                        return `${"safe" === safeInteger ? "safe-integer": "integer"}(${details.join(",")})`
                    },
                    value
                );
                return result;
            }
        };
        export const isNumber = (value: unknown, listner?: ErrorListener): value is number =>
            Error.withErrorHandling("number" === typeof value, listner, "number", value);
        export const isSafeNumber = (value: unknown, listner?: ErrorListener): value is number =>
            Error.withErrorHandling(Number.isFinite(value), listner, "safe-number", value);
        export const isDetailedNumber = (data: { minimum?: number; exclusiveMinimum?: number; maximum?: number; exclusiveMaximum?: number; multipleOf?: number; }, safeNumber?: "safe"): IsType<number> =>
        {
            const base = "safe" === safeNumber ? isSafeNumber: isNumber;
            if ([ data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf ].every(i => undefined === i))
            {
                return base;
            }
            else
            {
                const result = (value: unknown, listner?: ErrorListener): value is number => Error.withErrorHandling
                (
                    base(value) &&
                    (undefined === data.minimum || data.minimum <= value) &&
                    (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                    (undefined === data.maximum || value <= data.maximum) &&
                    (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                    (undefined === data.multipleOf || 0 === value % data.multipleOf),
                    listner,
                    () =>
                    {
                        const details: string[] = [];
                        if (undefined !== data.minimum)
                        {
                            details.push(`minimum:${data.minimum}`);
                        }
                        if (undefined !== data.exclusiveMinimum)
                        {
                            details.push(`exclusiveMinimum:${data.exclusiveMinimum}`);
                        }
                        if (undefined !== data.maximum)
                        {
                            details.push(`maximum:${data.maximum}`);
                        }
                        if (undefined !== data.exclusiveMaximum)
                        {
                            details.push(`exclusiveMaximum:${data.exclusiveMaximum}`);
                        }
                        if (undefined !== data.multipleOf)
                        {
                            details.push(`multipleOf:${data.multipleOf}`);
                        }
                        return `${"safe" === safeNumber ? "safe-number": "number"}(${details.join(",")})`
                    },
                    value
                );
                return result;
            }
        };
        export const isString = (value: unknown, listner?: ErrorListener): value is string =>
            Error.withErrorHandling("string" === typeof value, listner, "string", value);
        export const makeStringTypeName = (data: { minLength?: number; maxLength?: number; pattern?: string; format?: string; regexpFlags?: string; }) =>
        {
            const details: string[] = [];
            if (undefined !== data.minLength)
            {
                details.push(`minLength:${data.minLength}`);
            }
            if (undefined !== data.maxLength)
            {
                details.push(`maxLength:${data.maxLength}`);
            }
            if (undefined !== data.format)
            {
                details.push(`format:${data.format}`);
            }
            else
            if (undefined !== data.pattern)
            {
                details.push(`pattern:${data.pattern}`);
            }
            if (undefined !== data.regexpFlags)
            {
                details.push(`regexpFlags:${data.regexpFlags}`);
            }
            return `string(${details.join(",")})`
        };
        export const isDetailedString = <Type extends string = string>(data: { minLength?: number; maxLength?: number; pattern?: string; format?: string; regexpFlags?: string }, regexpFlags?: string): IsType<Type> =>
        {
            if ([ data.minLength, data.maxLength, data.pattern, data.format ].every(i => undefined === i))
            {
                return <IsType<Type>>isString;
            }
            const pattern = data.pattern;
            const result = (value: unknown, listner?: ErrorListener): value is Type => Error.withErrorHandling
            (
                "string" === typeof value &&
                (undefined === data.minLength || data.minLength <= value.length) &&
                (undefined === data.maxLength || value.length <= data.maxLength) &&
                (undefined === pattern || new RegExp(pattern, data.regexpFlags ?? regexpFlags ?? "u").test(value)),
                listner,
                () => makeStringTypeName(data),
                value
            );
            return result;
        };
        export type ActualObject = Exclude<object, null>;
        export const isObject = (value: unknown): value is ActualObject =>
            null !== value && "object" === typeof value && ! Array.isArray(value);
        export const isEnum = <T>(list: readonly T[]) =>
            (value: unknown, listner?: ErrorListener): value is T =>
                Error.withErrorHandling(list.includes(value as T), listner, () => list.map(i => Error.valueToString(i)).join(" | "), value);
        export const isUniqueItems = (list: unknown[]) =>
            list.map(i => JSON.stringify(i)).every((i, ix, list) => ix === list.indexOf(i));
        export const makeArrayTypeName = (data?: { minItems?: number; maxItems?: number; uniqueItems?: boolean; }) =>
        {
            const details: string[] = [];
            if (undefined !== data?.minItems)
            {
                details.push(`minItems:${data.minItems}`);
            }
            if (undefined !== data?.maxItems)
            {
                details.push(`maxItems:${data.maxItems}`);
            }
            if (true === data?.uniqueItems)
            {
                details.push(`uniqueItems:${data.uniqueItems}`);
            }
            return details.length <= 0 ? "array": `array(${details.join(",")})`
        };
        export const isArray = <T>(isType: IsType<T>, data?: { minItems?: number; maxItems?: number; uniqueItems?: boolean; }) =>
        {
            return (value: unknown, listner?: ErrorListener): value is T[] =>
            {
                if
                (
                    Array.isArray(value) &&
                    (undefined === data?.minItems || data.minItems <= value.length) &&
                    (undefined === data?.maxItems || value.length <= data.maxItems) &&
                    (true !== data?.uniqueItems || isUniqueItems(value))
                )
                {
                    const result = value.map(i => isType(i, listner)).every(i => i);
                    if (listner)
                    {
                        if (result)
                        {
                            Error.setMatch(listner);
                        }
                        else
                        {
                            Error.calculateMatchRate(listner);
                        }
                    }
                    return result;
                }
                else
                {
                    return undefined !== listner && Error.raiseError(listner, () => makeArrayTypeName(data), value);
                }
            };
        };
        export const makeOrTypeNameFromIsTypeList = <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) =>
            isTypeList.map(i => Error.getType(i))
                .reduce((a, b) => [...a, ...b], [])
                .filter((i, ix, list) => ix === list.indexOf(i));
        export const getBestMatchErrors = (listeners: ErrorListener[]) =>
            listeners.map
            (
                listener =>
                ({
                    listener,
                    matchRate: Error.getMatchRate(listener),
                })
            )
            .sort(comparer(i => -Error.matchRateToNumber(i.matchRate)))
            .filter((i, _ix, list) => i.matchRate === list[0].matchRate)
            .map(i => i.listener);
        export const isOr = <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) =>
            (value: unknown, listner?: ErrorListener): value is T[number] =>
            {
                if (listner)
                {
                    const resultList = isTypeList.map
                    (
                        i =>
                        {
                            const transactionListner = Error.makeListener(listner.path);
                            const result =
                            {
                                transactionListner,
                                result: i(value, transactionListner),
                            }
                            return result;
                        }
                    );
                    const success = resultList.filter(i => i.result)[0];
                    const result = Boolean(success);
                    if (result)
                    {
                        Error.setMatch(listner);
                    }
                    else
                    {
                        const requiredType = makeOrTypeNameFromIsTypeList(...isTypeList);
                        if ((isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array")))
                        {
                            const bestMatchErrors = getBestMatchErrors(resultList.map(i => i.transactionListner));
                            const errors = bestMatchErrors.map(i => i.errors).reduce((a, b) => [...a, ...b], []);
                            const fullErrors = resultList.map(i => i.transactionListner).map(i => i.errors).reduce((a, b) => [...a, ...b], []);
                            Error.orErros(listner, isTypeList.length, errors, fullErrors);
                            if (errors.length <= 0)
                            {
                                console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " +JSON.stringify(resultList));
                            }
                            if (0 < bestMatchErrors.length)
                            {
                                Object.entries(bestMatchErrors[0].matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                            }
                        }
                        else
                        {
                            Error.raiseError
                            (
                                listner,
                                requiredType.join(" | "),
                                value
                            );
                        }
                    }
                    return result;
                }
                else
                {
                    return isTypeList.some(i => i(value));
                }
            };
            export type OrTypeToAndType<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
            export const isAnd = <T extends any[]>(...isTypeList: { [K in keyof T]: IsType<T[K]>; }) =>
                (value: unknown, listner?: ErrorListener): value is OrTypeToAndType<T[number]> =>
                {
                    if (listner)
                    {
                        const resultList = isTypeList.map
                        (
                            i =>
                            {
                                const transactionListner = Error.makeListener(listner.path);
                                const result =
                                {
                                    transactionListner,
                                    result: i(value, transactionListner),
                                }
                                return result;
                            }
                        );
                        const result = resultList.every(i => i.result);
                        if (result)
                        {
                            Error.setMatch(listner);
                        }
                        else
                        {
                            const requiredType = makeOrTypeNameFromIsTypeList(...isTypeList);
                            if ((isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array")))
                            {
                                const transactionListners = resultList.map(i => i.transactionListner);
                                const errors = transactionListners.map(i => i.errors).reduce((a, b) => [...a, ...b], []);
                                Error.andErros(listner, errors);
                                if (errors.length <= 0)
                                {
                                    console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " +JSON.stringify(resultList));
                                }
                                if (0 < transactionListners.length)
                                {
                                    const paths = transactionListners
                                        .map(i => Object.keys(i.matchRate))
                                        .reduce((a, b) => [...a, ...b], [])
                                        .filter((i, ix, list) => ix === list.indexOf(i));
                                    paths.forEach
                                    (
                                        path =>
                                        {
                                            const matchRates = transactionListners.map(i => i.matchRate[path])
                                                .filter(i => undefined !== i);
                                            if (matchRates.every(i => true === i))
                                            {
                                                listner.matchRate[path] = true;
                                            }
                                            else
                                            {
                                                listner.matchRate[path] = matchRates
                                                    .map(i => Error.matchRateToNumber(i))
                                                    .reduce((a, b) => a +b, 0)
                                                    /matchRates.length;
                                            }
                                        }
                                    );
                                }
                            }
                            else
                            {
                                Error.raiseError
                                (
                                    listner,
                                    requiredType.join(" & "),
                                    value
                                );
                            }
                        }
                        return result;
                    }
                    else
                    {
                        return isTypeList.some(i => i(value));
                    }
                };
        export interface NeverTypeGuard
        {
            $type: "never-type-guard";
        }
        export const isNeverTypeGuard = (value: unknown, listner?: ErrorListener): value is NeverTypeGuard =>
            isSpecificObject<NeverTypeGuard>
            ({
                $type: isJust("never-type-guard"),
            })(value, listner);
        export const isNeverMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, _neverTypeGuard: NeverTypeGuard, listner?: ErrorListener): boolean =>
            ! (member in value) || isNever((value as ObjectType)[member], listner);
        export interface OptionalTypeGuard<T>
        {
            $type: "optional-type-guard";
            isType: IsType<T> | ObjectValidator<T>;
        }
        export const isOptionalTypeGuard = (value: unknown, listner?: ErrorListener): value is OptionalTypeGuard<unknown> =>
            isSpecificObject<OptionalTypeGuard<unknown>>
            ({
                $type: isJust("optional-type-guard"),
                isType: (value: unknown, listner?: ErrorListener): value is (IsType<unknown> | ObjectValidator<unknown>) =>
                    "function" === typeof value || (null !== value && "object" === typeof value) || (undefined !== listner && Error.raiseError(listner, "IsType<unknown> | ObjectValidator<unknown>", value)),
            })(value, listner);
        export const makeOptionalTypeGuard = <T>(isType: IsType<T> | ObjectValidator<T>): OptionalTypeGuard<T> =>
        ({
            $type: "optional-type-guard",
            isType,
        });
        export const invokeIsType = <T>(isType: IsType<T> | ObjectValidator<T>) =>
            "function" === typeof isType ? isType: isSpecificObject(isType);
        export const isOptional = makeOptionalTypeGuard;
        export const isOptionalMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalTypeGuard<unknown>, listner?: ErrorListener): boolean =>
        {
            const result = ! (member in value) || invokeIsType(optionalTypeGuard.isType)((value as ObjectType)[member], listner);
            if ( ! result && listner)
            {
                const error = listner.errors.filter(i => i.path === listner.path)[0];
                if (error)
                {
                    error.requiredType = "never | " + error.requiredType;
                }
                else
                {
                    // Not wrong, but noisy!
                    // listner.errors.filter(i => 0 === i.path.indexOf(listner.path) && "fragment" !== i.type).forEach(i => i.type = "fragment");
                    // listner.errors.push
                    // ({
                    //     type: "fragment",
                    //     path: listner.path,
                    //     requiredType: "never",
                    //     actualValue: Error.valueToString((value as ObjectType)[member]),
                    // });
                }
            }
            return result;
        };
        export const isMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: IsType<unknown> | OptionalTypeGuard<unknown>, listner?: ErrorListener): boolean =>
            isNeverTypeGuard(isType) ?
                isNeverMemberType(value, member, isType, listner):
                isOptionalTypeGuard(isType) ?
                    isOptionalMemberType(value, member, isType, listner):
                    invokeIsType(isType)((value as ObjectType)[member], listner);
        export type NeverKeys<T> = { [K in keyof T]: T[K] extends never ? K : never }[keyof T];
        export type OptionalKeys<T> =
            Exclude<{ [K in keyof T]: T extends Record<K, T[K]> ? never : K; } extends { [_ in keyof T]: infer U; } ? U : never, NeverKeys<T>>;
        export type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
        export type NonOptionalKeys<T> = Exclude<keyof T, NeverKeys<T> | OptionalKeys<T>>;
        export type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
        export type ObjectValidator<ObjectType> =
            { [key in NeverKeys<ObjectType>]: NeverTypeGuard; } &
            { [key in NonOptionalKeys<ObjectType>]: IsType<ObjectType[key]> | ObjectValidator<ObjectType[key]>; } &
            { [key in OptionalKeys<ObjectType>]: OptionalTypeGuard<Exclude<ObjectType[key], undefined>>; };
            // { [key in keyof ObjectType]: IsType<ObjectType[key]> | OptionalTypeGuard<ObjectType[key]>; };
        export type MergeType<A, B> = Omit<A, keyof B> & B;
        export type MergeMultipleType<A, B extends any[]> =
            B extends [infer Head, ...infer Tail ] ? MergeMultipleType<MergeType<A, Head>, Tail>:
            B extends [infer Last ] ? MergeType<A, Last>:
            A;
        export const mergeObjectValidator = <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) =>
            Object.assign(...[{ }, target, ...sources]) as MergeMultipleType<ObjectValidator<A>, B>;
        export const isSpecificObject = <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType> | (() => ObjectValidator<ObjectType>), additionalProperties?: boolean) =>
            (value: unknown, listner?: ErrorListener): value is ObjectType =>
            {
                if (isObject(value))
                {
                    let result = Object.entries("function" === typeof memberValidator ? memberValidator(): memberValidator).map
                    (
                        kv => isMemberType<ObjectType>
                        (
                            value,
                            kv[0] as keyof ObjectType,
                            kv[1] as IsType<unknown> | OptionalTypeGuard<unknown>,
                            Error.nextListener(kv[0], listner)
                        )
                    )
                    .every(i => i);
                    if (false === additionalProperties)
                    {
                        const regularKeys = Object.keys(memberValidator);
                        const additionalKeys = (Object.keys(value) as (keyof typeof value)[])
                            .filter(key => ! regularKeys.includes(key));
                        if (additionalKeys.some(_ => true))
                        {
                            additionalKeys.map(key => Error.raiseError(Error.nextListener(key, listner), "never", value[key]));
                            result = false;
                        }
                    }
                    if (listner)
                    {
                        if (result)
                        {
                            Error.setMatch(listner);
                        }
                        else
                        {
                            Error.calculateMatchRate(listner);
                        }
                    }
                    return result;
                }
                else
                {
                    return undefined !== listner && Error.raiseError(listner, "object", value);
                }
            };
        export const isDictionaryObject = <MemberType, Keys extends string>(isType: IsType<MemberType>, keys?: Keys[], additionalProperties?: boolean) =>
            (value: unknown, listner?: ErrorListener): value is { [key in Keys]: MemberType } =>
            {
                if (isObject(value))
                {
                    let result = undefined === keys ?
                        Object.entries(value).map(kv => isType(kv[1], Error.nextListener(kv[0], listner))).every(i => i):
                        keys.map(key => isType(value, Error.nextListener(key, listner))).every(i => i);
                    if (undefined !== keys && false === additionalProperties)
                    {
                        const additionalKeys = (Object.keys(value) as (keyof typeof value)[])
                            .filter(key => ! keys.includes(key));
                        if (additionalKeys.some(_ => true))
                        {
                            additionalKeys.map(key => Error.raiseError(Error.nextListener(key, listner), "never", value[key]));
                            result = false;
                        }
                    }
                    if (listner)
                    {
                        if (result)
                        {
                            Error.setMatch(listner);
                        }
                        else
                        {
                            Error.calculateMatchRate(listner);
                        }
                    }
                    return result;
                }
                else
                {
                    return undefined !== listner && Error.raiseError(listner, "object", value);
                }
            };
    }
}
