// Original: https://github.com/wraith13/evil-type.ts/blob/master/common/evil-type.ts
export namespace EvilType
{
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
        export const andErros = (listner: Listener, modulus: number, errors: Item[], fullErrors: Item[]) =>
        {
            // このコードは現状、 orErros をコピーしただけのモックです。
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
        // TypeScript さんが残念で Type Guard 関数の戻り型がすぐにただの boolean 扱いになってしまい、いちいち value is T を明示する羽目になって、記述をコンパクトにする為に isTypeLazy を使おうとしても全然コンパクトにできないので、これは使用を断念。
        // export const isTypeLazy= <T>(invoker: () => IsType<T>) =>
        //     (value: unknown, listner?: ErrorListener): value is T => invoker()(value, listner);
        // export const lazy = <T extends (...args: any[]) => any>(invoker: () => T): T =>
        //     ((...args: any[]): any => invoker()(...args)) as T;
        export const isJust = <T>(target: T) => (value: unknown, listner?: ErrorListener): value is T =>
            Error.withErrorHandling(target === value, listner, () => Error.valueToString(target), value);
        export const isUndefined = isJust(undefined);
        export const isNull = isJust(null);
        export const isBoolean = (value: unknown, listner?: ErrorListener): value is boolean =>
            Error.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
        export const isNumber = (value: unknown, listner?: ErrorListener): value is number =>
            Error.withErrorHandling("number" === typeof value, listner, "number", value);
        export const isString = (value: unknown, listner?: ErrorListener): value is string =>
            Error.withErrorHandling("string" === typeof value, listner, "string", value);
        export type ActualObject = Exclude<object, null>;
        export const isObject = (value: unknown): value is ActualObject =>
            null !== value && "object" === typeof value && ! Array.isArray(value);
        export const isEnum = <T>(list: readonly T[]) =>
            (value: unknown, listner?: ErrorListener): value is T =>
                Error.withErrorHandling(list.includes(value as T), listner, () => list.map(i => Error.valueToString(i)).join(" | "), value);
        export const isArray = <T>(isType: (value: unknown, listner?: ErrorListener) => value is T) =>
            (value: unknown, listner?: ErrorListener): value is T[] =>
            {
                if (Array.isArray(value))
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
                    return undefined !== listner && Error.raiseError(listner, "array", value);
                }
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
            .sort
            (
                (a, b) =>
                {
                    if (a.matchRate < b.matchRate)
                    {
                        return 1;
                    }
                    else
                    if (b.matchRate < a.matchRate)
                    {
                        return -1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            )
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
                        //Object.entries(success.transactionListner.matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
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
                                //Error.setMatchRate(listner, Error.getMatchRate(bestMatchErrors[0]));
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
                    // このコードは現状、 isOr をコピーしただけのモックです。
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
                            //Object.entries(success.transactionListner.matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                        }
                        else
                        {
                            const requiredType = makeOrTypeNameFromIsTypeList(...isTypeList);
                            if ((isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array")))
                            {
                                const transactionListners = resultList.map(i => i.transactionListner);
                                const errors = transactionListners.map(i => i.errors).reduce((a, b) => [...a, ...b], []);
                                const fullErrors = resultList.map(i => i.transactionListner).map(i => i.errors).reduce((a, b) => [...a, ...b], []);
                                Error.andErros(listner, isTypeList.length, errors, fullErrors);
                                if (errors.length <= 0)
                                {
                                    console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " +JSON.stringify(resultList));
                                }
                                if (0 < transactionListners.length)
                                {
                                    Object.entries(transactionListners[0].matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                                    //Error.setMatchRate(listner, Error.getMatchRate(bestMatchErrors[0]));
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
        export interface OptionalKeyTypeGuard<T>
        {
            $type: "optional-type-guard";
            isType: IsType<T> | ObjectValidator<T>;
        }
        export const isOptionalKeyTypeGuard = (value: unknown, listner?: ErrorListener): value is OptionalKeyTypeGuard<unknown> =>
            isSpecificObject<OptionalKeyTypeGuard<unknown>>
            ({
                $type: isJust("optional-type-guard"),
                isType: (value: unknown, listner?: ErrorListener): value is ((v: unknown, listner?: ErrorListener) => v is unknown) =>
                    "function" === typeof value || (undefined !== listner && Error.raiseError(listner, "function", value)),
            })(value, listner);
        export const makeOptionalKeyTypeGuard = <T>(isType: (value: unknown, listner?: ErrorListener) => value is T): OptionalKeyTypeGuard<T> =>
        ({
            $type: "optional-type-guard",
            isType,
        });
        export const invokeIsType = <T>(isType: IsType<T> | ObjectValidator<T>) =>
            "function" === typeof isType ? isType: isSpecificObject(isType);
        export const isOptional = makeOptionalKeyTypeGuard;
        export const isOptionalMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalKeyTypeGuard<unknown>, listner?: ErrorListener): boolean =>
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
                    listner.errors.filter(i => 0 === i.path.indexOf(listner.path) && "fragment" !== i.type).forEach(i => i.type = "fragment");
                    listner.errors.push
                    ({
                        type: "fragment",
                        path: listner.path,
                        requiredType: "never",
                        actualValue: Error.valueToString((value as ObjectType)[member]),
                    });
                }
            }
            return result;
        };
        export const isMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: IsType<unknown> | OptionalKeyTypeGuard<unknown>, listner?: ErrorListener): boolean =>
            isOptionalKeyTypeGuard(isType) ?
                isOptionalMemberType(value, member, isType, listner):
                invokeIsType(isType)((value as ObjectType)[member], listner);
        export type OptionalKeys<T> =
            { [K in keyof T]: T extends Record<K, T[K]> ? never : K } extends { [_ in keyof T]: infer U }
            ? U : never;
        export type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
        export type NonOptionalKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
        export type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
        export type ObjectValidator<ObjectType> =
            { [key in NonOptionalKeys<ObjectType>]: ((v: unknown) => v is ObjectType[key]) | ObjectValidator<ObjectType[key]> } &
            { [key in OptionalKeys<ObjectType>]: OptionalKeyTypeGuard<Exclude<ObjectType[key], undefined>> };
            // { [key in keyof ObjectType]: ((v: unknown) => v is ObjectType[key]) | OptionalKeyTypeGuard<ObjectType[key]> };
        export type MergeType<A, B> = Omit<A, keyof B> & B;
        export type MergeMultipleType<A, B extends any[]> =
            B extends [infer Head, ...infer Tail ] ? MergeMultipleType<MergeType<A, Head>, Tail>:
            B extends [infer Last ] ? MergeType<A, Last>:
            A;
        export const mergeObjectValidator = <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) =>
            Object.assign(...[{ }, target, ...sources]) as MergeMultipleType<ObjectValidator<A>, B>;
        // export const mergeObjectValidator = <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) =>
        //     Object.assign(...[{ }, target, ...sources]) as ObjectValidator<unknown>;
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
                            kv[1] as IsType<unknown> | OptionalKeyTypeGuard<unknown>,
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
        export const isDictionaryObject = <MemberType>(isType: IsType<MemberType>) =>
            (value: unknown, listner?: ErrorListener): value is { [key: string]: MemberType } =>
            {
                if (isObject(value))
                {
                    const result = Object.entries(value).map(kv => isType(kv[1], Error.nextListener(kv[0], listner))).every(i => i);
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
        // 現状ではこのコードで生成された型のエディタ上での入力保管や型検査が機能しなくなるので使い物にならない。
        // VS Coce + TypeScript の挙動がいまよりマシになったらこれベースのコードの採用を再検討
        // https://x.com/wraith13/status/1804464507755884969
        // export type GuardType<T> = T extends (value: unknown) => value is infer U ? U : never;
        // export type BuildInterface<T extends { [key: string]: (value: unknown) => value is any}> = { -readonly [key in keyof T]: GuardType<T[key]>; };
        // export const isSpecificObjectX = <T extends { [key: string]: (value: unknown) => value is any}>(memberSpecification: { [key: string]: ((v: unknown) => boolean) }) => (value: unknown): value is BuildInterface<T> =>
        //     isObject(value) &&
        //     Object.entries(memberSpecification).every
        //     (
        //         kv => kv[0].endsWith("?") ?
        //                 isMemberTypeOrUndefined<BuildInterface<T>>(value, kv[0].slice(0, -1) as keyof BuildInterface<T>, kv[1]):
        //                 isMemberType<BuildInterface<T>>(value, kv[0] as keyof BuildInterface<T>, kv[1])
        //     );
        // export const TypeOptionsTypeSource =
        // {
        //     indentUnit: isOr(isNumber, isJust("tab" as const)),
        //     indentStyle: isIndentStyleType,
        //     validatorOption: isValidatorOptionType,
        // } as const;
        // export type GenericTypeOptions = BuildInterface<typeof TypeOptionsTypeSource>;
        // export const isGenericTypeOptions = isSpecificObjectX(TypeOptionsTypeSource);
    }
}
