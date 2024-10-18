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
export namespace Build
{
    export const buildExport = (define: { export?: boolean } | { }): CodeExpression[] =>
        ("export" in define && (define.export ?? true)) ? [$expression("export")]: [];
    export const buildExtends = (define: Type.InterfaceDefinition): CodeExpression[] =>
        undefined !== define.extends ? [$expression("extends"), ...define.extends.map((i, ix, list) => $expression(ix < (list.length -1) ? `${i.$ref},`: `${i.$ref}`))]: [];
    export const asConst = [ $expression("as"), $expression("const"), ];
    export const buildLiteralAsConst = (literal: Jsonable.Jsonable) =>
        [ $expression(Jsonable.stringify(literal)), ...asConst, ];
    export namespace Define
    {
        export const buildDefineLine = (declarator: string, name: string, define: Type.TypeOrValue, postEpressions: CodeExpression[] = []): CodeLine =>
            $line([ ...buildExport(define), $expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineDefine(define)), ...postEpressions, ]);
        export const buildInlineDefineLiteral = (define: Type.LiteralElement) =>
            [ $expression(Jsonable.stringify(define.literal)) ];
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
        export const buildDefinePrimitiveType = (name: string, value: Type.PrimitiveTypeElement): CodeLine =>
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
        export const buildInlineDefineArray = (value: Type.ArrayElement) =>
            [ ...enParenthesisIfNeed(buildInlineDefine(value.items)), $expression("[]"), ];
        export const buildInlineDefineDictionary = (value: Type.DictionaryDefinition) =>
            $iblock([ $line([ $expression("[key: string]:"), ...buildInlineDefine(value.valueType), ]) ]);
        export const buildInlineDefineAnd = (value: Type.AndElement) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("&"));
        export const buildInlineDefineOr = (value: Type.OrElement) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("|"));
        export const buildDefineInlineInterface = (value: Type.InterfaceDefinition) => $iblock
        (
            Object.keys(value.members)
                .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(value.members[name])]))
        );
        export const buildDefineInterface = (name: string, value: Type.InterfaceDefinition): CodeBlock =>
        {
            const header = [ ...buildExport(value), ...["interface", name].map(i => $expression(i)), ...buildExtends(value), ];
            const lines = Object.keys(value.members)
                .map(name => $line([ $expression(name+ ":"), ...buildInlineDefine(value.members[name]), ]));
            return $block(header, lines);
        };
        export const buildDefineDictionary = (name: string, value: Type.DictionaryDefinition): CodeBlock =>
        {
            const header = [ ...buildExport(value), ...["type", name].map(i => $expression(i)), $expression("=")];
            return $block(header, [ $line([ $expression("[key: string]:"), ...buildInlineDefine(value.valueType), ]) ]);
        };
        export const buildDefineNamespaceCore = (options: Type.OutputOptions, members: { [key: string]: Type.Definition; }): CodeEntry[] =>
        [
            ...Object.entries(members)
                .map(i => Build.Define.buildDefine(options, i[0], i[1])),
            ...Object.entries(members)
                .map(i => Type.isTypeOrValue(i[1]) && Build.Validator.isValidatorTarget(i[1]) ? Build.Validator.buildValidator(options, i[0], i[1]): []),
            ...Object.entries(members)
                .map(i => Type.isInterfaceDefinition(i[1]) ? Build.Validator.buildValidatorObject(options, i[0], i[1]): []),
        ]
        .reduce((a, b) => [...a, ...b], []);
        export const buildDefineNamespace = (options: Type.OutputOptions, name: string, value: Type.NamespaceDefinition): CodeBlock =>
        {
            const header = [...buildExport(value), $expression("namespace"), $expression(name), ];
            const lines = buildDefineNamespaceCore(options, value.members);
            return $block(header, lines);
        };
        export const buildImports = (imports: undefined | Type.ImportDefinition[]) =>
            undefined === imports ? []: imports.map(i => $line([ $expression("import"), $expression(i.target), $expression("from"), $expression(Jsonable.stringify(i.from)) ]));
        export const buildDefine = (options: Type.OutputOptions, name: string, define: Type.Definition): CodeEntry[] =>
        {
            switch(define.$type)
            {
            case "code":
                return [ $line([ ...$comment(define), ...buildExport(define), ...define.tokens.map(i => $expression(i)), ]), ];
            case "interface":
                return [ ...$comment(define), buildDefineInterface(name, define), ];
            case "dictionary":
                return [ ...$comment(define), buildDefineDictionary(name, define), ];
            case "namespace":
                return [ ...$comment(define), buildDefineNamespace(options, name, define), ];
            case "type":
                return [ ...$comment(define), buildDefineLine("type", name, define), ];
            case "value":
                return [ ...$comment(define), buildDefineLine("const", name, define, Type.isLiteralElement(define.value) ? asConst: []), ];
            }
        };
        export const buildInlineDefine = (define: Type.TypeOrValueOfRefer): (CodeExpression | CodeInlineBlock)[] =>
        {
            if (Type.isReferElement(define))
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
    export namespace Validator
    {
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
                return [ $expression(Jsonable.stringify(value)), $expression("==="), $expression(name), ];
            }
        };
        export const buildInlineLiteralValidator = (define: Type.LiteralElement) =>
            $expression(`(value: unknown): value is ${Define.buildInlineDefineLiteral(define)} => ${buildLiterarlValidatorExpression("value", define.literal)};`);
        export const buildValidatorLine = (declarator: string, name: string, define: Type.Type): CodeExpression[] =>
            [ ...buildExport(define), $expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineValidator(name, define)), ];
        export const buildObjectValidatorObjectName = (name: string) =>
            [ ...Text.getNameSpace(name).split("."), `${Text.toLowerCamelCase(Text.getNameBody(name))}ValidatorObject`, ].filter(i => "" !== i).join(".");
        export const buildValidatorName = (name: string) =>
            [ ...Text.getNameSpace(name).split("."), `is${Text.toUpperCamelCase(Text.getNameBody(name))}`, ].filter(i => "" !== i).join(".");
        export const buildValidatorExpression = (name: string, define: Type.TypeOrValueOfRefer): CodeExpression[] =>
        {
            if (Type.isReferElement(define))
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
                    switch(define.type)
                    {
                    case "null":
                        return [ $expression(`"${define.type}" === ${name}`), ];
                    case "integer":
                        return [ $expression("Number.isInteger"), $expression("("), $expression(name), $expression(")"), ];
                    default:
                        return [ $expression(`"${define.type}" === typeof ${name}`), ];
                    }
                case "type":
                    return buildValidatorExpression(name, define.define);
                case "enum-type":
                    return [ $expression(`${Jsonable.stringify(define.members)}.includes(${name} as any)`), ];
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
                            i => EvilType.Validator.isObject(i) ?
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
        export const buildInterfaceValidator = (name: string, define: Type.InterfaceDefinition): CodeExpression[] =>
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
            if (Type.isDictionaryDefinition(members))
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
                        const current = Type.isOrElement(value) ?
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
        export const buildInlineValidator = (name: string, define: Type.TypeOrValue) =>
        [
            $expression(`(value: unknown): value is ${Type.isValueDefinition(define) ? "typeof " +name: name} =>`),
            ...buildValidatorExpression("value", define),
        ];
        export const buildObjectValidatorGetterCoreEntry = (define: Type.TypeOrRefer): CodeInlineEntry[] =>
        {
            if (Type.isReferElement(define))
            {
                return [ $expression(buildValidatorName(define.$ref)), ];
            }
            else
            {
                switch(define.$type)
                {
                case "literal":
                    return buildCall([ $expression("EvilType.Validator.isJust"), ], [ buildLiteralAsConst(define.literal), ]);
                case "typeof":
                    return [ $expression(buildValidatorName(define.value.$ref)), ];
                case "itemof":
                    return buildCall([ $expression("EvilType.Validator.isEnum"), ], [ $expression(define.value.$ref), ]);
                case "primitive-type":
                    switch(define.type)
                    {
                    case "null":
                        return [ $expression("EvilType.Validator.isNull"), ];
                    case "boolean":
                        return [ $expression("EvilType.Validator.isBoolean"), ];
                    case "number":
                        return [ $expression("EvilType.Validator.isNumber"), ];
                    case "integer":
                        return [ $expression("EvilType.Validator.isInteger"), ];
                    case "string":
                        return [ $expression("EvilType.Validator.isString"), ];
                    }
                    //return [ $expression(`EvilType.Validator.is${Text.toUpperCamelCase(define.type)}`), ];
                case "type":
                    return buildObjectValidatorGetterCoreEntry(define.define);
                case "enum-type":
                    return buildCall([ $expression("EvilType.Validator.isEnum"), ], [ buildLiteralAsConst(define.members), ]);
                case "array":
                    return buildCall([ $expression("EvilType.Validator.isArray"), ], [ buildObjectValidatorGetterCoreEntry(define.items), ]);
                case "and":
                    return buildCall
                    (
                        [ $expression("EvilType.Validator.isAnd"), ],
                        define.types.map(i => buildObjectValidatorGetterCoreEntry(i))
                    );
                case "or":
                    return buildCall
                    (
                        [ $expression("EvilType.Validator.isOr"), ],
                        define.types.map(i => buildObjectValidatorGetterCoreEntry(i))
                    );
                case "interface":
                    return buildObjectValidator(define);
                case "dictionary":
                    return buildCall
                    (
                        [ $expression("EvilType.Validator.isDictionaryObject"), ],
                        [ buildObjectValidatorGetterCoreEntry(define.valueType), ]
                    );
                }
            }
        };
        export const buildObjectValidatorGetterCore = (define: Type.InterfaceDefinition & { members: { [key: string]: Type.TypeOrRefer; }; }) => $iblock
        (
            Object.entries(define.members).map
            (
                i =>
                {
                    const key = Text.getPrimaryKeyName(i[0]);
                    const value = buildObjectValidatorGetterCoreEntry(i[1]);
                    return $line([ $expression(`${key}`), $expression(":"), ...(key === i[0] ? value: buildCall([ $expression("EvilType.Validator.isOptional"), ], [ value, ])) ])
                }
            )
        );
        export const buildObjectValidator = (define: Type.InterfaceDefinition & { members: { [key: string]: Type.TypeOrRefer; }; }) => (define.extends ?? []).some(_ => true) ?
            [
                $expression("EvilType.Validator.mergeObjectValidator"),
                ...Define.enParenthesis
                ([
                    ...(define.extends ?? []).map(i => $expression(`${buildObjectValidatorObjectName(i.$ref)},`)),
                    buildObjectValidatorGetterCore(define),
                ]),
            ]:
            Define.enParenthesis([ buildObjectValidatorGetterCore(define), ]);
        export const isLazyValidator = (define: Type.TypeOrRefer): boolean =>
        {
            if (Type.isType(define))
            {
                switch(define.$type)
                {
                case "enum-type":
                case "itemof":
                case "literal":
                case "primitive-type":
                case "typeof":
                    return false;
                case "type":
                    return isLazyValidator(define.define);
                case "array":
                    return isLazyValidator(define.items);
                case "dictionary":
                    return isLazyValidator(define.valueType);
                case "and":
                case "or":
                    return define.types.some(i => isLazyValidator(i));
                case "interface":
                    return true;
                }
            }
            return true;
        };
        export const buildFullValidator = (_name: string, define: Type.Type) => isLazyValidator(define) ?
            [
                ...buildCall
                (
                    [ $expression("EvilType.lazy"), ],
                    [ [ $expression("()"), $expression("=>"), ...buildObjectValidatorGetterCoreEntry(define), ] , ]
                ),
                // $expression(`(value: unknown, listner?: EvilType.Validator.ErrorListener): value is ${Type.isValueDefinition(define) ? "typeof " +name: name} =>`),
                // ...buildCall
                // (
                //     buildObjectValidatorGetterCoreEntry(define),
                //     [ $expression("value"), $expression("listner"), ]
                // ),
            ]:
            buildObjectValidatorGetterCoreEntry(define);
        export const isValidatorTarget = (define: Type.TypeOrValue) =>
            ! (Type.isValueDefinition(define) && false === define.validator);
        export const buildValidator = (options: Type.OutputOptions, name: string, define: Type.TypeOrValue): CodeLine[] =>
        {
            if ("simple" === options.validatorOption)
            {
                const result =
                [
                    $line
                    ([
                        ...buildExport(define),
                        $expression("const"),
                        $expression(buildValidatorName(name)),
                        $expression("="),
                        ...buildInlineValidator(name, define),
                    ])
                ];
                return result;
            }
            if ("full" === options.validatorOption)
            {
                const result: CodeLine["expressions"] =
                [
                    ...buildExport(define),
                    $expression("const"),
                    $expression(buildValidatorName(name)),
                ];
                if ("interface" === define.$type)
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
                                        [ $expression(buildObjectValidatorObjectName(name)), ...(undefined !== define.additionalProperties ? [ $expression(Jsonable.stringify(define.additionalProperties)), ]: []) ]
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
                        //         [ $expression(buildObjectValidatorObjectName(name)), ...(undefined !== define.additionalProperties ? [ $expression(Jsonable.stringify(define.additionalProperties)), ]: []) ]
                        //     ),
                        //     [ $expression("value"), $expression("listner"), ]
                        // )
                    );
                }
                else
                if ("value" === define.$type)
                {
                    if (Type.isReferElement(define.value))
                    {
                        result.push
                        (
                            $expression("="),
                            $expression(buildValidatorName(define.value.$ref))
                        );
                    }
                    else
                    {
                        result.push($expression("="), ...buildCall([ $expression("EvilType.Validator.isJust"), ], [ $expression(name), ]));
                    }
                }
                else
                {
                    result.push
                    (
                        ...[ $expression(":"), $expression(`EvilType.Validator.IsType<${name}>`) ],
                        $expression("="),
                        ...buildFullValidator(name, define)
                    );
                }
                return [ $line(result) ];
            }
            return [];
        };
        export const buildValidatorObject = (options: Type.OutputOptions, name: string, define: Type.InterfaceDefinition): CodeLine[] =>
        {
            if ("full" === options.validatorOption)
            {
                const result =
                [
                    $line
                    ([
                        ...buildExport(define),
                        $expression("const"),
                        $expression(buildObjectValidatorObjectName(name)),
                        $expression(":"),
                        $expression(`EvilType.Validator.ObjectValidator<${name}>`),
                        $expression("="),
                        ...buildObjectValidator(define),
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
        export interface SchemaProcess<ValueType>
        {
            source: Type.TypeSchema;
            schema: Type.SchemaOptions;
            definitions: Type.DefinitionMap;
            path: string;
            value: ValueType;
        }
        export const makeProcess = (source: Type.TypeSchema, schema: Type.SchemaOptions): SchemaProcess<Type.DefinitionMap> =>
        ({
            source,
            schema,
            definitions: makeDefinitionFlatMap(source.defines),
            path: "",
            value: source.defines,
        });
        export const nextProcess = <ValueType>(current: SchemaProcess<unknown>, key: null | string, value: ValueType):SchemaProcess<ValueType> =>
        ({
            source: current.source,
            schema: current.schema,
            definitions: current.definitions,
            path: nextPath(current.path, key),
            value,
        });
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
        export const getAbsolutePath = (data: SchemaProcess<unknown>, value: Type.ReferElement, context: string = data.path): string =>
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
        export const resolveExternalRefer = (data: SchemaProcess<unknown>, absolutePath: string) =>
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
        export const getDefinition = (data: SchemaProcess<unknown>, value: Type.ReferElement): SchemaProcess<Type.Definition> =>
        {
            const path = getAbsolutePath(data, value);
            const result: SchemaProcess<Type.Definition> =
            {
                source: data.source,
                schema: data.schema,
                definitions: data.definitions,
                path,
                value: data.definitions[path],
            };
            return result;
        };
        export const getLiteral = (data: SchemaProcess<unknown>, value: Type.ReferElement): Type.LiteralElement | null =>
        {
            const definition = getDefinition(data, value);
            if (Type.isValueDefinition(definition.value))
            {
                if (Type.isLiteralElement(definition.value.value))
                {
                    return definition.value.value;
                }
                else
                {
                    return getLiteral(definition, definition.value.value);
                }
            }
            return null;
        };
        export const build = (data: SchemaProcess<Type.DefinitionMap>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                $id: data.schema.$id,
                $schema: "http://json-schema.org/draft-07/schema#",
            };
            if (data.schema.$ref)
            {
                result["$ref"] = `#/${Const.definitions}/${data.schema.$ref}`;
            }
            result[Const.definitions] = buildDefinitions(data);
            return result;
        };
        export const buildDefinitions = (data: SchemaProcess<Type.DefinitionMap>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject = { };
            Object.entries(data.value).forEach
            (
                i =>
                {
                    const key = i[0];
                    const value = i[1];
                    switch(value.$type)
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
        export const buildLiteral = (data: SchemaProcess<Type.LiteralElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                const: data.value.literal,
                //enum: [ value.literal, ],
            };
            return result;
        };
        export const buildValue = (data: SchemaProcess<Type.ValueDefinition>):Jsonable.JsonableObject =>
            Type.isLiteralElement(data.value.value) ?
                buildLiteral(nextProcess(data, null, data.value.value)):
                buildRefer(nextProcess(data, null, data.value.value));
        export const buildType = (data: SchemaProcess<Type.Type>):Jsonable.JsonableObject =>
        {
            switch(data.value.$type)
            {
            case "primitive-type":
                return buildPrimitiveType(nextProcess(data, null, data.value));
            case "type":
                return buildTypeOrRefer(nextProcess(data, null, data.value.define));
            case "interface":
                return buildInterface(nextProcess(data, null, data.value));
            case "dictionary":
                return buildDictionary(nextProcess(data, null, data.value));
            case "enum-type":
                return buildEnumType(nextProcess(data, null, data.value));
            case "typeof":
                return buildTypeOf(nextProcess(data, null, data.value));
            case "itemof":
                return buildItemOf(nextProcess(data, null, data.value));
            case "array":
                return buildArray(nextProcess(data, null, data.value));
            case "or":
                return buildOr(nextProcess(data, null, data.value));
            case "and":
                return buildAnd(nextProcess(data, null, data.value));
            case "literal":
                return buildLiteral(nextProcess(data, null, data.value));
            }
            const result: Jsonable.JsonableObject =
            {
            };
            return result;
        };
        export const setCommonProperties = (result: Jsonable.JsonableObject, data: SchemaProcess<{ title?: string, description?: string }>) =>
        {
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
        export const buildPrimitiveType = (data: SchemaProcess<Type.PrimitiveTypeElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: data.value.type,
            };
            return setCommonProperties(result, data);
        };
        export const buildInterface = (data: SchemaProcess<Type.InterfaceDefinition>):Jsonable.JsonableObject =>
        {
            const properties: Jsonable.JsonableObject = { };
            const result: Jsonable.JsonableObject =
            {
                type: "object",
                properties,
                //additionalProperties: false,
                required: Object.keys(data.value.members).filter(i => ! i.endsWith("?")),
            };
            if (data.value.extends)
            {
                // additionalProperties: false と allOf の組み合わせは残念な事になるので極力使わない。( additionalProperties: false が、 allOf の参照先の properties も参照元の Properties も使えなくしてしまうので、この組み合わせは使えたもんじゃない。 )
                const allOf: Jsonable.Jsonable[] = [];
                data.value.extends.forEach
                (
                    i =>
                    {
                        const current = getDefinition(data, i);
                        if (Type.isInterfaceDefinition(current.value))
                        {
                            const base = buildInterface(<SchemaProcess<Type.InterfaceDefinition>>current);
                            Object.assign(properties, base["properties"]);
                            const required = result["required"] as string[];
                            required.push(...(base["required"] as string[]).filter(j => ! required.includes(j)));
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
                    properties[key] = buildTypeOrRefer(nextProcess(data, null, value));
                }
            );
            if ("boolean" === typeof data.value.additionalProperties)
            {
                result["additionalProperties"] = data.value.additionalProperties;
            }
            return setCommonProperties(result, data);
        };
        export const buildDictionary = (data: SchemaProcess<Type.DictionaryDefinition>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: "object",
                additionalProperties: buildTypeOrRefer(nextProcess(data, null, data.value.valueType)),
            };
            return setCommonProperties(result, data);
        };
        export const buildEnumType = (data: SchemaProcess<Type.EnumTypeElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                enum: data.value.members,
            };
            return setCommonProperties(result, data);
        };
        export const buildTypeOf = (data: SchemaProcess<Type.TypeofElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            let literal = getLiteral(data, data.value.value);
            if (literal)
            {
                result["const"] = literal.literal;
            }
            else
            {
                console.error(`🚫 Can not resolve refer: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref }) }`);
            }
            return setCommonProperties(result, data);
        };
        export const buildItemOf = (data: SchemaProcess<Type.ItemofElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
            };
            let literal = getLiteral(data, data.value.value);
            if (literal)
            {
                if (Array.isArray(literal.literal))
                {
                    result["enum"] = literal.literal;
                }
                else
                {
                    console.error(`🚫 Not array itemof: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref, literal: literal.literal }) }`);
                }
            }
            else
            {
                console.error(`🚫 Can not resolve refer: ${ JSON.stringify({ path: data.path, $ref: data.value.value.$ref }) }`);
            }
            return setCommonProperties(result, data);
        };
        export const buildRefer = (data: SchemaProcess<Type.ReferElement>):Jsonable.JsonableObject =>
        {
            const path = getAbsolutePath(data, data.value);
            const result: Jsonable.JsonableObject =
            {
                $ref: resolveExternalRefer(data, path) ?? `#/${Const.definitions}/${path}`,
            };
            return setCommonProperties(result, data);
        };
        export const buildArray = (data: SchemaProcess<Type.ArrayElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: "array",
                items: buildTypeOrRefer(nextProcess(data, null, data.value.items)),
            };
            return setCommonProperties(result, data);
        };
        export const buildOr = (data: SchemaProcess<Type.OrElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                oneOf: data.value.types.map(i => buildTypeOrRefer(nextProcess(data, null, i))),
            };
            return setCommonProperties(result, data);
        };
        export const buildAnd = (data: SchemaProcess<Type.AndElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                allOf: data.value.types.map(i => buildTypeOrRefer(nextProcess(data, null, i))),
            };
            return setCommonProperties(result, data);
        };
        export const buildTypeOrRefer = (data: SchemaProcess<Type.TypeOrRefer>):Jsonable.JsonableObject =>
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
            return [ ...code.expressions.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []), "," ];
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
        if (0 < (code.header ?? []).length)
        {
            result += currentIndent +expressions(code.header) +returnCode;
        }
        result += currentIndent +"{" +returnCode;
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
                ...Build.Define.buildDefineNamespaceCore(typeSource.options, typeSource.defines),
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
