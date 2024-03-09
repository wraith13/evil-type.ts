'use strict';
const startAt = new Date();
import fs from "fs";
import { Types } from "./types";
const returnCode = "\n";
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
const buildIndent = (indentUnit: Types.TypeOptions["indentUnit"], indent: number) =>
    Array.from({ length: indent, })
        .map(_ => "number" === typeof indentUnit ? Array.from({ length: indentUnit, }).map(_ => " ").join(""): indentUnit)
        .join("");
const buildExport = (define: { export?: boolean }) =>
    (define.export ?? true) ? "export": null;
const buildInlineValue = (_indentUnit: Types.TypeOptions["indentUnit"], _indent: number, value: Types.ValueDefine) =>
    value.value;
const buildValue = (indentUnit: Types.TypeOptions["indentUnit"], indent: number, name: string, value: Types.ValueDefine) =>
    buildIndent(indentUnit, indent) +[buildExport(value), "const", name, "=", buildInlineValue(indentUnit, indent, value)].filter(i => null !== i) +";" +returnCode;
const buildInlineType = (_indentUnit: Types.TypeOptions["indentUnit"], _indent: number, value: Types.TypeDefine) =>
    value.define;
const buildType = (indentUnit: Types.TypeOptions["indentUnit"], indent: number, name: string, value: Types.TypeDefine) =>
    buildIndent(indentUnit, indent) +[buildExport(value), "type", name, "=", buildInlineDefine(indentUnit, indent, value.define)].filter(i => null !== i) +";" +returnCode;
const buildDefine = (indentUnit: Types.TypeOptions["indentUnit"], indent: number, name: string, define: Types.Define) =>
{
    switch(define.$type)
    {
    case "value":
        return buildValue(indentUnit, indent, name, define);
    case "type":
        return buildType(indentUnit, indent, name, define);

    }
};
const buildInlineDefine = (indentUnit: Types.TypeOptions["indentUnit"], indent: number,  define: Types.TypeOrInterfaceOrRefer) =>
{
    if (define.$ref)
    {

    }
    switch(define.$type)
    {
    case "value":
        return buildInlineValue(indentUnit, indent, define);
    case "type":
        return buildInlineType(indentUnit, indent, define);

    }
};
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = fget(jsonPath) as Types.TypeSchema;;
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
