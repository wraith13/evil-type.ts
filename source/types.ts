export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export type JsonableValue = null | boolean | number | string;
    export const isJsonableValue = (value: unknown): value is JsonableValue =>
        null === value ||
        "boolean" === typeof value ||
        "number" === typeof value ||
        "string" === typeof value;
    export interface JsonableObject
    {
        [key: string]: Jsonable;
    }
    export const isJsonableObject = (value: unknown): value is JsonableObject =>
        null !== value &&
        "object" === typeof value &&
        Object.values(value).filter(v => ! isJsonable(v)).length <= 0;
    export type Jsonable = JsonableValue | Jsonable[] | JsonableObject;
    export const isJsonable = (value: unknown): value is Jsonable =>
        isJsonableValue(value) ||
        (Array.isArray(value) && value.filter(v => ! isJsonable(v)).length <= 0) ||
        isJsonableObject(value);
    export type JsonablePartial<Target> = { [key in keyof Target]?: Target[key] } & JsonableObject;
    export const isJust = <T>(target: T) => (value: unknown): value is T => target === value;
    export const isUndefined = isJust(undefined);
    export const isNull = isJust(null);
    export const isBoolean = (value: unknown): value is boolean => "boolean" === typeof value;
    export const isNumber = (value: unknown): value is number => "number" === typeof value;
    export const isString = (value: unknown): value is string => "string" === typeof value;
    export type ActualObject = Exclude<object, null>;
    export const isObject = (value: unknown): value is ActualObject => null !== value && "object" === typeof value;
    export const isEnum = <T>(list: readonly T[]) => (value: unknown): value is T => list.includes(value as T);
    export const isArray = <T>(isType: (value: unknown) => value is T) => (value: unknown): value is T[] =>
        Array.isArray(value) && value.filter(i => ! isType(i)).length <= 0;
    export const isOr = <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown) => value is T[K]) }) =>
        (value: unknown): value is T[number] => 0 < isTypeList.filter(i => i(value)).length;
    export interface OptionalKeyTypeGuard<T>
    {
        $type: "optional-type-guard";
        isType: (value: unknown) => value is T;
    }
    export const sss: OptionalKeyTypeGuard<number> =
    {
        $type: "optional-type-guard",
        isType: isNumber,
    }
    export const isOptionalKeyTypeGuard = (value: unknown): value is OptionalKeyTypeGuard<unknown> =>
        isSpecificObject<OptionalKeyTypeGuard<unknown>>
        ({
            $type: isJust("optional-type-guard"),
            isType: (value: unknown): value is ((v: unknown) => v is unknown) => "function" === typeof value,
        })(value);
    export const makeOptionalKeyTypeGuard = <T>(isType: (value: unknown) => value is T): OptionalKeyTypeGuard<T> =>
    ({
        $type: "optional-type-guard",
        isType,
    });
    export const isMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown) => boolean) | OptionalKeyTypeGuard<unknown>): boolean =>
        isOptionalKeyTypeGuard(isType) ?
            (! (member in value) || isType.isType((value as ObjectType)[member])):
            (member in value && isType((value as ObjectType)[member]));
    export const isMemberTypeOrUndefined = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown) => boolean)): boolean =>
        ! (member in value) || isType((value as ObjectType)[member]);
    export type OptionalKeys<T> =
        { [K in keyof T]: T extends Record<K, T[K]> ? never : K } extends { [_ in keyof T]: infer U }
        ? U : never;
    export type OptionalType<T> = Required<Pick<T, OptionalKeys<T>>>;
    export type NonOptionalKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
    export type NonOptionalType<T> = Pick<T, NonOptionalKeys<T>>;
    export type ObjectValidator<ObjectType> =
        { [key in NonOptionalKeys<ObjectType>]: ((v: unknown) => v is ObjectType[key]) } &
        { [key in OptionalKeys<ObjectType>]: OptionalKeyTypeGuard<Exclude<ObjectType[key], undefined>> };
        // { [key in keyof ObjectType]: ((v: unknown) => v is ObjectType[key]) | OptionalKeyTypeGuard<ObjectType[key]> };
    export const isSpecificObject = <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType>) => (value: unknown): value is ObjectType =>
        isObject(value) &&
        Object.entries(memberValidator).filter
        (
            kv => !
            (
                kv[0].endsWith("?") ?
                    isMemberTypeOrUndefined<ObjectType>(value, kv[0].slice(0, -1) as keyof ObjectType, kv[1] as (v: unknown) => boolean):
                    isMemberType<ObjectType>(value, kv[0] as keyof ObjectType, kv[1] as (v: unknown) => boolean)
            )
        ).length <= 0;
    export const isDictionaryObject = <MemberType>(isType: ((m: unknown) => m is MemberType)) => (value: unknown): value is { [key: string]: MemberType } =>
        isObject(value) && Object.values(value).filter(i => ! isType(i)).length <= 0;
    export const ValidatorOptionTypeMembers = [ "none", "simple", "full", ] as const;
    export type ValidatorOptionType = typeof ValidatorOptionTypeMembers[number];
    export const isValidatorOptionType = isEnum(ValidatorOptionTypeMembers);
    export const IndentStyleMembers = [ "allman", "egyptian", ] as const;
    export type IndentStyleType = typeof IndentStyleMembers[number];
    export const isIndentStyleType = isEnum(IndentStyleMembers);
    export interface TypeOptions
    {
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
    }
    export const isTypeOptions = isSpecificObject<TypeOptions>
    ({
        "indentUnit": isOr(isNumber, isJust("\t" as const)),
        "indentStyle": isIndentStyleType,
        "validatorOption": isValidatorOptionType,
    });
    // 現状ではこのコードで生成された型のエディタ上での入力保管や型検査が機能しなくなるので使い物にならない。
    // VS Coce + TypeScript の挙動がいまよりマシになったらこれベースのコードの採用を再検討
    // https://x.com/wraith13/status/1804464507755884969
    // export type GuardType<T> = T extends (value: unknown) => value is infer U ? U : never;
    // export type BuildInterface<T extends { [key: string]: (value: unknown) => value is any}> = { -readonly [key in keyof T]: GuardType<T[key]>; };
    // export const isSpecificObjectX = <T extends { [key: string]: (value: unknown) => value is any}>(memberSpecification: { [key: string]: ((v: unknown) => boolean) }) => (value: unknown): value is BuildInterface<T> =>
    //     isObject(value) &&
    //     Object.entries(memberSpecification).filter
    //     (
    //         kv => !
    //         (
    //             kv[0].endsWith("?") ?
    //                 isMemberTypeOrUndefined<BuildInterface<T>>(value, kv[0].slice(0, -1) as keyof BuildInterface<T>, kv[1]):
    //                 isMemberType<BuildInterface<T>>(value, kv[0] as keyof BuildInterface<T>, kv[1])
    //         )
    //     ).length <= 0;
    // export const TypeOptionsTypeSource =
    // {
    //     indentUnit: isOr(isNumber, isJust("\t" as const)),
    //     indentStyle: isIndentStyleType,
    //     validatorOption: isValidatorOptionType,
    // } as const;
    // export type GenericTypeOptions = BuildInterface<typeof TypeOptionsTypeSource>;
    // export const isGenericTypeOptions = isSpecificObjectX(TypeOptionsTypeSource);
    export interface TypeSchema
    {
        $ref: typeof schema;
        defines: { [key: string]: Define; };
        options: TypeOptions;
    }
    export const isTypeSchema = (value: unknown): value is TypeSchema =>
        isSpecificObject<TypeSchema>
        ({
            "$ref": isJust(schema),
            "defines": isDictionaryObject(isDefine),
            "options": isTypeOptions
        })
        (value);
    export type FilePath = string;
    export interface Refer
    {
        $ref: string;
    }
    export const isRefer = isSpecificObject<Refer>
    ({
        "$ref": isString,
    });
    export interface AlphaDefine
    {
        export?: boolean;
        $type: string;
    }
    export const getAlphaDefineSpecification = <T extends AlphaDefine>($type: T["$type"]) =>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        "$type": isJust($type),
    });
    export interface ModuleDefine extends AlphaDefine
    {
        $type: "module";
        members: { [key: string]: Define; };
    }
    export const isModuleDefine = (value: unknown): value is ModuleDefine => isSpecificObject<ModuleDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<ModuleDefine>("module"),
            {
                "members": isDictionaryObject(isDefine),
            }
        )
    )(value);
    export interface ValueDefine extends AlphaDefine
    {
        $type: "value";
        value: Jsonable;
    }
    export const isValueDefine = (value: unknown): value is ValueDefine =>isSpecificObject<ValueDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<ValueDefine>("value"),
            {
                "value": isJsonable,
            },
        )
    )(value);
    export interface TypeofDefine extends AlphaDefine
    {
        $type: "typeof";
        value: ValueDefine | Refer;
    }
    export const isTypeofDefine = (value: unknown): value is TypeofDefine =>isSpecificObject<TypeofDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<TypeofDefine>("typeof"),
            {
                "value": isOr(isValueDefine, isRefer),
            },
        )
    )(value);
    export const PrimitiveTypeMembers = ["undefined", "boolean", "number", "string"] as const;
    export type PrimitiveType = typeof PrimitiveTypeMembers[number];
    export const isPrimitiveType = isEnum(PrimitiveTypeMembers);
    export interface PrimitiveTypeDefine extends AlphaDefine
    {
        $type: "primitive-type";
        define: PrimitiveType;
    }
    export const isPrimitiveTypeDefine = (value: unknown): value is PrimitiveTypeDefine => isSpecificObject<PrimitiveTypeDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<PrimitiveTypeDefine>("primitive-type"),
            {
                "define": isPrimitiveType,
            }
        )
    )(value);
    export interface TypeDefine extends AlphaDefine
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export const isTypeDefine = (value: unknown): value is TypeDefine => isSpecificObject<TypeDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<TypeDefine>("type"),
            {
                "define": isTypeOrInterfaceOrRefer,
            }
        )
    )(value);
    export interface InterfaceDefine extends AlphaDefine
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer; };
    }
    export const isInterfaceDefine = (value: unknown): value is InterfaceDefine => isSpecificObject<InterfaceDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<InterfaceDefine>("interface"),
            {
                "members": isDictionaryObject(isTypeOrInterfaceOrRefer),
            }
        )
    )(value);
    export interface DictionaryDefine extends AlphaDefine
    {
        $type: "dictionary";
        members: TypeOrInterfaceOrRefer;
    }
    export const isDictionaryDefine = (value: unknown): value is DictionaryDefine => isSpecificObject<DictionaryDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<DictionaryDefine>("dictionary"),
            {
                "members": isTypeOrInterfaceOrRefer,
            }
        )
    )(value);
    export interface ArrayDefine extends AlphaDefine
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export const isArrayDefine = (value: unknown): value is ArrayDefine => isSpecificObject<ArrayDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<ArrayDefine>("array"),
            {
                "items": isTypeOrInterfaceOrRefer,
            }
        )
    )(value);
    export interface OrDefine extends AlphaDefine
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isOrDefine = (value: unknown): value is OrDefine => isSpecificObject<OrDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<OrDefine>("or"),
            {
                "types": isArray(isTypeOrInterfaceOrRefer),
            }
        )
    )(value);
    export interface AndDefine extends AlphaDefine
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isAndDefine = (value: unknown): value is AndDefine => isSpecificObject<AndDefine>
    (
        Object.assign
        (
            getAlphaDefineSpecification<AndDefine>("and"),
            {
                "types": isArray(isTypeOrInterfaceOrRefer),
            }
        )
    )(value);
    export type TypeOrInterface = PrimitiveTypeDefine | TypeDefine | TypeofDefine | InterfaceDefine | ArrayDefine | OrDefine | AndDefine;
    export type ValueOrTypeOfInterface = ValueDefine | TypeOrInterface;
    export type ValueOrTypeOfInterfaceOrRefer = ValueOrTypeOfInterface | Refer;
    export const isTypeOrInterface = isOr(isPrimitiveTypeDefine, isTypeDefine, isInterfaceDefine, isArrayDefine, isOrDefine, isAndDefine);
    export type TypeOrInterfaceOrRefer = TypeOrInterface | Refer;
    export const isTypeOrInterfaceOrRefer = isOr(isTypeOrInterface, isRefer);
    export type Define = ModuleDefine | ValueDefine | TypeOrInterface;
    export const isDefine = isOr(isModuleDefine, isValueDefine, isTypeOrInterface);
    export type DefineOrRefer = Define | Refer;
    export const isDefineOrRefer = (value: unknown): value is DefineOrRefer =>
        isDefine(value) || isRefer(value);
}
