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
const buildDefineLine = (declarator: string, name: string, define: Types.TypeOrInterfaceOrRefer): CodeLine =>
    $line([buildExport(define), $expression(declarator), $expression(name), $expression("="), ...buildInlineDefine(define)]);
const buildValueValidatorExpression = (name: string, value: Types.Jsonable): CodeExpression[] =>
{
    if (null !== value && "object" === typeof value)
    {
        if (Array.isArray(value))
        {
            const list: string[] = [];
            list.push(`Array.isArray(${name})`);
            list.push(`${value.length} <= ${name}.length`)
            value.forEach((i, ix) => list.push(buildValueValidatorExpression(`${name}[${ix}]`, i)));
            return list.join(" && ");
        }
        else
        {
            const list: string[] = [];
            list.push(`null !== ${name}`);
            list.push(`"object" === typeof ${name}`);
            Object.keys(value).forEach
            (
                key =>
                {
                    {
                        list.push(`"${key}" in ${name}`);
                        list.push(buildValueValidatorExpression(`${name}.${key}`, value[key]));
                    }
                }
            );
            return list.join(" && ");
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
    $code: (CodeExpression | CodeLine | CodeBlock)["$code"];
}
interface CodeExpression extends Code
{
    $code: "expression";
    expression: string;
};
const $expression = (expression: string): CodeExpression => ({ $code: "expression", expression, });
const isCodeExpression = (value: unknown): value is CodeExpression =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "expression" === value.$code &&
    "expression" in value && "string" === typeof value.expression;
interface CodeLine extends Code
{
    $code: "line";
    expressions: CodeExpression[];
};
const isCodeLine = (value: unknown): value is CodeLine =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "line" === value.$code &&
    "expressions" in value && Array.isArray(value.expressions) && value.expressions.filter(i => ! isCodeExpression(i)).length <= 0;
const $line = (expressions: CodeExpression[]): CodeLine => ({ $code: "line", expressions, });
interface CodeBlock extends Code
{
    $code: "block";
    header: CodeExpression[];
    lines: CodeLine[];
};
const isCodeBlock = (value: unknown): value is CodeBlock =>
    null !== value &&
    "object" === typeof value &&
    "$code" in value && "block" === value.$code &&
    "header" in value && Array.isArray(value.header) && value.header.filter(i => ! isCodeExpression(i)).length <= 0 &&
    "lines" in value && Array.isArray(value.lines) && value.lines.filter(i => ! isCodeLine(i)).length <= 0;
const $block = (header: CodeExpression[], lines: CodeLine[]): CodeBlock => ({ $code: "block", header, lines, });
type CodeEntry = CodeLine | CodeBlock;
const getReturnCode = (_options: Types.TypeOptions) => "\n";
const buildCodeLine = (options: Types.TypeOptions, indentDepth: number, code: CodeLine): string =>
    buildIndent(options, indentDepth) +code.expressions.filter(isCodeExpression).join(" ") +";" +getReturnCode(options);
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
    define: CodeExpression;
    validator: (name: string) => CodeExpression[];
}
const makeValueBuilder = (define: Types.ValueDefine): Builder =>
({
    declarator: $expression("const"),
    define: $expression(JSON.stringify(define.value)),
    validator: (name: string) => buildValueValidatorExpression(name, define.value),
});
const makePrimitiveTypeBuilder = (define: Types.PrimitiveTypeDefine): Builder =>
({
    declarator: $expression("const"),
    define: $expression(JSON.stringify(define.define)),
    validator: (name: string) => [ $expression(`"${define.$type}" === typeof ${name}`), ],
});
const makeTypeBuilder = (define: Types.TypeDefine): Builder =>
({
    declarator: $expression("type"),
    define: $expression(JSON.stringify(define.define)),
    validator: (name: string) => getBuilder(define.define).validator(name),
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
        return interfaceBuilder;
    case "module":
        return moduleBuilder;
    }
};

const buildInlineValueValidator = (define: Types.ValueDefine) =>
    `(value: unknown): value is ${buildInlineDefineValue(define)} => ${buildValueValidatorExpression("value", define.value)};`;
const buildValidatorLine = (string, name: string, define: Types.TypeOrInterfaceOrRefer): string =>
    [buildExport(define), declarator, name, "=", buildInlineValidator(define)].filter(i => null !== i).join("") +";" +returnCode;

const buildInlineDefineValue = (value: Types.ValueDefine): string => JSON.stringify(value.value);
const buildDefineValue = (name: string, value: Types.ValueDefine): CodeLine =>
    buildDefineLine("const", name, value);
const buildValueValidator = (name: string, value: Types.ValueDefine): string =>
    buildValidatorLine("const", name, value);

const buildInlineDefineType = (value: Types.TypeDefine): string => buildInlineDefine(value.define);
const buildDefineType = (name: string, value: Types.TypeDefine): string =>
    buildDefineLine("type", name, value);

const buildInlineDefinePrimitiveType = (value: Types.PrimitiveTypeDefine): string => value.define;
const buildDefinePrimitiveType = (name: string, value: Types.PrimitiveTypeDefine): string =>
    buildDefineLine("type", name, value);
    
const buildInlineDefineArray = (value: Types.ArrayDefine): string => buildInlineDefine(value.items) +"[]";
const buildInlineDefineInterface = (value: Types.InterfaceDefine): string =>
{
    let result = [];
    result.push("{");
    Object.keys(value.members).forEach
    (
        name => result.push(name+ ": " +buildInlineDefine(value.members[name]) +";")
    );
    result.push("}");
    return result.join(" ");
};
const buildDefineInterface = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.InterfaceDefine) =>
{
    let result = "";
    const currentIndent = buildIndent(options, indentDepth);
    const nextIndent = buildIndent(options, indentDepth +1);
    result += currentIndent +[buildExport(value), "type", name].filter(i => null !== i).join("") +returnCode;
    result += currentIndent +"{" +returnCode;
    Object.keys(value.members).forEach
    (
        name => result += nextIndent +name+ ": " +buildInlineDefine(value.members[name]) +";" +returnCode
    );
    result += currentIndent +"}" +returnCode;
    return result;
};
const buildDefineModuleCore = (members: { [key: string]: Types.Define; }): CodeEntry[] =>
[
    ...Object.keys(members).map(name => buildDefine(name, members[name])),
    ...Object.keys(members).map(name => buildValidator(name, members[name])),
];
const buildDefineModule = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.ModuleDefine) =>
{
    let result = "";
    const currentIndent = buildIndent(options, indentDepth);
    result += currentIndent +[buildExport(value), "type", name].filter(i => null !== i).join("") +returnCode;
    result += currentIndent +"{" +returnCode;
    result += buildDefineModuleCore(options, indentDepth +1, value.members);
    result += currentIndent +"}" +returnCode;
    return result;
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

const buildValidatorName = (_options: Types.TypeOptions, name: string) =>
    Text.getNameSpace(name).split(".").concat([`is${Text.toUpperCamelCase(Text.getNameBody(name))}`]).join(".");
const buildValidator = (options: Types.TypeOptions, name: string, define: Types.DefineOrRefer): CodeExpression[] =>
{
    if (Types.isRefer(define))
    {
        return [$expression(`${buildValidatorName(options, define.$ref)}(${name})`)];
    }
    else
    {
        return getBuilder(define).validator(name);
    }
};
const buildInlineValidator = (name: string, define: Types.TypeOrInterface): string =>
    `(value: unknown): value is ${name} => ${getBuilder(define).validator("value")}`;
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = JSON.parse(fget(jsonPath)) as Types.TypeSchema;;
    const result = buildCodeBlock(typeSource.options, 0, buildDefineModuleCore(typeSource.defines));
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
