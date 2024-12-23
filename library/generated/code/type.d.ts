import { EvilType } from "../../common/evil-type";
import { Jsonable } from "./jsonable";
export { EvilType, Jsonable };
export declare namespace Type {
    const schema: "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    interface CommentProperty {
        comment?: string[];
    }
    interface CommonProperties {
        default?: Jsonable.Jsonable;
        title?: string;
        description?: string;
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
        safeNumber?: boolean;
        safeInteger?: boolean;
        maxLineLength?: null | number;
        StringFormatMap?: {
            [key in keyof typeof StringFormatMap]?: StringFormatEntry;
        };
        default?: {
            export?: boolean;
            additionalProperties?: boolean;
            safeInteger?: boolean;
            safeNumber?: boolean;
            regexpFlags?: string;
        };
        schema?: SchemaOptions;
    }
    interface SchemaOptions {
        outputFile: string;
        $id?: string;
        $ref?: string;
        externalReferMapping?: {
            [key: string]: string;
        };
    }
    const indentStyleTypeMember: readonly ["allman", "egyptian"];
    type IndentStyleType = typeof indentStyleTypeMember[number];
    type ValidatorOptionType = "none" | "simple" | "full";
    interface AlphaElement extends CommonProperties {
        type: string;
    }
    interface AlphaDefinition extends AlphaElement, CommentProperty {
        export?: boolean;
    }
    interface ImportDefinition {
        import: string;
        from: string;
    }
    type Definition = CodeDefinition | NamespaceDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition | DictionaryDefinition;
    type DefinitionMap = {
        [key: string]: Definition;
    };
    interface CodeDefinition extends AlphaDefinition {
        type: "code";
        tokens: string[];
    }
    interface NamespaceDefinition extends AlphaDefinition {
        type: "namespace";
        members: DefinitionMap;
    }
    interface ValueDefinition extends AlphaDefinition {
        type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    interface TypeDefinition extends AlphaDefinition {
        type: "type";
        define: TypeOrRefer;
        validator?: boolean;
    }
    interface InterfaceDefinition extends AlphaDefinition {
        type: "interface";
        extends?: ReferElement[];
        members: {
            [key: string]: TypeOrRefer;
        };
        additionalProperties?: boolean;
    }
    interface DictionaryDefinition extends AlphaDefinition {
        type: "dictionary";
        keyin?: TypeOrRefer;
        optionality?: "as-is" | "partial" | "required";
        valueType: TypeOrRefer;
        additionalProperties?: boolean;
    }
    interface ArrayElement extends AlphaElement {
        type: "array";
        items: TypeOrRefer;
        minItems?: number;
        maxItems?: number;
        uniqueItems?: boolean;
    }
    interface OrElement extends AlphaElement {
        type: "or";
        types: TypeOrRefer[];
    }
    interface AndElement extends AlphaElement {
        type: "and";
        types: TypeOrRefer[];
    }
    interface LiteralElement extends CommonProperties {
        const: Jsonable.Jsonable;
    }
    interface ReferElement extends CommonProperties {
        $ref: string;
    }
    interface NeverType extends CommonProperties {
        type: "never";
    }
    interface AnyType extends CommonProperties {
        type: "any";
    }
    interface UnknownType extends CommonProperties {
        type: "unknown";
    }
    interface NullType extends CommonProperties {
        type: "null";
    }
    interface BooleanType extends CommonProperties {
        type: "boolean";
        default?: boolean;
    }
    interface IntegerType extends CommonProperties {
        type: "integer";
        minimum?: number;
        exclusiveMinimum?: number;
        maximum?: number;
        exclusiveMaximum?: number;
        multipleOf?: number;
        safeInteger?: boolean;
        default?: number;
    }
    interface NumberType extends CommonProperties {
        type: "number";
        minimum?: number;
        exclusiveMinimum?: number;
        maximum?: number;
        exclusiveMaximum?: number;
        multipleOf?: number;
        safeNumber?: boolean;
        default?: number;
    }
    interface BasicStringType extends CommonProperties {
        type: "string";
        minLength?: number;
        maxLength?: number;
        default?: string;
    }
    interface PatternStringType extends BasicStringType {
        pattern: string;
        tsPattern?: string[];
        regexpFlags?: string;
    }
    interface FormatStringType extends BasicStringType {
        format: keyof typeof StringFormatMap;
        regexpFlags?: string;
    }
    type StringType = BasicStringType | PatternStringType | FormatStringType;
    type PrimitiveTypeElement = NeverType | AnyType | UnknownType | NullType | BooleanType | NumberType | IntegerType | StringType;
    type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | KeyofElement | ItemofElement | MemberofElement | InterfaceDefinition | DictionaryDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    interface EnumTypeElement extends CommonProperties {
        type: "enum-type";
        members: (null | boolean | number | string)[];
    }
    interface TypeofElement extends CommonProperties {
        type: "typeof";
        value: ReferElement;
    }
    interface KeyofElement extends CommonProperties {
        type: "keyof";
        value: TypeofElement | ReferElement;
    }
    interface ItemofElement extends CommonProperties {
        type: "itemof";
        value: ReferElement;
    }
    interface MemberofElement extends CommonProperties {
        type: "memberof";
        value: ReferElement;
        key: string | number;
    }
    type TypeOrRefer = Type | ReferElement;
    type TypeOrValue = Type | ValueDefinition;
    type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    type TypeOrLiteralOfRefer = TypeOrRefer | LiteralElement;
    const StringFormatMap: {
        readonly "date-time": {
            readonly pattern: "^date-time$";
        };
        readonly date: {
            readonly pattern: "^date$";
        };
        readonly time: {
            readonly pattern: "^time$";
        };
        readonly duration: {
            readonly pattern: "^duration$";
        };
        readonly email: {
            readonly pattern: "^email$";
        };
        readonly "idn-email": {
            readonly pattern: "^idn-email$";
        };
        readonly hostname: {
            readonly pattern: "^hostname$";
        };
        readonly "idn-hostname": {
            readonly pattern: "^idn-hostname$";
        };
        readonly ipv4: {
            readonly pattern: "^ipv4$";
        };
        readonly ipv6: {
            readonly pattern: "^ipv6$";
        };
        readonly uuid: {
            readonly pattern: "^uuid$";
        };
        readonly uri: {
            readonly pattern: "^uri$";
        };
        readonly "uri-reference": {
            readonly pattern: "^uri-reference$";
        };
        readonly iri: {
            readonly pattern: "^iri$";
        };
        readonly "iri-reference": {
            readonly pattern: "^iri-reference$";
        };
        readonly "uri-template": {
            readonly pattern: "^uri-template$";
        };
        readonly "json-pointer": {
            readonly pattern: "^json-pointer$";
        };
        readonly "relative-json-pointer": {
            readonly pattern: "^relative-json-pointer$";
        };
        readonly regex: {
            readonly pattern: "^regex$";
        };
    };
    interface StringFormatEntry {
        pattern?: string;
        tsPattern?: string[];
        regexpFlags?: string;
    }
    const isSchema: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/generated/schema/type.json#";
    const isCommentProperty: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CommentProperty;
    const isCommonProperties: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is CommonProperties;
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
    const isNeverType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is NeverType;
    const isAnyType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is AnyType;
    const isUnknownType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is UnknownType;
    const isNullType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is NullType;
    const isBooleanType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is BooleanType;
    const isIntegerType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is IntegerType;
    const isNumberType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is NumberType;
    const isBasicStringType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is BasicStringType;
    const isPatternStringType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is PatternStringType;
    const isFormatStringType: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is FormatStringType;
    const isStringType: EvilType.Validator.IsType<StringType>;
    const isPrimitiveTypeElement: EvilType.Validator.IsType<PrimitiveTypeElement>;
    const isType: EvilType.Validator.IsType<Type>;
    const isEnumTypeElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is EnumTypeElement;
    const isTypeofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is TypeofElement;
    const isKeyofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is KeyofElement;
    const isItemofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is ItemofElement;
    const isMemberofElement: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is MemberofElement;
    const isTypeOrRefer: EvilType.Validator.IsType<TypeOrRefer>;
    const isTypeOrValue: EvilType.Validator.IsType<TypeOrValue>;
    const isTypeOrValueOfRefer: EvilType.Validator.IsType<TypeOrValueOfRefer>;
    const isTypeOrLiteralOfRefer: EvilType.Validator.IsType<TypeOrLiteralOfRefer>;
    const isStringFormatEntry: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is StringFormatEntry;
    const commentPropertyValidatorObject: EvilType.Validator.ObjectValidator<CommentProperty>;
    const commonPropertiesValidatorObject: EvilType.Validator.ObjectValidator<CommonProperties>;
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
    const neverTypeValidatorObject: EvilType.Validator.ObjectValidator<NeverType>;
    const anyTypeValidatorObject: EvilType.Validator.ObjectValidator<AnyType>;
    const unknownTypeValidatorObject: EvilType.Validator.ObjectValidator<UnknownType>;
    const nullTypeValidatorObject: EvilType.Validator.ObjectValidator<NullType>;
    const booleanTypeValidatorObject: EvilType.Validator.ObjectValidator<BooleanType>;
    const integerTypeValidatorObject: EvilType.Validator.ObjectValidator<IntegerType>;
    const numberTypeValidatorObject: EvilType.Validator.ObjectValidator<NumberType>;
    const basicStringTypeValidatorObject: EvilType.Validator.ObjectValidator<BasicStringType>;
    const patternStringTypeValidatorObject: EvilType.Validator.ObjectValidator<PatternStringType>;
    const formatStringTypeValidatorObject: EvilType.Validator.ObjectValidator<FormatStringType>;
    const enumTypeElementValidatorObject: EvilType.Validator.ObjectValidator<EnumTypeElement>;
    const typeofElementValidatorObject: EvilType.Validator.ObjectValidator<TypeofElement>;
    const keyofElementValidatorObject: EvilType.Validator.ObjectValidator<KeyofElement>;
    const itemofElementValidatorObject: EvilType.Validator.ObjectValidator<ItemofElement>;
    const memberofElementValidatorObject: EvilType.Validator.ObjectValidator<MemberofElement>;
    const stringFormatEntryValidatorObject: EvilType.Validator.ObjectValidator<StringFormatEntry>;
}
