'use strict';
const startAt = new Date();
import fs from "fs";
import { Jsonable } from "./jsonable";
import { TypesError } from "./types-error";
import { TypesPrime } from "./types-prime";
import { Types } from "./types";
import { Text } from "./text";
import config from "../resource/config.json";
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
const removeNullFilter = <ElementType>(list: (ElementType | null)[]): ElementType[] =>
    list.filter(i => null !== i) as ElementType[];
const isEmptyArray = (list: unknown) => Array.isArray(list) && list.length <= 0;
const kindofJoinExpression = <T>(list: T[], separator: CodeExpression) =>
        list.reduce
        (
            (a, b) => isEmptyArray(a) || isEmptyArray(b) ?
                (Array.isArray(a) ? a: [a]).concat(Array.isArray(b) ? [...b]: [b]):
                (Array.isArray(a) ? a: [a]).concat(Array.isArray(b) ? [separator, ...b]: [separator, b]),
            <CodeExpression[]>[]
        );
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
//     "expressions" in value && Array.isArray(value.expressions) && value.expressions.every(i => isCodeExpression(i));
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
//     "lines" in value && Array.isArray(value.lines) && value.lines.every(i => isCodeLine(i));
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
//     "header" in value && Array.isArray(value.header) && value.header.every(i => isCodeExpression(i)) &&
//     "lines" in value && Array.isArray(value.lines) && value.lines.every(i => isCodeLine(i));
type CodeEntry = CodeInlineBlock | CodeLine | CodeBlock;
export const $expression = (expression: CodeExpression["expression"]): CodeExpression => ({ $code: "expression", expression, });
export const $line = (expressions: CodeLine["expressions"]): CodeLine => ({ $code: "line", expressions, });
export const $iblock = (lines: CodeInlineBlock["lines"]): CodeInlineBlock => ({ $code: "inline-block", lines, });
export const $block = (header: CodeBlock["header"], lines: CodeBlock["lines"]): CodeBlock => ({ $code: "block", header, lines, });
export module Build
{
// data:input(json) to data:code(object)
    export const buildExport = (define: { export?: boolean } | { }): CodeExpression[] =>
        ("export" in define && (define.export ?? true)) ? [$expression("export")]: [];
    export const buildExtends = (define: Types.InterfaceDefinition): CodeExpression[] =>
        undefined !== define.extends ? [$expression("extends"), ...define.extends.map((i, ix, list) => $expression(ix < (list.length -1) ? `${i.$ref},`: `${i.$ref}`))]: [];
    export module Define
    {
        export const buildDefineLine = (declarator: string, name: string, define: Types.TypeOrValue, postEpressions: CodeExpression[] = []): CodeLine =>
            $line([ ...buildExport(define), $expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineDefine(define)), ...postEpressions, ]);
        export const buildInlineDefineLiteral = (define: Types.LiteralElement) => [$expression(JSON.stringify(define.literal))];
        export const buildInlineDefinePrimitiveType = (value: Types.PrimitiveTypeElement) =>
            $expression(value.type);
        export const buildDefinePrimitiveType = (name: string, value: Types.PrimitiveTypeElement): CodeLine =>
            buildDefineLine("type", name, value);
        export const enParenthesis = <T extends CodeInlineEntry>(expressions: T[]) =>
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
        export const buildInlineDefineEnum = (value: Types.EnumTypeElement) =>
            kindofJoinExpression(value.members.map(i => $expression(JSON.stringify(i))), $expression("|"));
        export const buildInlineDefineArray = (value: Types.ArrayElement) =>
            [ ...enParenthesisIfNeed(buildInlineDefine(value.items)), $expression("[]"), ];
        export const buildInlineDefineDictionary = (value: Types.DictionaryElement) =>
            $iblock([ $line([ $expression("[key: string]:"), ...buildInlineDefine(value.valueType), ]) ]);
        export const buildInlineDefineAnd = (value: Types.AndElement) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("&"));
        export const buildInlineDefineOr = (value: Types.OrElement) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("|"));
        export const buildDefineInlineInterface = (value: Types.InterfaceDefinition) =>
        {
            const members = value.members;
            if (Types.isDictionaryElement(members))
            {
                return buildInlineDefineDictionary(members);
            }
            else
            {
                return $iblock
                (
                    Object.keys(members)
                        .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(members[name])]))
                );
            }
        };
        export const buildDefineInterface = (name: string, value: Types.InterfaceDefinition): CodeBlock =>
        {
            const header = [ ...buildExport(value), ...["interface", name].map(i => $expression(i)), ...buildExtends(value), ];
            const members = value.members;
            if (Types.isDictionaryElement(members))
            {
                return $block(header, [ $line([ $expression("[key: string]:"), ...buildInlineDefine(members.valueType), ]) ]);
            }
            else
            {
                const lines = Object.keys(members)
                    .map(name => $line([ $expression(name+ ":"), ...buildInlineDefine(members[name]), ]));
                return $block(header, lines);
            }
        };
        export const buildDefineModuleCore = (members: { [key: string]: Types.Definition; }): CodeEntry[] =>
        [
            ...Object.entries(members)
                .map(i => Build.Define.buildDefine(i[0], i[1])),
            ...removeNullFilter
            (
                Object.entries(members)
                    .map(i => Types.isModuleDefinition(i[1]) || ! Build.Validator.isValidatorTarget(i[1]) ? null: Build.Validator.buildValidator(i[0], i[1]))
            )
        ];
        export const buildDefineModule = (name: string, value: Types.ModuleDefinition): CodeBlock =>
        {
            const header = [...buildExport(value), $expression("module"), $expression(name), ];
            const lines = buildDefineModuleCore(value.members);
            return $block(header, lines);
        };
        export const buildImports = (imports: undefined | Types.ImportDefinition[]) =>
            undefined === imports ? []: imports.map(i => $line([ $expression("import"), $expression(i.target), $expression("from"), $expression(JSON.stringify(i.from)) ]));
        export const buildDefine = (name: string, define: Types.Definition): CodeEntry =>
        {
            switch(define.$type)
            {
            case "interface":
                return buildDefineInterface(name, define);
            case "module":
                return buildDefineModule(name, define);
            case "type":
                return buildDefineLine("type", name, define);
            case "value":
                return buildDefineLine("const", name, define, [ $expression("as"), $expression("const"), ]);
            }
        };
        export const buildInlineDefine = (define: Types.TypeOrValueOfRefer): (CodeExpression | CodeInlineBlock)[] =>
        {
            if (Types.isReferElement(define))
            {
                return [ $expression(define.$ref), ];
            }
            else
            {
                switch(define.$type)
                {
                case "literal":
                    return buildInlineDefineLiteral(define);
                case "typeof":
                    return [ <CodeExpression | CodeInlineBlock>$expression("typeof"), ...buildInlineDefine(define.value), ];
                case "itemof":
                    return [ <CodeExpression | CodeInlineBlock>$expression("typeof"), $expression(`${define.value.$ref}[number]`), ];
                case "value":
                    return buildInlineDefine(define.value);
                case "primitive-type":
                    return [ buildInlineDefinePrimitiveType(define), ];
                case "type":
                    return buildInlineDefine(define.define);
                case "enum-type":
                    return buildInlineDefineEnum(define);
                case "array":
                    return buildInlineDefineArray(define);
                case "and":
                    return buildInlineDefineAnd(define);
                case "or":
                    return buildInlineDefineOr(define);
                case "interface":
                    return [ buildDefineInlineInterface(define), ];
                case "dictionary":
                    return [ buildInlineDefineDictionary(define), ];
                }
            }
        };
    }
    export module Validator
    {
        export const buildLiterarlValidatorExpression = (name: string, value: Jsonable.Jsonable): CodeExpression[] =>
        {
            if (null !== value && "object" === typeof value)
            {
                if (Array.isArray(value))
                {
                    const list: CodeExpression[] = [];
                    list.push($expression(`Array.isArray(${name})`));
                    list.push($expression("&&"));
                    list.push($expression(`${value.length} <= ${name}.length`));
                    value.forEach
                    (
                        (i, ix) =>
                        {
                            list.push($expression("&&"));
                            list.push(...buildLiterarlValidatorExpression(`${name}[${ix}]`, i));
                        }
                    );
                    return list;
                }
                else
                {
                    const list: CodeExpression[] = [];
                    list.push($expression(`null !== ${name}`));
                    list.push($expression("&&"));
                    list.push($expression(`"object" === typeof ${name}`));
                    Object.keys(value).forEach
                    (
                        key =>
                        {
                            list.push($expression("&&"));
                            list.push($expression(`"${key}" in ${name}`));
                            list.push($expression("&&"));
                            list.push(...buildLiterarlValidatorExpression(`${name}.${key}`, value[key]));
                        }
                    );
                    return list;
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
        export const buildInlineLiteralValidator = (define: Types.LiteralElement) =>
            $expression(`(value: unknown): value is ${Define.buildInlineDefineLiteral(define)} => ${buildLiterarlValidatorExpression("value", define.literal)};`);
        export const buildValidatorLine = (declarator: string, name: string, define: Types.Type): CodeExpression[] =>
            [ ...buildExport(define), $expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineValidator(name, define)), ];
        export const buildValidatorName = (name: string) =>
            [ ...Text.getNameSpace(name).split("."), `is${Text.toUpperCamelCase(Text.getNameBody(name))}`, ].filter(i => "" !== i).join(".");
        export const buildValidatorExpression = (name: string, define: Types.TypeOrValueOfRefer): CodeExpression[] =>
        {
            if (Types.isReferElement(define))
            {
                return [ $expression(`${buildValidatorName(define.$ref)}(${name})`), ];
            }
            else
            {
                switch(define.$type)
                {
                case "literal":
                    return buildLiterarlValidatorExpression(name, define.literal);
                case "typeof":
                    return buildValidatorExpression(name, define.value);
                case "itemof":
                    return [ $expression(`${define.value.$ref}.includes(${name} as any)`), ];
                case "value":
                    return buildValidatorExpression(name, define.value);
                case "primitive-type":
                    return [
                        $expression
                        (
                            "null" === define.type ?
                                `"${define.type}" === ${name}`:
                                `"${define.type}" === typeof ${name}`
                        ),
                    ];
                case "type":
                    return buildValidatorExpression(name, define.define);
                case "enum-type":
                    return [ $expression(`${JSON.stringify(define.members)}.includes(${name} as any)`), ];
                case "array":
                    return [
                        $expression(`Array.isArray(${name})`),
                        $expression("&&"),
                        $expression(`${name}.every(`),
                        $expression("i"),
                        $expression("=>"),
                        ...buildValidatorExpression("i", define.items),
                        $expression(")")
                    ];
                case "and":
                    return kindofJoinExpression
                    (
                        define.types.map
                        (
                            i => TypesPrime.isObject(i) ?
                                Define.enParenthesis(buildValidatorExpression(name, i)):
                                buildValidatorExpression(name, i)
                        ),
                        $expression("&&")
                    );
                case "or":
                    return  kindofJoinExpression
                    (
                        define.types.map(i => buildValidatorExpression(name, i)),
                        $expression("||")
                    );
                case "interface":
                    return buildInterfaceValidator(name, define);
                case "dictionary":
                    return [
                        $expression(`null !== ${name}`),
                        $expression("&&"),
                        $expression(`"object" === typeof ${name}`),
                        $expression("&&"),
                        $expression(`Object.values(${name}).every(`),
                        $expression("i"),
                        $expression("=>"),
                        ...buildValidatorExpression("i", define.valueType),
                        $expression(")")
                    ];
                }
            }
        };
        export const buildInterfaceValidator = (name: string, define: Types.InterfaceDefinition): CodeExpression[] =>
        {
            const list: CodeExpression[] = [];
            const members = define.members;
            if (undefined !== define.extends)
            {
                define.extends.forEach
                (
                    (i, ix, _l) =>
                    {
                        if (0 < ix)
                        {
                            list.push($expression("&&"));
                        }
                        list.push(...convertToExpression(buildValidatorExpression(name, i)));
                    }
                )
            }
            if (Types.isDictionaryElement(members))
            {
                if (undefined !== define.extends)
                {
                    list.push($expression("&&"));
                }
                else
                {
                }
                list.push(...buildValidatorExpression(name, members));
            }
            else
            {
                if (undefined !== define.extends)
                {
                }
                else
                {
                    list.push($expression(`null !== ${name}`));
                    list.push($expression("&&"));
                    list.push($expression(`"object" === typeof ${name}`));
                }
                Object.keys(members).forEach
                (
                    k =>
                    {
                        const key = Text.getPrimaryKeyName(k);
                        const value = members[k];
                        const base = convertToExpression(buildValidatorExpression(`${name}.${key}`, value));
                        const current = Types.isOrElement(value) ?
                            Define.enParenthesis(base):
                            base;
                        if (k === key)
                        {
                            list.push($expression("&&"));
                            list.push($expression(`"${key}" in ${name}`));
                            list.push($expression("&&"));
                            list.push(...current);
                        }
                        else
                        {
                            list.push($expression("&&"));
                            list.push($expression("("));
                            list.push($expression(`! ("${key}" in ${name})`));
                            list.push($expression("||"));
                            list.push(...current);
                            list.push($expression(")"));
                        }
                    }
                );
            }
            return list;
        };
        export const buildInlineValidator = (name: string, define: Types.TypeOrValue) =>
        [
            $expression(`(value: unknown): value is ${Types.isValueDefinition(define) ? "typeof " +name: name} =>`),
            ...buildValidatorExpression("value", define),
        ];
        export const isValidatorTarget = (define: Types.TypeOrValue) =>
            ! (Types.isValueDefinition(define) && false === define.validator);
        export const buildValidator = (name: string, define: Types.TypeOrValue): CodeLine => $line
        ([
            ...buildExport(define),
            $expression("const"),
            $expression(buildValidatorName(name)),
            $expression("="),
            ...buildInlineValidator(name, define),
        ]);
    }
}
export module Format
{
// data:code(object) to data:output(text)
    export const getMaxLineLength = (options: Types.OutputOptions): null | number =>
        TypesPrime.isUndefined(options.maxLineLength) ? config.maxLineLength: options.maxLineLength;
    export const buildIndent = (options: Types.OutputOptions, indentDepth: number) =>
        Array.from({ length: indentDepth, })
        .map(_ => "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(_ => " ").join(""): options.indentUnit)
        .join("");
    export const getReturnCode = (_options: Types.OutputOptions) => "\n";
    export const expressions = (code: CodeExpression[]): string =>
        code.map(i => i.expression).join(" ");
    export const getTokens = (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock): string[] =>
    {
        switch(code.$code)
        {
        case "inline-block":
            return [ "{", ...code.lines.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []), "}", ];
        case "line":
            return code.expressions.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []);
        case "expression":
            return [ code.expression, ];
        }
    };
    export const separator = (options: Types.OutputOptions, indentDepth: number, result: string, buffer: string, tokens: string[], i: number) =>
    {
        const token = tokens[i];
        if ("" === buffer)
        {
            if ("" === result)
            {
                return buildIndent(options, indentDepth);
            }
            else
            {
                return buildIndent(options, indentDepth +1);
            }
        }
        else
        {
            if ("[]" === token)
            {
                return "";
            }
        }
        return " ";
    };
    export const temporaryAssembleLine = (options: Types.OutputOptions, indentDepth: number, result: string, buffer: string, tokens: string[], i: number, length: number) =>
    {
        let ix = i;
        let temporary = buffer;
        let ixEnd = Math.min(tokens.length, i +length);
        while(ix < ixEnd)
        {
            temporary += separator(options, indentDepth, result, temporary, tokens, ix);
            temporary += tokens[ix];
            ++ix;
        }
        return temporary;
    }
    export const isLineBreak = (options: Types.OutputOptions, indentDepth: number, result: string, buffer: string, tokens: string[], i: number) =>
    {
        const maxLineLength = getMaxLineLength(options);
        if (null !== maxLineLength)
        {
            if (i +1 < tokens.length && maxLineLength <= temporaryAssembleLine(options, indentDepth, result, buffer, tokens, i +1, 1).length)
            {
                return ! config.lineUnbreakableTokens.heads.includes(tokens[i]) && ! config.lineUnbreakableTokens.tails.includes(tokens[i +1]);
            }
            if (i +2 < tokens.length && maxLineLength <= temporaryAssembleLine(options, indentDepth, result, buffer, tokens, i +1, 2).length)
            {
                return config.lineUnbreakableTokens.heads.includes(tokens[i +1]) || config.lineUnbreakableTokens.tails.includes(tokens[i +2]);
            }
        }
        return false;
    }
    export const line = (options: Types.OutputOptions, indentDepth: number, code: CodeLine): string =>
    {
        const tokens = code.expressions.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []);
        const returnCode = getReturnCode(options);
        let i = 0;
        let result = "";
        let buffer = "";
        while(i < tokens.length)
        {
            buffer = temporaryAssembleLine(options, indentDepth, result, buffer, tokens, i, 1);
            if (isLineBreak(options, indentDepth, result, buffer, tokens, i))
            {
                result += buffer +returnCode;
                buffer = "";
            }
            ++i;
        }
        result += buffer +";" +returnCode;
        return result;
    };
    export const inlineBlock = (options: Types.OutputOptions, indentDepth: number, code: CodeInlineBlock): string =>
        [ "{", ...code.lines.map(i => text(options, indentDepth +1, i)), "}", ].join(" ");
    export const block = (options: Types.OutputOptions, indentDepth: number, code: CodeBlock): string =>
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
    export const text = (options: Types.OutputOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]): string =>
    {
        if (Array.isArray(code))
        {
            return code.map(i => text(options, indentDepth, i)).join("");
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
    const rawSource = fget(jsonPath);
    const typeSource = Jsonable.parse(rawSource);
    const errorListner = TypesError.makeListener(jsonPath);
    if (Types.isTypeSchema(typeSource, errorListner))
    {
        const code =
        [
            ...Build.Define.buildImports(typeSource.imports),
            ...Build.Define.buildDefineModuleCore(typeSource.defines),
        ];
        const result = Format.text(typeSource.options, 0, code);
        if (typeSource.options.outputFile)
        {
            fs.writeFileSync(typeSource.options.outputFile, result, { encoding: "utf-8" });
            console.log(errorListner);
        }
        else
        {
            console.log(result);
        }
        console.log(`✅ ${jsonPath} build end: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    }
    else
    {
        console.error("🚫 Invalid TypeSchema");
        console.error(errorListner);
        console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
    }
}
catch(error)
{
    console.error(error);
    console.log(`🚫 ${jsonPath} build failed: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
}
// how to run: `node ./index.js .......`
