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
const buildInlineValue = (value: Types.ValueDefine) => value.value;
const buildValue = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, value: Types.ValueDefine) =>
    buildIndent(indentUnit, indentDepth) +[buildExport(value), "const", name, "=", buildInlineValue(value)].filter(i => null !== i).join("") +";" +returnCode;
const buildInlineType = (value: Types.TypeDefine) => buildInlineDefine(value.define);
const buildInlineArray = (value: Types.ArrayDefine) => buildInlineDefine(value.items) +"[]";
const buildType = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, value: Types.TypeDefine) =>
    buildIndent(indentUnit, indentDepth) +[buildExport(value), "type", name, "=", buildInlineDefine(value.define)].filter(i => null !== i).join("") +";" +returnCode;
const buildInlineInterface = (value: Types.InterfaceDefine) =>
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
const buildInterface = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, value: Types.InterfaceDefine) =>
{
    let result = "";
    result += buildIndent(indentUnit, indentDepth) +[buildExport(value), "type", name].filter(i => null !== i).join("") +returnCode;
    result += buildIndent(indentUnit, indentDepth) +"{" +returnCode;
    Object.keys(value.members).forEach
    (
        name => result += buildIndent(indentUnit, indentDepth +1) +name+ ": " +buildInlineDefine(value.members[name]) +";" +returnCode
    );
    result += buildIndent(indentUnit, indentDepth) +"}" +returnCode;
    return result;
};
const buildDefine = (indentUnit: Types.TypeOptions["indentUnit"], indentDepth: number, name: string, define: Types.Define): string =>
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
const buildInlineDefine = (define: Types.TypeOrInterfaceOrRefer): sgtring =>
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
        .map(name => buildDefine(typeSource.options.indentUnit, 0, name, typeSource.defines[name]))
        .join("");
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
