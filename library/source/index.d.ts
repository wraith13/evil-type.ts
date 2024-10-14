import { Jsonable } from "../generated/code/jsonable";
import { Type } from "../generated/code/type";
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
export declare const $comment: (define: Type.CommentProperty) => CodeLine[];
export declare const $iblock: (lines: CodeInlineBlock["lines"]) => CodeInlineBlock;
export declare const $block: (header: CodeBlock["header"], lines: CodeBlock["lines"]) => CodeBlock;
export declare namespace Build {
    const buildExport: (define: {
        export?: boolean;
    } | {}) => CodeExpression[];
    const buildExtends: (define: Type.InterfaceDefinition) => CodeExpression[];
    namespace Define {
        const buildDefineLine: (declarator: string, name: string, define: Type.TypeOrValue, postEpressions?: CodeExpression[]) => CodeLine;
        const buildInlineDefineLiteral: (define: Type.LiteralElement) => CodeExpression[];
        const buildInlineDefinePrimitiveType: (value: Type.PrimitiveTypeElement) => CodeExpression;
        const buildDefinePrimitiveType: (name: string, value: Type.PrimitiveTypeElement) => CodeLine;
        const enParenthesis: <T extends CodeInlineEntry>(expressions: T[]) => (CodeExpression | T)[];
        const isNeedParenthesis: (expressions: (CodeExpression | CodeInlineBlock)[]) => boolean;
        const enParenthesisIfNeed: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineEnum: (value: Type.EnumTypeElement) => CodeExpression[];
        const buildInlineDefineArray: (value: Type.ArrayElement) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineDictionary: (value: Type.DictionaryDefinition) => CodeInlineBlock;
        const buildInlineDefineAnd: (value: Type.AndElement) => CodeExpression[];
        const buildInlineDefineOr: (value: Type.OrElement) => CodeExpression[];
        const buildDefineInlineInterface: (value: Type.InterfaceDefinition) => CodeInlineBlock;
        const buildDefineInterface: (name: string, value: Type.InterfaceDefinition) => CodeBlock;
        const buildDefineDictionary: (name: string, value: Type.DictionaryDefinition) => CodeBlock;
        const buildDefineNamespaceCore: (options: Type.OutputOptions, members: {
            [key: string]: Type.Definition;
        }) => CodeEntry[];
        const buildDefineNamespace: (options: Type.OutputOptions, name: string, value: Type.NamespaceDefinition) => CodeBlock;
        const buildImports: (imports: undefined | Type.ImportDefinition[]) => CodeLine[];
        const buildDefine: (options: Type.OutputOptions, name: string, define: Type.Definition) => CodeEntry[];
        const buildInlineDefine: (define: Type.TypeOrValueOfRefer) => (CodeExpression | CodeInlineBlock)[];
    }
    namespace Validator {
        const buildCall: (method: CodeInlineEntry[], args: (CodeInlineEntry | CodeInlineEntry[])[]) => CodeInlineEntry[];
        const buildLiterarlValidatorExpression: (name: string, value: Jsonable.Jsonable) => CodeExpression[];
        const buildInlineLiteralValidator: (define: Type.LiteralElement) => CodeExpression;
        const buildValidatorLine: (declarator: string, name: string, define: Type.Type) => CodeExpression[];
        const buildObjectValidatorGetterName: (name: string) => string;
        const buildValidatorName: (name: string) => string;
        const buildValidatorExpression: (name: string, define: Type.TypeOrValueOfRefer) => CodeExpression[];
        const buildInterfaceValidator: (name: string, define: Type.InterfaceDefinition) => CodeExpression[];
        const buildInlineValidator: (name: string, define: Type.TypeOrValue) => CodeExpression[];
        const buildObjectValidatorGetterCoreEntry: (define: Type.TypeOrRefer) => CodeInlineEntry[];
        const buildObjectValidatorGetterCore: (define: Type.InterfaceDefinition & {
            members: {
                [key: string]: Type.TypeOrRefer;
            };
        }) => CodeInlineBlock;
        const buildObjectValidatorGetter: (define: Type.InterfaceDefinition & {
            members: {
                [key: string]: Type.TypeOrRefer;
            };
        }) => (CodeExpression | CodeInlineBlock)[];
        const buildFullValidator: (name: string, define: Type.Type) => CodeInlineEntry[];
        const isValidatorTarget: (define: Type.TypeOrValue) => boolean;
        const buildValidator: (options: Type.OutputOptions, name: string, define: Type.TypeOrValue) => CodeLine[];
    }
    namespace Schema {
        namespace Const {
            const definitions = "definitions";
        }
        interface SchemaProcess<ValueType> {
            source: Type.TypeSchema;
            schema: Type.SchemaOptions;
            definitions: Type.DefinitionMap;
            path: string;
            value: ValueType;
        }
        const makeProcess: (source: Type.TypeSchema, schema: Type.SchemaOptions) => SchemaProcess<Type.DefinitionMap>;
        const nextProcess: <ValueType>(current: SchemaProcess<unknown>, key: null | string, value: ValueType) => SchemaProcess<ValueType>;
        const nextPath: (path: string, key: null | string) => string;
        const makeDefinitionFlatMap: (defines: Type.DefinitionMap) => Type.DefinitionMap;
        const getAbsolutePath: (data: SchemaProcess<unknown>, value: Type.ReferElement, context?: string) => string;
        const resolveExternalRefer: (data: SchemaProcess<unknown>, absolutePath: string) => string | null;
        const getDefinition: (data: SchemaProcess<unknown>, value: Type.ReferElement) => SchemaProcess<Type.Definition>;
        const getLiteral: (data: SchemaProcess<unknown>, value: Type.ReferElement) => Type.LiteralElement | null;
        const build: (data: SchemaProcess<Type.DefinitionMap>) => Jsonable.JsonableObject;
        const buildDefinitions: (data: SchemaProcess<Type.DefinitionMap>) => Jsonable.JsonableObject;
        const buildLiteral: (data: SchemaProcess<Type.LiteralElement>) => Jsonable.JsonableObject;
        const buildValue: (data: SchemaProcess<Type.ValueDefinition>) => Jsonable.JsonableObject;
        const buildType: (data: SchemaProcess<Type.Type>) => Jsonable.JsonableObject;
        const buildPrimitiveType: (data: SchemaProcess<Type.PrimitiveTypeElement>) => Jsonable.JsonableObject;
        const buildInterface: (data: SchemaProcess<Type.InterfaceDefinition>) => Jsonable.JsonableObject;
        const buildDictionary: (data: SchemaProcess<Type.DictionaryDefinition>) => Jsonable.JsonableObject;
        const buildEnumType: (data: SchemaProcess<Type.EnumTypeElement>) => Jsonable.JsonableObject;
        const buildTypeOf: (data: SchemaProcess<Type.TypeofElement>) => Jsonable.JsonableObject;
        const buildItemOf: (data: SchemaProcess<Type.ItemofElement>) => Jsonable.JsonableObject;
        const buildRefer: (data: SchemaProcess<Type.ReferElement>) => Jsonable.JsonableObject;
        const buildArray: (data: SchemaProcess<Type.ArrayElement>) => Jsonable.JsonableObject;
        const buildOr: (data: SchemaProcess<Type.OrElement>) => Jsonable.JsonableObject;
        const buildAnd: (data: SchemaProcess<Type.AndElement>) => Jsonable.JsonableObject;
        const buildTypeOrRefer: (data: SchemaProcess<Type.TypeOrRefer>) => Jsonable.JsonableObject;
    }
}
export declare namespace Format {
    const getMaxLineLength: (options: Type.OutputOptions) => null | number;
    const buildIndent: (options: Type.OutputOptions, indentDepth: number) => string;
    const getReturnCode: (_options: Type.OutputOptions) => string;
    const expressions: (code: CodeExpression[]) => string;
    const getTokens: (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock) => string[];
    interface LineProcess {
        options: Readonly<Type.OutputOptions>;
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
    const line: (options: Readonly<Type.OutputOptions>, indentDepth: number, code: CodeLine) => string;
    const inlineBlock: (options: Readonly<Type.OutputOptions>, indentDepth: number, code: CodeInlineBlock) => string;
    const block: (options: Type.OutputOptions, indentDepth: number, code: CodeBlock) => string;
    const text: (options: Type.OutputOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]) => string;
}
export {};
