'use strict';
const startAt = new Date();
import fs from "fs";
import { Types } from "./types";
const returnCode = "\n";
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
const buildIndent = (options: Types.TypeOptions, indentDepth: number) =>
    Array.from({ length: indentDepth, })
        .map(_ => "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(_ => " ").join(""): options.indentUnit)
        .join("");
const buildExport = (define: { export?: boolean } | { }) =>
    ("export" in define && (define.export ?? true)) ? "export": null;
const buildDefineLine = (options: Types.TypeOptions, indentDepth: number, declarator: string, name: string, define: Types.TypeOrInterfaceOrRefer): string =>
    buildIndent(options, indentDepth) +[buildExport(define), declarator, name, "=", buildInlineDefine(define)].filter(i => null !== i).join("") +";" +returnCode;
const buildValueValidatorExpression = (options: Types.TypeOptions, name: string, value: Types.ValueDefine): string =>
{
    if (null !== value && "object" === typeof value)
    {

    }
    if (undefined === value)
    {
        return `undefined === ${name}`;
    }
    else
    {
        return `${JSON.stringify(value)} === ${name}`;
    }
};
const buildValidatorLine = (options: Types.TypeOptions, indentDepth: number, declarator: string, name: string, define: Types.TypeOrInterfaceOrRefer): string =>
    buildIndent(options, indentDepth) +[buildExport(define), declarator, name, "=", buildInlineValidator(define)].filter(i => null !== i).join("") +";" +returnCode;
const buildInlineDefineValue = (value: Types.ValueDefine): string => JSON.stringify(value.value);
const buildDefineValue = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.ValueDefine): string =>
    buildDefineLine(options, indentDepth, "const", name, value);
const buildValueValidator = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.ValueDefine): string =>
    buildValidatorLine(options, indentDepth, "const", name, value);
const buildInlineDefineType = (value: Types.TypeDefine): string => buildInlineDefine(value.define);
const buildDefineType = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.TypeDefine): string =>
    buildDefineLine(options, indentDepth, "type", name, value);
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
const buildDefineModuleCore = (options: Types.TypeOptions, indentDepth: number, members: { [key: string]: Types.Define; }) =>
{
    let result = "";
    Object.keys(members).forEach(name => result += buildDefine(options, indentDepth, name, members[name]));
    Object.keys(members).forEach(name => result += buildValidator(options, indentDepth, name, members[name]));
    return result;
};
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
const buildDefine = (options: Types.TypeOptions, indentDepth: number, name: string, define: Types.Define): string =>
{
    switch(define.$type)
    {
    case "value":
        return buildDefineValue(options, indentDepth, name, define);
    case "type":
        return buildDefineType(options, indentDepth, name, define);
    case "interface":
        return buildDefineInterface(options, indentDepth, name, define);
    case "module":
        return buildDefineModule(options, indentDepth, name, define);
    }
};
const buildInlineDefine = (define: Types.TypeOrInterfaceOrRefer): string =>
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
        case "type":
            return buildInlineDefineType(define);
        case "array":
            return buildInlineDefineArray(define);
        case "interface":
            return buildInlineDefineInterface(define);
        }
    }
};
const buildValidator = (options: Types.TypeOptions, indentDepth: number, name: string, define: Types.Define): string =>
{
    switch(define.$type)
    {
    case "value":
        return buildValueValidator(options, indentDepth, name, define);
    case "type":
        return buildDefineType(options, indentDepth, name, define);
    case "interface":
        return buildDefineInterface(options, indentDepth, name, define);
    case "module":
        return buildDefineModule(options, indentDepth, name, define);
    }
};
const buildInlineValidator = (define: Types.TypeOrInterfaceOrRefer): string =>
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
        case "type":
            return buildInlineDefineType(define);
        case "array":
            return buildInlineDefineArray(define);
        case "interface":
            return buildInlineDefineInterface(define);
        }
    }
};
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = JSON.parse(fget(jsonPath)) as Types.TypeSchema;;
    let result = "";
    result += buildDefineModuleCore(typeSource.options, 0, typeSource.defines);
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
