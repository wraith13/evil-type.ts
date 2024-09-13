import { Jsonable } from "./jsonable";
import { TypesError } from "./types-error";
import { TypesPrime } from "./types-prime";
export module Types
{
    export const schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#" as const;
    export const ValidatorOptionTypeMembers = [ "none", "simple", "full", ] as const;
    export type ValidatorOptionType = typeof ValidatorOptionTypeMembers[number];
    export const isValidatorOptionType = TypesPrime.isEnum(ValidatorOptionTypeMembers);
    export const IndentStyleMembers = [ "allman", "egyptian", ] as const;
    export type IndentStyleType = typeof IndentStyleMembers[number];
    export const isIndentStyleType = TypesPrime.isEnum(IndentStyleMembers);
    export interface OutputOptions
    {
        outputFile?: string,
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
        maxLineLength?: null | number;
    }
    export const isOutputOptions = TypesPrime.isSpecificObject<OutputOptions>
    ({
        "outputFile": TypesPrime.isOptional(TypesPrime.isString),
        "indentUnit": TypesPrime.isOr(TypesPrime.isNumber, TypesPrime.isJust("\t" as const)),
        "indentStyle": isIndentStyleType,
        "validatorOption": isValidatorOptionType,
        "maxLineLength": TypesPrime.isOptional(TypesPrime.isOr(TypesPrime.isNull, TypesPrime.isNumber)),
    });
    export interface CommentProperty
    {
        comment?: string[];
    }
    export const getCommentPropertyValidator = () :TypesPrime.ObjectValidator<CommentProperty> =>
    ({
        comment: TypesPrime.isOptional(TypesPrime.isArray(TypesPrime.isString)),
    });
    export const isCommentProperty = (value: unknown, listner?: TypesError.Listener): value is CommentProperty =>
        TypesPrime.isSpecificObject(getCommentPropertyValidator())(value, listner);
    export interface TypeSchema extends CommentProperty
    {
        $ref: typeof schema;
        imports?: ImportDefinition[];
        defines: { [key: string]: Definition; };
        options: OutputOptions;
    }
    export const getTypeSchemaValidator = () :TypesPrime.ObjectValidator<TypeSchema> => Object.assign
    (
        getCommentPropertyValidator(),
        {
            $ref: TypesPrime.isJust(schema),
            imports: TypesPrime.isOptional(TypesPrime.isArray(isImportDefinition)),
            defines: TypesPrime.isDictionaryObject(isDefinition),
            options: isOutputOptions,
        }
    );
    export const isTypeSchema = (value: unknown, listner?: TypesError.Listener): value is TypeSchema =>
        TypesPrime.isSpecificObject(getTypeSchemaValidator())(value, listner);
    export type FilePath = string;
    export interface ReferElement
    {
        $ref: string;
    }
    export const isReferElement = TypesPrime.isSpecificObject<ReferElement>
    ({
        "$ref": TypesPrime.isString,
    });
    export interface AlphaElement
    {
        $type: string;
    }
    export interface AlphaDefinition extends AlphaElement, CommentProperty
    {
        export?: boolean;
    }
    export interface ImportDefinition
    {
        $type: "import";
        target: string;
        from: string;
    }
    export const isImportDefinition = (value: unknown, listner?: TypesError.Listener): value is ImportDefinition => TypesPrime.isSpecificObject<ImportDefinition>
    ({
        $type: TypesPrime.isJust("import"),
        target: TypesPrime.isString,
        from: TypesPrime.isString,
    })
    (value, listner);
    export interface ModuleDefinition extends AlphaDefinition
    {
        $type: "module";
        members: { [key: string]: Definition; };
    }
    export const isModuleDefinition = (value: unknown, listner?: TypesError.Listener): value is ModuleDefinition => TypesPrime.isSpecificObject<ModuleDefinition>
    ({
        comment: TypesPrime.isOptional(TypesPrime.isArray(TypesPrime.isString)),
        export: TypesPrime.isOptional(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("module"),
        members: TypesPrime.isDictionaryObject(isDefinition),
    })
    (value, listner);
    export const PrimitiveTypeEnumMembers = ["null", "boolean", "number", "string"] as const;
    export type PrimitiveTypeEnum = typeof PrimitiveTypeEnumMembers[number];
    export const isPrimitiveTypeEnum = TypesPrime.isEnum(PrimitiveTypeEnumMembers);
    export interface PrimitiveTypeElement extends AlphaElement
    {
        $type: "primitive-type";
        type: PrimitiveTypeEnum;
    }
    export const isPrimitiveTypeElement = (value: unknown, listner?: TypesError.Listener): value is PrimitiveTypeElement => TypesPrime.isSpecificObject<PrimitiveTypeElement>
    ({
        $type: TypesPrime.isJust("primitive-type"),
        type: isPrimitiveTypeEnum,
    })
    (value, listner);
    export interface LiteralElement extends AlphaElement
    {
        $type: "literal";
        literal: Jsonable.Jsonable;
    }
    export const isLiteralElement = (value: unknown, listner?: TypesError.Listener): value is LiteralElement => TypesPrime.isSpecificObject<LiteralElement>
    ({
        $type: TypesPrime.isJust("literal"),
        literal: TypesPrime.isJsonable,
    })
    (value, listner);
    export interface ValueDefinition extends AlphaDefinition
    {
        $type: "value";
        value: LiteralElement | ReferElement;
        validator?: boolean;
    }
    export const isValueDefinition = (value: unknown, listner?: TypesError.Listener): value is ValueDefinition => TypesPrime.isSpecificObject<ValueDefinition>
    ({
        comment: TypesPrime.isOptional(TypesPrime.isArray(TypesPrime.isString)),
        export: TypesPrime.isOptional(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("value"),
        value: TypesPrime.isOr(isLiteralElement, isReferElement),
        validator: TypesPrime.isOptional(TypesPrime.isBoolean),
    })
    (value, listner);
    export interface TypeofElement extends AlphaElement
    {
        $type: "typeof";
        value: ReferElement;
    }
    export const isTypeofElement = (value: unknown, listner?: TypesError.Listener): value is TypeofElement => TypesPrime.isSpecificObject<TypeofElement>
    ({
        $type: TypesPrime.isJust("typeof"),
        value: isReferElement,
    })(value, listner);
    export interface ItemofElement extends AlphaElement
    {
        $type: "itemof";
        value: ReferElement;
    }
    export const isItemofElement = (value: unknown, listner?: TypesError.Listener): value is ItemofElement => TypesPrime.isSpecificObject<ItemofElement>
    ({
        $type: TypesPrime.isJust("itemof"),
        value: isReferElement,
    })(value, listner);
    export interface TypeDefinition extends AlphaDefinition
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export const isTypeDefinition = (value: unknown, listner?: TypesError.Listener): value is TypeDefinition => TypesPrime.isSpecificObject<TypeDefinition>
    ({
        comment: TypesPrime.isOptional(TypesPrime.isArray(TypesPrime.isString)),
        export: TypesPrime.isOptional(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("type"),
        define: isTypeOrRefer,
    })
    (value, listner);
    export interface EnumTypeElement extends AlphaElement
    {
        $type: "enum-type";
        members: (null | boolean | number | string)[];
    }
    export const isEnumTypeElement = (value: unknown, listner?: TypesError.Listener): value is EnumTypeElement => TypesPrime.isSpecificObject<EnumTypeElement>
    ({
        $type: TypesPrime.isJust("enum-type"),
        members: TypesPrime.isArray(TypesPrime.isOr(TypesPrime.isNumber, TypesPrime.isString)),
    })
    (value, listner);
    export interface InterfaceDefinition extends AlphaDefinition
    {
        $type: "interface";
        extends?: ReferElement[];
        members: { [key: string]: TypeOrInterfaceOrRefer; } | DictionaryElement;
    }
    export const isInterfaceDefinition = (value: unknown, listner?: TypesError.Listener): value is InterfaceDefinition => TypesPrime.isSpecificObject<InterfaceDefinition>
    ({
        comment: TypesPrime.isOptional(TypesPrime.isArray(TypesPrime.isString)),
        export: TypesPrime.isOptional(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("interface"),
        extends: TypesPrime.isOptional(TypesPrime.isArray(isReferElement)),
        members: TypesPrime.isOr(TypesPrime.isDictionaryObject(isTypeOrRefer), isDictionaryElement),
    })
    (value, listner);
    export interface DictionaryElement extends AlphaElement
    {
        $type: "dictionary";
        valueType: TypeOrInterfaceOrRefer;
    }
    export const isDictionaryElement = (value: unknown, listner?: TypesError.Listener): value is DictionaryElement => TypesPrime.isSpecificObject<DictionaryElement>
    ({
        $type: TypesPrime.isJust("dictionary"),
        valueType: isTypeOrRefer,
    })
    (value, listner);
    export interface ArrayElement extends AlphaElement
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export const isArrayElement = (value: unknown, listner?: TypesError.Listener): value is ArrayElement => TypesPrime.isSpecificObject<ArrayElement>
    ({
        $type: TypesPrime.isJust("array"),
        items: isTypeOrRefer,
    })
    (value, listner);
    export interface OrElement extends AlphaElement
    {
        $type: "or";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isOrElement = (value: unknown, listner?: TypesError.Listener): value is OrElement => TypesPrime.isSpecificObject<OrElement>
    ({
        $type: TypesPrime.isJust("or"),
        types: TypesPrime.isArray(isTypeOrRefer),
    })
    (value, listner);
    export interface AndElement extends AlphaElement
    {
        $type: "and";
        types: TypeOrInterfaceOrRefer[];
    }
    export const isAndElement = (value: unknown, listner?: TypesError.Listener): value is AndElement => TypesPrime.isSpecificObject<AndElement>
    ({
        $type: TypesPrime.isJust("and"),
        types: TypesPrime.isArray(isTypeOrRefer),
    })
    (value, listner);
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | DictionaryElement | ArrayElement | OrElement | AndElement | LiteralElement;
    export const isType = TypesPrime.isOr(isPrimitiveTypeElement, isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition, isDictionaryElement, isArrayElement, isOrElement, isAndElement, isLiteralElement);
    export type TypeOrValue = Type | ValueDefinition;
    export const isTypeOrValue = TypesPrime.isOr(isType, isValueDefinition);
    export type TypeOrValueOfRefer = TypeOrValue | ReferElement;
    export type TypeOrInterfaceOrRefer = Type | ReferElement;
    export const isTypeOrRefer = TypesPrime.isOr(isType, isReferElement);
    export type Definition = ModuleDefinition | ValueDefinition | TypeDefinition | InterfaceDefinition;
    export const isDefinition = TypesPrime.isOr(isModuleDefinition, isValueDefinition, isTypeDefinition, isInterfaceDefinition);
    export type DefineOrRefer = Definition | ReferElement;
    export const isDefineOrRefer = TypesPrime.isOr(isDefinition, isReferElement);
}
