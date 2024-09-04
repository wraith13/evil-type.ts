import { Jsonable } from "./jsonable";
import { TypesError } from "./types-error";
export declare namespace Types {
    const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    const ValidatorOptionTypeMembers: readonly ["none", "simple", "full"];
    type ValidatorOptionType = typeof ValidatorOptionTypeMembers[number];
    const isValidatorOptionType: (value: unknown, listner?: TypesError.Listener | undefined) => value is "none" | "simple" | "full";
    const IndentStyleMembers: readonly ["allman", "egyptian"];
    type IndentStyleType = typeof IndentStyleMembers[number];
    const isIndentStyleType: (value: unknown, listner?: TypesError.Listener | undefined) => value is "allman" | "egyptian";
    interface OutputOptions {
        outputFile?: string;
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
    }
    const isOutputOptions: (value: unknown, listner?: TypesError.Listener | undefined) => value is OutputOptions;
    interface TypeSchema {
        $ref: typeof schema;
        imports?: ImportDefinition[];
        defines: {
            [key: string]: Definition;
        };
        options: OutputOptions;
    }
    const isTypeSchema: (value: unknown, listner?: TypesError.Listener) => value is TypeSchema;
    type FilePath = string;
    interface ReferElement {
        $ref: string;
    }
    const isReferElement: (value: unknown, listner?: TypesError.Listener | undefined) => value is ReferElement;
    interface AlphaElement {
        $type: string;
    }
    interface AlphaDefinition extends AlphaElement {
        export?: boolean;
    }
    interface ImportDefinition {
        $type: "import";
        target: string;
        from: string;
    }
    const isImportDefinition: (value: unknown, listner?: TypesError.Listener) => value is ImportDefinition;
    interface ModuleDefinition extends AlphaDefinition {
        $type: "module";
        members: {
            [key: string]: Definition;
        };
    }
    const isModuleDefinition: (value: unknown, listner?: TypesError.Listener) => value is ModuleDefinition;
    const PrimitiveTypeEnumMembers: readonly ["null", "boolean", "number", "string"];
    type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    const isPrimitiveTypeEnum: (value: unknown, listner?: TypesError.Listener | undefined) => value is "string" | "number" | "boolean" | "null";
    interface PrimitiveTypeElement extends AlphaElement {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    const isPrimitiveTypeElement: (value: unknown, listner?: TypesError.Listener) => value is PrimitiveTypeElement;
    interface LiteralElement extends AlphaElement {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    const isLiteralElement: (value: unknown, listner?: TypesError.Listener) => value is LiteralElement;
    interface ValueDefinition extends AlphaDefinition {
        $type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    const isValueDefinition: (value: unknown, listner?: TypesError.Listener) => value is ValueDefinition;
    interface TypeofElement extends AlphaElement {
        $type: "typeof";
        value: ReferElement;
    }
    const isTypeofElement: (value: unknown, listner?: TypesError.Listener) => value is TypeofElement;
    interface ItemofElement extends AlphaElement {
        $type: "itemof";
        value: ReferElement;
    }
    const isItemofElement: (value: unknown, listner?: TypesError.Listener) => value is ItemofElement;
    interface TypeDefinition extends AlphaDefinition {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    const isTypeDefinition: (value: unknown, listner?: TypesError.Listener) => value is TypeDefinition;
    interface EnumTypeElement extends AlphaElement {
        $type: "enum-type";
        members: (null | boolean | number | string)[];
    }
    const isEnumTypeElement: (value: unknown, listner?: TypesError.Listener) => value is EnumTypeElement;
    interface InterfaceDefinition extends AlphaDefinition {
        $type: "interface";
        extends?: ReferElement[];
        members: {
            [key: string]: TypeOrInterfaceOrRefer;
        } | DictionaryElement;
    }
    const isInterfaceDefinition: (value: unknown, listner?: TypesError.Listener) => value is InterfaceDefinition;
    interface DictionaryElement extends AlphaElement {
        $type: "dictionary";
        valueType: TypeOrInterfaceOrRefer;
    }
    const isDictionaryElement: (value: unknown, listner?: TypesError.Listener) => value is DictionaryElement;
    interface ArrayElement extends AlphaElement {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    const isArrayElement: (value: unknown, listner?: TypesError.Listener) => value is ArrayElement;
    interface OrElement extends AlphaElement {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    const isOrElement: (value: unknown, listner?: TypesError.Listener) => value is OrElement;
    interface AndElement extends AlphaElement {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    const isAndElement: (value: unknown, listner?: TypesError.Listener) => value is AndElement;
    type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | DictionaryElement | ArrayElement | OrElement | AndElement | LiteralElement;
    const isType: (value: unknown, listner?: TypesError.Listener | undefined) => value is TypeDefinition | InterfaceDefinition | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | DictionaryElement | ArrayElement | OrElement | AndElement;
    type TypeOrValue = Type | ValueDefinition;
    const isTypeOrValue: (value: unknown, listner?: TypesError.Listener | undefined) => value is ValueDefinition | TypeDefinition | InterfaceDefinition | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | DictionaryElement | ArrayElement | OrElement | AndElement;
    type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    type TypeOrInterfaceOrRefer = Type | ReferElement;
    const isTypeOrRefer: (value: unknown, listner?: TypesError.Listener | undefined) => value is TypeDefinition | InterfaceDefinition | ReferElement | PrimitiveTypeElement | LiteralElement | TypeofElement | ItemofElement | EnumTypeElement | DictionaryElement | ArrayElement | OrElement | AndElement;
    type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    const isDefinition: (value: unknown, listner?: TypesError.Listener | undefined) => value is ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    type DefineOrRefer = Definition | ReferElement;
    const isDefineOrRefer: (value: unknown, listner?: TypesError.Listener | undefined) => value is ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition | ReferElement;
}
