export declare namespace Types {
    const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
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
    interface TypeSchema {
        $ref: typeof schema;
        defines: {
            [key: string]: Define;
        };
        options: TypeOptions;
    }
    const isTypeSchema: (value: unknown) => value is TypeSchema;
    type ValidatorOptionType = "none" | "simple" | "full";
    const isValidatorOptionType: (value: unknown) => value is ValidatorOptionType;
    interface TypeOptions {
        indentUnit: number | "\t";
        indentStyle: "allman" | "egyptian";
        validatorOption: ValidatorOptionType;
    }
    const isTypeOptions: (value: unknown) => value is TypeOptions;
    type FilePath = string;
    interface Refer {
        $ref: string;
    }
    const isRefer: (value: unknown) => value is Refer;
    interface AlphaDefine {
        export?: boolean;
        $type: string;
    }
    const isAlphaDefine: (value: unknown) => value is AlphaDefine;
    interface ModuleDefine extends AlphaDefine {
        $type: "module";
        members: {
            [key: string]: Define;
        };
    }
    const isModuleDefine: (value: unknown) => value is AlphaDefine;
    interface ValueDefine extends AlphaDefine {
        $type: "value";
        value: Jsonable;
    }
    const isValueDefine: (value: unknown) => value is ValueDefine;
    interface PrimitiveTypeDefine extends AlphaDefine {
        $type: "primitive-type";
        define: "undefined" | "boolean" | "number" | "string";
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
    const isTypeOrInterface: (value: unknown) => value is TypeOrInterface;
    type TypeOrInterfaceOrRefer = TypeOrInterface | Refer;
    const isTypeOrInterfaceOrRefer: (value: unknown) => value is TypeOrInterfaceOrRefer;
    type Define = ModuleDefine | ValueDefine | TypeOrInterface;
    const isDefine: (value: unknown) => value is Define;
    type DefineOrRefer = Define | Refer;
    const isDefineOrRefer: (value: unknown) => value is DefineOrRefer;
}
