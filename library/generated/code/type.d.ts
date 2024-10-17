import { EvilType } from "../../common/evil-type";
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
        indentUnit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "tab";
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
        title?: string;
        description?: string;
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
        title?: string;
        description?: string;
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
        title?: string;
        description?: string;
    }
    interface TypeofElement {
        $type: "typeof";
        value: ReferElement;
        title?: string;
        description?: string;
    }
    interface ItemofElement {
        $type: "itemof";
        value: ReferElement;
        title?: string;
        description?: string;
    }
    type TypeOrRefer = Type | ReferElement;
    type TypeOrValue = Type | ValueDefinition;
    type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    const isSchema: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    const isCommentProperty: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CommentProperty;
    const isTypeSchema: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeSchema;
    const isOutputOptions: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is OutputOptions;
    const isSchemaOptions: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is SchemaOptions;
    const isIndentStyleType: EvilType.Validator.IsType<IndentStyleType>;
    const isValidatorOptionType: EvilType.Validator.IsType<ValidatorOptionType>;
    const isAlphaElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AlphaElement;
    const isAlphaDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AlphaDefinition;
    const isImportDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ImportDefinition;
    const isDefinition: EvilType.Validator.IsType<Definition>;
    const isDefinitionMap: EvilType.Validator.IsType<DefinitionMap>;
    const isCodeDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CodeDefinition;
    const isNamespaceDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is NamespaceDefinition;
    const isValueDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ValueDefinition;
    const isTypeDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeDefinition;
    const isInterfaceDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is InterfaceDefinition;
    const isDictionaryDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is DictionaryDefinition;
    const isArrayElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ArrayElement;
    const isOrElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is OrElement;
    const isAndElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AndElement;
    const isLiteralElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is LiteralElement;
    const isReferElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ReferElement;
    const isPrimitiveTypeEnum: EvilType.Validator.IsType<PrimitiveTypeEnum>;
    const isPrimitiveTypeElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is PrimitiveTypeElement;
    const isType: EvilType.Validator.IsType<Type>;
    const isEnumTypeElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is EnumTypeElement;
    const isTypeofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeofElement;
    const isItemofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ItemofElement;
    const isTypeOrRefer: EvilType.Validator.IsType<TypeOrRefer>;
    const isTypeOrValue: EvilType.Validator.IsType<TypeOrValue>;
    const isTypeOrValueOfRefer: EvilType.Validator.IsType<TypeOrValueOfRefer>;
    const commentPropertyValidatorObject: EvilType.Validator.ObjectValidator<CommentProperty>;
    const typeSchemaValidatorObject: EvilType.Validator.ObjectValidator<TypeSchema>;
    const outputOptionsValidatorObject: EvilType.Validator.ObjectValidator<OutputOptions>;
    const schemaOptionsValidatorObject: EvilType.Validator.ObjectValidator<SchemaOptions>;
    const alphaElementValidatorObject: EvilType.Validator.ObjectValidator<AlphaElement>;
    const alphaDefinitionValidatorObject: EvilType.Validator.ObjectValidator<AlphaDefinition>;
    const importDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ImportDefinition>;
    const codeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<CodeDefinition>;
    const namespaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<NamespaceDefinition>;
    const valueDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ValueDefinition>;
    const typeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<TypeDefinition>;
    const interfaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<InterfaceDefinition>;
    const dictionaryDefinitionValidatorObject: EvilType.Validator.ObjectValidator<DictionaryDefinition>;
    const arrayElementValidatorObject: EvilType.Validator.ObjectValidator<ArrayElement>;
    const orElementValidatorObject: EvilType.Validator.ObjectValidator<OrElement>;
    const andElementValidatorObject: EvilType.Validator.ObjectValidator<AndElement>;
    const literalElementValidatorObject: EvilType.Validator.ObjectValidator<LiteralElement>;
    const referElementValidatorObject: EvilType.Validator.ObjectValidator<ReferElement>;
    const primitiveTypeElementValidatorObject: EvilType.Validator.ObjectValidator<PrimitiveTypeElement>;
    const enumTypeElementValidatorObject: EvilType.Validator.ObjectValidator<EnumTypeElement>;
    const typeofElementValidatorObject: EvilType.Validator.ObjectValidator<TypeofElement>;
    const itemofElementValidatorObject: EvilType.Validator.ObjectValidator<ItemofElement>;
}
