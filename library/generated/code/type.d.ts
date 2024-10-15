import { EvilTypeValidator } from "../../source/validator";
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
    const isSchema: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    const isCommentProperty: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is CommentProperty;
    const isTypeSchema: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is TypeSchema;
    const isOutputOptions: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is OutputOptions;
    const isSchemaOptions: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is SchemaOptions;
    const isIndentStyleType: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is "allman" | "egyptian";
    const isValidatorOptionType: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is "none" | "simple" | "full";
    const isAlphaElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is AlphaElement;
    const isAlphaDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is AlphaDefinition;
    const isImportDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is ImportDefinition;
    const isDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is Definition;
    const isDefinitionMap: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is DefinitionMap;
    const isCodeDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is CodeDefinition;
    const isNamespaceDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is NamespaceDefinition;
    const isValueDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is ValueDefinition;
    const isTypeDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is TypeDefinition;
    const isInterfaceDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is InterfaceDefinition;
    const isDictionaryDefinition: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is DictionaryDefinition;
    const isArrayElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is ArrayElement;
    const isOrElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is OrElement;
    const isAndElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is AndElement;
    const isLiteralElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is LiteralElement;
    const isReferElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is ReferElement;
    const isPrimitiveTypeEnum: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is "string" | "number" | "boolean" | "null";
    const isPrimitiveTypeElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is PrimitiveTypeElement;
    const isType: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is Type;
    const isEnumTypeElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is EnumTypeElement;
    const isTypeofElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is TypeofElement;
    const isItemofElement: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is ItemofElement;
    const isTypeOrRefer: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is TypeOrRefer;
    const isTypeOrValue: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is TypeOrValue;
    const isTypeOrValueOfRefer: (value: unknown, listner?: EvilTypeValidator.ErrorListener) => value is TypeOrValueOfRefer;
    const commentPropertyValidatorObject: EvilTypeValidator.ObjectValidator<CommentProperty>;
    const typeSchemaValidatorObject: EvilTypeValidator.ObjectValidator<TypeSchema>;
    const outputOptionsValidatorObject: EvilTypeValidator.ObjectValidator<OutputOptions>;
    const schemaOptionsValidatorObject: EvilTypeValidator.ObjectValidator<SchemaOptions>;
    const alphaElementValidatorObject: EvilTypeValidator.ObjectValidator<AlphaElement>;
    const alphaDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<AlphaDefinition>;
    const importDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<ImportDefinition>;
    const codeDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<CodeDefinition>;
    const namespaceDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<NamespaceDefinition>;
    const valueDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<ValueDefinition>;
    const typeDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<TypeDefinition>;
    const interfaceDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<InterfaceDefinition>;
    const dictionaryDefinitionValidatorObject: EvilTypeValidator.ObjectValidator<DictionaryDefinition>;
    const arrayElementValidatorObject: EvilTypeValidator.ObjectValidator<ArrayElement>;
    const orElementValidatorObject: EvilTypeValidator.ObjectValidator<OrElement>;
    const andElementValidatorObject: EvilTypeValidator.ObjectValidator<AndElement>;
    const literalElementValidatorObject: EvilTypeValidator.ObjectValidator<LiteralElement>;
    const referElementValidatorObject: EvilTypeValidator.ObjectValidator<ReferElement>;
    const primitiveTypeElementValidatorObject: EvilTypeValidator.ObjectValidator<PrimitiveTypeElement>;
    const enumTypeElementValidatorObject: EvilTypeValidator.ObjectValidator<EnumTypeElement>;
    const typeofElementValidatorObject: EvilTypeValidator.ObjectValidator<TypeofElement>;
    const itemofElementValidatorObject: EvilTypeValidator.ObjectValidator<ItemofElement>;
}
