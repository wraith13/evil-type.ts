import { EvilTypeValidator } from "../../source/validator";
import { EvilTypeError } from "../../source/error";
import { Jsonable } from "./jsonable";
export declare namespace Type {
    const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    interface CommentProperty {
        comment?: string[];
    }
    interface TypeSchema extends CommentProperty {
        $schema: typeof schema;
        imports?: ImportDefinition[];
        defines: DefinitionMap;
        options: OutputOptions;
    }
    interface OutputOptions {
        outputFile: string;
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
        schema?: SchemaOptions;
    }
    interface SchemaOptions {
        outputFile: string;
        $id: string;
        $ref?: string;
        externalReferMapping?: {
            [key: string]: string;
        };
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
    type DefinitionMap = {
        [key: string]: Definition;
    };
    interface CodeDefinition extends AlphaDefinition {
        $type: "code";
        tokens: string[];
    }
    interface NamespaceDefinition extends AlphaDefinition {
        $type: "namespace";
        members: DefinitionMap;
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
        additionalProperties?: boolean;
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
    const isSchema: (value: unknown, listner?: EvilTypeError.Listener) => value is "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    const getCommentPropertyValidator: () => EvilTypeValidator.ObjectValidator<CommentProperty>;
    const isCommentProperty: (value: unknown, listner?: EvilTypeError.Listener) => value is CommentProperty;
    const getTypeSchemaValidator: () => EvilTypeValidator.ObjectValidator<TypeSchema>;
    const isTypeSchema: (value: unknown, listner?: EvilTypeError.Listener) => value is TypeSchema;
    const getOutputOptionsValidator: () => EvilTypeValidator.ObjectValidator<OutputOptions>;
    const isOutputOptions: (value: unknown, listner?: EvilTypeError.Listener) => value is OutputOptions;
    const getSchemaOptionsValidator: () => EvilTypeValidator.ObjectValidator<SchemaOptions>;
    const isSchemaOptions: (value: unknown, listner?: EvilTypeError.Listener) => value is SchemaOptions;
    const isIndentStyleType: (value: unknown, listner?: EvilTypeError.Listener) => value is IndentStyleType;
    const isValidatorOptionType: (value: unknown, listner?: EvilTypeError.Listener) => value is ValidatorOptionType;
    const getAlphaElementValidator: () => EvilTypeValidator.ObjectValidator<AlphaElement>;
    const isAlphaElement: (value: unknown, listner?: EvilTypeError.Listener) => value is AlphaElement;
    const getAlphaDefinitionValidator: () => EvilTypeValidator.ObjectValidator<AlphaDefinition>;
    const isAlphaDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is AlphaDefinition;
    const getImportDefinitionValidator: () => EvilTypeValidator.ObjectValidator<ImportDefinition>;
    const isImportDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is ImportDefinition;
    const isDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is Definition;
    const isDefinitionMap: (value: unknown, listner?: EvilTypeError.Listener) => value is DefinitionMap;
    const getCodeDefinitionValidator: () => EvilTypeValidator.ObjectValidator<CodeDefinition>;
    const isCodeDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is CodeDefinition;
    const getNamespaceDefinitionValidator: () => EvilTypeValidator.ObjectValidator<NamespaceDefinition>;
    const isNamespaceDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is NamespaceDefinition;
    const getValueDefinitionValidator: () => EvilTypeValidator.ObjectValidator<ValueDefinition>;
    const isValueDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is ValueDefinition;
    const getTypeDefinitionValidator: () => EvilTypeValidator.ObjectValidator<TypeDefinition>;
    const isTypeDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is TypeDefinition;
    const getInterfaceDefinitionValidator: () => EvilTypeValidator.ObjectValidator<InterfaceDefinition>;
    const isInterfaceDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is InterfaceDefinition;
    const getDictionaryDefinitionValidator: () => EvilTypeValidator.ObjectValidator<DictionaryDefinition>;
    const isDictionaryDefinition: (value: unknown, listner?: EvilTypeError.Listener) => value is DictionaryDefinition;
    const getArrayElementValidator: () => EvilTypeValidator.ObjectValidator<ArrayElement>;
    const isArrayElement: (value: unknown, listner?: EvilTypeError.Listener) => value is ArrayElement;
    const getOrElementValidator: () => EvilTypeValidator.ObjectValidator<OrElement>;
    const isOrElement: (value: unknown, listner?: EvilTypeError.Listener) => value is OrElement;
    const getAndElementValidator: () => EvilTypeValidator.ObjectValidator<AndElement>;
    const isAndElement: (value: unknown, listner?: EvilTypeError.Listener) => value is AndElement;
    const getLiteralElementValidator: () => EvilTypeValidator.ObjectValidator<LiteralElement>;
    const isLiteralElement: (value: unknown, listner?: EvilTypeError.Listener) => value is LiteralElement;
    const getReferElementValidator: () => EvilTypeValidator.ObjectValidator<ReferElement>;
    const isReferElement: (value: unknown, listner?: EvilTypeError.Listener) => value is ReferElement;
    const isPrimitiveTypeEnum: (value: unknown, listner?: EvilTypeError.Listener) => value is PrimitiveTypeEnum;
    const getPrimitiveTypeElementValidator: () => EvilTypeValidator.ObjectValidator<PrimitiveTypeElement>;
    const isPrimitiveTypeElement: (value: unknown, listner?: EvilTypeError.Listener) => value is PrimitiveTypeElement;
    const isType: (value: unknown, listner?: EvilTypeError.Listener) => value is Type;
    const getEnumTypeElementValidator: () => EvilTypeValidator.ObjectValidator<EnumTypeElement>;
    const isEnumTypeElement: (value: unknown, listner?: EvilTypeError.Listener) => value is EnumTypeElement;
    const getTypeofElementValidator: () => EvilTypeValidator.ObjectValidator<TypeofElement>;
    const isTypeofElement: (value: unknown, listner?: EvilTypeError.Listener) => value is TypeofElement;
    const getItemofElementValidator: () => EvilTypeValidator.ObjectValidator<ItemofElement>;
    const isItemofElement: (value: unknown, listner?: EvilTypeError.Listener) => value is ItemofElement;
    const isTypeOrRefer: (value: unknown, listner?: EvilTypeError.Listener) => value is TypeOrRefer;
    const isTypeOrValue: (value: unknown, listner?: EvilTypeError.Listener) => value is TypeOrValue;
    const isTypeOrValueOfRefer: (value: unknown, listner?: EvilTypeError.Listener) => value is TypeOrValueOfRefer;
}
