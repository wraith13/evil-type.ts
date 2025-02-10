import { Jsonable, Type } from "../generated/code/type";
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
    const buildExport: (data: BaseProcess<{
        export?: boolean;
    }>) => CodeExpression[];
    const getAdditionalProperties: (data: BaseProcess<{
        additionalProperties?: boolean;
    }>) => boolean;
    const buildExtends: (define: Type.InterfaceDefinition) => CodeExpression[];
    const asConst: CodeExpression[];
    const buildLiteralAsConst: (literal: Jsonable.Jsonable) => CodeExpression[];
    interface BaseProcess<ValueType> {
        source: Type.TypeSchema;
        options: Type.OutputOptions;
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
    const resolveRefer: <Process extends BaseProcess<Type.TypeOrValueOfRefer>>(data: Process) => NextProcess<Process, Type.TypeOrLiteralOfRefer>;
    const getKeyofTarget: <Process extends BaseProcess<Type.KeyofElement>>(data: Process) => NextProcess<NextProcess<Process, Type.ReferElement>, Type.TypeOrLiteralOfRefer>;
    const getMemberofTarget: <Process extends BaseProcess<Type.MemberofElement>>(data: Process) => NextProcess<Process, Type.TypeOrLiteralOfRefer>;
    const getSafeInteger: <Process extends BaseProcess<unknown>>(data: Process) => boolean;
    const getSafeNumber: <Process extends BaseProcess<unknown>>(data: Process) => boolean;
    const getPattern: <Process extends BaseProcess<Type.FormatStringType>>(data: Process) => string | undefined;
    const getTsPattern: <Process extends BaseProcess<Type.StringType>>(data: Process) => string[] | undefined;
    const getRegexpFlags: <Process extends BaseProcess<unknown>>(data: Process) => string;
    const getRegexpTest: <Process extends BaseProcess<unknown>>(data: Process) => string | undefined;
    const getLiteral: <Process extends BaseProcess<Type.ReferElement>>(data: Process) => Type.LiteralElement | null;
    const getKeys: (data: BaseProcess<Type.InterfaceDefinition>) => string[];
    const getActualKeys: (data: BaseProcess<Type.TypeOrRefer>) => string[];
    const applyOptionality: (key: string, optionality: Type.DictionaryDefinition["optionality"]) => string;
    const isDetailedDictionary: <Process extends BaseProcess<Type.DictionaryDefinition>>(data: Process) => data is Process & {
        value: {
            keyin: Type.TypeOrRefer;
        };
    };
    const dictionaryToInterface: <Process extends BaseProcess<Type.DictionaryDefinition> & {
        value: {
            keyin: Type.TypeOrRefer;
        };
    }>(data: Process) => NextProcess<Process, Type.InterfaceDefinition>;
    const isKindofNeverType: (data: BaseProcess<Type.TypeOrRefer>) => boolean;
    const isValidatorTarget: (define: BaseProcess<unknown>) => boolean;
    const isDefinitionTarget: (define: BaseProcess<unknown>) => boolean;
    namespace Define {
        interface Process<ValueType> extends BaseProcess<ValueType> {
        }
        const makeProcess: (source: Type.TypeSchema) => Process<Type.DefinitionMap>;
        const buildDefineLine: (declarator: string, data: Process<Type.TypeOrValue & Type.Definition>, postEpressions?: CodeExpression[]) => CodeLine;
        const buildInlineDefineLiteral: (define: Type.LiteralElement) => CodeExpression[];
        const buildInlineDefinePrimitiveType: <Process extends BaseProcess<Type.PrimitiveTypeElement>>(data: Process) => CodeExpression;
        const enParenthesis: <T extends CodeInlineEntry>(expressions: T[]) => (CodeExpression | T)[];
        const isNeedParenthesis: (expressions: (CodeExpression | CodeInlineBlock)[]) => boolean;
        const enParenthesisIfNeed: <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineEnum: (value: Type.EnumTypeElement) => CodeExpression[];
        const buildInlineDefineArray: (data: Process<Type.ArrayElement>) => (CodeExpression | CodeInlineBlock)[];
        const buildOptionality: (optionality: Type.DictionaryDefinition["optionality"]) => CodeExpression[];
        const buildDictionaryKeyin: (data: Process<Type.DictionaryDefinition>) => (CodeExpression | CodeInlineBlock)[];
        const buildInlineDefineDictionary: (data: Process<Type.DictionaryDefinition>) => CodeInlineBlock;
        const buildInlineDefineAnd: (data: Process<Type.AndElement>) => CodeExpression[];
        const buildInlineDefineOr: (data: Process<Type.OrElement>) => CodeExpression[];
        const buildDefineInlineInterface: (data: Process<Type.InterfaceDefinition>) => CodeInlineBlock;
        const buildDefineInterface: (data: Process<Type.InterfaceDefinition>) => CodeBlock;
        const buildDefineDictionary: (data: Process<Type.DictionaryDefinition>) => CodeBlock;
        const buildDefineNamespaceCore: (data: Process<Type.DefinitionMap>) => CodeEntry[];
        const buildDefineNamespace: (data: Process<Type.NamespaceDefinition>) => CodeBlock;
        const buildImports: (imports: undefined | Type.ImportDefinition[]) => CodeLine[];
        const buildDefine: (data: Process<Type.Definition>) => CodeEntry[];
        const buildInlineDefine: (data: Process<Type.TypeOrValueOfRefer>) => (CodeExpression | CodeInlineBlock)[];
    }
    namespace Validator {
        const isRegularIdentifier: (key: string) => boolean;
        const buildObjectMember: (name: string, key: string) => string;
        const buildCall: (method: CodeInlineEntry[], args: (CodeInlineEntry | CodeInlineEntry[])[]) => CodeInlineEntry[];
        const buildLiterarlValidatorExpression: (name: string, value: Jsonable.Jsonable) => CodeExpression[];
        const buildObjectValidatorObjectName: (name: string) => string;
        const buildValidatorName: (name: string) => string;
        const buildCallRegExpTest: (regexpTest: string | undefined, pattern: string, flags: string, name: string) => CodeExpression[];
        const buildCallRegExpTestOrEmpty: (name: string, data: Define.Process<Type.StringType>) => CodeExpression[];
        const buildValidatorExpression: (name: string, data: Define.Process<Type.TypeOrValueOfRefer>) => CodeExpression[];
        const buildKeyofValidator: (name: string, data: Define.Process<Type.KeyofElement>) => CodeExpression[];
        const rejectAdditionalProperties: (name: string, regularKeys: string[]) => CodeExpression[];
        const buildInterfaceValidator: (name: string, data: Define.Process<Type.InterfaceDefinition>) => CodeExpression[];
        const buildInlineValidator: (name: string, data: Define.Process<Type.TypeOrValue>) => CodeExpression[];
        const buildPatternPropertyOrEmpty: (data: Define.Process<Type.StringType>) => CodeExpression[];
        const buildObjectValidatorGetterCoreEntry: (data: Define.Process<Type.TypeOrRefer>) => CodeInlineEntry[];
        const buildObjectValidatorGetterCore: (data: Define.Process<Type.InterfaceDefinition>) => CodeInlineBlock;
        const buildObjectValidator: (data: Define.Process<Type.InterfaceDefinition>) => (CodeExpression | CodeInlineBlock)[];
        const isLazyValidator: (data: Define.Process<Type.TypeOrRefer>) => boolean;
        const buildFullValidator: (data: Define.Process<Type.Type>) => CodeInlineEntry[];
        const buildValidator: (data: Define.Process<Type.TypeOrValue & Type.Definition>) => CodeLine[];
        const buildValidatorObject: (data: Define.Process<Type.InterfaceDefinition>) => CodeLine[];
    }
    namespace Schema {
        namespace Const {
            const definitions = "definitions";
        }
        interface Process<ValueType> extends BaseProcess<ValueType> {
            schema: Type.SchemaOptions;
        }
        const makeProcess: (source: Type.TypeSchema, schema: Type.SchemaOptions) => Process<Type.DefinitionMap>;
        const resolveExternalRefer: (data: Process<unknown>, absolutePath: string) => string | null;
        const build: (data: Process<Type.DefinitionMap>) => Jsonable.JsonableObject;
        const buildDefinitions: (data: Process<Type.DefinitionMap>) => Jsonable.JsonableObject;
        const buildLiteral: (data: Process<Type.LiteralElement>) => Jsonable.JsonableObject;
        const buildValue: (data: Process<Type.ValueDefinition>) => Jsonable.JsonableObject;
        const buildType: (data: Process<Type.Type>) => Jsonable.JsonableObject;
        const setCommonProperties: <T>(result: Jsonable.JsonableObject, data: Process<Type.CommonProperties & {
            default?: T;
        }>) => Jsonable.JsonableObject;
        const buildPrimitiveType: (data: Process<Type.PrimitiveTypeElement>) => Jsonable.JsonableObject;
        const buildInterface: (data: Process<Type.InterfaceDefinition>) => Jsonable.JsonableObject;
        const buildDictionary: (data: Process<Type.DictionaryDefinition>) => Jsonable.JsonableObject;
        const buildEnumType: (data: Process<Type.EnumTypeElement>) => Jsonable.JsonableObject;
        const buildTypeOf: (data: Process<Type.TypeofElement>) => Jsonable.JsonableObject;
        const buildKeyOf: (data: Process<Type.KeyofElement>) => Jsonable.JsonableObject;
        const buildItemOf: (data: Process<Type.ItemofElement>) => Jsonable.JsonableObject;
        const buildMemberOf: (data: Process<Type.MemberofElement>) => Jsonable.JsonableObject;
        const buildRefer: (data: Process<Type.ReferElement>) => Jsonable.JsonableObject;
        const buildArray: (data: Process<Type.ArrayElement>) => Jsonable.JsonableObject;
        const buildOr: (data: Process<Type.OrElement>) => Jsonable.JsonableObject;
        const buildAnd: (data: Process<Type.AndElement>) => Jsonable.JsonableObject;
        const buildTypeOrRefer: (data: Process<Type.TypeOrRefer>) => Jsonable.JsonableObject;
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
