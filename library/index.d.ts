declare module "types" {
    export namespace Types {
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
        type ValidatorOptionType = "none" | "simple" | "full";
        interface TypeOptions {
            indentUnit: number | "\t";
            indentStyle: "allman" | "egyptian";
            ValidatorOption: ValidatorOptionType;
        }
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
}
declare module "text" {
    export namespace Text {
        const getNameSpace: (name: string) => string;
        const getNameBody: (name: string) => string;
        const toUpperCamelCase: (name: string) => string;
    }
}
declare module "index" {
    import { Types } from "types";
    interface Code {
        $code: (CodeExpression | CodeLine | CodeInlineBlock | CodeBlock)["$code"];
    }
    interface CodeExpression extends Code {
        $code: "expression";
        expression: string;
    }
    export const convertToExpression: (code: CodeInlineEntry[]) => CodeExpression[];
    interface CodeLine extends Code {
        $code: "line";
        expressions: (CodeInlineEntry | CodeInlineEntry | CodeInlineBlock)[];
    }
    type CodeInlineEntry = CodeExpression | CodeLine | CodeInlineBlock;
    interface CodeInlineBlock extends Code {
        $code: "inline-block";
        lines: CodeInlineEntry[];
    }
    interface CodeBlock extends Code {
        $code: "block";
        header: CodeExpression[];
        lines: CodeEntry[];
    }
    type CodeEntry = CodeInlineBlock | CodeLine | CodeBlock;
    interface Builder {
        declarator: CodeExpression;
        define: CodeInlineEntry | CodeInlineEntry[] | CodeEntry[];
        validator?: (name: string) => CodeInlineEntry[];
    }
    export const $expression: (expression: CodeExpression["expression"]) => CodeExpression;
    export const $line: (expressions: CodeLine["expressions"]) => CodeLine;
    export const $iblock: (lines: CodeInlineBlock["lines"]) => CodeInlineBlock;
    export const $block: (header: CodeBlock["header"], lines: CodeBlock["lines"]) => CodeBlock;
    export namespace Build {
        const buildExport: (define: {
            export?: boolean;
        } | {}) => CodeExpression[];
        const makeValueBuilder: (define: Types.ValueDefine) => Builder;
        const makePrimitiveTypeBuilder: (define: Types.PrimitiveTypeDefine) => Builder;
        const makeTypeBuilder: (define: Types.TypeDefine) => Builder;
        const makeArrayTypeBuilder: (define: Types.ArrayDefine) => Builder;
        const makeAndTypeBuilder: (define: Types.AndDefine) => Builder;
        const makeOrTypeBuilder: (define: Types.OrDefine) => Builder;
        const makeInterfaceBuilder: (define: Types.InterfaceDefine) => Builder;
        const makeModuleBuilder: (define: Types.ModuleDefine) => Builder;
        const getBuilder: (define: Types.Define) => Builder;
        const getValidator: (define: Exclude<Types.Define, Types.ModuleDefine>) => (name: string) => CodeInlineEntry[];
        namespace Define {
            const buildDefineLine: (declarator: string, name: string, define: Types.ValueOrTypeOfInterface) => CodeLine;
            const buildInlineDefineValue: (value: Types.ValueDefine) => CodeExpression;
            const buildDefineValue: (name: string, value: Types.ValueDefine) => CodeLine;
            const buildInlineDefinePrimitiveType: (value: Types.PrimitiveTypeDefine) => CodeExpression;
            const buildDefinePrimitiveType: (name: string, value: Types.PrimitiveTypeDefine) => CodeLine;
            const enParenthesis: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => (CodeExpression | T[number])[];
            const isNeedParenthesis: (expressions: (CodeExpression | CodeInlineBlock)[]) => boolean;
            const enParenthesisIfNeed: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => T | (CodeExpression | T[number])[];
            const buildInlineDefineArray: (value: Types.ArrayDefine) => CodeExpression[];
            const buildInlineDefineAnd: (value: Types.AndDefine) => CodeExpression[];
            const buildInlineDefineOr: (value: Types.OrDefine) => CodeExpression[];
            const buildDefineInlineInterface: (value: Types.InterfaceDefine) => CodeInlineBlock;
            const buildDefineInterface: (name: string, value: Types.InterfaceDefine) => CodeBlock;
            const buildDefineModuleCore: (value: Types.ModuleDefine) => CodeEntry[];
            const buildDefineModule: (name: string, value: Types.ModuleDefine) => CodeBlock;
            const buildDefine: (name: string, define: Types.Define) => CodeEntry;
            const buildInlineDefine: (define: Types.ValueOrTypeOfInterfaceOrRefer) => (CodeExpression | CodeInlineBlock)[];
        }
        namespace Validator {
            const buildValueValidatorExpression: (name: string, value: Types.Jsonable) => CodeExpression[];
            const buildInlineValueValidator: (define: Types.ValueDefine) => CodeExpression;
            const buildValidatorLine: (declarator: string, name: string, define: Types.TypeOrInterface) => CodeExpression[];
            const buildValidatorName: (name: string) => string;
            const buildValidatorExpression: (name: string, define: Exclude<Types.DefineOrRefer, Types.ModuleDefine>) => CodeInlineEntry[];
            const buildInterfaceValidator: (name: string, define: Types.InterfaceDefine) => CodeExpression[];
            const buildInlineValidator: (name: string, define: Types.TypeOrInterface) => CodeInlineEntry[];
            const buildValidator: (name: string, define: Types.TypeOrInterface) => CodeLine;
        }
    }
    export namespace Format {
        const buildIndent: (options: Types.TypeOptions, indentDepth: number) => string;
        const getReturnCode: (_options: Types.TypeOptions) => string;
        const expressions: (code: CodeExpression[]) => string;
        const tokens: (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock) => string[];
        const line: (options: Types.TypeOptions, indentDepth: number, code: CodeLine) => string;
        const inlineBlock: (options: Types.TypeOptions, indentDepth: number, code: CodeInlineBlock) => string;
        const block: (options: Types.TypeOptions, indentDepth: number, code: CodeBlock) => string;
        const text: (options: Types.TypeOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]) => string;
    }
}
