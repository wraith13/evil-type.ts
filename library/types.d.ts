export declare namespace Types {
    const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    type JsonableValue = null | boolean | number | string;
    const isJsonableValue: (value: unknown) => value is JsonableValue;
    interface JsonableObject {
        [key: string]: Jsonable;
    }
    const isJsonableObject: (value: unknown) => value is JsonableObject;
    type Jsonable = JsonableValue | Jsonable[] | JsonableObject;
    const isJsonable: (value: unknown) => value is Jsonable;
    type JsonablePartial<Target> = {
        [key in keyof Target]?: Target[key];
    } & JsonableObject;
    const isJust: <T>(target: T) => (value: unknown) => value is T;
    const isUndefined: (value: unknown) => value is undefined;
    const isNull: (value: unknown) => value is null;
    const isBoolean: (value: unknown) => value is boolean;
    const isNumber: (value: unknown) => value is number;
    const isString: (value: unknown) => value is string;
    type ActualObject = Exclude<object, null>;
    const isObject: (value: unknown) => value is object;
    const isEnum: <T>(list: readonly T[]) => (value: unknown) => value is T;
    const isArray: <T>(isType: (value: unknown) => value is T) => (value: unknown) => value is T[];
    const isOr: <T extends any[]>(...isTypeList: { [K in keyof T]: (value: unknown) => value is T[K]; }) => (value: unknown) => value is T[number];
    interface OptionalKeyTypeGuard<T> {
        $type: "optional-type-guard";
        isType: (value: unknown) => value is T;
    }
    const sss: OptionalKeyTypeGuard<number>;
    const isOptionalKeyTypeGuard: (value: unknown) => value is OptionalKeyTypeGuard<unknown>;
    const makeOptionalKeyTypeGuard: <T>(isType: (value: unknown) => value is T) => OptionalKeyTypeGuard<T>;
    const isMemberType: <ObjectType extends object>(value: ActualObject, member: keyof ObjectType, isType: OptionalKeyTypeGuard<unknown> | ((v: unknown) => boolean)) => boolean;
    const isMemberTypeOrUndefined: <ObjectType extends object>(value: ActualObject, member: keyof ObjectType, isType: (v: unknown) => boolean) => boolean;
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
    const isSpecificObject: <ObjectType extends object>(memberValidator: ObjectValidator<ObjectType>) => (value: unknown) => value is ObjectType;
    const isDictionaryObject: <MemberType>(isType: (m: unknown) => m is MemberType) => (value: unknown) => value is {
        [key: string]: MemberType;
    };
    const ValidatorOptionTypeMembers: readonly ["none", "simple", "full"];
    type ValidatorOptionType = typeof ValidatorOptionTypeMembers[number];
    const isValidatorOptionType: (value: unknown) => value is "none" | "simple" | "full";
    const IndentStyleMembers: readonly ["allman", "egyptian"];
    type IndentStyleType = typeof IndentStyleMembers[number];
    const isIndentStyleType: (value: unknown) => value is "allman" | "egyptian";
    interface TypeOptions {
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
    }
    const isTypeOptions: (value: unknown) => value is TypeOptions;
    interface TypeSchema {
        $ref: typeof schema;
        defines: {
            [key: string]: Definition;
        };
        options: TypeOptions;
    }
    const isTypeSchema: (value: unknown) => value is TypeSchema;
    type FilePath = string;
    interface ReferElement {
        $ref: string;
    }
    const isReferElement: (value: unknown) => value is ReferElement;
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
    const isModuleDefinition: (value: unknown) => value is ModuleDefinition;
    const PrimitiveTypeEnumMembers: readonly ["undefined", "boolean", "number", "string"];
    type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    const isPrimitiveTypeEnum: (value: unknown) => value is "string" | "number" | "boolean" | "undefined";
    interface PrimitiveTypeElement extends AlphaElement {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    const isPrimitiveTypeElement: (value: unknown) => value is PrimitiveTypeElement;
    interface LiteralElement extends AlphaElement {
        $type: "literal";
        literal: Jsonable;
    }
    const isLiteralElement: (value: unknown) => value is LiteralElement;
    interface ValueDefinition extends AlphaDefinition {
        $type: "value";
        value: LiteralElement | ReferElement;
    }
    const isValueDefinition: (value: unknown) => value is ValueDefinition;
    interface TypeofElement extends AlphaElement {
        $type: "typeof";
        value: ReferElement;
    }
    const isTypeofElement: (value: unknown) => value is TypeofElement;
    interface ItemofElement extends AlphaElement {
        $type: "itemof";
        value: ReferElement;
    }
    const isItemofElement: (value: unknown) => value is ItemofElement;
    interface TypeDefinition extends AlphaDefinition {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    const isTypeDefinition: (value: unknown) => value is TypeDefinition;
    interface EnumTypeElement extends AlphaElement {
        $type: "enum-type";
        members: (number | string)[];
    }
    const isEnumTypeElement: (value: unknown) => value is EnumTypeElement;
    interface InterfaceDefinition extends AlphaDefinition {
        $type: "interface";
        members: {
            [key: string]: TypeOrInterfaceOrRefer;
        };
    }
    const isInterfaceDefinition: (value: unknown) => value is InterfaceDefinition;
    interface DictionaryElement extends AlphaElement {
        $type: "dictionary";
        members: TypeOrInterfaceOrRefer;
    }
    const isDictionaryElement: (value: unknown) => value is DictionaryElement;
    interface ArrayElement extends AlphaElement {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    const isArrayElement: (value: unknown) => value is ArrayElement;
    interface OrElement extends AlphaElement {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    const isOrElement: (value: unknown) => value is OrElement;
    interface AndElement extends AlphaElement {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    const isAndElement: (value: unknown) => value is AndElement;
    type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    const isType: (value: unknown) => value is TypeDefinition | InterfaceDefinition | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | ArrayElement | OrElement | AndElement;
    type TypeOrValue = Type | ValueDefinition;
    const isTypeOrValue: (value: unknown) => value is ValueDefinition | TypeDefinition | InterfaceDefinition | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | ArrayElement | OrElement | AndElement;
    type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    type TypeOrInterfaceOrRefer = Type | ReferElement;
    const isTypeOrRefer: (value: unknown) => value is TypeDefinition | InterfaceDefinition | ReferElement | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | ArrayElement | OrElement | AndElement;
    type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    const isDefinition: (value: unknown) => value is ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    type DefineOrRefer = Definition | ReferElement;
    const isDefineOrRefer: (value: unknown) => value is DefineOrRefer;
}
