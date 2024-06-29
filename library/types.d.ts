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
            [key: string]: Define;
        };
        options: TypeOptions;
    }
    const isTypeSchema: (value: unknown) => value is TypeSchema;
    type FilePath = string;
    interface Refer {
        $ref: string;
    }
    const isRefer: (value: unknown) => value is Refer;
    interface AlphaDefine {
        export?: boolean;
        $type: string;
    }
    const getAlphaDefineSpecification: <T extends AlphaDefine>($type: T["$type"]) => {
        export: OptionalKeyTypeGuard<boolean>;
        $type: (value: unknown) => value is T["$type"];
    };
    interface ModuleDefine extends AlphaDefine {
        $type: "module";
        members: {
            [key: string]: Define;
        };
    }
    const isModuleDefine: (value: unknown) => value is ModuleDefine;
    interface ValueDefine extends AlphaDefine {
        $type: "value";
        value: Jsonable;
    }
    const isValueDefine: (value: unknown) => value is ValueDefine;
    const PrimitiveTypeMembers: readonly ["undefined", "boolean", "number", "string"];
    type PrimitiveType = typeof PrimitiveTypeMembers[number];
    const isPrimitiveType: (value: unknown) => value is "string" | "number" | "boolean" | "undefined";
    interface PrimitiveTypeDefine extends AlphaDefine {
        $type: "primitive-type";
        define: PrimitiveType;
    }
    const isPrimitiveTypeDefine: (value: unknown) => value is PrimitiveTypeDefine;
    interface TypeDefine extends AlphaDefine {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    const isTypeDefine: (value: unknown) => value is TypeDefine;
    interface InterfaceDefine extends AlphaDefine {
        $type: "interface";
        members: {
            [key: string]: TypeOrInterfaceOrRefer;
        };
    }
    const isInterfaceDefine: (value: unknown) => value is InterfaceDefine;
    interface ArrayDefine extends AlphaDefine {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    const isArrayDefine: (value: unknown) => value is ArrayDefine;
    interface OrDefine extends AlphaDefine {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    const isOrDefine: (value: unknown) => value is OrDefine;
    interface AndDefine extends AlphaDefine {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    const isAndDefine: (value: unknown) => value is AndDefine;
    type TypeOrInterface = PrimitiveTypeDefine | TypeDefine | InterfaceDefine | ArrayDefine | OrDefine | AndDefine;
    type ValueOrTypeOfInterface = ValueDefine | TypeOrInterface;
    type ValueOrTypeOfInterfaceOrRefer = ValueOrTypeOfInterface | Refer;
    const isTypeOrInterface: (value: unknown) => value is PrimitiveTypeDefine | TypeDefine | InterfaceDefine | ArrayDefine | OrDefine | AndDefine;
    type TypeOrInterfaceOrRefer = TypeOrInterface | Refer;
    const isTypeOrInterfaceOrRefer: (value: unknown) => value is PrimitiveTypeDefine | TypeDefine | InterfaceDefine | ArrayDefine | OrDefine | AndDefine | Refer;
    type Define = ModuleDefine | ValueDefine | TypeOrInterface;
    const isDefine: (value: unknown) => value is ModuleDefine | ValueDefine | PrimitiveTypeDefine | TypeDefine | InterfaceDefine | ArrayDefine | OrDefine | AndDefine;
    type DefineOrRefer = Define | Refer;
    const isDefineOrRefer: (value: unknown) => value is DefineOrRefer;
}
