import { Jsonable } from "../generated/jsonable";
import { Types } from "../generated/types";
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
export declare const $comment: (define: Types.CommentProperty) => CodeLine[];
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
        const buildInlineDefineDictionary: (value: Types.DictionaryDefinition) => CodeInlineBlock;
        const buildInlineDefineAnd: (value: Types.AndElement) => CodeExpression[];
        const buildInlineDefineOr: (value: Types.OrElement) => CodeExpression[];
        const buildDefineInlineInterface: (value: Types.InterfaceDefinition) => CodeInlineBlock;
        const buildDefineInterface: (name: string, value: Types.InterfaceDefinition) => CodeBlock;
        const buildDefineDictionary: (name: string, value: Types.DictionaryDefinition) => CodeBlock;
        const buildDefineNamespaceCore: (options: Types.OutputOptions, members: {
            [key: string]: Types.Definition;
        }) => CodeEntry[];
        const buildDefineNamespace: (options: Types.OutputOptions, name: string, value: Types.NamespaceDefinition) => CodeBlock;
        const buildImports: (imports: undefined | Types.ImportDefinition[]) => CodeLine[];
        const buildDefine: (options: Types.OutputOptions, name: string, define: Types.Definition) => CodeEntry[];
        const buildInlineDefine: (define: Types.TypeOrValueOfRefer) => (CodeExpression | CodeInlineBlock)[];
    }
    namespace Validator {
        const buildCall: (method: CodeInlineEntry[], args: (CodeInlineEntry | CodeInlineEntry[])[]) => CodeInlineEntry[];
        const buildLiterarlValidatorExpression: (name: string, value: Jsonable.Jsonable) => CodeExpression[];
        const buildInlineLiteralValidator: (define: Types.LiteralElement) => CodeExpression;
        const buildValidatorLine: (declarator: string, name: string, define: Types.Type) => CodeExpression[];
        const buildObjectValidatorGetterName: (name: string) => string;
        const buildValidatorName: (name: string) => string;
        const buildValidatorExpression: (name: string, define: Types.TypeOrValueOfRefer) => CodeExpression[];
        const buildInterfaceValidator: (name: string, define: Types.InterfaceDefinition) => CodeExpression[];
        const buildInlineValidator: (name: string, define: Types.TypeOrValue) => CodeExpression[];
        const buildObjectValidatorGetterCoreEntry: (define: Types.TypeOrRefer) => CodeInlineEntry[];
        const buildObjectValidatorGetterCore: (define: Types.InterfaceDefinition & {
            members: {
                [key: string]: Types.TypeOrRefer;
            };
        }) => CodeInlineBlock;
        const buildObjectValidatorGetter: (define: Types.InterfaceDefinition & {
            members: {
                [key: string]: Types.TypeOrRefer;
            };
        }) => (CodeExpression | CodeInlineBlock)[];
        const buildFullValidator: (name: string, define: Types.Type) => CodeInlineEntry[];
        const isValidatorTarget: (define: Types.TypeOrValue) => boolean;
        const buildValidator: (options: Types.OutputOptions, name: string, define: Types.TypeOrValue) => CodeLine[];
    }
    namespace Schema {
        namespace Const {
            const definitions = "definitions";
        }
        interface SchemaProcess<ValueType> {
            source: Types.TypeSchema;
            schema: Types.SchemaOptions;
            path: string;
            value: ValueType;
        }
        const makeProcess: (source: Types.TypeSchema, schema: Types.SchemaOptions) => SchemaProcess<Types.TypeSchema["defines"]>;
        const nextProcess: <ValueType>(current: SchemaProcess<unknown>, key: null | string, value: ValueType) => SchemaProcess<ValueType>;
        const nextPath: (path: string, key: null | string) => string;
        const build: (data: SchemaProcess<Types.TypeSchema["defines"]>) => Jsonable.JsonableObject;
        const buildDefinitions: (data: SchemaProcess<Types.TypeSchema["defines"]>) => Jsonable.JsonableObject;
        const buildLiteral: (data: SchemaProcess<Types.LiteralElement>) => Jsonable.JsonableObject;
        const buildValue: (data: SchemaProcess<Types.ValueDefinition>) => Jsonable.JsonableObject;
        const buildType: (data: SchemaProcess<Types.Type>) => Jsonable.JsonableObject;
        const buildPrimitiveType: (data: SchemaProcess<Types.PrimitiveTypeElement>) => Jsonable.JsonableObject;
        const buildInterface: (data: SchemaProcess<Types.InterfaceDefinition>) => Jsonable.JsonableObject;
        const buildDictionary: (data: SchemaProcess<Types.DictionaryDefinition>) => Jsonable.JsonableObject;
        const buildEnumType: (data: SchemaProcess<Types.EnumTypeElement>) => Jsonable.JsonableObject;
        const buildRefer: (data: SchemaProcess<Types.ReferElement>) => Jsonable.JsonableObject;
        const buildArray: (data: SchemaProcess<Types.ArrayElement>) => Jsonable.JsonableObject;
        const buildOr: (data: SchemaProcess<Types.OrElement>) => Jsonable.JsonableObject;
        const buildAnd: (data: SchemaProcess<Types.AndElement>) => Jsonable.JsonableObject;
        const buildTypeOrRefer: (data: SchemaProcess<Types.TypeOrRefer>) => Jsonable.JsonableObject;
    }
}
export declare namespace Format {
    const getMaxLineLength: (options: Types.OutputOptions) => null | number;
    const buildIndent: (options: Types.OutputOptions, indentDepth: number) => string;
    const getReturnCode: (_options: Types.OutputOptions) => string;
    const expressions: (code: CodeExpression[]) => string;
    const getTokens: (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock) => string[];
    interface LineProcess {
        options: Readonly<Types.OutputOptions>;
        indentDepth: number;
        result: string;
        buffer: string;
        tokens: string[];
        i: number;
    }
    const separator: (data: Readonly<LineProcess>) => string;
    const temporaryAssembleLine: (data: Readonly<LineProcess>, length: number) => string;
    const isInLineComment: (data: Readonly<LineProcess>) => boolean;
    const isLineBreak: (data: Readonly<LineProcess>) => boolean;
    const line: (options: Readonly<Types.OutputOptions>, indentDepth: number, code: CodeLine) => string;
    const inlineBlock: (options: Readonly<Types.OutputOptions>, indentDepth: number, code: CodeInlineBlock) => string;
    const block: (options: Types.OutputOptions, indentDepth: number, code: CodeBlock) => string;
    const text: (options: Types.OutputOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]) => string;
}
export {};
