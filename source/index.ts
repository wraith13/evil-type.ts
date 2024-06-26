'use strict';
const startAt = new Date();
import fs from "fs";
import { Types } from "./types";
import { Text } from "./text";
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
// const removeNullFilter = <ElementType>(list: (ElementType | null)[]): ElementType[] =>
//     list.filter(i => null !== i) as ElementType[];
const kindofJoinExpression = <T>(list: T[], separator: CodeExpression) =>
        list.reduce((a, b) => (Array.isArray(a) ? a: [a]).concat(Array.isArray(b) ? [separator, ...b]: [separator, b]), <CodeExpression[]>[]);
interface Code
{
    $code: (CodeExpression | CodeLine | CodeInlineBlock | CodeBlock)["$code"];
}
interface CodeExpression extends Code
{
    $code: "expression";
    expression: string;
};
const isCodeExpression = (value: unknown): value is CodeExpression =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "expression" === value.$code &&
    "expression" in value && "string" === typeof value.expression;
export const convertToExpression = (code: CodeInlineEntry[]) =>
    {
        let result: CodeExpression[] = [];
        code.forEach
        (
            i =>
            {
                switch(i.$code)
                {
                case "inline-block":
                    result.concat($expression("{"), ...convertToExpression(i.lines), $expression("}"));
                    break;
                case "line":
                    {
                        const line = convertToExpression(i.expressions);
                        const last = line[line.length -1];
                        last.expression += ";"
                        result.concat(...line);
                    }
                    break;
                case "expression":
                    result.push(i);
                    break;
                }
            }
        );
        return result;
    };
interface CodeLine extends Code
{
    $code: "line";
    expressions: (CodeInlineEntry | CodeInlineEntry | CodeInlineBlock)[];
};
type CodeInlineEntry = CodeExpression | CodeLine | CodeInlineBlock;
// const isCodeLine = (value: unknown): value is CodeLine =>
//     null !== value &&
//     "object" === typeof value &&
//     "$code" in value && "line" === value.$code &&
//     "expressions" in value && Array.isArray(value.expressions) && value.expressions.filter(i => ! isCodeExpression(i)).length <= 0;
interface CodeInlineBlock extends Code
{
    $code: "inline-block";
    //header: never;
    lines: CodeInlineEntry[];
};
// const isCodeInlineBlock = (value: unknown): value is CodeBlock =>
//     null !== value &&
//     "object" === typeof value &&
//     "$code" in value && "inline-block" === value.$code &&
//     ! ("header" in value) &&
//     "lines" in value && Array.isArray(value.lines) && value.lines.filter(i => ! isCodeLine(i)).length <= 0;
interface CodeBlock extends Code
{
    $code: "block";
    header: CodeExpression[];
    lines: CodeEntry[];
};
// const isCodeBlock = (value: unknown): value is CodeBlock =>
//     null !== value &&
//     "object" === typeof value &&
//     "$code" in value && "block" === value.$code &&
//     "header" in value && Array.isArray(value.header) && value.header.filter(i => ! isCodeExpression(i)).length <= 0 &&
//     "lines" in value && Array.isArray(value.lines) && value.lines.filter(i => ! isCodeLine(i)).length <= 0;
type CodeEntry = CodeInlineBlock | CodeLine | CodeBlock;
interface Builder
{
    declarator: CodeExpression;
    define: CodeInlineEntry | CodeInlineEntry[] | CodeEntry[];
    validator?: (name: string) => CodeInlineEntry[];
}
export const $expression = (expression: CodeExpression["expression"]): CodeExpression => ({ $code: "expression", expression, });
export const $line = (expressions: CodeLine["expressions"]): CodeLine => ({ $code: "line", expressions, });
export const $iblock = (lines: CodeInlineBlock["lines"]): CodeInlineBlock => ({ $code: "inline-block", lines, });
export const $block = (header: CodeBlock["header"], lines: CodeBlock["lines"]): CodeBlock => ({ $code: "block", header, lines, });
export module Build
{
// data:input(json) to data:code(object)
    export const buildExport = (define: { export?: boolean } | { }): CodeExpression[] =>
        ("export" in define && (define.export ?? true)) ? [$expression("export")]: [];
    export const makeValueBuilder = (define: Types.ValueDefine): Builder =>
    ({
        declarator: $expression("const"),
        define: [$expression(JSON.stringify(define.value))],
        validator: (name: string) => Validator.buildValueValidatorExpression(name, define.value),
    });
    export const makePrimitiveTypeBuilder = (define: Types.PrimitiveTypeDefine): Builder =>
    ({
        declarator: $expression("const"),
        define: [$expression(JSON.stringify(define.define))],
        validator: (name: string) => [ $expression(`"${define.$type}" === typeof ${name}`), ],
    });
    export const makeTypeBuilder = (define: Types.TypeDefine): Builder =>
    ({
        declarator: $expression("type"),
        define: [$expression(JSON.stringify(define.define))],
        validator: (name: string) => Validator.buildValidatorExpression(name, define.define),
    });
    export const makeArrayTypeBuilder = (define: Types.ArrayDefine): Builder =>
    ({
        declarator: $expression("type"),
        define: [$expression(JSON.stringify(define.items) +"[]")],
        validator: (name: string) =>
        [
            $expression(`Array.isArray(${name})`),
            $expression("&&"),
            $expression("!"),
            $expression(`${name}.some(`),
            $expression("i"),
            $expression("=>"),
            ...Validator.buildValidatorExpression("i", define.items),
            $expression(")")
        ]
    });
    export const makeAndTypeBuilder = (define: Types.AndDefine): Builder =>
    ({
        declarator: $expression("type"),
        define: kindofJoinExpression(define.types.map(i => Define.buildInlineDefine(i)), $expression("&&")),
        validator: (name: string) => kindofJoinExpression
        (
            define.types.map(i => Validator.buildValidatorExpression(name, i)),
            $expression("&&")
        ),
    });
    export const makeOrTypeBuilder = (define: Types.OrDefine): Builder =>
    ({
        declarator: $expression("type"),
        define: kindofJoinExpression(define.types.map(i => Define.buildInlineDefine(i)), $expression("||")),
        validator: (name: string) => kindofJoinExpression
        (
            define.types.map(i => Validator.buildValidatorExpression(name, i)),
            $expression("||")
        ),
    });
    export const makeInterfaceBuilder = (define: Types.InterfaceDefine): Builder =>
    ({
        declarator: $expression("interface"),
        define: Define.buildDefineInlineInterface(define),
        validator: (name: string) => Validator.buildInterfaceValidator(name, define),
    });
    export const makeModuleBuilder = (define: Types.ModuleDefine): Builder =>
    ({
        declarator: $expression("module"),
        define: Define.buildDefineModuleCore(define),
    });
    export const getBuilder = (define: Types.Define): Builder =>
    {
        switch(define.$type)
        {
        case "value":
            return makeValueBuilder(define);
        case "primitive-type":
            return makePrimitiveTypeBuilder(define);
        case "type":
            return makeTypeBuilder(define);
        case "array":
            return makeArrayTypeBuilder(define);
        case "and":
            return makeAndTypeBuilder(define);
        case "or":
            return makeOrTypeBuilder(define);
        case "interface":
            return makeInterfaceBuilder(define);
        case "module":
            return makeModuleBuilder(define);
        }
    };
    export const getValidator = (define: Exclude<Types.Define, Types.ModuleDefine>) =>
        getBuilder(define).validator as Required<Builder>["validator"];
    export module Define
    {
        export const buildDefineLine = (declarator: string, name: string, define: Types.ValueOrTypeOfInterface): CodeLine =>
            $line(buildExport(define).concat([$expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineDefine(define))]));
        export const buildInlineDefineValue = (value: Types.ValueDefine) => $expression(JSON.stringify(value.value));
        export const buildDefineValue = (name: string, value: Types.ValueDefine): CodeLine =>
            buildDefineLine("const", name, value);
        //export const buildValueValidator = (name: string, value: Types.ValueDefine) =>
        //    Validator.buildValidatorLine("const", name, value);
        export const buildInlineDefinePrimitiveType = (value: Types.PrimitiveTypeDefine) =>
            $expression(value.define);
        export const buildDefinePrimitiveType = (name: string, value: Types.PrimitiveTypeDefine): CodeLine =>
            buildDefineLine("type", name, value);
        export const enParenthesis = <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) =>
            [ $expression("("), ...expressions, $expression(")"), ];
        export const isNeedParenthesis = (expressions: (CodeExpression | CodeInlineBlock)[]) =>
        {
            if (expressions.length <= 1)
            {
                return false;
            }
            const lastIx = expressions.length -1;
            const first = expressions[0];
            const last = expressions[lastIx];
            if (isCodeExpression(first) && "(" === first.expression &&  isCodeExpression(last) && ")" === last.expression)
            {
                let result = false;
                let count = 0;
                expressions.forEach
                (
                    (i, ix) =>
                    {
                        if (isCodeExpression(i))
                        {
                            if ("(" === i.expression)
                            {
                                ++count;
                            }
                            else
                            if (")" === i.expression)
                            {
                                --count;
                                if (count <= 0 && ix !== lastIx)
                                {
                                    // splitted
                                    result = true;
                                }
                            }
                        }
                    }
                );
                if (0 !== count)
                {
                    // unmatch parenthesis error...
                    result = true;
                }
                return result;
            }
            return true;
        };
        export const enParenthesisIfNeed = <T extends (CodeExpression | CodeInlineBlock)[]>(expressions: T) =>
            isNeedParenthesis(expressions) ? enParenthesis(expressions): expressions;
        export const buildInlineDefineArray = (value: Types.ArrayDefine) =>
            [ $expression(buildInlineDefine(value.items) +"[]"), ];
        export const buildInlineDefineAnd = (value: Types.AndDefine) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("&"));
        export const buildInlineDefineOr = (value: Types.OrDefine) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("|"));
        export const buildDefineInlineInterface = (value: Types.InterfaceDefine) => $iblock
        (
            Object.keys(value.members)
                .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(value.members[name])]))
        );
        export const buildDefineInterface = (name: string, value: Types.InterfaceDefine): CodeBlock =>
        {
            const header = buildExport(value).concat(["interface", name].filter(i => null !== i).map(i => $expression(i)));
            const lines = Object.keys(value.members)
                .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(value.members[name])]));
            return $block(header, lines);
        };
        export const buildDefineModuleCore = (value: Types.ModuleDefine): CodeEntry[] =>
        [
            ...Object.entries(value.members).map
            (
                i =>
                    Types.isModuleDefine(i[1]) ? [buildDefine(i[0], i[1])]:
                    Types.isTypeOrInterface(i[1]) ? [buildDefine(i[0], i[1]), Validator.buildValidator(i[0], i[1]), ]:
                    [] // Types.isValueDefine(i[1])
            )
            .reduce((a, b) => a.concat(b), []),
        ];
        export const buildDefineModule = (name: string, value: Types.ModuleDefine): CodeBlock =>
        {
            const header = buildExport(value).concat([$expression("module"), $expression(name)]);
            const lines = buildDefineModuleCore(value);
            return $block(header, lines);
        };
        export const buildDefine = (name: string, define: Types.Define): CodeEntry =>
        {
            switch(define.$type)
            {
            case "interface":
                return buildDefineInterface(name, define);
            case "module":
                return buildDefineModule(name, define);
            default:
                return buildDefineLine(getBuilder(define).declarator.expression, name, define);
            }
        };
        export const buildInlineDefine = (define: Types.ValueOrTypeOfInterfaceOrRefer): (CodeExpression | CodeInlineBlock)[] =>
        {
            if (Types.isRefer(define))
            {
                return [ $expression(define.$ref), ];
            }
            else
            {
                switch(define.$type)
                {
                case "value":
                    return [ buildInlineDefineValue(define), ];
                case "primitive-type":
                    return [ buildInlineDefinePrimitiveType(define), ];
                case "type":
                    return buildInlineDefine(define.define);
                case "array":
                    return buildInlineDefineArray(define);
                case "and":
                    return buildInlineDefineAnd(define);
                case "or":
                    return buildInlineDefineOr(define);
                case "interface":
                    return [ buildDefineInlineInterface(define), ];
                }
            }
        };
    }
    export module Validator
    {
        export const buildValueValidatorExpression = (name: string, value: Types.Jsonable): CodeExpression[] =>
        {
            if (null !== value && "object" === typeof value)
            {
                if (Array.isArray(value))
                {
                    let list: CodeExpression[] = [];
                    list.push($expression(`Array.isArray(${name})`));
                    list.push($expression(`${value.length} <= ${name}.length`));
                    value.forEach((i, ix) => list = list.concat(buildValueValidatorExpression(`${name}[${ix}]`, i)));
                    return kindofJoinExpression(list, $expression("&&"));
                }
                else
                {
                    const list: CodeExpression[] = [];
                    list.push($expression(`null !== ${name}`));
                    list.push($expression(`"object" === typeof ${name}`));
                    Object.keys(value).forEach
                    (
                        key =>
                        {
                            {
                                list.push($expression(`"${key}" in ${name}`));
                                list.push(...buildValueValidatorExpression(`${name}.${key}`, value[key]));
                            }
                        }
                    );
                    return kindofJoinExpression(list,$expression("&&"));
                }
            }
            if (undefined === value)
            {
                return [ $expression("undefined"), $expression("==="), $expression(name), ];
            }
            else
            {
                return [ $expression(JSON.stringify(value)), $expression("==="), $expression(name), ];
            }
        };
        export const buildInlineValueValidator = (define: Types.ValueDefine) =>
            $expression(`(value: unknown): value is ${Define.buildInlineDefineValue(define)} => ${buildValueValidatorExpression("value", define.value)};`);
        export const buildValidatorLine = (declarator: string, name: string, define: Types.TypeOrInterface): CodeExpression[] =>
            buildExport(define).concat([$expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineValidator(name, define))]);
        export const buildValidatorName = (name: string) =>
            Text.getNameSpace(name).split(".").concat([`is${Text.toUpperCamelCase(Text.getNameBody(name))}`]).join(".");
        export const buildValidatorExpression = (name: string, define: Exclude<Types.DefineOrRefer, Types.ModuleDefine>) =>
            Types.isRefer(define) ?
                [$expression(`${buildValidatorName( define.$ref)}(${name})`)]:
                getValidator(define)(name);
        export const buildInterfaceValidator = (name: string, define: Types.InterfaceDefine): CodeExpression[] =>
        {
            const list: CodeExpression[] = [];
            list.push($expression(`null !== ${name}`));
            list.push($expression(`"object" === typeof ${name}`));
            Object.keys(define.members).forEach
            (
                key =>
                {
                    {
                        list.push($expression(`"${key}" in ${name}`));
                        list.push(...convertToExpression(buildValidatorExpression(`${name}.${key}`, define.members[key])));
                    }
                }
            );
            return kindofJoinExpression(list,$expression("&&"));
        };
        export const buildInlineValidator = (name: string, define: Types.TypeOrInterface) =>
        [
            $expression(`(value: unknown): value is ${name} =>`),
            ...buildValidatorExpression("value", define),
        ];
        export const buildValidator = (name: string, define: Types.TypeOrInterface): CodeLine =>
            $line
            (
                (<CodeLine["expressions"]>[$expression("const"), $expression(buildValidatorName(name))])
                    .concat(buildInlineValidator(name, define))
            );
    }
}
export module Format
{
// data:code(object) to data:output(text)
    export const buildIndent = (options: Types.TypeOptions, indentDepth: number) =>
        Array.from({ length: indentDepth, })
        .map(_ => "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(_ => " ").join(""): options.indentUnit)
        .join("");
    export const getReturnCode = (_options: Types.TypeOptions) => "\n";
    export const expressions = (code: CodeExpression[]): string =>
        code.map(i => i.expression).join(" ");
    export const tokens = (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock): string[] =>
    {
        switch(code.$code)
        {
        case "inline-block":
            return code.lines.map(i => tokens(i)).reduce((a, b) => a.concat(b), []);
        case "line":
            return code.expressions.map(i => tokens(i)).reduce((a, b) => a.concat(b), []);
        case "expression":
            return [ code.expression ];
        }
    };
    export const line = (options: Types.TypeOptions, indentDepth: number, code: CodeLine): string =>
        buildIndent(options, indentDepth)
        +code.expressions.map(i => tokens(i)).reduce((a, b) => a.concat(b), []).join(" ")
        +";"
        +getReturnCode(options);
    export const inlineBlock = (options: Types.TypeOptions, indentDepth: number, code: CodeInlineBlock): string =>
        [ "{", ...code.lines.map(i => text(options, indentDepth +1, i)), "}" ].join(" ");
    export const block = (options: Types.TypeOptions, indentDepth: number, code: CodeBlock): string =>
    {
        const currentIndent = buildIndent(options, indentDepth);
        const returnCode = getReturnCode(options);
        let result = "";
        if (0 < (code.header ?? []).length)
        {
            result += currentIndent +expressions(code.header) +returnCode;
        }
        result += currentIndent +"{" +returnCode;
        result += text(options, indentDepth +1, code.lines);
        result += currentIndent +"}" +returnCode;
        return result;
    }
    export const text = (options: Types.TypeOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]): string =>
    {
        if (Array.isArray(code))
        {
            return code.map(i => text(options, indentDepth, i)).join(getReturnCode(options));
        }
        else
        {
            switch(code.$code)
            {
            case "expression":
                return line(options, indentDepth, $line([code]));
            case "line":
                return line(options, indentDepth, code);
            case "inline-block":
                return inlineBlock(options, indentDepth, code);
            case "block":
                return block(options, indentDepth, code);
            }
        }
    }
}
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = JSON.parse(fget(jsonPath));
    if (Types.isTypeSchema(typeSource))
    {
        const defines = Object.entries(typeSource.defines)
            .map(i => Build.Define.buildDefine(i[0], i[1]));
        console.log(JSON.stringify(defines, null, 4));
        const result = Format.text(typeSource.options, 0, defines);
        console.log(result);
    }
    else
    {
        console.error("Invalid TypeSchema", typeSource);
    }
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
