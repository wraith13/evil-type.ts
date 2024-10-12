'use strict';
const startAt = new Date();
import fs from "fs";
import { TypesPrime } from "./types-prime";
import { TypesError } from "./types-error";
import { Text } from "./text";
import { Jsonable } from "../generated/jsonable";
import { Types } from "../generated/types";
import config from "../resource/config.json";
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
export const $comment = (define: Types.CommentProperty): CodeLine[] => define.comment ? define.comment.map(i => $line([$expression("//"), $expression(i)])): [];
export const $iblock = (lines: CodeInlineBlock["lines"]): CodeInlineBlock => ({ $code: "inline-block", lines, });
export const $block = (header: CodeBlock["header"], lines: CodeBlock["lines"]): CodeBlock => ({ $code: "block", header, lines, });
export namespace Build
{
// data:input(json) to data:code(object)
    export const buildExport = (define: { export?: boolean } | { }): CodeExpression[] =>
        ("export" in define && (define.export ?? true)) ? [$expression("export")]: [];
    export const buildExtends = (define: Types.InterfaceDefinition): CodeExpression[] =>
        undefined !== define.extends ? [$expression("extends"), ...define.extends.map((i, ix, list) => $expression(ix < (list.length -1) ? `${i.$ref},`: `${i.$ref}`))]: [];
    export namespace Define
    {
        export const buildDefineLine = (declarator: string, name: string, define: Types.TypeOrValue, postEpressions: CodeExpression[] = []): CodeLine =>
            $line([ ...buildExport(define), $expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineDefine(define)), ...postEpressions, ]);
        export const buildInlineDefineLiteral = (define: Types.LiteralElement) => [$expression(Jsonable.stringify(define.literal))];
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
        export const buildInlineDefineEnum = (value: Types.EnumTypeElement) =>
            kindofJoinExpression(value.members.map(i => $expression(Jsonable.stringify(i))), $expression("|"));
        export const buildInlineDefineArray = (value: Types.ArrayElement) =>
            [ ...enParenthesisIfNeed(buildInlineDefine(value.items)), $expression("[]"), ];
        export const buildInlineDefineDictionary = (value: Types.DictionaryDefinition) =>
            $iblock([ $line([ $expression("[key: string]:"), ...buildInlineDefine(value.valueType), ]) ]);
        export const buildInlineDefineAnd = (value: Types.AndElement) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("&"));
        export const buildInlineDefineOr = (value: Types.OrElement) =>
            kindofJoinExpression(value.types.map(i => enParenthesisIfNeed(buildInlineDefine(i))), $expression("|"));
        export const buildDefineInlineInterface = (value: Types.InterfaceDefinition) => $iblock
        (
            Object.keys(value.members)
                .map(name => $line([$expression(name+ ":"), ...buildInlineDefine(value.members[name])]))
        );
        export const buildDefineInterface = (name: string, value: Types.InterfaceDefinition): CodeBlock =>
        {
            const header = [ ...buildExport(value), ...["interface", name].map(i => $expression(i)), ...buildExtends(value), ];
            const lines = Object.keys(value.members)
                .map(name => $line([ $expression(name+ ":"), ...buildInlineDefine(value.members[name]), ]));
            return $block(header, lines);
        };
        export const buildDefineDictionary = (name: string, value: Types.DictionaryDefinition): CodeBlock =>
        {
            const header = [ ...buildExport(value), ...["type", name].map(i => $expression(i)), $expression("=")];
            return $block(header, [ $line([ $expression("[key: string]:"), ...buildInlineDefine(value.valueType), ]) ]);
        };
        export const buildDefineNamespaceCore = (options: Types.OutputOptions, members: { [key: string]: Types.Definition; }): CodeEntry[] =>
        [
            ...Object.entries(members)
                .map(i => Build.Define.buildDefine(options, i[0], i[1])),
            ...Object.entries(members)
                .map(i => Types.isNamespaceDefinition(i[1]) || Types.isCodeDefinition(i[1]) || ! Build.Validator.isValidatorTarget(i[1]) ? []: Build.Validator.buildValidator(options, i[0], i[1]))
        ]
        .reduce((a, b) => [...a, ...b], []);
        export const buildDefineNamespace = (options: Types.OutputOptions, name: string, value: Types.NamespaceDefinition): CodeBlock =>
        {
            const header = [...buildExport(value), $expression("namespace"), $expression(name), ];
            const lines = buildDefineNamespaceCore(options, value.members);
            return $block(header, lines);
        };
        export const buildImports = (imports: undefined | Types.ImportDefinition[]) =>
            undefined === imports ? []: imports.map(i => $line([ $expression("import"), $expression(i.target), $expression("from"), $expression(Jsonable.stringify(i.from)) ]));
        export const buildDefine = (options: Types.OutputOptions, name: string, define: Types.Definition): CodeEntry[] =>
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
                return [ ...$comment(define), buildDefineLine("const", name, define, [ $expression("as"), $expression("const"), ]), ];
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
        export const buildInlineLiteralValidator = (define: Types.LiteralElement) =>
            $expression(`(value: unknown): value is ${Define.buildInlineDefineLiteral(define)} => ${buildLiterarlValidatorExpression("value", define.literal)};`);
        export const buildValidatorLine = (declarator: string, name: string, define: Types.Type): CodeExpression[] =>
            [ ...buildExport(define), $expression(declarator), $expression(name), $expression("="), ...convertToExpression(buildInlineValidator(name, define)), ];
        export const buildObjectValidatorGetterName = (name: string) =>
            [ ...Text.getNameSpace(name).split("."), `get${Text.toUpperCamelCase(Text.getNameBody(name))}Validator`, ].filter(i => "" !== i).join(".");
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
            if (Types.isDictionaryDefinition(members))
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
        export const buildObjectValidatorGetterCoreEntry = (define: Types.TypeOrRefer): CodeInlineEntry[] =>
        {
            if (Types.isReferElement(define))
            {
                return [ $expression(buildValidatorName(define.$ref)), ];
            }
            else
            {
                switch(define.$type)
                {
                case "literal":
                    return buildCall([ $expression("TypesPrime.isJust"), ], [ $expression(Jsonable.stringify(define.literal)), ]);
                case "typeof":
                    return [ $expression(buildValidatorName(define.value.$ref)), ];
                case "itemof":
                    return buildCall([ $expression("TypesPrime.isEnum"), ], [ $expression(define.value.$ref), ]);
                case "primitive-type":
                    switch(define.type)
                    {
                    case "null":
                        return [ $expression("TypesPrime.isNull"), ];
                    case "boolean":
                        return [ $expression("TypesPrime.isBoolean"), ];
                    case "number":
                        return [ $expression("TypesPrime.isNumber"), ];
                    case "string":
                        return [ $expression("TypesPrime.isString"), ];
                    }
                    return [ $expression(`TypesPrime.is${Text.toUpperCamelCase(define.type)}`), ];
                case "type":
                    return buildObjectValidatorGetterCoreEntry(define.define);
                case "enum-type":
                    return buildCall([ $expression("TypesPrime.isEnum"), ], [ $expression(Jsonable.stringify(define.members)), ]);
                case "array":
                    return buildCall([ $expression("TypesPrime.isArray"), ], [ buildObjectValidatorGetterCoreEntry(define.items), ]);
                case "and":
                    return buildCall
                    (
                        [ $expression("TypesPrime.isAnd"), ],
                        define.types.map(i => buildObjectValidatorGetterCoreEntry(i))
                    );
                case "or":
                    return buildCall
                    (
                        [ $expression("TypesPrime.isOr"), ],
                        define.types.map(i => buildObjectValidatorGetterCoreEntry(i))
                    );
                case "interface":
                    return buildObjectValidatorGetter(define);
                case "dictionary":
                    return buildCall
                    (
                        [ $expression("TypesPrime.isDictionaryObject"), ],
                        [ buildObjectValidatorGetterCoreEntry(define.valueType), ]
                    );
                }
            }
        };
        export const buildObjectValidatorGetterCore = (define: Types.InterfaceDefinition & { members: { [key: string]: Types.TypeOrRefer; }; }) => $iblock
        (
            Object.entries(define.members).map
            (
                i =>
                {
                    const key = Text.getPrimaryKeyName(i[0]);
                    const value = buildObjectValidatorGetterCoreEntry(i[1]);
                    return $line([ $expression(`${key}`), $expression(":"), ...(key === i[0] ? value: buildCall([ $expression("TypesPrime.isOptional"), ], [ value, ])) ])
                }
            )
        );
        export const buildObjectValidatorGetter = (define: Types.InterfaceDefinition & { members: { [key: string]: Types.TypeOrRefer; }; }) => (define.extends ?? []).some(_ => true) ?
            [
                $expression("TypesPrime.mergeObjectValidator"),
                ...Define.enParenthesis
                ([
                    ...(define.extends ?? []).map(i => $expression(`${buildObjectValidatorGetterName(i.$ref)}(),`)),
                    buildObjectValidatorGetterCore(define),
                ]),
            ]:
            Define.enParenthesis([ buildObjectValidatorGetterCore(define), ]);
        export const buildFullValidator = (name: string, define: Types.Type) =>
        [
            $expression(`(value: unknown, listner?: TypesError.Listener): value is ${Types.isValueDefinition(define) ? "typeof " +name: name} =>`),
            ...buildCall
            (
                buildObjectValidatorGetterCoreEntry(define),
                [ $expression("value"), $expression("listner"), ]
            ),
        ];
        export const isValidatorTarget = (define: Types.TypeOrValue) =>
            ! (Types.isValueDefinition(define) && false === define.validator);
        export const buildValidator = (options: Types.OutputOptions, name: string, define: Types.TypeOrValue): CodeLine[] =>
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
                if ("interface" === define.$type)
                {
                    const result =
                    [
                        ...
                        (
                            "interface" === define.$type ?
                            [
                                $line
                                ([
                                    ...buildExport(define),
                                    $expression("const"),
                                    $expression(buildObjectValidatorGetterName(name)),
                                    $expression("="),
                                    $expression("()"),
                                    $expression("=>"),
                                    $expression(`<TypesPrime.ObjectValidator<${name}>>`),
                                    ...buildObjectValidatorGetter(define),
                                ])
                            ]:
                            []
                        ),
                        $line
                        ([
                            ...buildExport(define),
                            $expression("const"),
                            $expression(buildValidatorName(name)),
                            $expression("="),
                            $expression(`(value: unknown, listner?: TypesError.Listener): value is ${name} =>`),
                            ...buildCall
                            (
                                buildCall
                                (
                                    [ $expression(`TypesPrime.isSpecificObject<${name}>`), ],
                                    [ buildCall([ $expression(buildObjectValidatorGetterName(name)), ], [ ]) ]
                                ),
                                [ $expression("value"), $expression("listner"), ]
                            ),
                        ])
                    ];
                    return result;
                }
                else
                if ("value" === define.$type)
                {
                    if (Types.isReferElement(define.value))
                    {
                        const result =
                        [
                            $line
                            ([
                                ...buildExport(define),
                                $expression("const"),
                                $expression(buildValidatorName(name)),
                                $expression("="),
                                $expression(buildValidatorName(define.value.$ref)),
                            ])
                        ];
                        return result;
                    }
                    else
                    {
                        const result =
                        [
                            $line
                            ([
                                ...buildExport(define),
                                $expression("const"),
                                $expression(buildValidatorName(name)),
                                $expression("="),
                                ...buildCall([ $expression("TypesPrime.isJust"), ], [ $expression(name), ]),
                            ])
                        ];
                        return result;
                    }
                }
                else
                {
                    const result =
                    [
                        $line
                        ([
                            ...buildExport(define),
                            $expression("const"),
                            $expression(buildValidatorName(name)),
                            $expression("="),
                            ...buildFullValidator(name, define),
                        ])
                    ];
                    return result;
                }
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
            source: Types.TypeSchema;
            schema: Types.SchemaOptions;
            path: string;
            value: ValueType;
        }
        export const makeProcess = (source: Types.TypeSchema, schema: Types.SchemaOptions): SchemaProcess<Types.TypeSchema["defines"]> =>
        ({
            source,
            schema,
            path: "",
            value: source.defines,
        });
        export const nextProcess = <ValueType>(current: SchemaProcess<unknown>, key: null | string, value: ValueType):SchemaProcess<ValueType> =>
        ({
            source: current.source,
            schema: current.schema,
            path: nextPath(current.path, key),
            value,
        });
        export const nextPath = (path: string, key: null | string) => null === key ? path: `${path}.${key}`;
        export const build = (data: SchemaProcess<Types.TypeSchema["defines"]>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                $id: data.schema.$id,
                $schema: "http://json-schema.org/draft-07/schema#",
            };
            if (data.schema.$ref)
            {
                result["$ref"] = data.schema.$ref;
            }
            result[Const.definitions] = buildDefinitions(data);
            return result;
        };
        export const buildDefinitions = (data: SchemaProcess<Types.TypeSchema["defines"]>):Jsonable.JsonableObject =>
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
        export const buildLiteral = (data: SchemaProcess<Types.LiteralElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                const: data.value.literal,
                //enum: [ value.literal, ],
            };
            return result;
        };
        export const buildValue = (data: SchemaProcess<Types.ValueDefinition>):Jsonable.JsonableObject =>
            Types.isLiteralElement(data.value.value) ?
                buildLiteral(nextProcess(data, null, data.value.value)):
                buildRefer(nextProcess(data, null, data.value.value));
        export const buildType = (data: SchemaProcess<Types.Type>):Jsonable.JsonableObject =>
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
                break;
            case "itemof":
                break;
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
        export const buildPrimitiveType = (data: SchemaProcess<Types.PrimitiveTypeElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: data.value.type,
            };
            return result;
        };
        export const buildInterface = (data: SchemaProcess<Types.InterfaceDefinition>):Jsonable.JsonableObject =>
        {
            const properties: Jsonable.JsonableObject = { };
            const result: Jsonable.JsonableObject =
            {
                type: "object",
                properties,
                additionalProperties: false,
                required: Object.keys(data.value.members).filter(i => ! i.endsWith("?")),
            };
            if (data.value.extends)
            {
                result["allOf"] = data.value.extends.map(i => buildRefer(nextProcess(data, null, i)));
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
            return result;
        };
        export const buildDictionary = (data: SchemaProcess<Types.DictionaryDefinition>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: "object",
                additionalProperties: buildTypeOrRefer(nextProcess(data, null, data.value.valueType)),
            };
            return result;
        };
        export const buildEnumType = (data: SchemaProcess<Types.EnumTypeElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                enum: data.value.members,
            };
            return result;
        };
        export const buildRefer = (data: SchemaProcess<Types.ReferElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                $ref: `#/${Const.definitions}/${data.value.$ref}`,
            };
            return result;
        };
        export const buildArray = (data: SchemaProcess<Types.ArrayElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                type: "array",
                items: buildTypeOrRefer(nextProcess(data, null, data.value.items)),
            };
            return result;
        };
        export const buildOr = (data: SchemaProcess<Types.OrElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                oneOf: data.value.types.map(i => buildTypeOrRefer(nextProcess(data, null, i))),
            };
            return result;
        };
        export const buildAnd = (data: SchemaProcess<Types.AndElement>):Jsonable.JsonableObject =>
        {
            const result: Jsonable.JsonableObject =
            {
                allOf: data.value.types.map(i => buildTypeOrRefer(nextProcess(data, null, i))),
            };
            return result;
        };
        export const buildTypeOrRefer = (data: SchemaProcess<Types.TypeOrRefer>):Jsonable.JsonableObject =>
            Types.isReferElement(data.value) ?
                buildRefer(nextProcess(data, null, data.value)):
                buildType(nextProcess(data, null, data.value));
    }
}
export namespace Format
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
            return [ ...code.expressions.map(i => getTokens(i)).reduce((a, b) => [ ...a, ...b, ], []), "," ];
        case "expression":
            return [ code.expression, ];
        }
    };
    export interface LineProcess
    {
        options: Readonly<Types.OutputOptions>;
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
    export const line = (options: Readonly<Types.OutputOptions>, indentDepth: number, code: CodeLine): string =>
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
    export const inlineBlock = (options: Readonly<Types.OutputOptions>, indentDepth: number, code: CodeInlineBlock): string =>
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
            ...$comment(typeSource),
            ...Build.Define.buildImports(typeSource.imports),
            ...Build.Define.buildDefineNamespaceCore(typeSource.options, typeSource.defines),
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
        if (typeSource.options.schema)
        {
            const schema = Build.Schema.build(Build.Schema.makeProcess(typeSource, typeSource.options.schema));
            fs.writeFileSync(typeSource.options.schema.outputFile, Jsonable.stringify(schema, null, 4), { encoding: "utf-8" });
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
