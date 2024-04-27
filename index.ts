'use strict';
const startAt = new Date();
import fs from "fs";
import { Types } from "./types";
import { Text } from "./text";
const returnCode = "\n";
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
const buildIndent = (options: Types.TypeOptions, indentDepth: number) =>
    Array.from({ length: indentDepth, })
        .map(_ => "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(_ => " ").join(""): options.indentUnit)
        .join("");
const buildExport = (define: { export?: boolean } | { }) =>
    ("export" in define && (define.export ?? true)) ? $expression("export"): null;
const buildDefineLine = (declarator: string, name: string, define: Types.ValueOrTypeOfInterface): CodeLine =>
    $line([buildExport(define), $expression(declarator), $expression(name), $expression("="), ...buildInlineDefine(define)]);
const kindofJoinExpression = (list: CodeExpression[], separator: CodeExpression) =>
list.reduce((a, b) => a.concat([separator, b]), <CodeExpression[]>[]);
const buildValueValidatorExpression = (name: string, value: Types.Jsonable): CodeExpression[] =>
{
    if (null !== value && "object" === typeof value)
    {
        if (Array.isArray(value))
        {
            let list: CodeExpression[] = [];
            list.push($expression(`Array.isArray(${name})`));
            list.push($expression(`${value.length} <= ${name}.length`));
            value.forEach((i, ix) => list = list.concat(buildValueValidatorExpression(`${name}[${ix}]`, i)));
            return kindofJoinExpression(list,$expression("&&"));
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
interface Code
{
    $code: (CodeExpression | CodeLine | CodeInlineBlock | CodeBlock)["$code"];
}
interface CodeExpression extends Code
{
    $code: "expression";
    expression: string;
};
const $expression = (expression: CodeExpression["expression"]): CodeExpression => ({ $code: "expression", expression, });
const isCodeExpression = (value: unknown): value is CodeExpression =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "expression" === value.$code &&
    "expression" in value && "string" === typeof value.expression;
interface CodeLine extends Code
{
    $code: "line";
    expressions: CodeInlineEntry;
};
type CodeInlineEntry = CodeExpression[] | CodeInlineBlock;
const isCodeLine = (value: unknown): value is CodeLine =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "line" === value.$code &&
    "expressions" in value && Array.isArray(value.expressions) && value.expressions.filter(i => ! isCodeExpression(i)).length <= 0;
const $line = (expressions: CodeLine["expressions"]): CodeLine => ({ $code: "line", expressions, });
interface CodeInlineBlock extends Code
{
    $code: "inline-block";
    //header: never;
    lines: CodeInlineEntry[];
};
const $iblock = (lines: CodeInlineBlock["lines"]): CodeInlineBlock => ({ $code: "inline-block", lines, });
const isCodeInlineBlock = (value: unknown): value is CodeBlock =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "inline-block" === value.$code &&
    ! ("header" in value) &&
    "lines" in value && Array.isArray(value.lines) && value.lines.filter(i => ! isCodeLine(i)).length <= 0;
interface CodeBlock extends Code
{
    $code: "block";
    header: CodeExpression[];
    lines: CodeEntry[];
};
const isCodeBlock = (value: unknown): value is CodeBlock =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "block" === value.$code &&
    "header" in value && Array.isArray(value.header) && value.header.filter(i => ! isCodeExpression(i)).length <= 0 &&
    "lines" in value && Array.isArray(value.lines) && value.lines.filter(i => ! isCodeLine(i)).length <= 0;
const $block = (header: CodeBlock["header"], lines: CodeBlock["lines"]): CodeBlock => ({ $code: "block", header, lines, });
type CodeEntry = CodeLine | CodeBlock;
const getReturnCode = (_options: Types.TypeOptions) => "\n";
const buildCodeLine = (options: Types.TypeOptions, indentDepth: number, code: CodeLine): string =>
{
    const indent = buildIndent(options, indentDepth);
    if (Array.isArray(code.expressions))
    {
        return indent +code.expressions.filter(isCodeExpression).join(" ") +";" +getReturnCode(options);
    }
    else
    {
        return indent +buildCodeInlineBlock(options, indentDepth, code.expressions);
    }
}
const buildCodeInlineBlock = (options: Types.TypeOptions, indentDepth: number, code: CodeInlineBlock): string =>
    [ "{", ...code.lines.map(i => buildCode(options, indentDepth +1, i)).reduce((a, b) => a.concat(b), []), "}" ].join(" ");
const buildCodeBlock = (options: Types.TypeOptions, indentDepth: number, code: CodeBlock): string =>
{
    const currentIndent = buildIndent(options, indentDepth);
    const returnCode = getReturnCode(options);
    let result = "";
    if (0 < (code.header ?? []).length)
    {
        result += currentIndent +code.header.join(" ") +returnCode;
    }
    result += currentIndent +"{" +returnCode;
    result += buildCode(options, indentDepth +1, code.lines);
    result += currentIndent +"}" +returnCode;
    return result;
}
const buildCode = (options: Types.TypeOptions, indentDepth: number, code: CodeEntry[]): string =>
    code
        .map
        (
            i => i.$code === "line" ?
                buildCodeLine(options, indentDepth, i):
                buildCodeBlock(options, indentDepth, i)
        )
        .join(getReturnCode(options));
interface Builder
{
    declarator: CodeExpression;
    define: CodeInlineEntry;
    validator?: (name: string) => CodeInlineEntry;
}
const makeValueBuilder = (define: Types.ValueDefine): Builder =>
({
    declarator: $expression("const"),
    define: [$expression(JSON.stringify(define.value))],
    validator: (name: string) => buildValueValidatorExpression(name, define.value),
});
const makePrimitiveTypeBuilder = (define: Types.PrimitiveTypeDefine): Builder =>
({
    declarator: $expression("const"),
    define: [$expression(JSON.stringify(define.define))],
    validator: (name: string) => [ $expression(`"${define.$type}" === typeof ${name}`), ],
});
const makeTypeBuilder = (define: Types.TypeDefine): Builder =>
({
    declarator: $expression("type"),
    define: [$expression(JSON.stringify(define.define))],
    validator: (name: string) => buildValidatorExpression(name, define.define),
});
const makeInterfaceBuilder = (define: Types.InterfaceDefine): Builder =>
({
    declarator: $expression("interface"),
    define: buildDefineInlineInterface(define),
    validator: (name: string) => buildInterfaceValidator(name, define),
});
const makeModuleBuilder = (define: Types.ModuleDefine): Builder =>
({
    declarator: $expression("module"),
    define: buildDefineModuleCore(define),
});
const getBuilder = (define: Types.Define): Builder =>
{
    switch(define.$type)
    {
    case "value":
        return makeValueBuilder(define);
    case "primitive-type":
        return makePrimitiveTypeBuilder(define);
    case "type":
        return makeTypeBuilder(define);
    case "interface":
        return makeInterfaceBuilder(define);
    case "module":
        return makeModuleBuilder(define);
    }
};
const buildInlineValueValidator = (define: Types.ValueDefine) =>
    `(value: unknown): value is ${buildInlineDefineValue(define)} => ${buildValueValidatorExpression("value", define.value)};`;
const buildValidatorLine = (declarator: string, name: string, define: Types.TypeOrInterfaceOrRefer): string =>
    [buildExport(define), declarator, name, "=", buildInlineValidator(define)].filter(i => null !== i).join("") +";" +returnCode;
const buildInlineDefineValue = (value: Types.ValueDefine): string => JSON.stringify(value.value);
const buildDefineValue = (name: string, value: Types.ValueDefine): CodeLine =>
    buildDefineLine("const", name, value);
const buildValueValidator = (name: string, value: Types.ValueDefine): string =>
    buildValidatorLine("const", name, value);
const buildInlineDefineType = (value: Types.TypeDefine): string => buildInlineDefine(value.define);
const buildDefineType = (name: string, value: Types.TypeDefine): CodeLine =>
    buildDefineLine("type", name, value);

const buildInlineDefinePrimitiveType = (value: Types.PrimitiveTypeDefine): string => value.define;
const buildDefinePrimitiveType = (name: string, value: Types.PrimitiveTypeDefine): CodeLine =>
    buildDefineLine("type", name, value);
    
const buildInlineDefineArray = (value: Types.ArrayDefine): string => buildInlineDefine(value.items) +"[]";
const buildDefineInlineInterface = (value: Types.InterfaceDefine) => $iblock
(
    Object.keys(value.members)
        .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(value.members[name])]))
);
const buildDefineInterface = (name: string, value: Types.InterfaceDefine): CodeBlock =>
{
    const header = [buildExport(value), "interface", name].filter(i => null !== i).map(i => $expression(i));
    const lines = buildDefineInlineInterface(value);
    return $block(header, lines);
};
const buildDefineModuleCore = (members: { [key: string]: Types.Define; }): CodeEntry[] =>
[
    ...Object.entries(members).map
    (
        i => Types.isModuleDefine(i[1]) ?
            [buildDefine(i[0], i[1])]:
            [buildDefine(i[0], i[1]), buildValidator(i[0], i[1]), ]
    ).reduce((a, b) => a.concat(b), []),
];
const buildDefineModule = (name: string, value: Types.ModuleDefine): CodeBlock =>
{
    const header = <CodeExpression[]>[buildExport(value), $expression("module"), $expression(name)].filter(i => null !== i);
    const lines = buildDefineModuleCore(value.members);
    return $block(header, lines);
};
const buildDefine = (name: string, define: Types.Define): CodeEntry =>
{
    switch(define.$type)
    {
    case "value":
        return buildDefineValue(name, define);
    case "primitive-type":
        return buildDefinePrimitiveType(name, define);
    case "type":
        return buildDefineType(name, define);
    case "interface":
        return buildDefineInterface(name, define);
    case "module":
        return buildDefineModule(name, define);
    }
};
const buildInlineDefine = (define: Types.TypeOrInterfaceOrRefer): CodeEpression[] =>
{
    if (Types.isRefer(define))
    {
        return define.$ref;
    }
    else
    {
        switch(define.$type)
        {
        case "value":
            return buildInlineDefineValue(define);
        case "primitive-type":
            return buildInlineDefinePrimitiveType(define);
        case "type":
            return buildInlineDefineType(define);
        case "array":
            return buildInlineDefineArray(define);
        case "interface":
            return buildInlineDefineInterface(define);
        }
    }
};

const buildValidatorName = (name: string) =>
    Text.getNameSpace(name).split(".").concat([`is${Text.toUpperCamelCase(Text.getNameBody(name))}`]).join(".");
const buildValidatorExpression = (name: string, define: Types.DefineOrRefer): CodeExpression[] =>
    Types.isRefer(define) ?
        [$expression(`${buildValidatorName( define.$ref)}(${name})`)]:
        getBuilder(define).validator(name);
const buildInterfaceValidator = (name: string, define: Types.InterfaceDefine): CodeExpression[] =>
{

};
const buildInlineValidator = (name: string, define: Types.TypeOrInterface): CodeExpression[] =>
[
    $expression(`(value: unknown): value is ${name} =>`),
    ...buildValidatorExpression("value", define),
];
const buildValidator = (name: string, define: Types.TypeOrInterface): CodeLine =>
    $line([$expression("const"), $expression(buildValidatorName(name))].concat(buildInlineValidator(name, define)));
    
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = JSON.parse(fget(jsonPath)) as Types.TypeSchema;;
    const result = buildCode(typeSource.options, 0, buildDefineModuleCore(typeSource.defines));
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
