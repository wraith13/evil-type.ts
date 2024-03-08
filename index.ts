'use strict';
import fs from "fs";
import { Types } from "./types"
const startAt = new Date();
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
const buildIndent = (indentUnit: Types.TypeOptions["indentUnit"], indent: number) =>
    Array.from({ length: indent, })
        .map(_ => "number" === typeof indentUnit ? Array.from({ length: indentUnit, }).map(_ => " ").join(""): indentUnit)
        .join("");
const buildExport = (define: { export?: boolean }) =>
    (define.export ?? true) ? "export": null;
const buildValue = (indentUnit: Types.TypeOptions["indentUnit"], indent: number, name: string, value: Types.ValueDefine) =>
    buildIndent(indentUnit, indent) +[buildExport(value), name, "=", value.value].filter(i => null !== i) +";";
const buildDefine = (indentUnit: Types.TypeOptions["indentUnit"], indent: number, define: Types.Define) =>
{
};
try
{
    const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
    console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    const typeSource = fget(jsonPath) as Types.TypeSchema;;
    typeSource.defines.map(i => )

}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
