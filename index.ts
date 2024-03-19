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
const buildInlineValue = (value: Types.ValueDefine): string => JSON.stringify(value.value);
const buildValue = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.ValueDefine): string =>
    buildDefineLine(options, indentDepth, "const", name, value);
const buildInlineType = (value: Types.TypeDefine): string => buildInlineDefine(value.define);
const buildType = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.TypeDefine): string =>
    buildDefineLine(options, indentDepth, "type", name, value);
const buildInlineArray = (value: Types.ArrayDefine): string => buildInlineDefine(value.items) +"[]";
const buildInlineInterface = (value: Types.InterfaceDefine): string =>
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
const buildInterface = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.InterfaceDefine) =>
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
const buildModule = (options: Types.TypeOptions, indentDepth: number, name: string, value: Types.ModuleDefine) =>
{
    let result = "";
    const currentIndent = buildIndent(options, indentDepth);
    const nextIndent = indentDepth +1;
    result += currentIndent +[buildExport(value), "type", name].filter(i => null !== i).join("") +returnCode;
    result += currentIndent +"{" +returnCode;
    Object.keys(value.members).forEach(name => result += buildDefine(options, nextIndent, name, value.members[name]));
    result += currentIndent +"}" +returnCode;
    return result;
};
const buildDefine = (options: Types.TypeOptions, indentDepth: number, name: string, define: Types.Define): string =>
{
    switch(define.$type)
    {
    case "value":
        return buildValue(options, indentDepth, name, define);
    case "type":
        return buildType(options, indentDepth, name, define);
    case "interface":
        return buildInterface(options, indentDepth, name, define);
    case "module":
        return buildModule(options, indentDepth, name, define);
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
            return buildInlineValue(define);
        case "type":
            return buildInlineType(define);
        case "array":
            return buildInlineArray(define);
        case "interface":
            return buildInlineInterface(define);
        }
    }
};
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = JSON.parse(fget(jsonPath)) as Types.TypeSchema;;
    Object.keys(typeSource.defines)
        .map(name => buildDefine(typeSource.options, 0, name, typeSource.defines[name]))
        .join("");
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
