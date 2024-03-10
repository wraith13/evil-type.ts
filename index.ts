'use strict';
const startAt = new Date();
import fs from "fs";
import { Types } from "./types";
const returnCode = "\n";
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
const buildIndent = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number) =>
    Array.from({ length: indentDepth, })
        .map(_ => "number" === typeof indentUnit ? Array.from({ length: indentUnit, }).map(_ => " ").join(""): indentUnit)
        .join("");
const buildExport = (define: { export?: boolean }) =>
    (define.export ?? true) ? "export": null;
const buildInlineValue = (_indentUnit: Types.TypeOptions["indentUnit"], _indentDepth: number, value: Types.ValueDefine) =>
    value.value;
const buildValue = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, value: Types.ValueDefine) =>
    buildIndent(indentUnit, indentDepth) +[buildExport(value), "const", name, "=", buildInlineValue(indentUnit, indentDepth, value)].filter(i => null !== i).join("") +";" +returnCode;
const buildInlineType = (_indentUnit: Types.TypeOptions["indentUnit"], _indent: number, value: Types.TypeDefine) =>
    value.define;
const buildType = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, value: Types.TypeDefine) =>
    buildIndent(indentUnit, indentDepth) +[buildExport(value), "type", name, "=", buildInlineDefine(indentUnit, indentDepth, value.define)].filter(i => null !== i).join("") +";" +returnCode;
const buildInterface = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, value: Types.InterfaceDefine) =>
{
    let result = "";
    result += buildIndent(indentUnit, indentDepth) +[buildExport(value), "type", name].filter(i => null !== i).join("") +returnCode;
    result += buildIndent(indentUnit, indentDepth) +"{" +returnCode;
    Object.keys(value.members).forEach
    (
        name => result += buildIndent(indentUnit, indentDepth +1) +name+ ": " +buildInlineDefine(indentUnit, indentDepth, value.members[name]) +returnCode
    );
    result += buildIndent(indentUnit, indentDepth) +"}" +returnCode;
    return result;
};
const buildDefine = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, define: Types.Define) =>
{
    switch(define.$type)
    {
    case "value":
        return buildValue(indentUnit, indentDepth, name, define);
    case "type":
        return buildType(indentUnit, indentDepth, name, define);
    case "interface":
        return buildInterface(indentUnit, indentDepth, name, define);
    
    }
};
const buildInlineDefine = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number,  define: Types.TypeOrInterfaceOrRefer) =>
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
            return buildInlineValue(indentUnit, indentDepth, define);
        case "type":
            return buildInlineType(indentUnit, indentDepth, define);

        }
    }
};
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = JSON.parse(fget(jsonPath)) as Types.TypeSchema;;
    Object.keys(typeSource.defines)
        .map(name => buildDefine(typeSource.options.indentUnit, 0, name, typeSource.defines[name]))
        .join("");
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
