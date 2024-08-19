import { Jsonable } from "./jsonable";
import { TypeError } from "./typeerror";
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
    export interface TypeOptions
    {
        indentUnit: number | "\t";
        indentStyle: IndentStyleType;
        validatorOption: ValidatorOptionType;
    }
    export const isTypeOptions = TypesPrime.isSpecificObject<TypeOptions>
    ({
        "indentUnit": TypesPrime.isOr(TypesPrime.isNumber, TypesPrime.isJust("\t" as const)),
        "indentStyle": isIndentStyleType,
        "validatorOption": isValidatorOptionType,
    });
    export interface TypeSchema
    {
        $ref: typeof schema;
        defines: { [key: string]: Definition; };
        options: TypeOptions;
    }
    export const isTypeSchema = (value: unknown, listner?: TypeError.Listener): value is TypeSchema =>
        TypesPrime.isSpecificObject<TypeSchema>
        ({
            "$ref": TypesPrime.isJust(schema),
            "defines": TypesPrime.isDictionaryObject(isDefinition),
            "options": isTypeOptions
        })
        (value, listner);
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
    export interface AlphaDefinition extends AlphaElement
    {
        export?: boolean;
    }
    export interface ModuleDefinition extends AlphaDefinition
    {
        $type: "module";
        members: { [key: string]: Definition; };
    }
    export const isModuleDefinition = (value: unknown, listner?: TypeError.Listener): value is ModuleDefinition => TypesPrime.isSpecificObject<ModuleDefinition>
    ({
        export: TypesPrime.makeOptionalKeyTypeGuard(TypesPrime.isBoolean),
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
    export const isPrimitiveTypeElement = (value: unknown, listner?: TypeError.Listener): value is PrimitiveTypeElement => TypesPrime.isSpecificObject<PrimitiveTypeElement>
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
    export const isLiteralElement = (value: unknown, listner?: TypeError.Listener): value is LiteralElement => TypesPrime.isSpecificObject<LiteralElement>
    ({
        $type: TypesPrime.isJust("literal"),
        literal: TypesPrime.isJsonable,
    })
    (value, listner);
    export interface ValueDefinition extends AlphaDefinition
    {
        $type: "value";
        value: LiteralElement | ReferElement;
    }
    export const isValueDefinition = (value: unknown, listner?: TypeError.Listener): value is ValueDefinition => TypesPrime.isSpecificObject<ValueDefinition>
    ({
        export: TypesPrime.makeOptionalKeyTypeGuard(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("value"),
        value: TypesPrime.isOr(isLiteralElement, isReferElement),
    })
    (value, listner);
    export interface TypeofElement extends AlphaElement
    {
        $type: "typeof";
        value: ReferElement;
    }
    export const isTypeofElement = (value: unknown, listner?: TypeError.Listener): value is TypeofElement => TypesPrime.isSpecificObject<TypeofElement>
    ({
        $type: TypesPrime.isJust("typeof"),
        value: isReferElement,
    })(value, listner);
    export interface ItemofElement extends AlphaElement
    {
        $type: "itemof";
        value: ReferElement;
    }
    export const isItemofElement = (value: unknown, listner?: TypeError.Listener): value is ItemofElement => TypesPrime.isSpecificObject<ItemofElement>
    ({
        $type: TypesPrime.isJust("itemof"),
        value: isReferElement,
    })(value, listner);
    export interface TypeDefinition extends AlphaDefinition
    {
        $type: "type";
        define: TypeOrInterfaceOrRefer;
    }
    export const isTypeDefinition = (value: unknown, listner?: TypeError.Listener): value is TypeDefinition => TypesPrime.isSpecificObject<TypeDefinition>
    ({
        export: TypesPrime.makeOptionalKeyTypeGuard(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("type"),
        define: isTypeOrRefer,
    })
    (value, listner);
    export interface EnumTypeElement extends AlphaElement
    {
        $type: "enum-type";
        members: (number | string)[];
    }
    export const isEnumTypeElement = (value: unknown, listner?: TypeError.Listener): value is EnumTypeElement => TypesPrime.isSpecificObject<EnumTypeElement>
    ({
        $type: TypesPrime.isJust("enum-type"),
        members: TypesPrime.isArray(TypesPrime.isOr(TypesPrime.isNumber, TypesPrime.isString)),
    })
    (value, listner);
    export interface InterfaceDefinition extends AlphaDefinition
    {
        $type: "interface";
        members: { [key: string]: TypeOrInterfaceOrRefer; };
    }
    export const isInterfaceDefinition = (value: unknown, listner?: TypeError.Listener): value is InterfaceDefinition => TypesPrime.isSpecificObject<InterfaceDefinition>
    ({
        export: TypesPrime.makeOptionalKeyTypeGuard(TypesPrime.isBoolean),
        $type: TypesPrime.isJust("interface"),
        members: TypesPrime.isDictionaryObject(isTypeOrRefer),
    })
    (value, listner);
    export interface DictionaryElement extends AlphaElement
    {
        $type: "dictionary";
        members: TypeOrInterfaceOrRefer;
    }
    export const isDictionaryElement = (value: unknown, listner?: TypeError.Listener): value is DictionaryElement => TypesPrime.isSpecificObject<DictionaryElement>
    ({
        $type: TypesPrime.isJust("dictionary"),
        members: isTypeOrRefer,
    })
    (value, listner);
    export interface ArrayElement extends AlphaElement
    {
        $type: "array";
        items: TypeOrInterfaceOrRefer;
    }
    export const isArrayElement = (value: unknown, listner?: TypeError.Listener): value is ArrayElement => TypesPrime.isSpecificObject<ArrayElement>
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
    export const isOrElement = (value: unknown, listner?: TypeError.Listener): value is OrElement => TypesPrime.isSpecificObject<OrElement>
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
    export const isAndElement = (value: unknown, listner?: TypeError.Listener): value is AndElement => TypesPrime.isSpecificObject<AndElement>
    ({
        $type: TypesPrime.isJust("and"),
        types: TypesPrime.isArray(isTypeOrRefer),
    })
    (value, listner);
    export type Type = PrimitiveTypeElement | TypeDefinition | EnumTypeElement | TypeofElement | ItemofElement | InterfaceDefinition | ArrayElement | OrElement | AndElement | LiteralElement;
    export const isType = TypesPrime.isOr(isPrimitiveTypeElement, isTypeDefinition, isEnumTypeElement, isTypeofElement, isItemofElement, isInterfaceDefinition, isArrayElement, isOrElement, isAndElement, isLiteralElement);
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
