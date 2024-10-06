import { Jsonable } from "./jsonable";
import { TypesError } from "./types-error";
export namespace TypesPrime
{
    export const isJust = <T>(target: T) => (value: unknown, listner?: TypesError.Listener): value is T =>
        TypesError.withErrorHandling(target === value, listner, () => TypesError.valueToString(target), value);
    export const isUndefined = isJust(undefined);
    export const isNull = isJust(null);
    export const isBoolean = (value: unknown, listner?: TypesError.Listener): value is boolean =>
        TypesError.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
    export const isNumber = (value: unknown, listner?: TypesError.Listener): value is number =>
        TypesError.withErrorHandling("number" === typeof value, listner, "number", value);
    export const isString = (value: unknown, listner?: TypesError.Listener): value is string =>
        TypesError.withErrorHandling("string" === typeof value, listner, "string", value);
    export type ActualObject = Exclude<object, null>;
    export const isObject = (value: unknown): value is ActualObject =>
        null !== value && "object" === typeof value && ! Array.isArray(value);
    export const isEnum = <T>(list: readonly T[]) => (value: unknown, listner?: TypesError.Listener): value is T =>
        TypesError.withErrorHandling(list.includes(value as T), listner, () => list.map(i => TypesError.valueToString(i)).join(" | "), value);
    export const isArray = <T>(isType: (value: unknown, listner?: TypesError.Listener) => value is T) => (value: unknown, listner?: TypesError.Listener): value is T[] =>
    {
        if (Array.isArray(value))
        {
            const result = value.map(i => isType(i, listner)).every(i => i);
            if (listner)
            {
                if (result)
                {
                    TypesError.setMatch(listner);
                }
                else
                {
                    TypesError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else
        {
            return undefined !== listner && TypesError.raiseError(listner, "array", value);
        }
    };
    export const isJsonable = (value: unknown, listner?: TypesError.Listener): value is Jsonable.Jsonable =>
        TypesError.withErrorHandling(Jsonable.isJsonable(value), listner, "jsonable", value);
    export const makeOrTypeNameFromIsTypeList = <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypesError.Listener) => value is T[K]) }) =>
        isTypeList.map(i => TypesError.getType(i))
            .reduce((a, b) => [...a, ...b], [])
            .filter((i, ix, list) => ix === list.indexOf(i));
    export const getBestMatchErrors = (listeners: TypesError.Listener[]) =>
        listeners.map
        (
            listener =>
            ({
                listener,
                matchRate: TypesError.getMatchRate(listener),
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
    export const isOr = <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypesError.Listener) => value is T[K]) }) =>
        (value: unknown, listner?: TypesError.Listener): value is T[number] =>
        {
            if (listner)
            {
                const resultList = isTypeList.map
                (
                    i =>
                    {
                        const transactionListner = TypesError.makeListener(listner.path);
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
                    TypesError.setMatch(listner);
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
                        TypesError.orErros(listner, isTypeList.length, errors, fullErrors);
                        if (errors.length <= 0)
                        {
                            console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " +JSON.stringify(resultList));
                        }
                        if (0 < bestMatchErrors.length)
                        {
                            Object.entries(bestMatchErrors[0].matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                            //TypeError.setMatchRate(listner, TypeError.getMatchRate(bestMatchErrors[0]));
                        }
                    }
                    else
                    {
                        TypesError.raiseError
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
        export const isAnd = <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypesError.Listener) => value is T[K]) }) =>
            (value: unknown, listner?: TypesError.Listener): value is OrTypeToAndType<T[number]> =>
            {
                // このコードは現状、 isOr をコピーしただけのモックです。
                if (listner)
                {
                    const resultList = isTypeList.map
                    (
                        i =>
                        {
                            const transactionListner = TypesError.makeListener(listner.path);
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
                        TypesError.setMatch(listner);
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
                            TypesError.andErros(listner, isTypeList.length, errors, fullErrors);
                            if (errors.length <= 0)
                            {
                                console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " +JSON.stringify(resultList));
                            }
                            if (0 < transactionListners.length)
                            {
                                Object.entries(transactionListners[0].matchRate).forEach(kv => listner.matchRate[kv[0]] = kv[1]);
                                //TypeError.setMatchRate(listner, TypeError.getMatchRate(bestMatchErrors[0]));
                            }
                        }
                        else
                        {
                            TypesError.raiseError
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
        isType: ((value: unknown, listner?: TypesError.Listener) => value is T) | ObjectValidator<T>;
    }
    export const isOptionalKeyTypeGuard = (value: unknown, listner?: TypesError.Listener): value is OptionalKeyTypeGuard<unknown> =>
        isSpecificObject<OptionalKeyTypeGuard<unknown>>
        ({
            $type: isJust("optional-type-guard"),
            isType: (value: unknown, listner?: TypesError.Listener): value is ((v: unknown, listner?: TypesError.Listener) => v is unknown) =>
                "function" === typeof value || (undefined !== listner && TypesError.raiseError(listner, "function", value)),
        })(value, listner);
    export const makeOptionalKeyTypeGuard = <T>(isType: (value: unknown, listner?: TypesError.Listener) => value is T): OptionalKeyTypeGuard<T> =>
    ({
        $type: "optional-type-guard",
        isType,
    });
    export const invokeIsType = <T>(isType: ((value: unknown, listner?: TypesError.Listener) => value is T) | ObjectValidator<T>) =>
        "function" === typeof isType ? isType: isSpecificObject(isType);
    export const isOptional = makeOptionalKeyTypeGuard;
    export const isOptionalMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, optionalTypeGuard: OptionalKeyTypeGuard<unknown>, listner?: TypesError.Listener): boolean =>
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
                    actualValue: TypesError.valueToString((value as ObjectType)[member]),
                });
            }
        }
        return result;
    };
    export const isMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown, listner?: TypesError.Listener) => boolean) | OptionalKeyTypeGuard<unknown>, listner?: TypesError.Listener): boolean =>
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
        B extends [infer Head, ...infer Tail] ?
            MergeType<MergeType<A, Head>, Tail>:
            A;
    export const mergeObjectValidator = <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) =>
        Object.assign(...[{ }, target, ...sources]) as MergeMultipleType<ObjectValidator<A>, B>;
    // export const mergeObjectValidator = <A, B extends ObjectValidator<unknown>[]>(target: ObjectValidator<A>, ...sources: B) =>
    //     Object.assign(...[{ }, target, ...sources]) as ObjectValidator<unknown>;
    export const isSpecificObject = <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType> | (() => ObjectValidator<ObjectType>)) => (value: unknown, listner?: TypesError.Listener): value is ObjectType =>
    {
        if (isObject(value))
        {
            const result = Object.entries("function" === typeof memberValidator ? memberValidator(): memberValidator).map
            (
                kv => isMemberType<ObjectType>
                (
                    value,
                    kv[0] as keyof ObjectType,
                    kv[1] as ((v: unknown, listner?: TypesError.Listener) => boolean) | OptionalKeyTypeGuard<unknown>,
                    TypesError.nextListener(kv[0], listner)
                )
            )
            .every(i => i);
            if (listner)
            {
                if (result)
                {
                    TypesError.setMatch(listner);
                }
                else
                {
                    TypesError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else
        {
            return undefined !== listner && TypesError.raiseError(listner, "object", value);
        }
    };
    export const isDictionaryObject = <MemberType>(isType: ((m: unknown, listner?: TypesError.Listener) => m is MemberType)) => (value: unknown, listner?: TypesError.Listener): value is { [key: string]: MemberType } =>
    {
        if (isObject(value))
        {
            const result = Object.entries(value).map(kv => isType(kv[1], TypesError.nextListener(kv[0], listner))).every(i => i);
            if (listner)
            {
                if (result)
                {
                    TypesError.setMatch(listner);
                }
                else
                {
                    TypesError.calculateMatchRate(listner);
                }
            }
            return result;
        }
        else
        {
            return undefined !== listner && TypesError.raiseError(listner, "object", value);
        }
    }
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
    //     indentUnit: isOr(isNumber, isJust("\t" as const)),
    //     indentStyle: isIndentStyleType,
    //     validatorOption: isValidatorOptionType,
    // } as const;
    // export type GenericTypeOptions = BuildInterface<typeof TypeOptionsTypeSource>;
    // export const isGenericTypeOptions = isSpecificObjectX(TypeOptionsTypeSource);
}
