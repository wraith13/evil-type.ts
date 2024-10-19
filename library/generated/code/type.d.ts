import { EvilType } from "../../common/evil-type";
import { Jsonable } from "./jsonable";
export declare namespace Type {
    export const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    export interface CommentProperty {
        comment?: string[];
    }
    export interface CommonProperties {
        title?: string;
        description?: string;
    }
    export interface TypeSchema extends CommentProperty {
        $schema: typeof schema;
        imports?: ImportDefinition[];
        defines: DefinitionMap;
        options: OutputOptions;
    }
    export interface OutputOptions {
        outputFile: string;
        indentUnit: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "tab";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
        schema?: SchemaOptions;
    }
    export interface SchemaOptions {
        outputFile: string;
        $id: string;
        $ref?: string;
        externalReferMapping?: {
            [key: string]: string;
        };
    }
    export const indentStyleTypeMember: readonly ["allman", "egyptian"];
    export type IndentStyleType = typeof indentStyleTypeMember[number];
    export type ValidatorOptionType = "none" | "simple" | "full";
    export interface AlphaElement extends CommonProperties {
        $type: string;
    }
    export interface AlphaDefinition extends AlphaElement, CommentProperty {
        export?: boolean;
    }
    export interface ImportDefinition {
        $type: "import";
        target: string;
        from: string;
    }
    export type Definition = CodeDefinition | NamespaceDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition | DictionaryDefinition;
    export type DefinitionMap = {
        [key: string]: Definition;
    };
    export interface CodeDefinition extends AlphaDefinition {
        $type: "code";
        tokens: string[];
    }
    export interface NamespaceDefinition extends AlphaDefinition {
        $type: "namespace";
        members: DefinitionMap;
    }
    export interface ValueDefinition extends AlphaDefinition {
        $type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    export interface TypeDefinition extends AlphaDefinition {
        $type: "type";
        define: TypeOrRefer;
    }
    export interface InterfaceDefinition extends AlphaDefinition {
        $type: "interface";
        extends?: ReferElement[];
        members: {
            [key: string]: TypeOrRefer;
        };
        additionalProperties?: boolean;
    }
    export interface DictionaryDefinition extends AlphaDefinition {
        $type: "dictionary";
        valueType: TypeOrRefer;
    }
    export interface ArrayElement extends AlphaElement {
        $type: "array";
        items: TypeOrRefer;
    }
    export interface OrElement extends AlphaElement {
        $type: "or";
        types: TypeOrRefer[];
    }
    export interface AndElement extends AlphaElement {
        $type: "and";
        types: TypeOrRefer[];
    }
    export interface LiteralElement extends AlphaElement {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    export interface ReferElement extends CommonProperties {
        $ref: string;
    }
    interface NullType extends CommonProperties {
        $type: "primitive-type";
        type: "null";
    }
    interface BooleanType extends CommonProperties {
        $type: "primitive-type";
        type: "boolean";
    }
    interface NumberType extends CommonProperties {
        $type: "primitive-type";
        type: "number";
    }
    interface IntegerType extends CommonProperties {
        $type: "primitive-type";
        type: "integer";
    }
    interface StringType extends CommonProperties {
        $type: "primitive-type";
        type: "string";
        pattern?: string;
    }
    export type PrimitiveTypeElement = NullType | BooleanType | NumberType | IntegerType | StringType;
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | KeyofElement | ItemofElement | InterfaceDefinition | DictionaryDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    export interface EnumTypeElement extends CommonProperties {
        $type: "enum-type";
        members: (null | boolean | number | string)[];
    }
    export interface TypeofElement extends CommonProperties {
        $type: "typeof";
        value: ReferElement;
    }
    export interface KeyofElement extends CommonProperties {
        $type: "keyof";
        value: ReferElement;
    }
    export interface ItemofElement extends CommonProperties {
        $type: "itemof";
        value: ReferElement;
    }
    export type TypeOrRefer = Type | ReferElement;
    export type TypeOrValue = Type | ValueDefinition;
    export type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    export type TypeOrLiteralOfRefer = TypeOrRefer | LiteralElement;
    export const isSchema: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    export const isCommentProperty: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CommentProperty;
    export const isCommonProperties: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CommonProperties;
    export const isTypeSchema: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeSchema;
    export const isOutputOptions: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is OutputOptions;
    export const isSchemaOptions: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is SchemaOptions;
    export const isIndentStyleType: EvilType.Validator.IsType<IndentStyleType>;
    export const isValidatorOptionType: EvilType.Validator.IsType<ValidatorOptionType>;
    export const isAlphaElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AlphaElement;
    export const isAlphaDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AlphaDefinition;
    export const isImportDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ImportDefinition;
    export const isDefinition: EvilType.Validator.IsType<Definition>;
    export const isDefinitionMap: EvilType.Validator.IsType<DefinitionMap>;
    export const isCodeDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CodeDefinition;
    export const isNamespaceDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is NamespaceDefinition;
    export const isValueDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ValueDefinition;
    export const isTypeDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeDefinition;
    export const isInterfaceDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is InterfaceDefinition;
    export const isDictionaryDefinition: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is DictionaryDefinition;
    export const isArrayElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ArrayElement;
    export const isOrElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is OrElement;
    export const isAndElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AndElement;
    export const isLiteralElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is LiteralElement;
    export const isReferElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ReferElement;
    export const isPrimitiveTypeElement: EvilType.Validator.IsType<PrimitiveTypeElement>;
    export const isType: EvilType.Validator.IsType<Type>;
    export const isEnumTypeElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is EnumTypeElement;
    export const isTypeofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeofElement;
    export const isKeyofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is KeyofElement;
    export const isItemofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ItemofElement;
    export const isTypeOrRefer: EvilType.Validator.IsType<TypeOrRefer>;
    export const isTypeOrValue: EvilType.Validator.IsType<TypeOrValue>;
    export const isTypeOrValueOfRefer: EvilType.Validator.IsType<TypeOrValueOfRefer>;
    export const isTypeOrLiteralOfRefer: EvilType.Validator.IsType<TypeOrLiteralOfRefer>;
    export const commentPropertyValidatorObject: EvilType.Validator.ObjectValidator<CommentProperty>;
    export const commonPropertiesValidatorObject: EvilType.Validator.ObjectValidator<CommonProperties>;
    export const typeSchemaValidatorObject: EvilType.Validator.ObjectValidator<TypeSchema>;
    export const outputOptionsValidatorObject: EvilType.Validator.ObjectValidator<OutputOptions>;
    export const schemaOptionsValidatorObject: EvilType.Validator.ObjectValidator<SchemaOptions>;
    export const alphaElementValidatorObject: EvilType.Validator.ObjectValidator<AlphaElement>;
    export const alphaDefinitionValidatorObject: EvilType.Validator.ObjectValidator<AlphaDefinition>;
    export const importDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ImportDefinition>;
    export const codeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<CodeDefinition>;
    export const namespaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<NamespaceDefinition>;
    export const valueDefinitionValidatorObject: EvilType.Validator.ObjectValidator<ValueDefinition>;
    export const typeDefinitionValidatorObject: EvilType.Validator.ObjectValidator<TypeDefinition>;
    export const interfaceDefinitionValidatorObject: EvilType.Validator.ObjectValidator<InterfaceDefinition>;
    export const dictionaryDefinitionValidatorObject: EvilType.Validator.ObjectValidator<DictionaryDefinition>;
    export const arrayElementValidatorObject: EvilType.Validator.ObjectValidator<ArrayElement>;
    export const orElementValidatorObject: EvilType.Validator.ObjectValidator<OrElement>;
    export const andElementValidatorObject: EvilType.Validator.ObjectValidator<AndElement>;
    export const literalElementValidatorObject: EvilType.Validator.ObjectValidator<LiteralElement>;
    export const referElementValidatorObject: EvilType.Validator.ObjectValidator<ReferElement>;
    export const enumTypeElementValidatorObject: EvilType.Validator.ObjectValidator<EnumTypeElement>;
    export const typeofElementValidatorObject: EvilType.Validator.ObjectValidator<TypeofElement>;
    export const keyofElementValidatorObject: EvilType.Validator.ObjectValidator<KeyofElement>;
    export const itemofElementValidatorObject: EvilType.Validator.ObjectValidator<ItemofElement>;
    export {};
}
