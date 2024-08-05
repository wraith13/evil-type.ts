import { Jsonable } from "./jsonable";
import { TypeError } from "./typeerror"
export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export const isJust = <T>(target: T) => (value: unknown, listner?: TypeError.Listener): value is T =>
        target === value || (undefined !== listner && TypeError.raiseError(listner, TypeError.valueToString(target), value));
    export const isUndefined = isJust(undefined);
    export const isNull = isJust(null);
    export const isBoolean = (value: unknown, listner?: TypeError.Listener): value is boolean =>
        "boolean" === typeof value || (undefined !== listner && TypeError.raiseError(listner, "boolean", value));
    export const isNumber = (value: unknown, listner?: TypeError.Listener): value is number =>
        "number" === typeof value || (undefined !== listner && TypeError.raiseError(listner, "number", value));
    export const isString = (value: unknown, listner?: TypeError.Listener): value is string =>
        "string" === typeof value || (undefined !== listner && TypeError.raiseError(listner, "string", value));
    export type ActualObject = Exclude<object, null>;
    export const isObject = (value: unknown, listner?: TypeError.Listener): value is ActualObject =>
        (null !== value && "object" === typeof value) || (undefined !== listner && TypeError.raiseError(listner, "object", value));
    export const isEnum = <T>(list: readonly T[]) => (value: unknown, listner?: TypeError.Listener): value is T =>
        list.includes(value as T) || (undefined !== listner && TypeError.raiseError(listner, list.map(i => TypeError.valueToString(i)).join(" | "), value));
    export const isArray = <T>(isType: (value: unknown, listner?: TypeError.Listener) => value is T) => (value: unknown, listner?: TypeError.Listener): value is T[] =>
        Array.isArray(value) && value.every(i => isType(i, listner));
    export const makeOrTypeNameFromIsTypeList = <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypeError.Listener) => value is T[K]) }) =>
    {
        const transactionListner = TypeError.makeListener();
        isTypeList.some(i => i(undefined, transactionListner));
        return transactionListner.errors.map(i => i.requiredType).join(" | ");
    };
    export const isOr = <T extends any[]>(...isTypeList: { [K in keyof T]: ((value: unknown, listner?: TypeError.Listener) => value is T[K]) }) =>
        (value: unknown, listner?: TypeError.Listener): value is T[number] =>
        {
            if (listner)
            {
                const transactionListner = TypeError.makeListener(listner.path);
                const result = isTypeList.some(i => i(value, transactionListner));
                if ( ! result)
                {
                    TypeError.raiseError(listner, makeOrTypeNameFromIsTypeList(...isTypeList), value);
                }
                return result;
            }
            else
            {
                return isTypeList.some(i => i(value));
            }
        }
    export interface OptionalKeyTypeGuard<T>
    {
        $type: "optional-type-guard";
        isType: (value: unknown, listner?: TypeError.Listener) => value is T;
    }
    export const sss: OptionalKeyTypeGuard<number> =
    {
        $type: "optional-type-guard",
        isType: isNumber,
    }
    export const isOptionalKeyTypeGuard = (value: unknown, listner?: TypeError.Listener): value is OptionalKeyTypeGuard<unknown> =>
        isSpecificObject<OptionalKeyTypeGuard<unknown>>
        ({
            $type: isJust("optional-type-guard"),
            isType: (value: unknown, listner?: TypeError.Listener): value is ((v: unknown, listner?: TypeError.Listener) => v is unknown) =>
                "function" === typeof value && (undefined !== listner && TypeError.raiseError(listner, "function", value)),
        })(value, listner);
    export const makeOptionalKeyTypeGuard = <T>(isType: (value: unknown, listner?: TypeError.Listener) => value is T): OptionalKeyTypeGuard<T> =>
    ({
        $type: "optional-type-guard",
        isType,
    });
    export const isMemberType = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown, listner?: TypeError.Listener) => boolean) | OptionalKeyTypeGuard<unknown>, listner?: TypeError.Listener): boolean =>
        isOptionalKeyTypeGuard(isType) ?
            (! (member in value) || isType.isType((value as ObjectType)[member], listner)):
            (member in value && isType((value as ObjectType)[member], listner));
    export const isMemberTypeOrUndefined = <ObjectType extends ActualObject>(value: ActualObject, member: keyof ObjectType, isType: ((v: unknown, listner?: TypeError.Listener) => boolean), listner?: TypeError.Listener): boolean =>
        ! (member in value) || isType((value as ObjectType)[member], listner);
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
    export const isSpecificObject = <ObjectType extends ActualObject>(memberValidator: ObjectValidator<ObjectType>) => (value: unknown, listner?: TypeError.Listener): value is ObjectType =>
        isObject(value, listner) &&
        Object.entries(memberValidator).every
        (
            kv => kv[0].endsWith("?") ?
                isMemberTypeOrUndefined<ObjectType>(value, kv[0].slice(0, -1) as keyof ObjectType, kv[1] as (v: unknown, listner?: TypeError.Listener) => boolean, TypeError.nextListener(kv[0], listner)):
                isMemberType<ObjectType>(value, kv[0] as keyof ObjectType, kv[1] as (v: unknown, listner?: TypeError.Listener) => boolean, TypeError.nextListener(kv[0], listner))
        );
    export const isDictionaryObject = <MemberType>(isType: ((m: unknown, listner?: TypeError.Listener) => m is MemberType)) => (value: unknown, listner?: TypeError.Listener): value is { [key: string]: MemberType } =>
        isObject(value, listner) &&
        Object.entries(value).every(kv => isType(kv[1], TypeError.nextListener(kv[0], listner)));
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
    export interface TypeSchema
    {
        $ref: typeof schema;
        defines: { [key: string]: Definition; };
        options: TypeOptions;
    }
    export const isTypeSchema = (value: unknown, listner?: TypeError.Listener): value is TypeSchema =>
        isSpecificObject<TypeSchema>
        ({
            "$ref": isJust(schema),
            "defines": isDictionaryObject(isDefinition),
            "options": isTypeOptions
        })
        (value, listner);
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
    export const isModuleDefinition = (value: unknown, listner?: TypeError.Listener): value is ModuleDefinition => isSpecificObject<ModuleDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("module"),
        members: isDictionaryObject(isDefinition),
    })
    (value, listner);
    export const PrimitiveTypeEnumMembers = ["undefined", "boolean", "number", "string"] as const;
    export type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    export const isPrimitiveTypeEnum = isEnum(PrimitiveTypeEnumMembers);
    export interface PrimitiveTypeElement extends AlphaElement
    {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    export const isPrimitiveTypeElement = (value: unknown, listner?: TypeError.Listener): value is PrimitiveTypeElement => isSpecificObject<PrimitiveTypeElement>
    ({
        $type: isJust("primitive-type"),
        type: isPrimitiveTypeEnum,
    })
    (value, listner);
    export interface LiteralElement extends AlphaElement
    {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    export const isLiteralElement = (value: unknown, listner?: TypeError.Listener): value is LiteralElement => isSpecificObject<LiteralElement>
    ({
        $type: isJust("literal"),
        literal: Jsonable.isJsonable,
    })
    (value, listner);
    export interface ValueDefinition extends AlphaDefinition
    {
        $type: "value";
        value: LiteralElement | ReferElement;
    }
    export const isValueDefinition = (value: unknown, listner?: TypeError.Listener): value is ValueDefinition => isSpecificObject<ValueDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("value"),
        value: isOr(isLiteralElement, isReferElement),
    })
    (value, listner);
    export interface TypeofElement extends AlphaElement
    {
        $type: "typeof";
        value: ReferElement;
    }
    export const isTypeofElement = (value: unknown, listner?: TypeError.Listener): value is TypeofElement => isSpecificObject<TypeofElement>
    ({
        $type: isJust("typeof"),
        value: isReferElement,
    })(value, listner);
    export interface ItemofElement extends AlphaElement
    {
        $type: "itemof";
        value: ReferElement;
    }
    export const isItemofElement = (value: unknown, listner?: TypeError.Listener): value is ItemofElement => isSpecificObject<ItemofElement>
    ({
        $type: isJust("itemof"),
        value: isReferElement,
    })(value, listner);
    export interface TypeDefinition extends AlphaDefinition
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export const isTypeDefinition = (value: unknown, listner?: TypeError.Listener): value is TypeDefinition => isSpecificObject<TypeDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("type"),
        define: isTypeOrRefer,
    })
    (value, listner);
    export interface EnumTypeElement extends AlphaElement
    {
        $type: "enum-type";
        members: (number | string)[];
    }
    export const isEnumTypeElement = (value: unknown, listner?: TypeError.Listener): value is EnumTypeElement => isSpecificObject<EnumTypeElement>
    ({
        $type: isJust("enum-type"),
        members: isArray(isOr(isNumber, isString)),
    })
    (value, listner);
    export interface InterfaceDefinition extends AlphaDefinition
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer; };
    }
    export const isInterfaceDefinition = (value: unknown, listner?: TypeError.Listener): value is InterfaceDefinition => isSpecificObject<InterfaceDefinition>
    ({
        export: makeOptionalKeyTypeGuard(isBoolean),
        $type: isJust("interface"),
        members: isDictionaryObject(isTypeOrRefer),
    })
    (value, listner);
    export interface DictionaryElement extends AlphaElement
    {
        $type: "dictionary";
        members: TypeOrInterfaceOrRefer;
    }
    export const isDictionaryElement = (value: unknown, listner?: TypeError.Listener): value is DictionaryElement => isSpecificObject<DictionaryElement>
    ({
        $type: isJust("dictionary"),
        members: isTypeOrRefer,
    })
    (value, listner);
    export interface ArrayElement extends AlphaElement
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export const isArrayElement = (value: unknown, listner?: TypeError.Listener): value is ArrayElement => isSpecificObject<ArrayElement>
    ({
        $type: isJust("array"),
        items: isTypeOrRefer,
    })
    (value, listner);
    export interface OrElement extends AlphaElement
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isOrElement = (value: unknown, listner?: TypeError.Listener): value is OrElement => isSpecificObject<OrElement>
    ({
        $type: isJust("or"),
        types: isArray(isTypeOrRefer),
    })
    (value, listner);
    export interface AndElement extends AlphaElement
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isAndElement = (value: unknown, listner?: TypeError.Listener): value is AndElement => isSpecificObject<AndElement>
    ({
        $type: isJust("and"),
        types: isArray(isTypeOrRefer),
    })
    (value, listner);
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    export const isType = isOr(isPrimitiveTypeElement, isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition, isArrayElement, isOrElement, isAndElement, isLiteralElement);
    export type TypeOrValue = Type | ValueDefinition;
    export const isTypeOrValue = isOr(isType, isValueDefinition);
    export type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    export type TypeOrInterfaceOrRefer = Type | ReferElement;
    export const isTypeOrRefer = isOr(isType, isReferElement);
    export type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    export const isDefinition = isOr(isModuleDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition);
    export type DefineOrRefer = Definition | ReferElement;
    export const isDefineOrRefer = isOr(isDefinition, isReferElement);
}
