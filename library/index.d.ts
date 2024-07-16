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
export declare const $expression: (expression: CodeExpression["expression"]) => CodeExpression;
export declare const $line: (expressions: CodeLine["expressions"]) => CodeLine;
export declare const $iblock: (lines: CodeInlineBlock["lines"]) => CodeInlineBlock;
export declare const $block: (header: CodeBlock["header"], lines: CodeBlock["lines"]) => CodeBlock;
export declare namespace Build {
    const buildExport: (define: {
        export?: boolean;
    } | {}) => CodeExpression[];
    namespace Define {
        const buildDefineLine: (declarator: string, name: string, define: Types.ValueOrType) => CodeLine;
        const buildInlineDefineLiteral: (define: Types.LiteralElement) => CodeExpression[];
        const buildDefineValue: (name: string, value: Types.ValueDefinition) => CodeLine;
        const buildInlineDefinePrimitiveType: (value: Types.PrimitiveTypeElement) => CodeExpression;
        const buildDefinePrimitiveType: (name: string, value: Types.PrimitiveTypeElement) => CodeLine;
        const enParenthesis: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => (CodeExpression | T[number])[];
        const isNeedParenthesis: (expressions: (CodeExpression | CodeInlineBlock)[]) => boolean;
        const enParenthesisIfNeed: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => T | (CodeExpression | T[number])[];
        const buildInlineDefineArray: (value: Types.ArrayElement) => CodeExpression[];
        const buildInlineDefineAnd: (value: Types.AndElement) => CodeExpression[];
        const buildInlineDefineOr: (value: Types.OrElement) => CodeExpression[];
        const buildDefineInlineInterface: (value: Types.InterfaceDefinition) => CodeInlineBlock;
        const buildDefineInterface: (name: string, value: Types.InterfaceDefinition) => CodeBlock;
        const buildDefineModuleCore: (value: Types.ModuleDefinition) => CodeEntry[];
        const buildDefineModule: (name: string, value: Types.ModuleDefinition) => CodeBlock;
        const buildDefine: (name: string, define: Types.Definition) => CodeEntry;
        const buildInlineDefine: (define: Types.ValueOrTypeOfRefer) => (CodeExpression | CodeInlineBlock)[];
    }
    namespace Validator {
        const buildLiterarlValidatorExpression: (name: string, value: Types.Jsonable) => CodeExpression[];
        const buildInlineLiteralValidator: (define: Types.LiteralElement) => CodeExpression;
        const buildValidatorLine: (declarator: string, name: string, define: Types.Type) => CodeExpression[];
        const buildValidatorName: (name: string) => string;
        const buildValidatorExpression: (name: string, define: Types.ValueOrTypeOfRefer) => CodeInlineEntry[];
        const buildInterfaceValidator: (name: string, define: Types.InterfaceDefinition) => CodeExpression[];
        const buildInlineValidator: (name: string, define: Types.Type) => CodeInlineEntry[];
        const buildValidator: (name: string, define: Types.Type) => CodeLine;
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
