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
        defines: { [key: string]: Definition; };
        options: TypeOptions;
    }
    export const isTypeSchema = (value: unknown): value is TypeSchema =>
        isSpecificObject<TypeSchema>
        ({
            "$ref": isJust(schema),
            "defines": isDictionaryObject(isDefinition),
            "options": isTypeOptions
        })
        (value);
    export type FilePath = string;
    export interface ReferElement
    {
        $ref: string;
    }
    export const isReferElement = isSpecificObject<ReferElement>
    ({
        "$ref": isString,
    });
    export interface AlphaElement
    {
        $type: string;
    }
    export interface AlphaDefinition extends AlphaElement
    {
        export?: boolean;
    }
    export interface ModuleDefinition extends AlphaDefinition
    {
        $type: "module";
        members: { [key: string]: Definition; };
    }
    export const isModuleDefinition = (value: unknown): value is ModuleDefinition => isSpecificObject<ModuleDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("module"),
        members: isDictionaryObject(isDefinition),
    })
    (value);
    export interface LiteralElement extends AlphaElement
    {
        $type: "literal";
        literal: Jsonable;
    }
    export const isLiteralElement = (value: unknown): value is LiteralElement => isSpecificObject<LiteralElement>
    ({
        $type: isJust("literal"),
        literal: isJsonable,
    })
    (value);
    export interface ValueDefinition extends AlphaDefinition
    {
        $type: "value";
        value: LiteralElement | ReferElement;
    }
    export const isValueDefinition = (value: unknown): value is ValueDefinition => isSpecificObject<ValueDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("value"),
        value: isOr(isLiteralElement, isReferElement),
    })
    (value);
    export interface TypeofElement extends AlphaElement
    {
        $type: "typeof";
        value: ReferElement;
    }
    export const isTypeofElement = (value: unknown): value is TypeofElement => isSpecificObject<TypeofElement>
    ({
        $type: isJust("typeof"),
        value: isReferElement,
    })(value);
    export const PrimitiveTypeEnumMembers = ["undefined", "boolean", "number", "string"] as const;
    export type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    export const isPrimitiveTypeEnum = isEnum(PrimitiveTypeEnumMembers);
    export interface PrimitiveTypeElement extends AlphaElement
    {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    export const isPrimitiveTypeElement = (value: unknown): value is PrimitiveTypeElement => isSpecificObject<PrimitiveTypeElement>
    ({
        $type: isJust("primitive-type"),
        type: isPrimitiveTypeEnum,
    })
    (value);
    export interface TypeDefinition extends AlphaDefinition
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export const isTypeDefinition = (value: unknown): value is TypeDefinition => isSpecificObject<TypeDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("type"),
        define: isTypeOrRefer,
    })
    (value);
    export interface InterfaceDefinition extends AlphaDefinition
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer; };
    }
    export const isInterfaceDefinition = (value: unknown): value is InterfaceDefinition => isSpecificObject<InterfaceDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("interface"),
        members: isDictionaryObject(isTypeOrRefer),
    })
    (value);
    export interface DictionaryElement extends AlphaElement
    {
        $type: "dictionary";
        members: TypeOrInterfaceOrRefer;
    }
    export const isDictionaryElement = (value: unknown): value is DictionaryElement => isSpecificObject<DictionaryElement>
    ({
        $type: isJust("dictionary"),
        members: isTypeOrRefer,
    })
    (value);
    export interface ArrayElement extends AlphaElement
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export const isArrayElement = (value: unknown): value is ArrayElement => isSpecificObject<ArrayElement>
    ({
        $type: isJust("array"),
        items: isTypeOrRefer,
    })
    (value);
    export interface OrElement extends AlphaElement
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isOrElement = (value: unknown): value is OrElement => isSpecificObject<OrElement>
    ({
        $type: isJust("or"),
        types: isArray(isTypeOrRefer),
    })
    (value);
    export interface AndElement extends AlphaElement
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isAndElement = (value: unknown): value is AndElement => isSpecificObject<AndElement>
    ({
        $type: isJust("and"),
        types: isArray(isTypeOrRefer),
    })
    (value);
    export type Type = PrimitiveTypeElement | TypeDefinition | TypeofElement | InterfaceDefinition | ArrayElement | OrElement | AndElement;
    export const isType = isOr(isPrimitiveTypeElement, isTypeDefinition, isTypeofElement, isInterfaceDefinition, isArrayElement, isOrElement, isAndElement);
    export type TypeOrValue = Type | ValueDefinition | LiteralElement;
    export const isTypeOrValue = isOr(isType, isValueDefinition, isLiteralElement);
    export type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    export type TypeOrInterfaceOrRefer = Type | ReferElement;
    export const isTypeOrRefer = isOr(isType, isReferElement);
    export type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    export const isDefinition = isOr(isModuleDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition);
    export type DefineOrRefer = Definition | ReferElement;
    export const isDefineOrRefer = (value: unknown): value is DefineOrRefer =>
        isDefinition(value) || isReferElement(value);
}
