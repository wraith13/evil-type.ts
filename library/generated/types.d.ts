import { TypesPrime } from "../source/types-prime";
import { TypesError } from "../source/types-error";
import { Jsonable } from "./jsonable";
export declare namespace Types {
    const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    interface CommentProperty {
        comment?: string[];
    }
    interface TypeSchema extends CommentProperty {
        $ref: typeof schema;
        imports?: ImportDefinition[];
        defines: {
            [key: string]: Definition;
        };
        options: OutputOptions;
    }
    interface OutputOptions {
        outputFile?: string;
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
        schema?: SchemaOptions;
    }
    interface SchemaOptions {
        outputFile: string;
        id: string;
        $ref?: string;
    }
    const indentStyleTypeMember: readonly ["allman", "egyptian"];
    type IndentStyleType = typeof indentStyleTypeMember[number];
    type ValidatorOptionType = "none" | "simple" | "full";
    interface AlphaElement {
        $type: string;
    }
    interface AlphaDefinition extends AlphaElement, CommentProperty {
        export?: boolean;
    }
    interface ImportDefinition {
        $type: "import";
        target: string;
        from: string;
    }
    type Definition = CodeDefinition | NamespaceDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition | DictionaryDefinition;
    interface CodeDefinition extends AlphaDefinition {
        $type: "code";
        tokens: string[];
    }
    interface NamespaceDefinition extends AlphaDefinition {
        $type: "namespace";
        members: {
            [key: string]: Definition;
        };
    }
    interface ValueDefinition extends AlphaDefinition {
        $type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    interface TypeDefinition extends AlphaDefinition {
        $type: "type";
        define: TypeOrRefer;
    }
    interface InterfaceDefinition extends AlphaDefinition {
        $type: "interface";
        extends?: ReferElement[];
        members: {
            [key: string]: TypeOrRefer;
        };
    }
    interface DictionaryDefinition extends AlphaDefinition {
        $type: "dictionary";
        valueType: TypeOrRefer;
    }
    interface ArrayElement extends AlphaElement {
        $type: "array";
        items: TypeOrRefer;
    }
    interface OrElement extends AlphaElement {
        $type: "or";
        types: TypeOrRefer[];
    }
    interface AndElement extends AlphaElement {
        $type: "and";
        types: TypeOrRefer[];
    }
    interface LiteralElement extends AlphaElement {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    interface ReferElement {
        $ref: string;
    }
    const PrimitiveTypeEnumMembers: readonly ["null", "boolean", "number", "string"];
    type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    interface PrimitiveTypeElement extends AlphaElement {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | DictionaryDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    interface EnumTypeElement {
        $type: "enum-type";
        members: (null | boolean | number | string)[];
    }
    interface TypeofElement {
        $type: "typeof";
        value: ReferElement;
    }
    interface ItemofElement {
        $type: "itemof";
        value: ReferElement;
    }
    type TypeOrRefer = Type | ReferElement;
    type TypeOrValue = Type | ValueDefinition;
    type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    const isSchema: (value: unknown, listner?: TypesError.Listener) => value is "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
    const getCommentPropertyValidator: () => TypesPrime.ObjectValidator<CommentProperty>;
    const isCommentProperty: (value: unknown, listner?: TypesError.Listener) => value is CommentProperty;
    const getTypeSchemaValidator: () => TypesPrime.ObjectValidator<TypeSchema>;
    const isTypeSchema: (value: unknown, listner?: TypesError.Listener) => value is TypeSchema;
    const getOutputOptionsValidator: () => TypesPrime.ObjectValidator<OutputOptions>;
    const isOutputOptions: (value: unknown, listner?: TypesError.Listener) => value is OutputOptions;
    const getSchemaOptionsValidator: () => TypesPrime.ObjectValidator<SchemaOptions>;
    const isSchemaOptions: (value: unknown, listner?: TypesError.Listener) => value is SchemaOptions;
    const isIndentStyleType: (value: unknown, listner?: TypesError.Listener) => value is IndentStyleType;
    const isValidatorOptionType: (value: unknown, listner?: TypesError.Listener) => value is ValidatorOptionType;
    const getAlphaElementValidator: () => TypesPrime.ObjectValidator<AlphaElement>;
    const isAlphaElement: (value: unknown, listner?: TypesError.Listener) => value is AlphaElement;
    const getAlphaDefinitionValidator: () => TypesPrime.ObjectValidator<AlphaDefinition>;
    const isAlphaDefinition: (value: unknown, listner?: TypesError.Listener) => value is AlphaDefinition;
    const getImportDefinitionValidator: () => TypesPrime.ObjectValidator<ImportDefinition>;
    const isImportDefinition: (value: unknown, listner?: TypesError.Listener) => value is ImportDefinition;
    const isDefinition: (value: unknown, listner?: TypesError.Listener) => value is Definition;
    const getCodeDefinitionValidator: () => TypesPrime.ObjectValidator<CodeDefinition>;
    const isCodeDefinition: (value: unknown, listner?: TypesError.Listener) => value is CodeDefinition;
    const getNamespaceDefinitionValidator: () => TypesPrime.ObjectValidator<NamespaceDefinition>;
    const isNamespaceDefinition: (value: unknown, listner?: TypesError.Listener) => value is NamespaceDefinition;
    const getValueDefinitionValidator: () => TypesPrime.ObjectValidator<ValueDefinition>;
    const isValueDefinition: (value: unknown, listner?: TypesError.Listener) => value is ValueDefinition;
    const getTypeDefinitionValidator: () => TypesPrime.ObjectValidator<TypeDefinition>;
    const isTypeDefinition: (value: unknown, listner?: TypesError.Listener) => value is TypeDefinition;
    const getInterfaceDefinitionValidator: () => TypesPrime.ObjectValidator<InterfaceDefinition>;
    const isInterfaceDefinition: (value: unknown, listner?: TypesError.Listener) => value is InterfaceDefinition;
    const getDictionaryDefinitionValidator: () => TypesPrime.ObjectValidator<DictionaryDefinition>;
    const isDictionaryDefinition: (value: unknown, listner?: TypesError.Listener) => value is DictionaryDefinition;
    const getArrayElementValidator: () => TypesPrime.ObjectValidator<ArrayElement>;
    const isArrayElement: (value: unknown, listner?: TypesError.Listener) => value is ArrayElement;
    const getOrElementValidator: () => TypesPrime.ObjectValidator<OrElement>;
    const isOrElement: (value: unknown, listner?: TypesError.Listener) => value is OrElement;
    const getAndElementValidator: () => TypesPrime.ObjectValidator<AndElement>;
    const isAndElement: (value: unknown, listner?: TypesError.Listener) => value is AndElement;
    const getLiteralElementValidator: () => TypesPrime.ObjectValidator<LiteralElement>;
    const isLiteralElement: (value: unknown, listner?: TypesError.Listener) => value is LiteralElement;
    const getReferElementValidator: () => TypesPrime.ObjectValidator<ReferElement>;
    const isReferElement: (value: unknown, listner?: TypesError.Listener) => value is ReferElement;
    const isPrimitiveTypeEnum: (value: unknown, listner?: TypesError.Listener) => value is PrimitiveTypeEnum;
    const getPrimitiveTypeElementValidator: () => TypesPrime.ObjectValidator<PrimitiveTypeElement>;
    const isPrimitiveTypeElement: (value: unknown, listner?: TypesError.Listener) => value is PrimitiveTypeElement;
    const isType: (value: unknown, listner?: TypesError.Listener) => value is Type;
    const getEnumTypeElementValidator: () => TypesPrime.ObjectValidator<EnumTypeElement>;
    const isEnumTypeElement: (value: unknown, listner?: TypesError.Listener) => value is EnumTypeElement;
    const getTypeofElementValidator: () => TypesPrime.ObjectValidator<TypeofElement>;
    const isTypeofElement: (value: unknown, listner?: TypesError.Listener) => value is TypeofElement;
    const getItemofElementValidator: () => TypesPrime.ObjectValidator<ItemofElement>;
    const isItemofElement: (value: unknown, listner?: TypesError.Listener) => value is ItemofElement;
    const isTypeOrRefer: (value: unknown, listner?: TypesError.Listener) => value is TypeOrRefer;
    const isTypeOrValue: (value: unknown, listner?: TypesError.Listener) => value is TypeOrValue;
    const isTypeOrValueOfRefer: (value: unknown, listner?: TypesError.Listener) => value is TypeOrValueOfRefer;
}
