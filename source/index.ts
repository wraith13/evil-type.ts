'use strict';
const startAt = new Date();
import fs from "fs";
import { EvilType } from "../common/evil-type";
import { Jsonable } from "../generated/code/jsonable";
import { Type } from "../generated/code/type";
import { Text } from "./text";
import config from "../resource/config.json";
if (3 !== process.argv.length)
{
    console.error("🚫 Unmatch command parameter.");
    console.error("You can specify one type definition JSON file.");
    console.error(`See ${config.repository}`);
    process.exit(1);
}
const getBuildTime = () => new Date().getTime() - startAt.getTime();
const jsonPath = process.argv[2];
console.log(`🚀 ${jsonPath} build start: ${startAt}`);
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
                    result.concat(...convertToExpression(i.expressions), $expression(";"));
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
interface CodeInlineBlock extends Code
{
    $code: "inline-block";
    //header: never;
    lines: CodeInlineEntry[];
};
interface CodeBlock extends Code
{
    $code: "block";
    header: CodeExpression[];
    lines: CodeEntry[];
};
type CodeEntry = CodeInlineBlock | CodeLine | CodeBlock;
export const $expression = (expression: CodeExpression["expression"]): CodeExpression => ({ $code: "expression", expression, });
export const $line = (expressions: CodeLine["expressions"]): CodeLine => ({ $code: "line", expressions, });
export const $comment = (define: Type.CommentProperty): CodeLine[] => define.comment ? define.comment.map(i => $line([$expression("//"), $expression(i)])): [];
export const $iblock = (lines: CodeInlineBlock["lines"]): CodeInlineBlock => ({ $code: "inline-block", lines, });
export const $block = (header: CodeBlock["header"], lines: CodeBlock["lines"]): CodeBlock => ({ $code: "block", header, lines, });
const stringifyTokens = (json: Jsonable.Jsonable) =>
    Jsonable.stringify(json, null, 1).split(/[\r\n]+[\t ]*/)
    .map(i => $expression(i));
export namespace Build
{
    export const buildExport = (data: BaseProcess<{ export?: boolean; }>): CodeExpression[] =>
        (data.value.export ?? data.options.default?.export ?? true) ? [ $expression("export"), ]: [];
    export const getAdditionalProperties = (data: BaseProcess<{ additionalProperties?: boolean; }>) =>
        data.value.additionalProperties ?? data.options.default?.additionalProperties;
    export const buildExtends = (define: Type.InterfaceDefinition): CodeExpression[] =>
        undefined !== define.extends ? [$expression("extends"), ...define.extends.map((i, ix, list) => $expression(ix < (list.length -1) ? `${i.$ref},`: `${i.$ref}`))]: [];
    export const asConst = [ $expression("as"), $expression("const"), ];
    export const buildLiteralAsConst = (literal: Jsonable.Jsonable) =>
        [ ...stringifyTokens(literal), ...asConst, ];
    export interface BaseProcess<ValueType>
    {
        source: Type.TypeSchema;
        options: Type.OutputOptions;
        definitions: Type.DefinitionMap;
        path: string;
        key: string;
        value: ValueType;
    };
    export type NextProcess<base extends BaseProcess<unknown>, ValueType> = Omit<base, "value"> & { value: ValueType };
    export const nextProcess = <Process extends BaseProcess<unknown>, ValueType>(current: Process, key: null | string, value: ValueType): NextProcess<Process, ValueType> =>
        null === key ?
            Object.assign({ }, current, { value, }):
            Object.assign({ }, current, { path: nextPath(current.path, key), key, value, });
    export const nextPath = (path: string, key: null | string) =>
        null === key ?
            path:
            "" === path?
                key:
                `${path}.${key}`;
    export const makeDefinitionFlatMap = (defines: Type.DefinitionMap): Type.DefinitionMap =>
    {
        const result: { [key: string]: Type.Definition } = { };
        Object.entries(defines).forEach
        (
            i =>
            {
                const key = i[0];
                const value = i[1];
                if (Type.isDefinition(value))
                {
                    result[key] = value;
                    if (Type.isNamespaceDefinition(value))
                    {
                        Object.entries(makeDefinitionFlatMap(value.members))
                            .forEach(j => result[`${key}.${j[0]}`] = j[1]);
                    }
                }
            }
        );
        return result;
    };
    export const getAbsolutePath = (data: BaseProcess<unknown>, value: Type.ReferElement, context: string = data.path): string =>
    {
        if ("" === context)
        {
            return value.$ref;
        }
        else
        {
            const path = `${context}.${value.$ref}`;
            if (data.definitions[path])
            {
                return path;
            }
            return getAbsolutePath(data, value, Text.getNameSpace(context));
        }
    };
    export const getDefinition = <Process extends BaseProcess<Type.ReferElement>>(data: Process): NextProcess<Process, Type.Definition> =>
    {
        const path = getAbsolutePath(data, data.value);
        return Object.assign({ }, data, { path, value: data.definitions[path], });
    };
    export const resolveRefer = <Process extends BaseProcess<Type.TypeOrValueOfRefer>>(data: Process): NextProcess<Process, Type.TypeOrLiteralOfRefer> =>
    {
        if (Type.isReferElement(data.value))
        {
            const next = getDefinition(nextProcess(data, null, data.value));
            if (Type.isTypeOrValueOfRefer(next.value))
            {
                return resolveRefer(<Process>next);
            }
            else
            {
                return nextProcess(data, null, data.value);
            }
        }
        if (Type.isValueDefinition(data.value))
        {
            if (Type.isReferElement(data.value.value))
            {
                return resolveRefer(<Process>nextProcess(data, null, data.value.value));
            }
            else
            {
                return nextProcess(data, null, data.value.value);
            }
        }
        if (Type.isTypeDefinition(data.value))
        {
            return resolveRefer(<Process>nextProcess(data, null, data.value.define));
        }
        if (Type.isMemberofElement(data.value))
        {
            return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>resolveRefer(getMemberofTarget(nextProcess(data, null, data.value)));
        }
        return nextProcess(data, null, data.value);
    };
    export const getKeyofTarget = <Process extends BaseProcess<Type.KeyofElement>>(data: Process) => resolveRefer
    (
        nextProcess
        (
            data,
            null,
            Type.isTypeofElement(data.value.value) ?
                data.value.value.value:
                data.value.value
        )
    );
    export const getMemberofTarget = <Process extends BaseProcess<Type.MemberofElement>>(data: Process): NextProcess<Process, Type.TypeOrLiteralOfRefer>  =>
    {
        const entry = resolveRefer
        (
            nextProcess
            (
                data,
                null,
                data.value.value
            )
        );
        if (Type.isLiteralElement(entry.value))
        {
            if (EvilType.Validator.isObject(entry.value.const) && data.value.key in entry.value.const)
            {
                const value = (entry.value.const as any)[data.value.key];
                if (Jsonable.isJsonable(value))
                {
                    return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>nextProcess(entry, `${data.value.key}`, <Type.LiteralElement>{ const: value });
                }
            }
        }
        else
        if (Type.isType(entry.value))
        {
            switch(entry.value.type)
            {
            case "interface":
                return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>nextProcess(entry, `${data.value.key}`, entry.value.members[data.value.key] ?? <Type.NeverType>{ "type": "never" });
            case "dictionary":
                return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>nextProcess(entry, `${data.value.key}`, entry.value.valueType);
            case "or":
                return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>nextProcess
                (
                    entry,
                    `${data.value.key}`,
                    <Type.OrElement>
                    {
                        type: "or",
                        types: entry.value.types.map
                        (
                            i => getMemberofTarget
                            (
                                nextProcess
                                (
                                    entry,
                                    null,
                                    <Type.MemberofElement>
                                    {
                                        type: "memberof",
                                        value: i,
                                        key: data.value.key,
                                    }
                                )
                            ).value
                        )
                    }
                );
            case "and":
                return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>nextProcess
                (
                    entry,
                    `${data.value.key}`,
                    <Type.AndElement>
                    {
                        type: "and",
                        types: entry.value.types.map
                        (
                            i => getMemberofTarget
                            (
                                nextProcess
                                (
                                    entry,
                                    null,
                                    <Type.MemberofElement>
                                    {
                                        type: "memberof",
                                        value: i,
                                        key: data.value.key,
                                    }
                                )
                            ).value
                        )
                    }
                );
            }
        }
        return <NextProcess<Process, Type.TypeOrLiteralOfRefer>>nextProcess(entry, `${data.value.key}`, <Type.NeverType>{ "type": "never" });
    }
    export const getSafeInteger = <Process extends BaseProcess<unknown>>(data: Process) =>
    {
        if ((Type.isIntegerType(data.value)) && undefined !== data.value.safeInteger)
        {
            return data.value.safeInteger;
        }
        return data.options.default?.safeInteger ?? config.safeInteger;
    }
    export const getSafeNumber = <Process extends BaseProcess<unknown>>(data: Process) =>
    {
        if ((Type.isNumberType(data.value)) && undefined !== data.value.safeNumber)
        {
            return data.value.safeNumber;
        }
        return data.options.default?.safeNumber ?? config.safeNumber;
    }
    export const getRegexpFlags = <Process extends BaseProcess<unknown>>(data: Process) =>
    {
        if ((Type.isPatternStringType(data.value) || Type.isFormatStringType(data.value)) && undefined !== data.value.regexpFlags)
        {
            return data.value.regexpFlags;
        }
        return data.options.default?.regexpFlags ?? config.regexpFlags;
    }
    export const getLiteral = <Process extends BaseProcess<Type.ReferElement>>(data: Process): Type.LiteralElement | null =>
    {
        const definition = getDefinition(data);
        if (Type.isValueDefinition(definition.value))
        {
            if (Type.isLiteralElement(definition.value.value))
            {
                return definition.value.value;
            }
            else
            {
                return getLiteral(nextProcess(definition, null, definition.value.value));
            }
        }
        return null;
    };
    export const getKeys = (data: BaseProcess<Type.InterfaceDefinition>): string[] =>
    {
        const result: string[] = [];
        if (data.value.extends)
        {
            data.value.extends.forEach
            (
                i =>
                {
                    const current = resolveRefer(nextProcess(data, null, i));
                    if (Type.isInterfaceDefinition(current.value))
                    {
                        result.push(...getKeys(nextProcess(current, null, current.value)));
                    }
                }
            )
        }
        result.push(...Object.keys(data.value.members));
        return result;
    };
    export const getActualKeys = (data: BaseProcess<Type.TypeOrRefer>): string[] =>
    {
        const target = resolveRefer(data);
        if (Type.isLiteralElement(target.value))
        {
            if (EvilType.Validator.isArray(EvilType.Validator.isString)(target.value.const))
            {
                return target.value.const;
            }
            else
            {
                return [];
            }
        }
        if (Type.isType(target.value))
        {
            switch(target.value.type)
            {
            case "keyof":
                {
                    const entry = getKeyofTarget(nextProcess(target, null, target.value));
                    if (Type.isInterfaceDefinition(entry.value))
                    {
                        return getKeys(nextProcess(entry, null, entry.value));
                    }
                    else
                    if (Type.isDictionaryDefinition(entry.value))
                    {
                        if (undefined !== entry.value.keyin)
                        {
                            return getActualKeys(nextProcess(entry, null, entry.value.keyin));
                        }
                    }
                    else
                    if (Type.isLiteralElement(entry.value))
                    {
                        if (EvilType.Validator.isObject(entry.value.const))
                        {
                            return Object.keys(entry.value.const);
                        }
                    }
                    return [];
                }
            case "itemof":
                {
                    const entry = resolveRefer(nextProcess(target, null, target.value.value));
                    if (Type.isLiteralElement(entry.value))
                    {
                        if (EvilType.Validator.isArray(EvilType.Validator.isString)(entry.value.const))
                        {
                            return entry.value.const;
                        }
                    }
                    return [];
                }
            case "enum-type":
                return target.value.members.map(i => `${i}`);
            case "or":
                return target.value.types.map(i => getActualKeys(nextProcess(target, null, i))).reduce((a, b) => [...a, ...b], []);
            }
        }
        return [];
    }
    export const applyOptionality = (key: string, optionality: Type.DictionaryDefinition["optionality"]) =>
    {
        switch(optionality ?? "as-is")
        {
        case "as-is":
            return key;
        case "partial":
            return key.replace(/\??$/, "?");
        case "required":
            return Text.getPrimaryKeyName(key);
        }
    };
    export const isDetailedDictionary = <Process extends BaseProcess<Type.DictionaryDefinition>>(data: Process): data is Process & { value: { keyin: Type.TypeOrRefer; } } =>
        undefined !== data.value.keyin;
    export const dictionaryToInterface = <Process extends BaseProcess<Type.DictionaryDefinition> & { value: { keyin: Type.TypeOrRefer; } }>(data: Process): NextProcess<Process, Type.InterfaceDefinition> =>
    {
        const result: Type.InterfaceDefinition =
        {
            type: "interface",
            members: { }
        };
        getActualKeys(nextProcess(data, null, data.value.keyin))
            .forEach(key => result.members[applyOptionality(key, data.value.optionality)] = data.value.valueType);
        if (undefined !== data.value.additionalProperties)
        {
            result.additionalProperties = data.value.additionalProperties;
        }
        return nextProcess(data, null, result);
    };
    export const sortType = <Process extends BaseProcess<Type.TypeOrRefer>>(data: Process): Process =>
    {
        const sortBy = data.options.regulateType?.sortBy ?? config.regulateType.sortBy;
        switch(sortBy)
        {

        }
        return data;
    };
    export const mergeType = <Process extends BaseProcess<Type.TypeOrRefer>>(data: Process): Process =>
    {
        const merge = data.options.regulateType?.merge ?? config.regulateType.merge;
        if(merge)
        {
            const target = resolveRefer(data);
            if (Type.isOrElement(target.value))
            {
                return <Process>mergeOrElement(nextProcess(data, null, target.value));
            }
            if (Type.isAndElement(target.value))
            {
                return <Process>mergeAndElement(nextProcess(data, null, target.value));
            }
        }
        return data;
    };
    export type TypeCompatibility = "unknown" | "same" | "wide" | "narrow" | "overlapping" | "exclusive";
    export const orTypeCompatibility = (list: TypeCompatibility[]): TypeCompatibility =>
    {
        if (list.includes("same"))
        {
            return "same";
        }
        else
        if (list.includes("wide"))
        {
            return "wide";
        }
        else
        if (list.includes("narrow"))
        {
            return "narrow";
        }
        else
        if (list.includes("overlapping"))
        {
            return "overlapping";
        }
        else
        if (list.includes("exclusive"))
        {
            return "exclusive";
        }
        else
        {
            return "unknown";
        }
    };
    export const andTypeCompatibility = (list: TypeCompatibility[]): TypeCompatibility =>
    {
        if (list.includes("unknown"))
        {
            return "unknown";
        }
        else
        if (list.includes("exclusive"))
        {
            return "exclusive";
        }
        else
        if (list.includes("overlapping"))
        {
            return "overlapping";
        }
        else
        if (list.includes("narrow"))
        {
            return "narrow";
        }
        else
        if (list.includes("wide"))
        {
            return "wide";
        }
        else
        {
            return "same";
        }
    };
    export const reverseTypeCompatibility = (value: TypeCompatibility): TypeCompatibility =>
    {
        switch(value)
        {
        case "wide":
            return "narrow";
        case "narrow":
            return "wide";
        default:
            return value;
        }
    }
    export const compareType = <Process extends BaseProcess<Type.TypeOrLiteralOfRefer>>(a: Process, b: Process): TypeCompatibility =>
    {
        const aTarget = resolveRefer(a);
        const bTarget = resolveRefer(b);
        if (Type.isAnyType(aTarget.value))
        {
            if (Type.isAnyType(bTarget.value))
            {
                return "same";
            }
            return "wide";
        }
        if (Type.isNeverType(aTarget.value))
        {
            if (Type.isNeverType(bTarget.value))
            {
                return "same";
            }
            return "narrow";
        }
        if (Type.isReferElement(aTarget.value))
        {
            if (Type.isReferElement(bTarget.value))
            {
                if (aTarget.value.$ref === bTarget.value.$ref)
                {
                    return "same";
                }
            }
            return "unknown";
        }
        if (Type.isReferElement(bTarget.value))
        {
            return "unknown";
        }
        if (Type.isLiteralElement(aTarget.value))
        {
            if (Type.isLiteralElement(bTarget.value))
            {
                if (Jsonable.stringify(aTarget.value.const) === Jsonable.stringify(bTarget.value.const))
                {
                    return "same";
                }
                else
                {
                    return "exclusive";
                }
            }
            if (Type.isOrElement(bTarget.value))
            {
                return reverseTypeCompatibility(compareType(bTarget, aTarget));
            }
            if (Type.isEnumTypeElement(bTarget.value))
            {
                if (bTarget.value.members.includes(aTarget.value.const as any))
                {
                    return "narrow";
                }
                else
                {
                    return "exclusive";
                }
            }
            if (Type.isItemofElement(bTarget.value))
            {
                const items = resolveRefer(nextProcess(bTarget, null, bTarget.value.value));
                if (Type.isLiteralElement(items.value))
                {
                    if (Array.isArray(items.value.const))
                    {
                        if (items.value.const.includes(aTarget.value.const as any))
                        {
                            return "narrow";
                        }
                        else
                        {
                            return "exclusive";
                        }
                    }
                }
                return "unknown";
            }
            if (null === aTarget.value.const)
            {
                if (Type.isNullType(bTarget.value))
                {
                    return "same";
                }
                else
                {
                    return "exclusive";
                }
            }
            if ("boolean" === typeof aTarget.value.const)
            {
                if (Type.isBooleanType(bTarget.value))
                {
                    return "narrow";
                }
                else
                {
                    return "exclusive";
                }
            }
            if ("number" === typeof aTarget.value.const)
            {
                if (Type.isIntegerType(bTarget.value))
                {
                    if (EvilType.Validator.isDetailedInteger(bTarget.value, bTarget.value.safeInteger)(aTarget.value.const))
                    {
                        return "narrow";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                if (Type.isNumberType(bTarget.value))
                {
                    if (EvilType.Validator.isDetailedNumber(bTarget.value, bTarget.value.safeNumber)(aTarget.value.const))
                    {
                        return "narrow";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                {
                    return "exclusive";
                }
            }
            if ("string" === typeof aTarget.value.const)
            {
                if (Type.isStringType(bTarget.value))
                {
                    if (EvilType.Validator.isDetailedString(bTarget.value, getRegexpFlags(bTarget))(aTarget.value.const))
                    {
                        return "narrow";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                {
                    return "exclusive";
                }
            }
            if (Array.isArray(aTarget.value.const))
            {
                if (Type.isArrayElement(bTarget.value))
                {
                    if (true === bTarget.value.uniqueItems)
                    {
                        if ( ! EvilType.Validator.isUniqueItems(aTarget.value.const))
                        {
                            return "exclusive";
                        }
                    }
                    if (undefined !== bTarget.value.minItems)
                    {
                        if (aTarget.value.const.length < bTarget.value.minItems)
                        {
                            return "exclusive";
                        }
                    }
                    if (undefined !== bTarget.value.maxItems)
                    {
                        if (bTarget.value.maxItems < aTarget.value.const.length)
                        {
                            return "exclusive";
                        }
                    }
                    const bValue = bTarget.value;
                    return andTypeCompatibility(aTarget.value.const.map((i, ix) => compareType(<Process>nextProcess(aTarget, `${ix}`, { const: i, }), <Process>nextProcess(bTarget, null, bValue.items))));
                }
                else
                {
                    return "exclusive";
                }
            }
            if (EvilType.Validator.isObject(aTarget.value.const))
            {
                if (Type.isDictionaryDefinition(bTarget.value))
                {
                    const entry = nextProcess(bTarget, null, bTarget.value);
                    if (isDetailedDictionary(entry))
                    {
                        return compareType(aTarget, <Process>dictionaryToInterface(entry));
                    }
                    else
                    {
                        const valueType = <Process>nextProcess(bTarget, null, bTarget.value.valueType);
                        return andTypeCompatibility(Object.entries(aTarget.value.const).map(i => compareType(<Process>nextProcess(aTarget, i[0], { const: i[1], }), valueType)));
                    }
                }
                else
                if (Type.isInterfaceDefinition(bTarget.value))
                {
                    const aConst = aTarget.value.const;
                    let membersResult = andTypeCompatibility
                    (
                        Object.entries(bTarget.value.members)
                            .map
                            (
                                i =>
                                {
                                    const key = Text.getPrimaryKeyName(i[0]);
                                    const value = resolveRefer(nextProcess(bTarget, key, i[1]));
                                    if (key !== i[0])
                                    {
                                        if (key in aConst)
                                        {
                                            return compareType(<Process>nextProcess(aTarget, key, { const: aConst[key] }), value);
                                        }
                                        else
                                        {
                                            return "narrow";
                                        }
                                    }
                                    else
                                    {
                                        if (key in aConst)
                                        {
                                            return compareType(<Process>nextProcess(aTarget, key, { const: aConst[key] }), value);
                                        }
                                        else
                                        {
                                            if (Type.isNeverType(value.value))
                                            {
                                                return "same";
                                            }
                                            else
                                            {
                                                return "exclusive";
                                            }
                                        }
                                    }
                                }
                            )
                    );
                    if (false === bTarget.value.additionalProperties)
                    {
                        const keys = Object.keys(bTarget.value.members).map(i => Text.getPrimaryKeyName(i));
                        membersResult = andTypeCompatibility
                        ([
                            membersResult,
                            Object.keys(aConst).every(i => keys.includes(i)) ? "narrow": "exclusive"
                        ]);
                    }
                    return membersResult;
                }
                return "exclusive";
            }
            return "unknown";
        }
        switch(aTarget.value.type)
        {
            case "null":
                if (Type.isNullType(bTarget.value))
                {
                    return "same";
                }
                else
                if (Type.isLiteralElement(bTarget.value))
                {
                    if (null === bTarget.value.const)
                    {
                        return "same";
                    }
                }
                else
                if (Type.isOrElement(bTarget.value))
                {
                    return orTypeCompatibility(bTarget.value.types.map(i => compareType(aTarget, <Process>nextProcess(bTarget, null, i))));
                }
                return "exclusive";
            case "boolean":
                if (Type.isBooleanType(bTarget.value))
                {
                    return "same";
                }
                else
                if (Type.isLiteralElement(bTarget.value))
                {
                    if ("boolean" === typeof bTarget.value.const)
                    {
                        return "wide";
                    }
                }
                else
                if (Type.isOrElement(bTarget.value))
                {
                    return orTypeCompatibility(bTarget.value.types.map(i => compareType(aTarget, <Process>nextProcess(bTarget, null, i))));
                }
                return "exclusive";
            case "integer":
                if (Type.isIntegerType(bTarget.value))
                {
                    if
                    (
                        aTarget.value.minimum === bTarget.value.minimum &&
                        aTarget.value.maximum === bTarget.value.maximum &&
                        aTarget.value.exclusiveMinimum === bTarget.value.exclusiveMinimum &&
                        aTarget.value.exclusiveMaximum === bTarget.value.exclusiveMaximum &&
                        aTarget.value.multipleOf === bTarget.value.multipleOf &&
                        aTarget.value.safeInteger === bTarget.value.safeInteger
                    )
                    {
                        return "same";
                    }
                    if
                    (
                        !
                        (
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.maximum || aTarget.value.minimum <= bTarget.value.maximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.minimum || bTarget.value.minimum <= aTarget.value.maximum) &&
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.minimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.maximum || aTarget.value.exclusiveMinimum < bTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.minimum || bTarget.value.minimum < aTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.exclusiveMinimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.exclusiveMaximum)
                        )
                    )
                    {
                        return "exclusive";
                    }
                    if
                    (
                        (undefined === aTarget.value.minimum || (undefined !== bTarget.value.minimum && aTarget.value.minimum <= bTarget.value.minimum)) &&
                        (undefined === aTarget.value.maximum || (undefined !== bTarget.value.maximum && bTarget.value.maximum <= aTarget.value.maximum)) &&
                        (undefined === aTarget.value.exclusiveMinimum || (undefined !== bTarget.value.exclusiveMinimum && aTarget.value.exclusiveMinimum <= bTarget.value.exclusiveMinimum)) &&
                        (undefined === aTarget.value.exclusiveMaximum || (undefined !== bTarget.value.exclusiveMaximum && bTarget.value.exclusiveMaximum <= aTarget.value.exclusiveMaximum)) &&
                        (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMinimum || aTarget.value.minimum < bTarget.value.exclusiveMinimum) &&
                        (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMaximum || bTarget.value.exclusiveMaximum < aTarget.value.maximum) &&
                        (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.minimum || aTarget.value.exclusiveMinimum < bTarget.value.minimum) &&
                        (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.maximum || bTarget.value.maximum < aTarget.value.exclusiveMaximum) &&
                        (undefined === aTarget.value.multipleOf || (undefined !== bTarget.value.multipleOf && Number.isInteger(bTarget.value.multipleOf /aTarget.value.multipleOf))) &&
                        (true !== aTarget.value.safeInteger || true === bTarget.value.safeInteger)
                    )
                    {
                        return "wide";
                    }
                    if
                    (
                        (undefined === bTarget.value.minimum || (undefined !== aTarget.value.minimum && bTarget.value.minimum <= aTarget.value.minimum)) &&
                        (undefined === bTarget.value.maximum || (undefined !== aTarget.value.maximum && aTarget.value.maximum <= bTarget.value.maximum)) &&
                        (undefined === bTarget.value.exclusiveMinimum || (undefined !== aTarget.value.exclusiveMinimum && bTarget.value.exclusiveMinimum <= aTarget.value.exclusiveMinimum)) &&
                        (undefined === bTarget.value.exclusiveMaximum || (undefined !== aTarget.value.exclusiveMaximum && aTarget.value.exclusiveMaximum <= bTarget.value.exclusiveMaximum)) &&
                        (undefined === bTarget.value.minimum || undefined === aTarget.value.exclusiveMinimum || bTarget.value.minimum < aTarget.value.exclusiveMinimum) &&
                        (undefined === bTarget.value.maximum || undefined === aTarget.value.exclusiveMaximum || aTarget.value.exclusiveMaximum < bTarget.value.maximum) &&
                        (undefined === bTarget.value.exclusiveMinimum || undefined === aTarget.value.minimum || bTarget.value.exclusiveMinimum < aTarget.value.minimum) &&
                        (undefined === bTarget.value.exclusiveMaximum || undefined === aTarget.value.maximum || aTarget.value.maximum < bTarget.value.exclusiveMaximum) &&
                        (undefined === bTarget.value.multipleOf || (undefined !== aTarget.value.multipleOf && Number.isInteger(aTarget.value.multipleOf /bTarget.value.multipleOf))) &&
                        (true !== bTarget.value.safeInteger || true === aTarget.value.safeInteger)
                    )
                    {
                        return "narrow";
                    }
                    return "overlapping";
                }
                else
                if (Type.isNumberType(bTarget.value))
                {
                    if
                    (
                        aTarget.value.minimum === bTarget.value.minimum &&
                        aTarget.value.maximum === bTarget.value.maximum &&
                        aTarget.value.exclusiveMinimum === bTarget.value.exclusiveMinimum &&
                        aTarget.value.exclusiveMaximum === bTarget.value.exclusiveMaximum &&
                        aTarget.value.multipleOf === bTarget.value.multipleOf &&
                        aTarget.value.safeInteger === bTarget.value.safeNumber
                    )
                    {
                        return "narrow";
                    }
                    if
                    (
                        !
                        (
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.maximum || aTarget.value.minimum <= bTarget.value.maximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.minimum || bTarget.value.minimum <= aTarget.value.maximum) &&
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.minimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.maximum || aTarget.value.exclusiveMinimum < bTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.minimum || bTarget.value.minimum < aTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.exclusiveMinimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.exclusiveMaximum)
                        )
                    )
                    {
                        return "exclusive";
                    }
                    if
                    (
                        (undefined === aTarget.value.minimum || (undefined !== bTarget.value.minimum && aTarget.value.minimum <= bTarget.value.minimum)) &&
                        (undefined === aTarget.value.maximum || (undefined !== bTarget.value.maximum && bTarget.value.maximum <= aTarget.value.maximum)) &&
                        (undefined === aTarget.value.exclusiveMinimum || (undefined !== bTarget.value.exclusiveMinimum && aTarget.value.exclusiveMinimum <= bTarget.value.exclusiveMinimum)) &&
                        (undefined === aTarget.value.exclusiveMaximum || (undefined !== bTarget.value.exclusiveMaximum && bTarget.value.exclusiveMaximum <= aTarget.value.exclusiveMaximum)) &&
                        (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMinimum || aTarget.value.minimum < bTarget.value.exclusiveMinimum) &&
                        (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMaximum || bTarget.value.exclusiveMaximum < aTarget.value.maximum) &&
                        (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.minimum || aTarget.value.exclusiveMinimum < bTarget.value.minimum) &&
                        (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.maximum || bTarget.value.maximum < aTarget.value.exclusiveMaximum) &&
                        (undefined === aTarget.value.multipleOf || (undefined !== bTarget.value.multipleOf && Number.isInteger(bTarget.value.multipleOf /aTarget.value.multipleOf))) &&
                        (true !== aTarget.value.safeInteger || true === bTarget.value.safeNumber)
                    )
                    {
                        return "overlapping";
                    }
                    if
                    (
                        (undefined === bTarget.value.minimum || (undefined !== aTarget.value.minimum && bTarget.value.minimum <= aTarget.value.minimum)) &&
                        (undefined === bTarget.value.maximum || (undefined !== aTarget.value.maximum && aTarget.value.maximum <= bTarget.value.maximum)) &&
                        (undefined === bTarget.value.exclusiveMinimum || (undefined !== aTarget.value.exclusiveMinimum && bTarget.value.exclusiveMinimum <= aTarget.value.exclusiveMinimum)) &&
                        (undefined === bTarget.value.exclusiveMaximum || (undefined !== aTarget.value.exclusiveMaximum && aTarget.value.exclusiveMaximum <= bTarget.value.exclusiveMaximum)) &&
                        (undefined === bTarget.value.minimum || undefined === aTarget.value.exclusiveMinimum || bTarget.value.minimum < aTarget.value.exclusiveMinimum) &&
                        (undefined === bTarget.value.maximum || undefined === aTarget.value.exclusiveMaximum || aTarget.value.exclusiveMaximum < bTarget.value.maximum) &&
                        (undefined === bTarget.value.exclusiveMinimum || undefined === aTarget.value.minimum || bTarget.value.exclusiveMinimum < aTarget.value.minimum) &&
                        (undefined === bTarget.value.exclusiveMaximum || undefined === aTarget.value.maximum || aTarget.value.maximum < bTarget.value.exclusiveMaximum) &&
                        (undefined === bTarget.value.multipleOf || (undefined !== aTarget.value.multipleOf && Number.isInteger(aTarget.value.multipleOf /bTarget.value.multipleOf))) &&
                        (true !== bTarget.value.safeNumber || true === aTarget.value.safeInteger)
                    )
                    {
                        return "narrow";
                    }
                    return "overlapping";
                }
                else
                if (Type.isLiteralElement(bTarget.value))
                {
                    if (EvilType.Validator.isDetailedInteger(aTarget.value, aTarget.value.safeInteger)(bTarget.value.const))
                    {
                        return "wide";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                if (Type.isOrElement(bTarget.value))
                {
                    return orTypeCompatibility(bTarget.value.types.map(i => compareType(aTarget, <Process>nextProcess(bTarget, null, i))));
                }
                return "exclusive";
            case "number":
                if (Type.isNumberType(bTarget.value))
                {
                    if
                    (
                        aTarget.value.minimum === bTarget.value.minimum &&
                        aTarget.value.maximum === bTarget.value.maximum &&
                        aTarget.value.exclusiveMinimum === bTarget.value.exclusiveMinimum &&
                        aTarget.value.exclusiveMaximum === bTarget.value.exclusiveMaximum &&
                        aTarget.value.multipleOf === bTarget.value.multipleOf &&
                        aTarget.value.safeNumber === bTarget.value.safeNumber
                    )
                    {
                        return "same";
                    }
                    if
                    (
                        !
                        (
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.maximum || aTarget.value.minimum <= bTarget.value.maximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.minimum || bTarget.value.minimum <= aTarget.value.maximum) &&
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.minimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.maximum || aTarget.value.exclusiveMinimum < bTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.minimum || bTarget.value.minimum < aTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.exclusiveMinimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.exclusiveMaximum)
                        )
                    )
                    {
                        return "exclusive";
                    }
                    if
                    (
                        (undefined === aTarget.value.minimum || (undefined !== bTarget.value.minimum && aTarget.value.minimum <= bTarget.value.minimum)) &&
                        (undefined === aTarget.value.maximum || (undefined !== bTarget.value.maximum && bTarget.value.maximum <= aTarget.value.maximum)) &&
                        (undefined === aTarget.value.exclusiveMinimum || (undefined !== bTarget.value.exclusiveMinimum && aTarget.value.exclusiveMinimum <= bTarget.value.exclusiveMinimum)) &&
                        (undefined === aTarget.value.exclusiveMaximum || (undefined !== bTarget.value.exclusiveMaximum && bTarget.value.exclusiveMaximum <= aTarget.value.exclusiveMaximum)) &&
                        (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMinimum || aTarget.value.minimum < bTarget.value.exclusiveMinimum) &&
                        (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMaximum || bTarget.value.exclusiveMaximum < aTarget.value.maximum) &&
                        (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.minimum || aTarget.value.exclusiveMinimum < bTarget.value.minimum) &&
                        (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.maximum || bTarget.value.maximum < aTarget.value.exclusiveMaximum) &&
                        (undefined === aTarget.value.multipleOf || (undefined !== bTarget.value.multipleOf && Number.isInteger(bTarget.value.multipleOf /aTarget.value.multipleOf))) &&
                        (true !== aTarget.value.safeNumber || true === bTarget.value.safeNumber)
                    )
                    {
                        return "wide";
                    }
                    if
                    (
                        (undefined === bTarget.value.minimum || (undefined !== aTarget.value.minimum && bTarget.value.minimum <= aTarget.value.minimum)) &&
                        (undefined === bTarget.value.maximum || (undefined !== aTarget.value.maximum && aTarget.value.maximum <= bTarget.value.maximum)) &&
                        (undefined === bTarget.value.exclusiveMinimum || (undefined !== aTarget.value.exclusiveMinimum && bTarget.value.exclusiveMinimum <= aTarget.value.exclusiveMinimum)) &&
                        (undefined === bTarget.value.exclusiveMaximum || (undefined !== aTarget.value.exclusiveMaximum && aTarget.value.exclusiveMaximum <= bTarget.value.exclusiveMaximum)) &&
                        (undefined === bTarget.value.minimum || undefined === aTarget.value.exclusiveMinimum || bTarget.value.minimum < aTarget.value.exclusiveMinimum) &&
                        (undefined === bTarget.value.maximum || undefined === aTarget.value.exclusiveMaximum || aTarget.value.exclusiveMaximum < bTarget.value.maximum) &&
                        (undefined === bTarget.value.exclusiveMinimum || undefined === aTarget.value.minimum || bTarget.value.exclusiveMinimum < aTarget.value.minimum) &&
                        (undefined === bTarget.value.exclusiveMaximum || undefined === aTarget.value.maximum || aTarget.value.maximum < bTarget.value.exclusiveMaximum) &&
                        (undefined === bTarget.value.multipleOf || (undefined !== aTarget.value.multipleOf && Number.isInteger(aTarget.value.multipleOf /bTarget.value.multipleOf))) &&
                        (true !== bTarget.value.safeNumber || true === aTarget.value.safeNumber)
                    )
                    {
                        return "narrow";
                    }
                    return "overlapping";
                }
                else
                if (Type.isIntegerType(bTarget.value))
                {
                    if
                    (
                        aTarget.value.minimum === bTarget.value.minimum &&
                        aTarget.value.maximum === bTarget.value.maximum &&
                        aTarget.value.exclusiveMinimum === bTarget.value.exclusiveMinimum &&
                        aTarget.value.exclusiveMaximum === bTarget.value.exclusiveMaximum &&
                        aTarget.value.multipleOf === bTarget.value.multipleOf &&
                        aTarget.value.safeNumber === bTarget.value.safeInteger
                    )
                    {
                        return "wide";
                    }
                    if
                    (
                        !
                        (
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.maximum || aTarget.value.minimum <= bTarget.value.maximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.minimum || bTarget.value.minimum <= aTarget.value.maximum) &&
                            (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.minimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.maximum || aTarget.value.exclusiveMinimum < bTarget.value.maximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.minimum || bTarget.value.minimum < aTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.exclusiveMaximum || aTarget.value.exclusiveMinimum < bTarget.value.exclusiveMaximum) &&
                            (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.exclusiveMinimum || bTarget.value.exclusiveMinimum < aTarget.value.exclusiveMaximum)
                        )
                    )
                    {
                        return "exclusive";
                    }
                    if
                    (
                        (undefined === aTarget.value.minimum || (undefined !== bTarget.value.minimum && aTarget.value.minimum <= bTarget.value.minimum)) &&
                        (undefined === aTarget.value.maximum || (undefined !== bTarget.value.maximum && bTarget.value.maximum <= aTarget.value.maximum)) &&
                        (undefined === aTarget.value.exclusiveMinimum || (undefined !== bTarget.value.exclusiveMinimum && aTarget.value.exclusiveMinimum <= bTarget.value.exclusiveMinimum)) &&
                        (undefined === aTarget.value.exclusiveMaximum || (undefined !== bTarget.value.exclusiveMaximum && bTarget.value.exclusiveMaximum <= aTarget.value.exclusiveMaximum)) &&
                        (undefined === aTarget.value.minimum || undefined === bTarget.value.exclusiveMinimum || aTarget.value.minimum < bTarget.value.exclusiveMinimum) &&
                        (undefined === aTarget.value.maximum || undefined === bTarget.value.exclusiveMaximum || bTarget.value.exclusiveMaximum < aTarget.value.maximum) &&
                        (undefined === aTarget.value.exclusiveMinimum || undefined === bTarget.value.minimum || aTarget.value.exclusiveMinimum < bTarget.value.minimum) &&
                        (undefined === aTarget.value.exclusiveMaximum || undefined === bTarget.value.maximum || bTarget.value.maximum < aTarget.value.exclusiveMaximum) &&
                        (undefined === aTarget.value.multipleOf || (undefined !== bTarget.value.multipleOf && Number.isInteger(bTarget.value.multipleOf /aTarget.value.multipleOf))) &&
                        (true !== aTarget.value.safeNumber || true === bTarget.value.safeInteger)
                    )
                    {
                        return "overlapping";
                    }
                    if
                    (
                        (undefined === bTarget.value.minimum || (undefined !== aTarget.value.minimum && bTarget.value.minimum <= aTarget.value.minimum)) &&
                        (undefined === bTarget.value.maximum || (undefined !== aTarget.value.maximum && aTarget.value.maximum <= bTarget.value.maximum)) &&
                        (undefined === bTarget.value.exclusiveMinimum || (undefined !== aTarget.value.exclusiveMinimum && bTarget.value.exclusiveMinimum <= aTarget.value.exclusiveMinimum)) &&
                        (undefined === bTarget.value.exclusiveMaximum || (undefined !== aTarget.value.exclusiveMaximum && aTarget.value.exclusiveMaximum <= bTarget.value.exclusiveMaximum)) &&
                        (undefined === bTarget.value.minimum || undefined === aTarget.value.exclusiveMinimum || bTarget.value.minimum < aTarget.value.exclusiveMinimum) &&
                        (undefined === bTarget.value.maximum || undefined === aTarget.value.exclusiveMaximum || aTarget.value.exclusiveMaximum < bTarget.value.maximum) &&
                        (undefined === bTarget.value.exclusiveMinimum || undefined === aTarget.value.minimum || bTarget.value.exclusiveMinimum < aTarget.value.minimum) &&
                        (undefined === bTarget.value.exclusiveMaximum || undefined === aTarget.value.maximum || aTarget.value.maximum < bTarget.value.exclusiveMaximum) &&
                        (undefined === bTarget.value.multipleOf || (undefined !== aTarget.value.multipleOf && Number.isInteger(aTarget.value.multipleOf /bTarget.value.multipleOf))) &&
                        (true !== bTarget.value.safeInteger || true === aTarget.value.safeNumber)
                    )
                    {
                        return "overlapping";
                    }
                    return "overlapping";
                }
                else
                if (Type.isLiteralElement(bTarget.value))
                {
                    if (EvilType.Validator.isDetailedNumber(aTarget.value, aTarget.value.safeNumber)(bTarget.value.const))
                    {
                        return "wide";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                if (Type.isOrElement(bTarget.value))
                {
                    return orTypeCompatibility(bTarget.value.types.map(i => compareType(aTarget, <Process>nextProcess(bTarget, null, i))));
                }
                return "exclusive";
            case "string":
                if (Type.isStringType(bTarget.value))
                {
                    if
                    (
                        aTarget.value.minLength === bTarget.value.minLength &&
                        aTarget.value.maxLength === bTarget.value.maxLength &&
                        (<Type.FormatStringType>aTarget.value).format === (<Type.FormatStringType>bTarget.value).format &&
                        (<Type.PatternStringType>aTarget.value).pattern === (<Type.PatternStringType>bTarget.value).pattern &&
                        (<Type.FormatStringType & Type.PatternStringType>aTarget.value).regexpFlags === (<Type.FormatStringType & Type.PatternStringType>bTarget.value).regexpFlags
                    )
                    {
                        return "same";
                    }
                    if
                    (
                        !
                        (
                            (undefined === aTarget.value.minLength || undefined === bTarget.value.maxLength || aTarget.value.minLength <= bTarget.value.maxLength) &&
                            (undefined === aTarget.value.maxLength || undefined === bTarget.value.minLength || bTarget.value.minLength <= aTarget.value.maxLength) &&
                            (undefined === (<Type.FormatStringType>aTarget.value).format || undefined === (<Type.FormatStringType>bTarget.value).format || (<Type.FormatStringType>aTarget.value).format === (<Type.FormatStringType>bTarget.value).format) &&
                            (undefined === (<Type.PatternStringType>aTarget.value).pattern || undefined === (<Type.PatternStringType>bTarget.value).pattern || (<Type.PatternStringType>aTarget.value).pattern === (<Type.PatternStringType>bTarget.value).pattern) &&
                            (undefined === (<Type.FormatStringType>aTarget.value).format || undefined === (<Type.PatternStringType>bTarget.value).pattern) &&
                            (undefined === (<Type.PatternStringType>aTarget.value).pattern || undefined === (<Type.FormatStringType>bTarget.value).format) &&
                            (undefined === (<Type.FormatStringType & Type.PatternStringType>aTarget.value).regexpFlags || undefined === (<Type.FormatStringType & Type.PatternStringType>bTarget.value).regexpFlags || (<Type.FormatStringType & Type.PatternStringType>aTarget.value).regexpFlags === (<Type.FormatStringType & Type.PatternStringType>bTarget.value).regexpFlags)
                        )
                    )
                    {
                        return "exclusive";
                    }
                    if
                    (
                        (undefined === aTarget.value.minLength || aTarget.value.minLength <= (bTarget.value.minLength ?? aTarget.value.minLength)) &&
                        (undefined === aTarget.value.maxLength || (bTarget.value.maxLength ?? aTarget.value.maxLength) <= aTarget.value.maxLength) &&
                        (undefined === (<Type.FormatStringType>aTarget.value).format || (<Type.FormatStringType>aTarget.value).format === ((<Type.FormatStringType>bTarget.value).format ?? (<Type.FormatStringType>aTarget.value).format)) &&
                        (undefined === (<Type.PatternStringType>aTarget.value).pattern || (<Type.PatternStringType>aTarget.value).pattern === ((<Type.PatternStringType>bTarget.value).pattern ?? (<Type.PatternStringType>aTarget.value).pattern)) &&
                        (undefined === (<Type.FormatStringType>aTarget.value).format || (<Type.FormatStringType>aTarget.value).format === ((<Type.FormatStringType>bTarget.value).format ?? (<Type.FormatStringType>aTarget.value).format)) &&
                        (<Type.FormatStringType & Type.PatternStringType>aTarget.value).regexpFlags === (<Type.FormatStringType & Type.PatternStringType>bTarget.value).regexpFlags
                    )
                    {
                        return "wide";
                    }
                    if
                    (
                        (undefined === bTarget.value.minLength || bTarget.value.minLength <= (aTarget.value.minLength ?? bTarget.value.minLength)) &&
                        (undefined === bTarget.value.maxLength || (aTarget.value.maxLength ?? bTarget.value.maxLength) <= bTarget.value.maxLength) &&
                        (undefined === (<Type.FormatStringType>bTarget.value).format || (<Type.FormatStringType>bTarget.value).format === ((<Type.FormatStringType>aTarget.value).format ?? (<Type.FormatStringType>bTarget.value).format)) &&
                        (undefined === (<Type.PatternStringType>bTarget.value).pattern || (<Type.PatternStringType>bTarget.value).pattern === ((<Type.PatternStringType>aTarget.value).pattern ?? (<Type.PatternStringType>bTarget.value).pattern)) &&
                        (undefined === (<Type.FormatStringType>bTarget.value).format || (<Type.FormatStringType>bTarget.value).format === ((<Type.FormatStringType>aTarget.value).format ?? (<Type.FormatStringType>bTarget.value).format)) &&
                        (<Type.FormatStringType & Type.PatternStringType>bTarget.value).regexpFlags === (<Type.FormatStringType & Type.PatternStringType>aTarget.value).regexpFlags
                    )
                    {
                        return "narrow";
                    }
                    return "overlapping";
                }
                else
                if (Type.isLiteralElement(bTarget.value))
                {
                    if (EvilType.Validator.isDetailedString(aTarget.value, getRegexpFlags(aTarget))(bTarget.value.const))
                    {
                        return "wide";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                if (Type.isOrElement(bTarget.value))
                {
                    return orTypeCompatibility(bTarget.value.types.map(i => compareType(aTarget, <Process>nextProcess(bTarget, null, i))));
                }
                return "exclusive";
            case "array":
                if (Type.isArrayElement(bTarget.value))
                {
                    const items = compareType(nextProcess(aTarget, null, aTarget.value.items), nextProcess(bTarget, null, bTarget.value.items));
                    if
                    (
                        "same" === items &&
                        aTarget.value.minItems === bTarget.value.minItems &&
                        aTarget.value.maxItems === bTarget.value.maxItems &&
                        (aTarget.value.uniqueItems ?? false) === (bTarget.value.uniqueItems ?? false)
                    )
                    {
                        return "same";
                    }
                    if
                    (
                        ["same", "wide"].includes(items) &&
                        (undefined === aTarget.value.minItems || (undefined !== bTarget.value.minItems && aTarget.value.minItems <= bTarget.value.minItems)) &&
                        (undefined === aTarget.value.maxItems || (undefined !== bTarget.value.maxItems && bTarget.value.maxItems <= aTarget.value.maxItems)) &&
                        true !== aTarget.value.uniqueItems || true === bTarget.value.uniqueItems
                    )
                    {
                        return "wide";
                    }
                    // 🚧
                    return "exclusive";
                }
                else
                if (Type.isLiteralElement(bTarget.value))
                {
                    const aValue = aTarget.value;
                    if
                    (
                        Array.isArray(bTarget.value.const) &&
                        (undefined === aTarget.value.minItems || aTarget.value.minItems <= bTarget.value.const.length) &&
                        (undefined === aTarget.value.maxItems || bTarget.value.const.length <= aTarget.value.maxItems) &&
                        bTarget.value.const.every((i, ix) => ["same", "wide"].includes(compareType(nextProcess(aTarget, null, aValue.items), nextProcess(bTarget, `${ix}`, { const: i, })))) &&
                        (false === (aTarget.value.uniqueItems ?? false) || EvilType.Validator.isUniqueItems(bTarget.value.const))
                    )
                    {
                        return "wide";
                    }
                    else
                    {
                        return "exclusive";
                    }
                }
                else
                if (Type.isOrElement(bTarget.value))
                {
                    return orTypeCompatibility(bTarget.value.types.map(i => compareType(aTarget, <Process>nextProcess(bTarget, null, i))));
                }
                return "exclusive";
        
            // 🚧

            case "or":
                {
                    if (Type.isOrElement(bTarget.value))
                    {
                        const aValue = aTarget.value;
                        const bValue = bTarget.value;
                        const results = aValue.types
                            .map(i => orTypeCompatibility(bValue.types.map(j => compareType(nextProcess(aTarget, null, i), nextProcess(bTarget, null, j)))))
                            .filter((i, ix, list) => ix === list.indexOf(i));
                        if (results.length === 1)
                        {
                            if (aValue.types.length < bValue.types.length)
                            {
                                switch(results[0])
                                {

                                }
                                return "unknown";
                            }
                            if (bValue.types.length < aValue.types.length)
                            {
                                switch(results[0])
                                {

                                }
                                return "unknown";
                            }
                            return results[0];
                        }
                        if (results.includes("unknown"))
                        {
                            return "unknown";
                        }
                        else
                        if (results.every(i => "exclusive" === i))
                        {
                            return "exclusive";
                        }
                        else
                        if (results.includes("overlapping"))
                        {
                            return "overlapping";
                        }
                        else
                        if (results.every(i => "narrow" === i || "same" === i))
                        {
                            return "narrow";
                        }
                        else
                        if (results.every(i => "wide" === i || "same" === i))
                        {
                            return "wide";
                        }
                        else
                        {
                            return "overlapping";
                        }
                    }
                    else
                    {
                        const results = aTarget.value.types
                            .map(i => compareType(nextProcess(aTarget, null, i), bTarget))
                            .filter((i, ix, list) => ix === list.indexOf(i));
                        if (results.length === 1)
                        {
                            return results[0];
                        }
                        if (results.includes("same") || results.includes("wide"))
                        {
                            return "wide";
                        }
                        if (results.includes("narrow") || results.includes("overlapping"))
                        {
                            return "overlapping";
                        }
                    }
                    return "unknown";
                }

            case "and":
                {
                    if (Type.isAndElement(bTarget.value))
                    {

                    }
                    else
                    {
                        const results = aTarget.value.types
                            .map(i => compareType(nextProcess(aTarget, null, i), bTarget))
                            .filter((i, ix, list) => ix === list.indexOf(i));
                        if (results.length === 1)
                        {
                            return results[0];
                        }
                        if (results.includes("exclusive"))
                        {
                            return "exclusive";
                        }
                        if (results.includes("same"))
                        {
                            return "narrow";
                        }
                        if (results.includes("wide") || results.includes("narrow") || results.includes("overlapping"))
                        {
                            return "overlapping";
                        }
                    }
                    return "unknown";
                }
        }
        return "unknown";
    };
    export const applyCommonProperties = <ValueType extends Type.CommonProperties>(target: ValueType, source: Type.CommonProperties): ValueType =>
    {
        if (undefined !== source.default)
        {
            target.default = source.default;
        }
        if (undefined !== source.title)
        {
            target.title = source.title;
        }
        if (undefined !== source.description)
        {
            target.description = source.description;
        }
        return target;
    };
    export const mergeOrType = <Process extends BaseProcess<Type.TypeOrRefer>>(a: Process, b: Process): Process =>
    {

            // 🚧

            return <Process>nextProcess(a, null, <Type.OrElement>{ type: "or", types: [ a.value, b.value ] });
    };
    export const mergeOrElement = <Process extends BaseProcess<Type.OrElement>>(data: Process): NextProcess<Process, Type.TypeOrRefer> =>
    {
        type ResultType = NextProcess<Process, Type.TypeOrRefer>;
        const sourceTypes: ResultType[] = data.value.types
            .map(i => mergeType(nextProcess(data, null, i)))
            .map(i => Type.isOrElement(i.value) ? i.value.types.map(j => <ResultType>nextProcess(i, null, j)): [ i, ])
            .reduce((a, b) => [ ...a, ...b, ], []);
        let types: ResultType[] = [];
        sourceTypes.forEach
        (
            i =>
            {
                for(var ix = 0; ix < types.length; ++ix)
                {
                    switch(compareType(types[ix], i))
                    {
                    case "unknown":
                        break;
                    case "same":
                    case "wide":
                        return;
                    case "narrow":
                        types[ix] = i;
                        return;
                    case "overlapping":
                        types[ix] = mergeOrType(types[ix], i);
                        return;
                    case "exclusive":
                        break;
                    }
                }
                types.push(i);
            }
        );
        types = types
            .map(i => Type.isOrElement(i.value) ? i.value.types.map(j => <ResultType>nextProcess(i, null, j)): [ i, ])
            .reduce((a, b) => [ ...a, ...b, ], []);
        switch(types.length)
        {
        case 0:
            return nextProcess(data, null, applyCommonProperties(<Type.NeverType>{ type: "never" }, data.value));
        case 1:
            return nextProcess(data, null, applyCommonProperties(types[0].value, data.value));
        }
        if (types.map(i => i.value).some(i => Type.isAnyType(i)))
        {
            return nextProcess(data, null, applyCommonProperties(<Type.AnyType>{ type: "any" }, data.value));
        }
        return nextProcess(data, null, applyCommonProperties(<Type.OrElement>{ type: "or", types: types.map(i => i.value), }, data.value));
    };
    export const mergeAndType = <Process extends BaseProcess<Type.TypeOrRefer>>(a: Process, b: Process): Process =>
    {

            // 🚧

            return <Process>nextProcess(a, null, <Type.AndElement>{ type: "and", types: [ a.value, b.value ] });
    };
    export const mergeAndElement = <Process extends BaseProcess<Type.AndElement>>(data: Process): NextProcess<Process, Type.TypeOrRefer> =>
    {
        type ResultType = NextProcess<Process, Type.TypeOrRefer>;
        const sourceTypes = data.value.types.map(i => mergeType(nextProcess(data, null, i)))
            .map(i => Type.isAndElement(i.value) ? i.value.types.map(j => <ResultType>nextProcess(i, null, j)): [ i, ])
            .reduce((a, b) => [ ...a, ...b, ], []);
        let types: ResultType[] = [];
        sourceTypes.forEach
        (
            i =>
            {
                for(var ix = 0; ix < types.length; ++ix)
                {
                    switch(compareType(types[ix], i))
                    {
                    case "unknown":
                        break;
                    case "same":
                        return;
                    case "wide":
                        types[ix] = i;
                        return;
                    case "narrow":
                        return;
                    case "overlapping":
                        types[ix] = mergeAndType(types[ix], i);
                        return;
                    case "exclusive":
                        types[ix] = nextProcess(data, null, <Type.NeverType>{ type: "never" });
                        return;
                    }
                }
                types.push(i);
            }
        );
        types = types
            .map(i => Type.isAndElement(i.value) ? i.value.types.map(j => <ResultType>nextProcess(i, null, j)): [ i, ])
            .reduce((a, b) => [ ...a, ...b, ], []);
        switch(types.length)
        {
        case 0:
            return nextProcess(data, null, applyCommonProperties(<Type.AnyType>{ type: "any" }, data.value));
        case 1:
            return nextProcess(data, null, applyCommonProperties(types[0].value, data.value));
        }
        if (types.map(i => i.value).some(i => Type.isNeverType(i)))
        {
            return nextProcess(data, null, applyCommonProperties(<Type.NeverType>{ type: "never" }, data.value));
        }
        return nextProcess(data, null, applyCommonProperties(<Type.AndElement>{ type: "and", types: types.map(i => i.value), }, data.value));
    };
    export const regulateType = <Process extends BaseProcess<Type.TypeOrRefer>>(data: Process): Process =>
        sortType(mergeType(data));
    export const isKindofNeverType = (data: BaseProcess<Type.TypeOrRefer>): boolean =>
    {
        const target = resolveRefer(data);
        if (Type.isLiteralElement(target.value))
        {
            return false;
        }
        if (Type.isType(target.value))
        {
            switch(target.value.type)
            {
            case "typeof":
                return false;
            case "keyof":
                {
                    const entry = getKeyofTarget(nextProcess(target, null, target.value));
                    if (Type.isInterfaceDefinition(entry.value))
                    {
                        return 0 === Object.entries(entry.value.members).filter(i => ! isKindofNeverType(nextProcess(entry, i[0], i[1]))).length;
                    }
                    else
                    if (Type.isDictionaryDefinition(entry.value))
                    {
                        return undefined !== entry.value.keyin && 0 === getActualKeys(nextProcess(entry, null, entry.value.keyin)).length;
                    }
                    else
                    if (Type.isLiteralElement(entry.value))
                    {
                        return ! EvilType.Validator.isObject(entry.value.const) || Object.keys(entry.value.const).length <= 0;
                    }
                    else
                    {
                        return false;
                    }
                }
                break;
            case "itemof":
                {
                    const literal = getLiteral(nextProcess(target, null, target.value.value));
                    if (literal)
                    {
                        return ! Array.isArray(literal.const) || 0 === literal.const.length;
                    }
                    else
                    {
                        // 厳密に不明だが、ここでは false としておく。
                        return false;
                    }
                }
            case "memberof":
                return false;
            case "never":
                return true;
            case "any":
                return false;
            case "unknown":
                return false;
            case "null":
                return false;
            case "boolean":
                return false;
            case "integer":
                return false;
            case "number":
                return false;
            case "string":
                return false;
            case "type":
                return isKindofNeverType(nextProcess(target, null, target.value.define));
            case "enum-type":
                return 0 === target.value.members.length;
            case "array":
                return false;
            case "and":
                return 0 === target.value.types.length || target.value.types.some(i => isKindofNeverType(nextProcess(target, null, i)));
            case "or":
                return 0 === target.value.types.length || target.value.types.every(i => isKindofNeverType(nextProcess(target, null, i)));
            case "interface":
                //return target.value.extends?.some?.(i => isKindofNeverType(nextProcess(target, null, i))) ?? false;
                return false;
            case "dictionary":
                //return isKindofNeverType(nextProcess(target, null, target.value.valueType));
                return false;
            }
        }
        return false;
    }
    export namespace Define
    {
        export interface Process<ValueType> extends BaseProcess<ValueType>
        {
        }
        export const makeProcess = (source: Type.TypeSchema): Process<Type.DefinitionMap> =>
        ({
            source,
            options: source.options,
            definitions: makeDefinitionFlatMap(source.defines),
            path: "",
            key: "",
            value: source.defines,
        });
        export const buildDefineLine = (declarator: string, data: Process<Type.TypeOrValue & Type.Definition>, postEpressions: CodeExpression[] = []): CodeLine =>
            $line([ ...buildExport(data), $expression(declarator), $expression(data.key), $expression("="), ...convertToExpression(buildInlineDefine(data)), ...postEpressions, ]);
        export const buildInlineDefineLiteral = (define: Type.LiteralElement) =>
            [ ...stringifyTokens(define.const) ];
        export const buildInlineDefinePrimitiveType = (value: Type.PrimitiveTypeElement) =>
        {
            switch(value.type)
            {
            case "integer":
                return $expression("number");
            default:
                return $expression(value.type);
            }
        };
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
            if (isCodeExpression(first) && "(" === first.expression && isCodeExpression(last) && ")" === last.expression)
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
        export const buildInlineDefineEnum = (value: Type.EnumTypeElement) =>
            kindofJoinExpression(value.members.map(i => $expression(Jsonable.stringify(i))), $expression("|"));
        export const buildInlineDefineArray = (data: Process<Type.ArrayElement>) =>
            [ ...enParenthesisIfNeed(buildInlineDefine(nextProcess(data, null, data.value.items))), $expression("[]"), ];
        export const buildOptionality = (optionality: Type.DictionaryDefinition["optionality"]): CodeExpression[] =>
        {
            switch(optionality ?? "as-is")
            {
            case "as-is":
                return [];
            case "partial":
                return [ $expression("?"), ];
            case "required":
                return [ $expression("-?"), ];
            }
        };
        export const buildDictionaryKeyin = (data: Process<Type.DictionaryDefinition>) =>
            undefined === data.value.keyin ?
                [ $expression("["), $expression("key:"), $expression("string"), $expression("]:"), ]:
                [
                    $expression("["),
                    $expression("key"),
                    $expression("in"),
                    ...buildInlineDefine(nextProcess(data, null, data.value.keyin)),
                    $expression("]"),
                    ...buildOptionality(data.value.optionality),
                    $expression(":"),
                ];
        export const buildInlineDefineDictionary = (data: Process<Type.DictionaryDefinition>) =>
            $iblock([ $line([ ...buildDictionaryKeyin(data), ...buildInlineDefine(nextProcess(data, null, data.value.valueType)), $expression(";"), ]) ]);
        export const buildInlineDefineAnd = (data: Process<Type.AndElement>) =>
            kindofJoinExpression(data.value.types.map(i => enParenthesisIfNeed(buildInlineDefine(nextProcess(data, null, i)))), $expression("&"));
        export const buildInlineDefineOr = (data: Process<Type.OrElement>) =>
            kindofJoinExpression(data.value.types.map(i => enParenthesisIfNeed(buildInlineDefine(nextProcess(data, null, i)))), $expression("|"));
        export const buildDefineInlineInterface = (data: Process<Type.InterfaceDefinition>) => $iblock
        (
            Object.keys(data.value.members)
                .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(nextProcess(data, name, data.value.members[name])), $expression(";"), ]))
        );
        export const buildDefineInterface = (data: Process<Type.InterfaceDefinition>): CodeBlock =>
        {
            const header = [ ...buildExport(data), ...["interface", data.key].map(i => $expression(i)), ...buildExtends(data.value), ];
            const lines = Object.keys(data.value.members)
                .map(name => $line([ $expression(name+ ":"), ...buildInlineDefine(nextProcess(data, name, data.value.members[name])), ]));
            return $block(header, lines);
        };
        export const buildDefineDictionary = (data: Process<Type.DictionaryDefinition>): CodeBlock =>
        {
            const header = [ ...buildExport(data), ...["type", data.key].map(i => $expression(i)), $expression("=")];
            return $block(header, [ $line([ ...buildDictionaryKeyin(data), ...buildInlineDefine(nextProcess(data, null, data.value.valueType)), ]) ]);
        };
        export const buildDefineNamespaceCore = (data: Process<Type.DefinitionMap>): CodeEntry[] =>
        [
            ...Object.entries(data.value)
                .map(i => Build.Define.buildDefine(nextProcess(data, i[0], i[1]))),
            ...Object.entries(data.value)
                .map(i => Type.isTypeOrValue(i[1]) && Build.Validator.isValidatorTarget(i[1]) ? Build.Validator.buildValidator(nextProcess(data, i[0], i[1])): []),
            ...Object.entries(data.value)
                .map(i => Type.isInterfaceDefinition(i[1]) ? Build.Validator.buildValidatorObject(nextProcess(data, i[0], i[1])): []),
        ]
        .reduce((a, b) => [...a, ...b], []);
        export const buildDefineNamespace = (data: Process<Type.NamespaceDefinition>): CodeBlock =>
        {
            const header = [...buildExport(data), $expression("namespace"), $expression(data.key), ];
            const lines = buildDefineNamespaceCore(nextProcess(data, null, data.value.members));
            return $block(header, lines);
        };
        export const buildImports = (imports: undefined | Type.ImportDefinition[]) =>
            undefined === imports ? []: imports.map(i => $line([ $expression("import"), $expression(i.import), $expression("from"), $expression(Jsonable.stringify(i.from)) ]));
        export const buildDefine = (data: Process<Type.Definition>): CodeEntry[] =>
        {
            switch(data.value.type)
            {
            case "code":
                return [ $line([ ...$comment(data.value), ...buildExport(data), ...data.value.tokens.map(i => $expression(i)), ]), ];
            case "interface":
                return [ ...$comment(data.value), buildDefineInterface(nextProcess(data, null, data.value)), ];
            case "dictionary":
                return [ ...$comment(data.value), buildDefineDictionary(nextProcess(data, null, data.value)), ];
            case "namespace":
                return [ ...$comment(data.value), buildDefineNamespace(nextProcess(data, null, data.value)), ];
            case "type":
                return [ ...$comment(data.value), buildDefineLine("type", nextProcess(data, null, data.value)), ];
            case "value":
                return [ ...$comment(data.value), buildDefineLine("const", nextProcess(data, null, data.value), Type.isLiteralElement(data.value.value) ? asConst: []), ];
            }
        };
        export const buildInlineDefine = (data: Process<Type.TypeOrValueOfRefer>): (CodeExpression | CodeInlineBlock)[] =>
        {
            if (Type.isReferElement(data.value))
            {
                return [ $expression(data.value.$ref), ];
            }
            else
            if (Type.isLiteralElement(data.value))
            {
                return buildInlineDefineLiteral(data.value);
            }
            else
            {
                switch(data.value.type)
                {
                case "typeof":
                    return [ <CodeExpression | CodeInlineBlock>$expression("typeof"), ...buildInlineDefine(nextProcess(data, null, data.value.value)), ];
                case "keyof":
                    return [ <CodeExpression | CodeInlineBlock>$expression("keyof"), ...buildInlineDefine(nextProcess(data, null, data.value.value)), ];
                case "itemof":
                    return [ <CodeExpression | CodeInlineBlock>$expression("typeof"), $expression(`${data.value.value.$ref}[number]`), ];
                case "memberof":
                    return [ <CodeExpression | CodeInlineBlock>$expression(`${data.value.value.$ref}["${data.value.key}"]`), ];
                case "value":
                    return buildInlineDefine(nextProcess(data, null, data.value.value));
                case "never":
                case "any":
                case "unknown":
                case "null":
                case "boolean":
                case "integer":
                case "number":
                case "string":
                    return [ buildInlineDefinePrimitiveType(data.value), ];
                case "type":
                    return buildInlineDefine(nextProcess(data, null, data.value.define));
                case "enum-type":
                    return buildInlineDefineEnum(data.value);
                case "array":
                    return buildInlineDefineArray(nextProcess(data, null, data.value));
                case "and":
                    return buildInlineDefineAnd(nextProcess(data, null, data.value));
                case "or":
                    return buildInlineDefineOr(nextProcess(data, null, data.value));
                case "interface":
                    return [ buildDefineInlineInterface(nextProcess(data, null, data.value)), ];
                case "dictionary":
                    return [ buildInlineDefineDictionary(nextProcess(data, null, data.value)), ];
                }
            }
        };
    }
    export namespace Validator
    {
        export const isRegularIdentifier = (key: string) =>
            0 <= key.length &&
            ! /^\d/.test(key) &&
            /^[$\w]+$/.test(key);
        export const buildObjectMember = (name: string, key: string) =>
            isRegularIdentifier(key) ? `${name}.${key}`: `${name}[${Jsonable.stringify(key)}]`;
        export const buildCall = (method: CodeInlineEntry[], args: (CodeInlineEntry | CodeInlineEntry[])[]): CodeInlineEntry[] =>
            [ ...method, ...Define.enParenthesis(kindofJoinExpression(args, $expression(",")))];
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
                            list.push($expression(`${Jsonable.stringify(key)} in ${name}`));
                            list.push($expression("&&"));
                            list.push(...buildLiterarlValidatorExpression(buildObjectMember(name, key), value[key]));
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
            if (null !== value && "object" === typeof value)
            {
                return [ $expression(Jsonable.stringify(Jsonable.stringify(value))), $expression("==="), $expression(`JSON.stringify(${name})`), ];
            }
            else
            {
                return [ $expression(Jsonable.stringify(value)), $expression("==="), $expression(name), ];
            }
        };
        export const buildObjectValidatorObjectName = (name: string) =>
            [ ...Text.getNameSpace(name).split("."), `${Text.toLowerCamelCase(Text.getNameBody(name))}ValidatorObject`, ].filter(i => "" !== i).join(".");
        export const buildValidatorName = (name: string) =>
            [ ...Text.getNameSpace(name).split("."), `is${Text.toUpperCamelCase(Text.getNameBody(name))}`, ].filter(i => "" !== i).join(".");
        export const buildValidatorExpression = (name: string, data: Define.Process<Type.TypeOrValueOfRefer>): CodeExpression[] =>
        {
            if (Type.isReferElement(data.value))
            {
                return [ $expression(`${buildValidatorName(data.value.$ref)}(${name})`), ];
            }
            else
            if (Type.isLiteralElement(data.value))
            {
                return buildLiterarlValidatorExpression(name, data.value.const);
            }
            else
            {
                switch(data.value.type)
                {
                case "typeof":
                    return buildValidatorExpression(name, nextProcess(data, null, data.value.value));
                case "keyof":
                    return buildKeyofValidator(name, nextProcess(data, null, data.value));
                case "itemof":
                    return [ $expression(`${data.value.value.$ref}.includes(${name} as any)`), ];
                case "memberof":
                    {
                        const target = resolveRefer(data);
                        if ( ! Type.isMemberofElement(target.value))
                        {
                            return buildValidatorExpression(name, target);
                        }
                        else
                        {
                            return [ $expression("false"), ];
                        }
                    }
                case "value":
                    return buildValidatorExpression(name, nextProcess(data, null, data.value.value));
                case "never":
                    return [ $expression("false"), ];
                case "any":
                    return [ $expression("true"), ];
                case "unknown":
                    return [ $expression("true"), ];
                case "null":
                    return [ $expression(`"${data.value.type}" === ${name}`), ];
                case "boolean":
                    return [ $expression(`"${data.value.type}" === typeof ${name}`), ];
                case "integer":
                    return [
                        $expression(`"${data.value.type}" === typeof ${name}`),
                        $expression("&&"), true !== getSafeInteger(data) ? $expression("Number.isSafeInteger"): $expression("Number.isInteger"), $expression("("), $expression(name), $expression(")"),
                        ...(undefined !== data.value.minimum ? [ $expression("&&"), $expression(`${data.value.minimum}`), $expression("<="), $expression(`${name}`), ]: []),
                        ...(undefined !== data.value.exclusiveMinimum ? [ $expression("&&"), $expression(`${data.value.exclusiveMinimum}`), $expression("<"), $expression(`${name}`), ]: []),
                        ...(undefined !== data.value.maximum ? [ $expression("&&"), $expression(`${name}`), $expression("<="), $expression(`${data.value.maximum}`), ]: []),
                        ...(undefined !== data.value.exclusiveMaximum ? [ $expression("&&"), $expression(`${name}`), $expression("<"), $expression(`${data.value.exclusiveMaximum}`), ]: []),
                        ...(undefined !== data.value.multipleOf ? [ $expression("&&"), $expression("0"), $expression("==="), $expression(`${name}`), $expression("%"), $expression(`${data.value.multipleOf}`), ]: []),
                    ];
                case "number":
                    return [
                        $expression(`"${data.value.type}" === typeof ${name}`),
                        ...(true !== getSafeNumber(data) ? [ $expression("&&"), $expression("Number.isFinite"), $expression("("), $expression(name), $expression(")"), ]: []),
                        ...(undefined !== data.value.minimum ? [ $expression("&&"), $expression(`${data.value.minimum}`), $expression("<="), $expression(`${name}`), ]: []),
                        ...(undefined !== data.value.exclusiveMinimum ? [ $expression("&&"), $expression(`${data.value.exclusiveMinimum}`), $expression("<"), $expression(`${name}`), ]: []),
                        ...(undefined !== data.value.maximum ? [ $expression("&&"), $expression(`${name}`), $expression("<="), $expression(`${data.value.maximum}`), ]: []),
                        ...(undefined !== data.value.exclusiveMaximum ? [ $expression("&&"), $expression(`${name}`), $expression("<"), $expression(`${data.value.exclusiveMaximum}`), ]: []),
                        ...(undefined !== data.value.multipleOf ? [ $expression("&&"), $expression("0"), $expression("==="), $expression(`${name}`), $expression("%"), $expression(`${data.value.multipleOf}`), ]: []),
                    ];
                case "string":
                    return [
                        $expression(`"${data.value.type}" === typeof ${name}`),
                        ...(undefined !== data.value.minLength ? [ $expression("&&"), $expression(`${data.value.minLength}`), $expression("<="), $expression(`${name}.length`), ]: []),
                        ...(undefined !== data.value.maxLength ? [ $expression("&&"), $expression(`${name}.length`), $expression("<="), $expression(`${data.value.maxLength}`), ]: []),
                        ...(Type.isPatternStringType(data.value) ? [ $expression("new"), $expression("RegExp"), $expression("("), $expression(Jsonable.stringify(data.value.pattern)), $expression(","), $expression(Jsonable.stringify(getRegexpFlags(data))), $expression(")"), $expression(`.test(${name})`) ]: []),
                        ...(Type.isFormatStringType(data.value) ? [ $expression("new"), $expression("RegExp"), $expression("("), $expression(Jsonable.stringify(Type.StringFormatMap[data.value.format])), $expression(","), $expression(Jsonable.stringify(getRegexpFlags(data))), $expression(")"), $expression(`.test(${name})`) ]: []),
                    ];
                case "type":
                    return buildValidatorExpression(name, nextProcess(data, null, data.value.define));
                case "enum-type":
                    return [ ...stringifyTokens(data.value.members), $expression("."), $expression(`includes(${name} as any)`), ];
                case "array":
                    return [
                        $expression(`Array.isArray(${name})`),
                        ...(undefined !== data.value.minItems ? [ $expression("&&"), $expression(`${data.value.minItems}`), $expression("<="), $expression(`${name}.length`), ]: []),
                        ...(undefined !== data.value.maxItems ? [ $expression("&&"), $expression(`${name}.length`), $expression("<="), $expression(`${data.value.maxItems}`), ]: []),
                        ...
                        (
                            true === data.value.uniqueItems ?
                            [
                                $expression("&&"), $expression(`${name}`), $expression("."), $expression("map"), $expression("("), $expression("i"), $expression("=>"),
                                $expression("JSON"), $expression("."), $expression("stringify"), $expression("("), $expression("i"), $expression(")"), $expression(")"),
                                $expression("."), $expression("every"), $expression("("), $expression("("), $expression("i"), $expression(","), $expression("ix"),
                                $expression(","), $expression("list"), $expression(")"), $expression("=>"), $expression("ix"), $expression("==="), $expression("list"),
                                $expression("."), $expression("indexOf"), $expression("("), $expression("i"), $expression(")"), $expression(")"),
                            ]:
                            []
                        ),
                        $expression("&&"),
                        $expression(`${name}.every(`),
                        $expression("i"),
                        $expression("=>"),
                        ...buildValidatorExpression("i", nextProcess(data, null, data.value.items)),
                        $expression(")")
                    ];
                case "and":
                    return kindofJoinExpression
                    (
                        data.value.types.map
                        (
                            i => EvilType.Validator.isObject(i) ?
                                Define.enParenthesis(buildValidatorExpression(name, nextProcess(data, null, i))):
                                buildValidatorExpression(name, i)
                        ),
                        $expression("&&")
                    );
                case "or":
                    return kindofJoinExpression
                    (
                        data.value.types.map(i => buildValidatorExpression(name, nextProcess(data, null, i))),
                        $expression("||")
                    );
                case "interface":
                    return buildInterfaceValidator(name, nextProcess(data, null, data.value));
                case "dictionary":
                    {
                        const entry = nextProcess(data, null, data.value);
                        if (isDetailedDictionary(entry))
                        {
                            return buildInterfaceValidator(name, dictionaryToInterface(entry));
                        }
                        else
                        {
                            return [
                                $expression(`null !== ${name}`),
                                $expression("&&"),
                                $expression(`"object" === typeof ${name}`),
                                $expression("&&"),
                                $expression(`Object.values(${name}).every(`),
                                $expression("i"),
                                $expression("=>"),
                                ...buildValidatorExpression("i", nextProcess(data, null, data.value.valueType)),
                                $expression(")"),
                            ];
                        }
                    }
                }
            }
        };
        export const buildKeyofValidator = (name: string, data: Define.Process<Type.KeyofElement>): CodeExpression[] =>
        {
            const target = getKeyofTarget(nextProcess(data, null, data.value));
            if (Type.isInterfaceDefinition(target.value))
            {
                return [ ...stringifyTokens(getKeys(nextProcess(data, null, target.value)).map(i => Text.getPrimaryKeyName(i))), $expression("."), $expression(`includes(${name} as any)`), ];
            }
            else
            if (Type.isDictionaryDefinition(target.value))
            {
                if (undefined !== target.value.keyin)
                {
                    return [ ...stringifyTokens(getActualKeys(nextProcess(data, null, target.value.keyin)).map(i => Text.getPrimaryKeyName(i))), $expression("."), $expression(`includes(${name} as any)`), ];
                }
                else
                {
                    return [ $expression(`"string" === typeof ${name}`), ];
                }
            }
            else
            if (Type.isLiteralElement(target.value))
            {
                if (EvilType.Validator.isObject(target.value.const))
                {
                    return [ ...stringifyTokens(Object.keys(target.value.const)), $expression("."), $expression(`includes(${name} as any)`), ];
                }
                else
                {
                    return [ $expression("false"), ];
                }
            }
            else
            {
                return [ $expression(`"string" === typeof ${name}`), ];
            }
        };
        export const rejectAdditionalProperties = (name: string, regularKeys: string[]) =>
        {
            const list: CodeExpression[] = [];
            list.push($expression("&&"));
            list.push($expression("Object"));
            list.push($expression("."));
            list.push($expression("keys"));
            list.push($expression("("));
                list.push($expression(name));
            list.push($expression(")"));
            list.push($expression("."));
            list.push($expression("filter"));
            list.push($expression("("));
                list.push($expression("key"));
                list.push($expression("=>"));
                list.push($expression("!"));
                list.push(...stringifyTokens(regularKeys))
                list.push($expression("."));
                list.push($expression("includes(key)"));
            list.push($expression(")"));
            list.push($expression("."));
            list.push($expression("length"));
            list.push($expression("<="));
            list.push($expression("0"));
            return list;
        };
        export const buildInterfaceValidator = (name: string, data: Define.Process<Type.InterfaceDefinition>): CodeExpression[] =>
        {
            const list: CodeExpression[] = [];
            const members = data.value.members;
            if (undefined !== data.value.extends)
            {
                data.value.extends.forEach
                (
                    (i, ix, _l) =>
                    {
                        if (0 < ix)
                        {
                            list.push($expression("&&"));
                        }
                        list.push(...convertToExpression(buildValidatorExpression(name, nextProcess(data, null, i))));
                    }
                )
            }
            if (undefined !== data.value.extends)
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
                    if (isKindofNeverType(nextProcess(data, key, value)))
                    {
                        list.push($expression("&&"));
                        list.push($expression(`! ${Jsonable.stringify(key)} in ${name}`));
                    }
                    else
                    {
                        const base = convertToExpression(buildValidatorExpression(buildObjectMember(name, key), nextProcess(data, key, value)));
                        const current = Type.isOrElement(value) ?
                            Define.enParenthesis(base):
                            base;
                        if (k === key)
                        {
                            list.push($expression("&&"));
                            list.push($expression(`${Jsonable.stringify(key)} in ${name}`));
                            list.push($expression("&&"));
                            list.push(...current);
                        }
                        else
                        {
                            list.push($expression("&&"));
                            list.push($expression("("));
                            list.push($expression(`! (${Jsonable.stringify(key)} in ${name})`));
                            list.push($expression("||"));
                            list.push(...current);
                            list.push($expression(")"));
                        }
                    }
                }
            );
            if (false === getAdditionalProperties(data))
            {
                list.push(...rejectAdditionalProperties(name, Object.keys(data.value.members).map(key => Text.getPrimaryKeyName(key))));
            }
            return list;
        };
        export const buildInlineValidator = (name: string, data: Define.Process<Type.TypeOrValue>) =>
        [
            $expression(`(value: unknown): value is ${Type.isValueDefinition(data.value) ? "typeof " +name: name} =>`),
            ...buildValidatorExpression("value", data),
        ];
        export const buildObjectValidatorGetterCoreEntry = (data: Define.Process<Type.TypeOrRefer>): CodeInlineEntry[] =>
        {
            if (Type.isReferElement(data.value))
            {
                return [ $expression(buildValidatorName(data.value.$ref)), ];
            }
            else
            if (Type.isLiteralElement(data.value))
            {
                return buildCall([ $expression("EvilType.Validator.isJust"), ], [ buildLiteralAsConst(data.value.const), ]);
            }
            else
            {
                switch(data.value.type)
                {
                case "typeof":
                    return [ $expression(buildValidatorName(data.value.value.$ref)), ];
                case "keyof":
                    {
                        const target = getKeyofTarget(nextProcess(data, null, data.value));
                        if (Type.isInterfaceDefinition(target.value))
                        {
                            return buildCall
                            (
                                [ $expression("EvilType.Validator.isEnum"), ],
                                [ buildLiteralAsConst(getKeys(nextProcess(target, null, target.value)).map(i => Text.getPrimaryKeyName(i))), ]
                            );
                        }
                        else
                        if (Type.isDictionaryDefinition(target.value))
                        {
                            if (undefined !== target.value.keyin)
                            {
                                return buildCall
                                (
                                    [ $expression("EvilType.Validator.isEnum"), ],
                                    [ buildLiteralAsConst(getActualKeys(nextProcess(target, null, target.value.keyin)).map(i => Text.getPrimaryKeyName(i))), ]
                                );
                            }
                            else
                            {
                                return [ $expression("EvilType.Validator.isString"), ];
                            }
                        }
                        else
                        if (Type.isLiteralElement(target.value))
                        {
                            if (EvilType.Validator.isObject(target.value.const))
                            {
                                return buildCall
                                (
                                    [ $expression("EvilType.Validator.isEnum"), ],
                                    [ buildLiteralAsConst(Object.keys(target.value.const)), ]
                                );
                            }
                            else
                            {
                                return [ $expression("EvilType.Validator.isNever"), ];
                            }
                        }
                        else
                        {
                            return [ $expression("EvilType.Validator.isString"), ];
                        }
                    }
                case "itemof":
                    return buildCall([ $expression("EvilType.Validator.isEnum"), ], [ $expression(data.value.value.$ref), ]);
                case "memberof":
                    {
                        const target = resolveRefer(data);
                        if ( ! Type.isMemberofElement(target.value))
                        {
                            return buildObjectValidatorGetterCoreEntry(target);
                        }
                        else
                        {
                            return [ $expression("EvilType.Validator.isNever"), ];
                        }
                    }
                case "never":
                    return [ $expression("EvilType.Validator.isNever"), ];
                case "any":
                    return [ $expression("EvilType.Validator.isAny"), ];
                case "unknown":
                    return [ $expression("EvilType.Validator.isUnknown"), ];
                case "null":
                    return [ $expression("EvilType.Validator.isNull"), ];
                case "boolean":
                    return [ $expression("EvilType.Validator.isBoolean"), ];
                case "integer":
                    const integerOptions = [
                        ...(undefined !== data.value.minimum ? [ $expression(`minimum:${data.value.minimum},`), ]: []),
                        ...(undefined !== data.value.exclusiveMinimum ? [ $expression(`exclusiveMinimum:${data.value.exclusiveMinimum},`), ]: []),
                        ...(undefined !== data.value.maximum ? [ $expression(`maximum:${data.value.maximum},`), ]: []),
                        ...(undefined !== data.value.exclusiveMaximum ? [ $expression(`exclusiveMaximum:${data.value.exclusiveMaximum},`), ]: []),
                        ...(undefined !== data.value.multipleOf ? [ $expression(`multipleOf:${data.value.multipleOf},`), ]: []),
                    ];
                    if (0 < integerOptions.length)
                    {
                        return [
                            $expression("EvilType.Validator.isDetailedInteger"),
                            $expression("("),
                            $expression("{"),
                            ...integerOptions,
                            $expression("},"),
                            $expression(`${Jsonable.stringify(getSafeNumber(data))},`),
                            $expression(")"),
                        ];
                    }
                    else
                    {
                        return [
                            getSafeInteger(data) ?
                                $expression("EvilType.Validator.isSafeInteger"):
                                $expression("EvilType.Validator.isInteger"),
                        ];
                    }
                case "number":
                    const numberOptions = [
                        ...(undefined !== data.value.minimum ? [ $expression(`minimum:${data.value.minimum},`), ]: []),
                        ...(undefined !== data.value.exclusiveMinimum ? [ $expression(`exclusiveMinimum:${data.value.exclusiveMinimum},`), ]: []),
                        ...(undefined !== data.value.maximum ? [ $expression(`maximum:${data.value.maximum},`), ]: []),
                        ...(undefined !== data.value.exclusiveMaximum ? [ $expression(`exclusiveMaximum:${data.value.exclusiveMaximum},`), ]: []),
                        ...(undefined !== data.value.multipleOf ? [ $expression(`multipleOf:${data.value.multipleOf},`), ]: []),
                    ];
                    if (0 < numberOptions.length)
                    {
                        return [
                            $expression("EvilType.Validator.isDetailedNumber"),
                            $expression("("),
                            $expression("{"),
                            ...numberOptions,
                            $expression("},"),
                            $expression(`${Jsonable.stringify(getSafeNumber(data))},`),
                            $expression(")"),
                        ];
                    }
                    else
                    {
                        return [
                            getSafeNumber(data) ?
                                $expression("EvilType.Validator.isSafeNumber"):
                                $expression("EvilType.Validator.isNumber"),
                        ];
                    }
                case "string":
                    const stringOptions = [
                        ...(undefined !== data.value.minLength ? [ $expression(`minLength:${data.value.minLength},`), ]: []),
                        ...(undefined !== data.value.maxLength ? [ $expression(`maxLength:${data.value.maxLength},`), ]: []),
                        ...(Type.isPatternStringType(data.value) ? [ $expression(`pattern:${Jsonable.stringify(data.value.pattern)},`), ]: []),
                        ...(Type.isFormatStringType(data.value) ? [ $expression(`pattern:${Jsonable.stringify(Type.StringFormatMap[data.value.format])},`), $expression(`pattern:${Jsonable.stringify(data.value.format)},`), ]: []),
                    ];
                    if (0 < stringOptions.length)
                    {
                        return [
                            $expression("EvilType.Validator.isDetailedString"),
                            $expression("("),
                            $expression("{"),
                            ...stringOptions,
                            $expression("},"),
                            $expression(`regexpFlags:${Jsonable.stringify(getRegexpFlags(data))},`),
                            $expression(")"),
                        ];
                    }
                    else
                    {
                        return [ $expression("EvilType.Validator.isString"), ];
                    }
                case "type":
                    return buildObjectValidatorGetterCoreEntry(nextProcess(data, null, data.value.define));
                case "enum-type":
                    return buildCall
                    (
                        [ $expression("EvilType.Validator.isEnum"), ],
                        [ buildLiteralAsConst(data.value.members), ]
                    );
                case "array":
                    const arrayOptions = [
                        ...(undefined !== data.value.minItems ? [ $expression(`minItems:${data.value.minItems},`), ]: []),
                        ...(undefined !== data.value.maxItems ? [ $expression(`maxItems:${data.value.maxItems},`), ]: []),
                        ...(undefined !== data.value.uniqueItems ? [ $expression(`maxItems:${data.value.maxItems},`), ]: []),
                    ];
                    if (0 < arrayOptions.length)
                    {
                        return buildCall
                        (
                            [ $expression("EvilType.Validator.isArray"), ],
                            [
                                buildObjectValidatorGetterCoreEntry(nextProcess(data, null, data.value.items)),
                                [ $expression("{"), ...arrayOptions, $expression("},"), ],
                            ]
                        );
                    }
                    else
                    {
                        return buildCall
                        (
                            [ $expression("EvilType.Validator.isArray"), ],
                            [ buildObjectValidatorGetterCoreEntry(nextProcess(data, null, data.value.items)), ]
                        );
                    }
                case "and":
                    return buildCall
                    (
                        [ $expression("EvilType.Validator.isAnd"), ],
                        data.value.types.map(i => buildObjectValidatorGetterCoreEntry(nextProcess(data, null, i)))
                    );
                case "or":
                    return buildCall
                    (
                        [ $expression("EvilType.Validator.isOr"), ],
                        data.value.types.map(i => buildObjectValidatorGetterCoreEntry(nextProcess(data, null, i)))
                    );
                case "interface":
                    return buildObjectValidator(nextProcess(data, null, data.value));
                case "dictionary":
                    {
                        const entry = nextProcess(data, null, data.value);
                        if (isDetailedDictionary(entry))
                        {
                            return buildObjectValidator(dictionaryToInterface(entry));
                        }
                        else
                        {
                            return buildCall
                            (
                                [ $expression("EvilType.Validator.isDictionaryObject"), ],
                                [ buildObjectValidatorGetterCoreEntry(nextProcess(data, null, data.value.valueType)), ]
                            );
                        }
                    }
                }
            }
        };
        export const buildObjectValidatorGetterCore = (data: Define.Process<Type.InterfaceDefinition>) => $iblock
        (
            Object.entries(data.value.members).map
            (
                i =>
                {
                    const key = Text.getPrimaryKeyName(i[0]);
                    const value =
                        isKindofNeverType(nextProcess(data, key, i[1])) ?
                            buildLiteralAsConst({ $type: "never-type-guard", }):
                            buildObjectValidatorGetterCoreEntry(nextProcess(data, key, i[1]));
                    return $line
                    ([
                        $expression(Text.isValidIdentifier(key) ? key: JSON.stringify(key)),
                        $expression(":"),
                        ...(key === i[0] ? value: buildCall([ $expression("EvilType.Validator.isOptional"), ], [ value, ])),
                        $expression(","),
                    ])
                }
            )
        );
        export const buildObjectValidator = (data: Define.Process<Type.InterfaceDefinition>) => (data.value.extends ?? []).some(_ => true) ?
            [
                $expression("EvilType.Validator.mergeObjectValidator"),
                ...Define.enParenthesis
                ([
                    ...(data.value.extends ?? []).map(i => $expression(`${buildObjectValidatorObjectName(i.$ref)},`)),
                    buildObjectValidatorGetterCore(data),
                ]),
            ]:
            Define.enParenthesis([ buildObjectValidatorGetterCore(data), ]);
        export const isLazyValidator = (data: Define.Process<Type.TypeOrRefer>): boolean =>
        {
            if (Type.isLiteralElement(data.value))
            {
                return false;
            }
            if (Type.isType(data.value))
            {
                switch(data.value.type)
                {
                case "enum-type":
                case "itemof":
                case "never":
                case "any":
                case "unknown":
                case "null":
                case "boolean":
                case "integer":
                case "number":
                case "string":
                case "typeof":
                    return false;
                case "type":
                    return isLazyValidator(nextProcess(data, null, data.value.define));
                case "array":
                    return isLazyValidator(nextProcess(data, null, data.value.items));
                case "dictionary":
                    return undefined !== data.value.keyin || isLazyValidator(nextProcess(data, null, data.value.valueType));
                case "keyof":
                    return false;
                case "memberof":
                    return isLazyValidator(getMemberofTarget(nextProcess(data, null, data.value)))
                case "and":
                case "or":
                    return data.value.types.some(i => isLazyValidator(nextProcess(data, null, i)));
                case "interface":
                    return true;
                }
            }
            return true;
        };
        export const buildFullValidator = (data: Define.Process<Type.Type>) => isLazyValidator(data) ?
            [
                ...buildCall
                (
                    [ $expression("EvilType.lazy"), ],
                    [ [ $expression("()"), $expression("=>"), ...buildObjectValidatorGetterCoreEntry(data), ] , ]
                ),
                // $expression(`(value: unknown, listner?: EvilType.Validator.ErrorListener): value is ${Type.isValueDefinition(define) ? "typeof " +data.key: data.key} =>`),
                // ...buildCall
                // (
                //     buildObjectValidatorGetterCoreEntry(define),
                //     [ $expression("value"), $expression("listner"), ]
                // ),
            ]:
            buildObjectValidatorGetterCoreEntry(data);
        export const isValidatorTarget = (define: Type.TypeOrValue) =>
            ! (Type.isValueDefinition(define) && false === define.validator);
        export const buildValidator = (data: Define.Process<Type.TypeOrValue & Type.Definition>): CodeLine[] =>
        {
            if ("simple" === data.options.validatorOption)
            {
                const result =
                [
                    $line
                    ([
                        ...buildExport(data),
                        $expression("const"),
                        $expression(buildValidatorName(data.key)),
                        $expression("="),
                        ...buildInlineValidator(data.key, data),
                    ])
                ];
                return result;
            }
            if ("full" === data.options.validatorOption)
            {
                const result: CodeLine["expressions"] =
                [
                    ...buildExport(data),
                    $expression("const"),
                    $expression(buildValidatorName(data.key)),
                ];
                if ("interface" === data.value.type)
                {
                    result.push
                    (
                        $expression("="),
                        ...buildCall
                        (
                            [ $expression("EvilType.lazy"), ],
                            [
                                [
                                    $expression("()"),
                                    $expression("=>"),
                                    ...buildCall
                                    (
                                        [ $expression("EvilType.Validator.isSpecificObject"), ],
                                        [
                                            $expression(buildObjectValidatorObjectName(data.key)),
                                            ...(false === getAdditionalProperties(nextProcess(data, null, data.value)) ? [ $expression("false"), ]: [])
                                        ]
                                    ),
                                ]
                            ]
                        )
                        // $expression(`(value: unknown, listner?: EvilType.Validator.ErrorListener): value is ${name} =>`),
                        // ...buildCall
                        // (
                        //     buildCall
                        //     (
                        //         [ $expression(`EvilType.Validator.isSpecificObject<${name}>`), ],
                        //         [ $expression(buildObjectValidatorObjectName(name)), ...(undefined !== data.value.additionalProperties ? [ $expression(Jsonable.stringify(define.additionalProperties)), ]: []) ]
                        //     ),
                        //     [ $expression("value"), $expression("listner"), ]
                        // )
                    );
                }
                else
                if ("value" === data.value.type)
                {
                    if (Type.isReferElement(data.value.value))
                    {
                        result.push
                        (
                            $expression("="),
                            $expression(buildValidatorName(data.value.value.$ref))
                        );
                    }
                    else
                    {
                        result.push($expression("="), ...buildCall([ $expression("EvilType.Validator.isJust"), ], [ $expression(data.key), ]));
                    }
                }
                else
                {
                    result.push
                    (
                        ...[ $expression(":"), $expression(`EvilType.Validator.IsType<${data.key}>`) ],
                        $expression("="),
                        ...buildFullValidator(nextProcess(data, null, data.value))
                    );
                }
                return [ $line(result) ];
            }
            return [];
        };
        export const buildValidatorObject = (data: Define.Process<Type.InterfaceDefinition>): CodeLine[] =>
        {
            if ("full" === data.options.validatorOption)
            {
                const result =
                [
                    $line
                    ([
                        ...buildExport(data),
                        $expression("const"),
                        $expression(buildObjectValidatorObjectName(data.key)),
                        $expression(":"),
                        $expression(`EvilType.Validator.ObjectValidator<${data.key}>`),
                        $expression("="),
                        ...buildObjectValidator(data),
                    ])
                ];
                return result;
            }
            return [];
        };
    }
    export namespace Schema
    {
        export namespace Const
        {
            export const definitions = "definitions";
        }
        export interface Process<ValueType> extends BaseProcess<ValueType>
        {
            //source: Type.TypeSchema;
            schema: Type.SchemaOptions;
            //definitions: Type.DefinitionMap;
            //path: string;
            //value: ValueType;
        }
        export const makeProcess = (source: Type.TypeSchema, schema: Type.SchemaOptions): Process<Type.DefinitionMap> =>
        ({
            source,
            options: source.options,
            schema,
            definitions: makeDefinitionFlatMap(source.defines),
            path: "",
            key: "",
            value: source.defines,
        });
        export const resolveExternalRefer = (data: Process<unknown>, absolutePath: string) =>
        {
            if (data.schema.externalReferMapping)
            {
                const key = Object.keys(data.schema.externalReferMapping)
                    .filter(i => i === absolutePath || absolutePath.startsWith(`${i}.`))
                    .sort(EvilType.comparer(i => -i.length))
                    [0];
                if (key)
                {
                    return data.schema.externalReferMapping[key] +absolutePath.slice(key.length);
                }
            }
            return null;
        };
        export const build = (data: Process<Type.DefinitionMap>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            if (data.schema.$id)
            {
                result["$id"] = data.schema.$id;
            }
            result["$schema"] = "http://json-schema.org/draft-07/schema#";
            if (data.schema.$ref)
            {
                result["$ref"] = `#/${Const.definitions}/${data.schema.$ref}`;
            }
            result[Const.definitions] = buildDefinitions(data);
            return result;
        };
        export const buildDefinitions = (data: Process<Type.DefinitionMap>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject = { };
            Object.entries(data.value).forEach
            (
                i =>
                {
                    const key = i[0];
                    const value = i[1];
                    switch(value.type)
                    {
                    case "value":
                        result[key] = buildValue(nextProcess(data, null, value));
                        break;
                    case "code":
                        //  nothing
                        break;
                    case "namespace":
                        {
                            const members = buildDefinitions(nextProcess(data, key, value.members));
                            Object.entries(members).forEach(j => result[`${key}.${j[0]}`] = j[1]);
                        }
                        break;
                    default:
                        result[key] = buildType(nextProcess(data, null, value));
                    }
                }
            );
            return result;
        };
        export const buildLiteral = (data: Process<Type.LiteralElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                const: data.value.const,
            };
            return result;
        };
        export const buildValue = (data: Process<Type.ValueDefinition>):Jsonable.JsonableObject =>
            Type.isLiteralElement(data.value.value) ?
                buildLiteral(nextProcess(data, null, data.value.value)):
                buildRefer(nextProcess(data, null, data.value.value));
        export const buildType = (data: Process<Type.Type>):Jsonable.JsonableObject =>
        {
            if (Type.isLiteralElement(data.value))
            {
                return buildLiteral(nextProcess(data, null, data.value));
            }
            switch(data.value.type)
            {
            case "never":
            case "any":
            case "unknown":
            case "null":
            case "boolean":
            case "integer":
            case "number":
            case "string":
                return buildPrimitiveType(nextProcess(data, null, data.value));
            case "type":
                return buildTypeOrRefer(nextProcess(data, null, data.value.define));
            case "interface":
                return buildInterface(nextProcess(data, null, data.value));
            case "dictionary":
                {
                    const entry = nextProcess(data, null, data.value);
                    if (isDetailedDictionary(entry))
                    {
                        return buildInterface(dictionaryToInterface(entry));
                    }
                    else
                    {
                        return buildDictionary(entry);
                    }
                }
            case "enum-type":
                return buildEnumType(nextProcess(data, null, data.value));
            case "typeof":
                return buildTypeOf(nextProcess(data, null, data.value));
            case "keyof":
                return buildKeyOf(nextProcess(data, null, data.value));
            case "itemof":
                return buildItemOf(nextProcess(data, null, data.value));
            case "memberof":
                return buildMemberOf(nextProcess(data, null, data.value));
            case "array":
                return buildArray(nextProcess(data, null, data.value));
            case "or":
                return buildOr(nextProcess(data, null, data.value));
            case "and":
                return buildAnd(nextProcess(data, null, data.value));
            }
            const result: Jsonable.JsonableObject =
            {
            };
            return result;
        };
        export const setCommonProperties = <T>(result: Jsonable.JsonableObject, data: Process<Type.CommonProperties & { default?: T }>) =>
        {
            if (data.value.default)
            {
                result["default"] = data.value.default;
            }
            if (data.value.title)
            {
                result["title"] = data.value.title;
            }
            if (data.value.description)
            {
                result["description"] = data.value.description;
            }
            return result;
        };
        export const buildPrimitiveType = (data: Process<Type.PrimitiveTypeElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            switch(data.value.type)
            {
            case "any":
            case "unknown":
                break;
            default:
                result["type"] = data.value.type;
                break;
            }
            if ("integer" === data.value.type || "number" === data.value.type)
            {
                if (undefined !== data.value.minimum)
                {
                    result["minimum"] = data.value.minimum;
                }
                if (undefined !== data.value.exclusiveMinimum)
                {
                    result["exclusiveMinimum"] = data.value.exclusiveMinimum;
                }
                if (undefined !== data.value.maximum)
                {
                    result["maximum"] = data.value.maximum;
                }
                if (undefined !== data.value.exclusiveMaximum)
                {
                    result["exclusiveMaximum"] = data.value.exclusiveMaximum;
                }
                if (undefined !== data.value.multipleOf)
                {
                    result["multipleOf"] = data.value.multipleOf;
                }
                // これは TypeScript のコードでしか使わない値なので JSON Schema には吐かない
                // if (undefined !== data.value.safeInteger)
                // {
                //     result["safeInteger"] = data.value.safeInteger;
                // }
                // if (undefined !== data.value.safeNumber)
                // {
                //     result["safeNumber"] = data.value.safeNumber;
                // }
            }
            if ("string" === data.value.type)
            {
                if (undefined !== data.value.minLength)
                {
                    result["minLength"] = data.value.minLength;
                }
                if (undefined !== data.value.maxLength)
                {
                    result["maxLength"] = data.value.maxLength;
                }
                if ("pattern" in data.value)
                {
                    result["pattern"] = data.value.pattern;
                }
                if ("format" in data.value)
                {
                    result["pattern"] = Type.StringFormatMap[data.value.format];
                    result["format"] = data.value.format;
                }
                // これは TypeScript のコードでしか使わない値なので JSON Schema には吐かない
                // if ("regexpFlags" in data.value && "string" === typeof data.value.regexpFlags)
                // {
                //     result["regexpFlags"] = data.value.regexpFlags;
                // }
            }
            return setCommonProperties(result, data);
        };
        export const buildInterface = (data: Process<Type.InterfaceDefinition>):Jsonable.JsonableObject =>
        {
            const properties: Jsonable.JsonableObject = { };
            const result: Jsonable.JsonableObject =
            {
                type: "object",
                properties,
                //additionalProperties: false,
                required: Object.keys(data.value.members).filter(i => ! (i.endsWith("?") || isKindofNeverType(nextProcess(data, i, data.value.members[i])))),
            };
            const notRequired: string[] = [];
            if (data.value.extends)
            {
                // additionalProperties: false と allOf の組み合わせは残念な事になるので極力使わない。( additionalProperties: false が、 allOf の参照先の properties も参照元の Properties も使えなくしてしまうので、この組み合わせは使えたもんじゃない。 )
                const allOf: Jsonable.Jsonable[] = [];
                data.value.extends.forEach
                (
                    i =>
                    {
                        const current = resolveRefer(nextProcess(data, null, i));
                        if (Type.isInterfaceDefinition(current.value))
                        {
                            const base = buildInterface(<Process<Type.InterfaceDefinition>>current);
                            Object.assign(properties, base["properties"]);
                            const required = result["required"] as string[];
                            required.push(...(base["required"] as string[]).filter(j => ! required.includes(j)));
                            const not = base["not"];
                            if (Jsonable.isJsonableObject(not))
                            {
                                const baseNotRequired = not["required"];
                                if (EvilType.Validator.isArray(EvilType.Validator.isString)(baseNotRequired))
                                {
                                    notRequired.push(...baseNotRequired);
                                }
                            }
                        }
                        else
                        {
                            allOf.push(buildRefer(nextProcess(data, null, i)));
                        }
                    }
                );
                if (allOf.some(_i => true))
                {
                    result["allOf"] = allOf;
                }
            }
            Object.entries(data.value.members).forEach
            (
                i =>
                {
                    const key = Text.getPrimaryKeyName(i[0]);
                    const value = i[1];
                    if (isKindofNeverType(nextProcess(data, key, value)))
                    {
                        notRequired.push(key);
                    }
                    else
                    {
                        properties[key] = buildTypeOrRefer(nextProcess(data, key, value));
                    }
                }
            );
            const additionalProperties = getAdditionalProperties(data);
            if ("boolean" === typeof additionalProperties)
            {
                result["additionalProperties"] = additionalProperties;
            }
            if (notRequired.some(_ => true))
            {
                result["not"] =
                {
                    required: notRequired,
                };
            }
            return setCommonProperties(result, data);
        };
        export const buildDictionary = (data: Process<Type.DictionaryDefinition>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: "object",
            };
            const valueType = buildTypeOrRefer(nextProcess(data, null, data.value.valueType));
            if (undefined === data.value.keyin)
            {
                result["additionalProperties"] = valueType;
            }
            else
            {
                // ここには到達しない
                const properties: Jsonable.JsonableObject = { };
                const keys = getActualKeys(nextProcess(data, null, data.value.keyin));
                keys.map(i => Text.getPrimaryKeyName(i)).forEach(key => properties[key] = valueType);
                result["properties"] = properties;
                switch(data.value.optionality ?? "as-is")
                {
                case "as-is":
                    result["required"] = keys.filter(i => ! i.endsWith("?"));
                    break;
                case "partial":
                    result["required"] = [];
                    break;
                case "required":
                    result["required"] = keys.map(i => Text.getPrimaryKeyName(i));
                    break;
                }
                const additionalProperties = getAdditionalProperties(data);
                if ("boolean" === typeof additionalProperties)
                {
                    result["additionalProperties"] = additionalProperties;
                }
            }
            return setCommonProperties(result, data);
        };
        export const buildEnumType = (data: Process<Type.EnumTypeElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                enum: data.value.members,
            };
            return setCommonProperties(result, data);
        };
        export const buildTypeOf = (data: Process<Type.TypeofElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            let literal = getLiteral(nextProcess(data, null, data.value.value));
            if (literal)
            {
                result["const"] = literal.const;
            }
            else
            {
                console.error(`🚫 Can not resolve refer: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref }) }`);
            }
            return setCommonProperties(result, data);
        };
        export const buildKeyOf = (data: Process<Type.KeyofElement>): Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            const target = getKeyofTarget(nextProcess(data, null, data.value));
            if (Type.isInterfaceDefinition(target.value))
            {
                result["enum"] = getKeys(nextProcess(target, null, target.value)).map(i => Text.getPrimaryKeyName(i));
            }
            else
            if (Type.isDictionaryDefinition(target.value))
            {
                if (undefined !== target.value.keyin)
                {
                    result["enum"] = getActualKeys(nextProcess(target, null, target.value.keyin)).map(i => Text.getPrimaryKeyName(i));
                }
                else
                {
                    result["type"] = "string";
                }
            }
            else
            if (Type.isLiteralElement(target.value))
            {
                if (EvilType.Validator.isObject(target.value.const))
                {
                    result["enum"] = Object.keys(target.value.const);
                }
                else
                {
                    result["enum"] = [];
                }
            }
            else
            {
                result["type"] = "string";
            }
            return setCommonProperties(result, data);
        };
        export const buildItemOf = (data: Process<Type.ItemofElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            let literal = getLiteral(nextProcess(data, null, data.value.value));
            if (literal)
            {
                if (Array.isArray(literal.const))
                {
                    result["enum"] = literal.const;
                }
                else
                {
                    console.error(`🚫 Not array itemof: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref, literal: literal.const }) }`);
                }
            }
            else
            {
                console.error(`🚫 Can not resolve refer: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref }) }`);
            }
            return setCommonProperties(result, data);
        };
        export const buildMemberOf = (data: Process<Type.MemberofElement>):Jsonable.JsonableObject =>
        {
            const target = getMemberofTarget(data);
            if (Type.isMemberofElement(target.value))
            {
                console.error(`🚫 Can not resolve memberof: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref, key: data.value.key, }) }`);
                const result: Jsonable.JsonableObject =
                {
                };
                return setCommonProperties(result, data);
            }
            else
            {
                return buildTypeOrRefer(target);
            }
        };
        export const buildRefer = (data: Process<Type.ReferElement>):Jsonable.JsonableObject =>
        {
            const path = getAbsolutePath(data, data.value);
            const result: Jsonable.JsonableObject =
            {
                $ref: resolveExternalRefer(data, path) ?? `#/${Const.definitions}/${path}`,
            };
            return setCommonProperties(result, data);
        };
        export const buildArray = (data: Process<Type.ArrayElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: "array",
                items: buildTypeOrRefer(nextProcess(data, null, data.value.items)),
            };
            if (undefined !== data.value.minItems)
            {
                result["minItems"] = data.value.minItems;
            }
            if (undefined !== data.value.maxItems)
            {
                result["maxItems"] = data.value.maxItems;
            }
            if (undefined !== data.value.uniqueItems)
            {
                result["uniqueItems"] = data.value.uniqueItems;
            }
            return setCommonProperties(result, data);
        };
        export const buildOr = (data: Process<Type.OrElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                oneOf: data.value.types.map(i => buildTypeOrRefer(nextProcess(data, null, i))),
            };
            return setCommonProperties(result, data);
        };
        export const buildAnd = (data: Process<Type.AndElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                allOf: data.value.types.map(i => buildTypeOrRefer(nextProcess(data, null, i))),
            };
            return setCommonProperties(result, data);
        };
        export const buildTypeOrRefer = (data: Process<Type.TypeOrRefer>):Jsonable.JsonableObject =>
            Type.isReferElement(data.value) ?
                buildRefer(nextProcess(data, null, data.value)):
                buildType(nextProcess(data, null, data.value));
    }
}
export namespace Format
{
// data:code(object) to data:output(text)
    export const getMaxLineLength = (options: Type.OutputOptions): null | number =>
        EvilType.Validator.isUndefined(options.maxLineLength) ? config.maxLineLength: options.maxLineLength;
    export const buildIndent = (options: Type.OutputOptions, indentDepth: number) =>
        Array.from({ length: indentDepth, })
        .map(_ => "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(_ => " ").join(""): "\t")
        .join("");
    export const getReturnCode = (_options: Type.OutputOptions) => "\n";
    export const expressions = (code: CodeExpression[]): string =>
        code.map(i => i.expression).join(" ");
    export const getTokens = (code: CodeInlineEntry | CodeInlineEntry | CodeInlineBlock): string[] =>
    {
        switch(code.$code)
        {
        case "inline-block":
            return [ "{", ...code.lines.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []), "}", ];
        case "line":
            return [ ...code.expressions.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []) ];
        case "expression":
            return [ code.expression, ];
        }
    };
    export interface LineProcess
    {
        options: Readonly<Type.OutputOptions>;
        indentDepth: number;
        result: string;
        buffer: string;
        tokens: string[];
        i: number;
    }
    export const separator = (data: Readonly<LineProcess>) =>
    {
        const token = data.tokens[data.i];
        if ("" === data.buffer)
        {
            if ("" === data.result)
            {
                return buildIndent(data.options, data.indentDepth);
            }
            else
            {
                return buildIndent(data.options, data.indentDepth +1);
            }
        }
        else
        {

            if ( ! data.buffer.endsWith("|") && ! data.buffer.endsWith("&") && ! token.startsWith("!"))
            {
                if
                (
                    [ ")", "[]", ":", ".", ",", ";", ].includes(token) ||
                    ( ! data.buffer.endsWith("=") && ! data.buffer.endsWith("=>") && "(" === token) ||
                    data.buffer.endsWith("(") ||
                    data.buffer.endsWith(".")
                    // data.buffer.endsWith("...")
                )
                {
                    return "";
                }
            }
        }
        return " ";
    };
    export const temporaryAssembleLine = (data: Readonly<LineProcess>, length: number) =>
    {
        let { options, indentDepth, result, buffer, tokens, i, } = data;
        let iEnd = Math.min(data.tokens.length, data.i +length);
        while(i < iEnd)
        {
            buffer += separator({ options, indentDepth, result, buffer, tokens, i, });
            buffer += data.tokens[i];
            ++i;
        }
        return buffer;
    }
    export const isInLineComment = (data: Readonly<LineProcess>) =>
    {
        const ix = data.tokens.indexOf("//");
        return 0 <= ix && ix <= data.i;
    }
    export const isLineBreak = (data: Readonly<LineProcess>) =>
    {
        const maxLineLength = getMaxLineLength(data.options);
        if (null !== maxLineLength && ! isInLineComment(data))
        {
            let { options, indentDepth, result, buffer, tokens, i, } = data;
            ++i;
            if (data.i +1 < tokens.length && maxLineLength <= temporaryAssembleLine({ options, indentDepth, result, buffer, tokens, i, }, 1).length)
            {
                return ! config.lineUnbreakableTokens.heads.includes(tokens[data.i]) && ! config.lineUnbreakableTokens.tails.includes(tokens[data.i +1]);
            }
            if (data.i +2 < tokens.length && maxLineLength <= temporaryAssembleLine({ options, indentDepth, result, buffer, tokens, i, }, 2).length)
            {
                return config.lineUnbreakableTokens.heads.includes(tokens[data.i +1]) || config.lineUnbreakableTokens.tails.includes(tokens[data.i +2]);
            }
        }
        return false;
    }
    export const line = (options: Readonly<Type.OutputOptions>, indentDepth: number, code: CodeLine): string =>
    {
        const returnCode = getReturnCode(options);
        const data: LineProcess =
        {
            options,
            indentDepth,
            result: "",
            buffer: "",
            tokens: code.expressions.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []),
            i: 0,
        };
        while(data.i < data.tokens.length)
        {
            data.buffer = temporaryAssembleLine(data, 1);
            if (isLineBreak(data))
            {
                data.result += data.buffer +returnCode;
                data.buffer = "";
            }
            ++data.i;
        }
        data.result += data.buffer;
        if ( ! isInLineComment(data))
        {
            data.result += ";";
        }
        data.result += returnCode;
        return data.result;
    };
    export const inlineBlock = (options: Readonly<Type.OutputOptions>, indentDepth: number, code: CodeInlineBlock): string =>
        [ "{", ...code.lines.map(i => text(options, indentDepth +1, i)), "}", ].join(" ");
    export const block = (options: Type.OutputOptions, indentDepth: number, code: CodeBlock): string =>
    {
        const currentIndent = buildIndent(options, indentDepth);
        const returnCode = getReturnCode(options);
        let result = "";
        if ("allman" === options.indentStyle)
        {
            if (0 < (code.header ?? []).length)
            {
                result += currentIndent +expressions(code.header) +returnCode;
            }
            result += currentIndent +"{" +returnCode;
        }
        else
        {
            if (0 < (code.header ?? []).length)
            {
                result += currentIndent +expressions(code.header) +" " +"{" +returnCode;
            }
        }
        result += text(options, indentDepth +1, code.lines);
        result += currentIndent +"}" +returnCode;
        return result;
    }
    export const text = (options: Type.OutputOptions, indentDepth: number, code: CodeExpression | CodeEntry | CodeEntry[]): string =>
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
const build = (jsonPath: string) =>
{
    try
    {
        const fget = (path: string) => fs.readFileSync(path, { encoding: "utf-8" });
        const rawSource = fget(jsonPath);
        const typeSource = Jsonable.parse(rawSource);
        const errorListner = EvilType.Validator.makeErrorListener(jsonPath);
        const resolvePath = (path: string) =>
        {
            if (path.startsWith("./") || path.startsWith("../"))
            {
                let base = jsonPath.split("/").slice(0, -1);
                let current = path;
                while(true)
                {
                    if (current.startsWith("./"))
                    {
                        current = current.slice(2);
                    }
                    else
                    if (current.startsWith("../"))
                    {
                        current = current.slice(3);
                        base = base.slice(0, -1);
                    }
                    else
                    {
                        return [ ...base, current ].join("/");
                    }
                }
            }
            else
            {
                return path;
            }
        };
        if (Type.isTypeSchema(typeSource, errorListner))
        {
            const code =
            [
                ...$comment(typeSource),
                ...Build.Define.buildImports(typeSource.imports),
                ...Build.Define.buildDefineNamespaceCore(Build.Define.makeProcess(typeSource)),
            ];
            const result = Format.text(typeSource.options, 0, code);
            fs.writeFileSync(resolvePath(typeSource.options.outputFile), result, { encoding: "utf-8" });
            if (typeSource.options.schema)
            {
                const schema = Build.Schema.build(Build.Schema.makeProcess(typeSource, typeSource.options.schema));
                fs.writeFileSync(resolvePath(typeSource.options.schema.outputFile), Jsonable.stringify(schema, null, 4), { encoding: "utf-8" });
            }
            return true;
        }
        else
        {
            console.error("🚫 Invalid TypeSchema");
            console.error(errorListner);
            console.error(`See ${config.repository}`);
        }
    }
    catch(error)
    {
        console.error(error);
    }
    return false;
}
const result = build(jsonPath);
const emoji = result ? "✅": "🚫";
const text = result ? "end": "failed";
console.log(`${emoji} ${jsonPath} build ${text}: ${new Date()} ( ${(getBuildTime() / 1000).toLocaleString()}s )`);
// how to run: `node . YOUR-TYPE.JSON`
