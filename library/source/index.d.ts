import { Jsonable } from "./jsonable";
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
    const buildExtends: (define: Types.InterfaceDefinition) => CodeExpression[];
    namespace Define {
        const buildDefineLine: (declarator: string, name: string, define: Types.TypeOrValue, postEpressions?: CodeExpression[]) => CodeLine;
        const buildInlineDefineLiteral: (define: Types.LiteralElement) => CodeExpression[];
        const buildInlineDefinePrimitiveType: (value: Types.PrimitiveTypeElement) => CodeExpression;
        const buildDefinePrimitiveType: (name: string, value: Types.PrimitiveTypeElement) => CodeLine;
        const enParenthesis: <T extends CodeInlineEntry>(expressions: T[]) => (CodeExpression | T)[];
        const isNeedParenthesis: (expressions: (CodeExpression | CodeInlineBlock)[]) => boolean;
        const enParenthesisIfNeed: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineEnum: (value: Types.EnumTypeElement) => CodeExpression[];
        const buildInlineDefineArray: (value: Types.ArrayElement) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineDictionary: (value: Types.DictionaryElement) => CodeInlineBlock;
        const buildInlineDefineAnd: (value: Types.AndElement) => CodeExpression[];
        const buildInlineDefineOr: (value: Types.OrElement) => CodeExpression[];
        const buildDefineInlineInterface: (value: Types.InterfaceDefinition) => CodeInlineBlock;
        const buildDefineInterface: (name: string, value: Types.InterfaceDefinition) => CodeBlock;
        const buildDefineModuleCore: (members: {
            [key: string]: Types.Definition;
        }) => CodeEntry[];
        const buildDefineModule: (name: string, value: Types.ModuleDefinition) => CodeBlock;
        const buildDefine: (name: string, define: Types.Definition) => CodeEntry;
        const buildInlineDefine: (define: Types.TypeOrValueOfRefer) => (CodeExpression | CodeInlineBlock)[];
    }
    namespace Validator {
        const buildLiterarlValidatorExpression: (name: string, value: Jsonable.Jsonable) => CodeExpression[];
        const buildInlineLiteralValidator: (define: Types.LiteralElement) => CodeExpression;
        const buildValidatorLine: (declarator: string, name: string, define: Types.Type) => CodeExpression[];
        const buildValidatorName: (name: string) => string;
        const buildValidatorExpression: (name: string, define: Types.TypeOrValueOfRefer) => CodeInlineEntry[];
        const buildInterfaceValidator: (name: string, define: Types.InterfaceDefinition) => CodeExpression[];
        const buildInlineValidator: (name: string, define: Types.TypeOrValue) => CodeInlineEntry[];
        const isValidatorTarget: (define: Types.TypeOrValue) => boolean;
        const buildValidator: (name: string, define: Types.TypeOrValue) => CodeLine;
    }
}
export declare namespace Format {
    const getMaxLineLength: (options: Types.OutputOptions) => null | number;
    const buildIndent: (options: Types.OutputOptions, indentDepth: number) => string;
    const getReturnCode: (_options: Types.OutputOptions) => string;
    const expressions: (code: CodeExpression[]) => string;
    const getTokens: (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock) => string[];
    const line: (options: Types.OutputOptions, indentDepth: number, code: CodeLine) => string;
    const inlineBlock: (options: Types.OutputOptions, indentDepth: number, code: CodeInlineBlock) => string;
    const block: (options: Types.OutputOptions, indentDepth: number, code: CodeBlock) => string;
    const text: (options: Types.OutputOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]) => string;
}
export {};
