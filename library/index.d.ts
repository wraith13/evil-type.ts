import { Types } from "./types";
interface Code {
    $code: (CodeExpression | CodeLine | CodeInlineBlock | CodeBlock)["$code"];
}
interface CodeExpression extends Code {
    $code: "expression";
    expression: string;
}
export declare const convertToExpression: (code: CodeInlineEntry[]) => CodeExpression[];
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
export declare const $expression: (expression: CodeExpression["expression"]) => CodeExpression;
export declare const $line: (expressions: CodeLine["expressions"]) => CodeLine;
export declare const $iblock: (lines: CodeInlineBlock["lines"]) => CodeInlineBlock;
export declare const $block: (header: CodeBlock["header"], lines: CodeBlock["lines"]) => CodeBlock;
export declare namespace Build {
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
export declare namespace Format {
    const buildIndent: (options: Types.TypeOptions, indentDepth: number) => string;
    const getReturnCode: (_options: Types.TypeOptions) => string;
    const expressions: (code: CodeExpression[]) => string;
    const tokens: (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock) => string[];
    const line: (options: Types.TypeOptions, indentDepth: number, code: CodeLine) => string;
    const inlineBlock: (options: Types.TypeOptions, indentDepth: number, code: CodeInlineBlock) => string;
    const block: (options: Types.TypeOptions, indentDepth: number, code: CodeBlock) => string;
    const text: (options: Types.TypeOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]) => string;
}
export {};
