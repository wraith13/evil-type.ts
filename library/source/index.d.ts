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
    const asConst: CodeExpression[];
    const buildLiteralAsConst: (literal: Jsonable.Jsonable) => CodeExpression[];
    interface BaseProcess<ValueType> {
        source: Type.TypeSchema;
        definitions: Type.DefinitionMap;
        path: string;
        key: string;
        value: ValueType;
    }
    type NextProcess<base extends BaseProcess<unknown>, ValueType> = Omit<base, "value"> & {
        value: ValueType;
    };
    const nextProcess: <Process extends BaseProcess<unknown>, ValueType>(current: Process, key: null | string, value: ValueType) => NextProcess<Process, ValueType>;
    const nextPath: (path: string, key: null | string) => string;
    const makeDefinitionFlatMap: (defines: Type.DefinitionMap) => Type.DefinitionMap;
    const getAbsolutePath: (data: BaseProcess<unknown>, value: Type.ReferElement, context?: string) => string;
    const getDefinition: <Process extends BaseProcess<Type.ReferElement>>(data: Process) => NextProcess<Process, Type.Definition>;
    const getTarget: <Process extends BaseProcess<Type.TypeOrValueOfRefer>>(data: Process) => NextProcess<Process, Type.TypeOrLiteralOfRefer>;
    const getLiteral: <Process extends BaseProcess<Type.ReferElement>>(data: Process) => Type.LiteralElement | null;
    const getKeys: (data: BaseProcess<Type.InterfaceDefinition>) => string[];
    namespace Define {
        interface DefineProcess<ValueType> extends BaseProcess<ValueType> {
            options: Type.OutputOptions;
        }
        const makeProcess: (source: Type.TypeSchema) => DefineProcess<Type.DefinitionMap>;
        const buildDefineLine: (declarator: string, data: DefineProcess<Type.TypeOrValue>, postEpressions?: CodeExpression[]) => CodeLine;
        const buildInlineDefineLiteral: (define: Type.LiteralElement) => CodeExpression[];
        const buildInlineDefinePrimitiveType: (value: Type.PrimitiveTypeElement) => CodeExpression;
        const buildDefinePrimitiveType: (data: DefineProcess<Type.PrimitiveTypeElement>) => CodeLine;
        const enParenthesis: <T extends CodeInlineEntry>(expressions: T[]) => (CodeExpression | T)[];
        const isNeedParenthesis: (expressions: (CodeExpression | CodeInlineBlock)[]) => boolean;
        const enParenthesisIfNeed: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineEnum: (value: Type.EnumTypeElement) => CodeExpression[];
        const buildInlineDefineArray: (data: DefineProcess<Type.ArrayElement>) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineDictionary: (data: DefineProcess<Type.DictionaryDefinition>) => CodeInlineBlock;
        const buildInlineDefineAnd: (data: DefineProcess<Type.AndElement>) => CodeExpression[];
        const buildInlineDefineOr: (data: DefineProcess<Type.OrElement>) => CodeExpression[];
        const buildDefineInlineInterface: (data: DefineProcess<Type.InterfaceDefinition>) => CodeInlineBlock;
        const buildDefineInterface: (data: DefineProcess<Type.InterfaceDefinition>) => CodeBlock;
        const buildDefineDictionary: (data: DefineProcess<Type.DictionaryDefinition>) => CodeBlock;
        const buildDefineNamespaceCore: (data: DefineProcess<Type.DefinitionMap>) => CodeEntry[];
        const buildDefineNamespace: (data: DefineProcess<Type.NamespaceDefinition>) => CodeBlock;
        const buildImports: (imports: undefined | Type.ImportDefinition[]) => CodeLine[];
        const buildDefine: (data: DefineProcess<Type.Definition>) => CodeEntry[];
        const buildInlineDefine: (data: DefineProcess<Type.TypeOrValueOfRefer>) => (CodeExpression | CodeInlineBlock)[];
    }
    namespace Validator {
        const buildCall: (method: CodeInlineEntry[], args: (CodeInlineEntry | CodeInlineEntry[])[]) => CodeInlineEntry[];
        const buildLiterarlValidatorExpression: (name: string, value: Jsonable.Jsonable) => CodeExpression[];
        const buildInlineLiteralValidator: (define: Type.LiteralElement) => CodeExpression;
        const buildObjectValidatorObjectName: (name: string) => string;
        const buildValidatorName: (name: string) => string;
        const buildValidatorExpression: (name: string, data: Define.DefineProcess<Type.TypeOrValueOfRefer>) => CodeExpression[];
        const buildKeyofValidator: (name: string, data: Define.DefineProcess<Type.KeyofElement>) => CodeExpression[];
        const buildInterfaceValidator: (name: string, data: Define.DefineProcess<Type.InterfaceDefinition>) => CodeExpression[];
        const buildInlineValidator: (name: string, data: Define.DefineProcess<Type.TypeOrValue>) => CodeExpression[];
        const buildObjectValidatorGetterCoreEntry: (data: Define.DefineProcess<Type.TypeOrRefer>) => CodeInlineEntry[];
        const buildObjectValidatorGetterCore: (data: Define.DefineProcess<Type.InterfaceDefinition>) => CodeInlineBlock;
        const buildObjectValidator: (data: Define.DefineProcess<Type.InterfaceDefinition>) => (CodeExpression | CodeInlineBlock)[];
        const isLazyValidator: (define: Type.TypeOrRefer) => boolean;
        const buildFullValidator: (data: Define.DefineProcess<Type.Type>) => CodeInlineEntry[];
        const isValidatorTarget: (define: Type.TypeOrValue) => boolean;
        const buildValidator: (data: Define.DefineProcess<Type.TypeOrValue>) => CodeLine[];
        const buildValidatorObject: (data: Define.DefineProcess<Type.InterfaceDefinition>) => CodeLine[];
    }
    namespace Schema {
        namespace Const {
            const definitions = "definitions";
        }
        interface SchemaProcess<ValueType> extends BaseProcess<ValueType> {
            schema: Type.SchemaOptions;
        }
        const makeProcess: (source: Type.TypeSchema, schema: Type.SchemaOptions) => SchemaProcess<Type.DefinitionMap>;
        const resolveExternalRefer: (data: SchemaProcess<unknown>, absolutePath: string) => string | null;
        const build: (data: SchemaProcess<Type.DefinitionMap>) => Jsonable.JsonableObject;
        const buildDefinitions: (data: SchemaProcess<Type.DefinitionMap>) => Jsonable.JsonableObject;
        const buildLiteral: (data: SchemaProcess<Type.LiteralElement>) => Jsonable.JsonableObject;
        const buildValue: (data: SchemaProcess<Type.ValueDefinition>) => Jsonable.JsonableObject;
        const buildType: (data: SchemaProcess<Type.Type>) => Jsonable.JsonableObject;
        const setCommonProperties: (result: Jsonable.JsonableObject, data: SchemaProcess<{
            title?: string;
            description?: string;
        }>) => Jsonable.JsonableObject;
        const buildPrimitiveType: (data: SchemaProcess<Type.PrimitiveTypeElement>) => Jsonable.JsonableObject;
        const buildInterface: (data: SchemaProcess<Type.InterfaceDefinition>) => Jsonable.JsonableObject;
        const buildDictionary: (data: SchemaProcess<Type.DictionaryDefinition>) => Jsonable.JsonableObject;
        const buildEnumType: (data: SchemaProcess<Type.EnumTypeElement>) => Jsonable.JsonableObject;
        const buildTypeOf: (data: SchemaProcess<Type.TypeofElement>) => Jsonable.JsonableObject;
        const buildKeyOf: (data: SchemaProcess<Type.KeyofElement>) => Jsonable.JsonableObject;
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
