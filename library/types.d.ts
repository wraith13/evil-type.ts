import { Jsonable } from "./jsonable";
import { TypeError } from "./typeerror";
export declare namespace Types {
    const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    const isJust: <T>(target: T) => (value: unknown, listner?: TypeError.Listener) => value is T;
    const isUndefined: (value: unknown, listner?: TypeError.Listener) => value is undefined;
    const isNull: (value: unknown, listner?: TypeError.Listener) => value is null;
    const isBoolean: (value: unknown, listner?: TypeError.Listener) => value is boolean;
    const isNumber: (value: unknown, listner?: TypeError.Listener) => value is number;
    const isString: (value: unknown, listner?: TypeError.Listener) => value is string;
    type ActualObject = Exclude<object, null>;
    const isObject: (value: unknown, listner?: TypeError.Listener) => value is object;
    const isEnum: <T>(list: readonly T[]) => (value: unknown, listner?: TypeError.Listener) => value is T;
    const isArray: <T>(isType: (value: unknown, listner?: TypeError.Listener) => value is T) => (value: unknown, listner?: TypeError.Listener) => value is T[];
    const makeOrTypeNameFromIsTypeList: <T extends any[]>(...isTypeList: { [K in keyof T]: (value: unknown, listner?: TypeError.Listener) => value is T[K]; }) => string[];
    const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: (value: unknown, listner?: TypeError.Listener) => value is T[K]; }) => (value: unknown, listner?: TypeError.Listener) => value is T[number];
    interface OptionalKeyTypeGuard<T> {
        $type: "optional-type-guard";
        isType: (value: unknown, listner?: TypeError.Listener) => value is T;
    }
    const isOptionalKeyTypeGuard: (value: unknown, listner?: TypeError.Listener) => value is OptionalKeyTypeGuard<unknown>;
    const makeOptionalKeyTypeGuard: <T>(isType: (value: unknown, listner?: TypeError.Listener) => value is T) => OptionalKeyTypeGuard<T>;
    const isMemberType: <ObjectType extends object>(value: ActualObject, member: keyof ObjectType, isType: OptionalKeyTypeGuard<unknown> | ((v: unknown, listner?: TypeError.Listener) => boolean), listner?: TypeError.Listener) => boolean;
    const isMemberTypeOrUndefined: <ObjectType extends object>(value: ActualObject, member: keyof ObjectType, isType: (v: unknown, listner?: TypeError.Listener) => boolean, listner?: TypeError.Listener) => boolean;
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
    const ValidatorOptionTypeMembers: readonly ["none", "simple", "full"];
    type ValidatorOptionType = typeof ValidatorOptionTypeMembers[number];
    const isValidatorOptionType: (value: unknown, listner?: TypeError.Listener) => value is "none" | "simple" | "full";
    const IndentStyleMembers: readonly ["allman", "egyptian"];
    type IndentStyleType = typeof IndentStyleMembers[number];
    const isIndentStyleType: (value: unknown, listner?: TypeError.Listener) => value is "allman" | "egyptian";
    interface TypeOptions {
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
    }
    const isTypeOptions: (value: unknown, listner?: TypeError.Listener) => value is TypeOptions;
    interface TypeSchema {
        $ref: typeof schema;
        defines: {
            [key: string]: Definition;
        };
        options: TypeOptions;
    }
    const isTypeSchema: (value: unknown, listner?: TypeError.Listener) => value is TypeSchema;
    type FilePath = string;
    interface ReferElement {
        $ref: string;
    }
    const isReferElement: (value: unknown, listner?: TypeError.Listener) => value is ReferElement;
    interface AlphaElement {
        $type: string;
    }
    interface AlphaDefinition extends AlphaElement {
        export?: boolean;
    }
    interface ModuleDefinition extends AlphaDefinition {
        $type: "module";
        members: {
            [key: string]: Definition;
        };
    }
    const isModuleDefinition: (value: unknown, listner?: TypeError.Listener) => value is ModuleDefinition;
    const PrimitiveTypeEnumMembers: readonly ["undefined", "boolean", "number", "string"];
    type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    const isPrimitiveTypeEnum: (value: unknown, listner?: TypeError.Listener) => value is "string" | "number" | "boolean" | "undefined";
    interface PrimitiveTypeElement extends AlphaElement {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    const isPrimitiveTypeElement: (value: unknown, listner?: TypeError.Listener) => value is PrimitiveTypeElement;
    interface LiteralElement extends AlphaElement {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    const isLiteralElement: (value: unknown, listner?: TypeError.Listener) => value is LiteralElement;
    interface ValueDefinition extends AlphaDefinition {
        $type: "value";
        value: LiteralElement | ReferElement;
    }
    const isValueDefinition: (value: unknown, listner?: TypeError.Listener) => value is ValueDefinition;
    interface TypeofElement extends AlphaElement {
        $type: "typeof";
        value: ReferElement;
    }
    const isTypeofElement: (value: unknown, listner?: TypeError.Listener) => value is TypeofElement;
    interface ItemofElement extends AlphaElement {
        $type: "itemof";
        value: ReferElement;
    }
    const isItemofElement: (value: unknown, listner?: TypeError.Listener) => value is ItemofElement;
    interface TypeDefinition extends AlphaDefinition {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    const isTypeDefinition: (value: unknown, listner?: TypeError.Listener) => value is TypeDefinition;
    interface EnumTypeElement extends AlphaElement {
        $type: "enum-type";
        members: (number | string)[];
    }
    const isEnumTypeElement: (value: unknown, listner?: TypeError.Listener) => value is EnumTypeElement;
    interface InterfaceDefinition extends AlphaDefinition {
        $type: "interface";
        members: {
            [key: string]: TypeOrInterfaceOrRefer;
        };
    }
    const isInterfaceDefinition: (value: unknown, listner?: TypeError.Listener) => value is InterfaceDefinition;
    interface DictionaryElement extends AlphaElement {
        $type: "dictionary";
        members: TypeOrInterfaceOrRefer;
    }
    const isDictionaryElement: (value: unknown, listner?: TypeError.Listener) => value is DictionaryElement;
    interface ArrayElement extends AlphaElement {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    const isArrayElement: (value: unknown, listner?: TypeError.Listener) => value is ArrayElement;
    interface OrElement extends AlphaElement {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    const isOrElement: (value: unknown, listner?: TypeError.Listener) => value is OrElement;
    interface AndElement extends AlphaElement {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    const isAndElement: (value: unknown, listner?: TypeError.Listener) => value is AndElement;
    type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    const isType: (value: unknown, listner?: TypeError.Listener) => value is TypeDefinition | InterfaceDefinition | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | ArrayElement | OrElement | AndElement;
    type TypeOrValue = Type | ValueDefinition;
    const isTypeOrValue: (value: unknown, listner?: TypeError.Listener) => value is ValueDefinition | TypeDefinition | InterfaceDefinition | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | ArrayElement | OrElement | AndElement;
    type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    type TypeOrInterfaceOrRefer = Type | ReferElement;
    const isTypeOrRefer: (value: unknown, listner?: TypeError.Listener) => value is TypeDefinition | InterfaceDefinition | ReferElement | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | ArrayElement | OrElement | AndElement;
    type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    const isDefinition: (value: unknown, listner?: TypeError.Listener) => value is ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    type DefineOrRefer = Definition | ReferElement;
    const isDefineOrRefer: (value: unknown, listner?: TypeError.Listener) => value is ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition | ReferElement;
}
