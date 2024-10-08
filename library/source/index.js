'use strict';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = exports.Build = exports.$block = exports.$iblock = exports.$comment = exports.$line = exports.$expression = exports.convertToExpression = void 0;
var startAt = new Date();
var fs_1 = __importDefault(require("fs"));
var types_prime_1 = require("./types-prime");
var types_error_1 = require("./types-error");
var text_1 = require("./text");
var jsonable_1 = require("../generated/jsonable");
var types_1 = require("../generated/types");
var config_json_1 = __importDefault(require("../resource/config.json"));
var getBuildTime = function () { return new Date().getTime() - startAt.getTime(); };
var jsonPath = process.argv[2];
console.log("\uD83D\uDE80 ".concat(jsonPath, " build start: ").concat(startAt));
var isEmptyArray = function (list) { return Array.isArray(list) && list.length <= 0; };
var kindofJoinExpression = function (list, separator) {
    return list.reduce(function (a, b) { return isEmptyArray(a) || isEmptyArray(b) ?
        (Array.isArray(a) ? a : [a]).concat(Array.isArray(b) ? __spreadArray([], b, true) : [b]) :
        (Array.isArray(a) ? a : [a]).concat(Array.isArray(b) ? __spreadArray([separator], b, true) : [separator, b]); }, []);
};
;
var isCodeExpression = function (value) {
    return null !== value &&
        "object" === typeof value &&
        "$code" in value && "expression" === value.$code &&
        "expression" in value && "string" === typeof value.expression;
};
var convertToExpression = function (code) {
    var result = [];
    code.forEach(function (i) {
        switch (i.$code) {
            case "inline-block":
                result.concat.apply(result, __spreadArray(__spreadArray([(0, exports.$expression)("{")], (0, exports.convertToExpression)(i.lines), false), [(0, exports.$expression)("}")], false));
                break;
            case "line":
                result.concat.apply(result, __spreadArray(__spreadArray([], (0, exports.convertToExpression)(i.expressions), false), [(0, exports.$expression)(";")], false));
                break;
            case "expression":
                result.push(i);
                break;
        }
    });
    return result;
};
exports.convertToExpression = convertToExpression;
;
;
;
var $expression = function (expression) { return ({ $code: "expression", expression: expression, }); };
exports.$expression = $expression;
var $line = function (expressions) { return ({ $code: "line", expressions: expressions, }); };
exports.$line = $line;
var $comment = function (define) { return define.comment ? define.comment.map(function (i) { return (0, exports.$line)([(0, exports.$expression)("//"), (0, exports.$expression)(i)]); }) : []; };
exports.$comment = $comment;
var $iblock = function (lines) { return ({ $code: "inline-block", lines: lines, }); };
exports.$iblock = $iblock;
var $block = function (header, lines) { return ({ $code: "block", header: header, lines: lines, }); };
exports.$block = $block;
var Build;
(function (Build) {
    // data:input(json) to data:code(object)
    Build.buildExport = function (define) { var _a; return ("export" in define && ((_a = define.export) !== null && _a !== void 0 ? _a : true)) ? [(0, exports.$expression)("export")] : []; };
    Build.buildExtends = function (define) {
        return undefined !== define.extends ? __spreadArray([(0, exports.$expression)("extends")], define.extends.map(function (i, ix, list) { return (0, exports.$expression)(ix < (list.length - 1) ? "".concat(i.$ref, ",") : "".concat(i.$ref)); }), true) : [];
    };
    var Define;
    (function (Define) {
        Define.buildDefineLine = function (declarator, name, define, postEpressions) {
            if (postEpressions === void 0) { postEpressions = []; }
            return (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [(0, exports.$expression)(declarator), (0, exports.$expression)(name), (0, exports.$expression)("=")], false), (0, exports.convertToExpression)(Define.buildInlineDefine(define)), true), postEpressions, true));
        };
        Define.buildInlineDefineLiteral = function (define) { return [(0, exports.$expression)(jsonable_1.Jsonable.stringify(define.literal))]; };
        Define.buildInlineDefinePrimitiveType = function (value) {
            return (0, exports.$expression)(value.type);
        };
        Define.buildDefinePrimitiveType = function (name, value) {
            return Define.buildDefineLine("type", name, value);
        };
        Define.enParenthesis = function (expressions) {
            return __spreadArray(__spreadArray([(0, exports.$expression)("(")], expressions, true), [(0, exports.$expression)(")"),], false);
        };
        Define.isNeedParenthesis = function (expressions) {
            if (expressions.length <= 1) {
                return false;
            }
            var lastIx = expressions.length - 1;
            var first = expressions[0];
            var last = expressions[lastIx];
            if (isCodeExpression(first) && "(" === first.expression && isCodeExpression(last) && ")" === last.expression) {
                var result_1 = false;
                var count_1 = 0;
                expressions.forEach(function (i, ix) {
                    if (isCodeExpression(i)) {
                        if ("(" === i.expression) {
                            ++count_1;
                        }
                        else if (")" === i.expression) {
                            --count_1;
                            if (count_1 <= 0 && ix !== lastIx) {
                                // splitted
                                result_1 = true;
                            }
                        }
                    }
                });
                if (0 !== count_1) {
                    // unmatch parenthesis error...
                    result_1 = true;
                }
                return result_1;
            }
            return true;
        };
        Define.enParenthesisIfNeed = function (expressions) {
            return Define.isNeedParenthesis(expressions) ? Define.enParenthesis(expressions) : expressions;
        };
        Define.buildInlineDefineEnum = function (value) {
            return kindofJoinExpression(value.members.map(function (i) { return (0, exports.$expression)(jsonable_1.Jsonable.stringify(i)); }), (0, exports.$expression)("|"));
        };
        Define.buildInlineDefineArray = function (value) {
            return __spreadArray(__spreadArray([], Define.enParenthesisIfNeed(Define.buildInlineDefine(value.items)), true), [(0, exports.$expression)("[]"),], false);
        };
        Define.buildInlineDefineDictionary = function (value) {
            return (0, exports.$iblock)([(0, exports.$line)(__spreadArray([(0, exports.$expression)("[key: string]:")], Define.buildInlineDefine(value.valueType), true))]);
        };
        Define.buildInlineDefineAnd = function (value) {
            return kindofJoinExpression(value.types.map(function (i) { return Define.enParenthesisIfNeed(Define.buildInlineDefine(i)); }), (0, exports.$expression)("&"));
        };
        Define.buildInlineDefineOr = function (value) {
            return kindofJoinExpression(value.types.map(function (i) { return Define.enParenthesisIfNeed(Define.buildInlineDefine(i)); }), (0, exports.$expression)("|"));
        };
        Define.buildDefineInlineInterface = function (value) { return (0, exports.$iblock)(Object.keys(value.members)
            .map(function (name) { return (0, exports.$line)(__spreadArray([(0, exports.$expression)(name + ":")], Define.buildInlineDefine(value.members[name]), true)); })); };
        Define.buildDefineInterface = function (name, value) {
            var header = __spreadArray(__spreadArray(__spreadArray([], Build.buildExport(value), true), ["interface", name].map(function (i) { return (0, exports.$expression)(i); }), true), Build.buildExtends(value), true);
            var lines = Object.keys(value.members)
                .map(function (name) { return (0, exports.$line)(__spreadArray([(0, exports.$expression)(name + ":")], Define.buildInlineDefine(value.members[name]), true)); });
            return (0, exports.$block)(header, lines);
        };
        Define.buildDefineDictionary = function (name, value) {
            var header = __spreadArray(__spreadArray(__spreadArray([], Build.buildExport(value), true), ["type", name].map(function (i) { return (0, exports.$expression)(i); }), true), [(0, exports.$expression)("=")], false);
            return (0, exports.$block)(header, [(0, exports.$line)(__spreadArray([(0, exports.$expression)("[key: string]:")], Define.buildInlineDefine(value.valueType), true))]);
        };
        Define.buildDefineNamespaceCore = function (options, members) {
            return __spreadArray(__spreadArray([], Object.entries(members)
                .map(function (i) { return Build.Define.buildDefine(options, i[0], i[1]); }), true), Object.entries(members)
                .map(function (i) { return types_1.Types.isNamespaceDefinition(i[1]) || types_1.Types.isCodeDefinition(i[1]) || !Build.Validator.isValidatorTarget(i[1]) ? [] : Build.Validator.buildValidator(options, i[0], i[1]); }), true).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
        };
        Define.buildDefineNamespace = function (options, name, value) {
            var header = __spreadArray(__spreadArray([], Build.buildExport(value), true), [(0, exports.$expression)("namespace"), (0, exports.$expression)(name),], false);
            var lines = Define.buildDefineNamespaceCore(options, value.members);
            return (0, exports.$block)(header, lines);
        };
        Define.buildImports = function (imports) {
            return undefined === imports ? [] : imports.map(function (i) { return (0, exports.$line)([(0, exports.$expression)("import"), (0, exports.$expression)(i.target), (0, exports.$expression)("from"), (0, exports.$expression)(jsonable_1.Jsonable.stringify(i.from))]); });
        };
        Define.buildDefine = function (options, name, define) {
            switch (define.$type) {
                case "code":
                    return [(0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], (0, exports.$comment)(define), true), Build.buildExport(define), true), define.tokens.map(function (i) { return (0, exports.$expression)(i); }), true)),];
                case "interface":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(define), true), [Define.buildDefineInterface(name, define),], false);
                case "dictionary":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(define), true), [Define.buildDefineDictionary(name, define),], false);
                case "namespace":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(define), true), [Define.buildDefineNamespace(options, name, define),], false);
                case "type":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(define), true), [Define.buildDefineLine("type", name, define),], false);
                case "value":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(define), true), [Define.buildDefineLine("const", name, define, [(0, exports.$expression)("as"), (0, exports.$expression)("const"),]),], false);
            }
        };
        Define.buildInlineDefine = function (define) {
            if (types_1.Types.isReferElement(define)) {
                return [(0, exports.$expression)(define.$ref),];
            }
            else {
                switch (define.$type) {
                    case "literal":
                        return Define.buildInlineDefineLiteral(define);
                    case "typeof":
                        return __spreadArray([(0, exports.$expression)("typeof")], Define.buildInlineDefine(define.value), true);
                    case "itemof":
                        return [(0, exports.$expression)("typeof"), (0, exports.$expression)("".concat(define.value.$ref, "[number]")),];
                    case "value":
                        return Define.buildInlineDefine(define.value);
                    case "primitive-type":
                        return [Define.buildInlineDefinePrimitiveType(define),];
                    case "type":
                        return Define.buildInlineDefine(define.define);
                    case "enum-type":
                        return Define.buildInlineDefineEnum(define);
                    case "array":
                        return Define.buildInlineDefineArray(define);
                    case "and":
                        return Define.buildInlineDefineAnd(define);
                    case "or":
                        return Define.buildInlineDefineOr(define);
                    case "interface":
                        return [Define.buildDefineInlineInterface(define),];
                    case "dictionary":
                        return [Define.buildInlineDefineDictionary(define),];
                }
            }
        };
    })(Define = Build.Define || (Build.Define = {}));
    var Validator;
    (function (Validator) {
        Validator.buildCall = function (method, args) {
            return __spreadArray(__spreadArray([], method, true), Define.enParenthesis(kindofJoinExpression(args, (0, exports.$expression)(","))), true);
        };
        Validator.buildLiterarlValidatorExpression = function (name, value) {
            if (null !== value && "object" === typeof value) {
                if (Array.isArray(value)) {
                    var list_1 = [];
                    list_1.push((0, exports.$expression)("Array.isArray(".concat(name, ")")));
                    list_1.push((0, exports.$expression)("&&"));
                    list_1.push((0, exports.$expression)("".concat(value.length, " <= ").concat(name, ".length")));
                    value.forEach(function (i, ix) {
                        list_1.push((0, exports.$expression)("&&"));
                        list_1.push.apply(list_1, Validator.buildLiterarlValidatorExpression("".concat(name, "[").concat(ix, "]"), i));
                    });
                    return list_1;
                }
                else {
                    var list_2 = [];
                    list_2.push((0, exports.$expression)("null !== ".concat(name)));
                    list_2.push((0, exports.$expression)("&&"));
                    list_2.push((0, exports.$expression)("\"object\" === typeof ".concat(name)));
                    Object.keys(value).forEach(function (key) {
                        list_2.push((0, exports.$expression)("&&"));
                        list_2.push((0, exports.$expression)("\"".concat(key, "\" in ").concat(name)));
                        list_2.push((0, exports.$expression)("&&"));
                        list_2.push.apply(list_2, Validator.buildLiterarlValidatorExpression("".concat(name, ".").concat(key), value[key]));
                    });
                    return list_2;
                }
            }
            if (undefined === value) {
                return [(0, exports.$expression)("undefined"), (0, exports.$expression)("==="), (0, exports.$expression)(name),];
            }
            else {
                return [(0, exports.$expression)(jsonable_1.Jsonable.stringify(value)), (0, exports.$expression)("==="), (0, exports.$expression)(name),];
            }
        };
        Validator.buildInlineLiteralValidator = function (define) {
            return (0, exports.$expression)("(value: unknown): value is ".concat(Define.buildInlineDefineLiteral(define), " => ").concat(Validator.buildLiterarlValidatorExpression("value", define.literal), ";"));
        };
        Validator.buildValidatorLine = function (declarator, name, define) {
            return __spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [(0, exports.$expression)(declarator), (0, exports.$expression)(name), (0, exports.$expression)("=")], false), (0, exports.convertToExpression)(Validator.buildInlineValidator(name, define)), true);
        };
        Validator.buildObjectValidatorGetterName = function (name) {
            return __spreadArray(__spreadArray([], text_1.Text.getNameSpace(name).split("."), true), ["get".concat(text_1.Text.toUpperCamelCase(text_1.Text.getNameBody(name)), "Validator"),], false).filter(function (i) { return "" !== i; }).join(".");
        };
        Validator.buildValidatorName = function (name) {
            return __spreadArray(__spreadArray([], text_1.Text.getNameSpace(name).split("."), true), ["is".concat(text_1.Text.toUpperCamelCase(text_1.Text.getNameBody(name))),], false).filter(function (i) { return "" !== i; }).join(".");
        };
        Validator.buildValidatorExpression = function (name, define) {
            if (types_1.Types.isReferElement(define)) {
                return [(0, exports.$expression)("".concat(Validator.buildValidatorName(define.$ref), "(").concat(name, ")")),];
            }
            else {
                switch (define.$type) {
                    case "literal":
                        return Validator.buildLiterarlValidatorExpression(name, define.literal);
                    case "typeof":
                        return Validator.buildValidatorExpression(name, define.value);
                    case "itemof":
                        return [(0, exports.$expression)("".concat(define.value.$ref, ".includes(").concat(name, " as any)")),];
                    case "value":
                        return Validator.buildValidatorExpression(name, define.value);
                    case "primitive-type":
                        return [
                            (0, exports.$expression)("null" === define.type ?
                                "\"".concat(define.type, "\" === ").concat(name) :
                                "\"".concat(define.type, "\" === typeof ").concat(name)),
                        ];
                    case "type":
                        return Validator.buildValidatorExpression(name, define.define);
                    case "enum-type":
                        return [(0, exports.$expression)("".concat(jsonable_1.Jsonable.stringify(define.members), ".includes(").concat(name, " as any)")),];
                    case "array":
                        return __spreadArray(__spreadArray([
                            (0, exports.$expression)("Array.isArray(".concat(name, ")")),
                            (0, exports.$expression)("&&"),
                            (0, exports.$expression)("".concat(name, ".every(")),
                            (0, exports.$expression)("i"),
                            (0, exports.$expression)("=>")
                        ], Validator.buildValidatorExpression("i", define.items), true), [
                            (0, exports.$expression)(")")
                        ], false);
                    case "and":
                        return kindofJoinExpression(define.types.map(function (i) { return types_prime_1.TypesPrime.isObject(i) ?
                            Define.enParenthesis(Validator.buildValidatorExpression(name, i)) :
                            Validator.buildValidatorExpression(name, i); }), (0, exports.$expression)("&&"));
                    case "or":
                        return kindofJoinExpression(define.types.map(function (i) { return Validator.buildValidatorExpression(name, i); }), (0, exports.$expression)("||"));
                    case "interface":
                        return Validator.buildInterfaceValidator(name, define);
                    case "dictionary":
                        return __spreadArray(__spreadArray([
                            (0, exports.$expression)("null !== ".concat(name)),
                            (0, exports.$expression)("&&"),
                            (0, exports.$expression)("\"object\" === typeof ".concat(name)),
                            (0, exports.$expression)("&&"),
                            (0, exports.$expression)("Object.values(".concat(name, ").every(")),
                            (0, exports.$expression)("i"),
                            (0, exports.$expression)("=>")
                        ], Validator.buildValidatorExpression("i", define.valueType), true), [
                            (0, exports.$expression)(")")
                        ], false);
                }
            }
        };
        Validator.buildInterfaceValidator = function (name, define) {
            var list = [];
            var members = define.members;
            if (undefined !== define.extends) {
                define.extends.forEach(function (i, ix, _l) {
                    if (0 < ix) {
                        list.push((0, exports.$expression)("&&"));
                    }
                    list.push.apply(list, (0, exports.convertToExpression)(Validator.buildValidatorExpression(name, i)));
                });
            }
            if (types_1.Types.isDictionaryDefinition(members)) {
                if (undefined !== define.extends) {
                    list.push((0, exports.$expression)("&&"));
                }
                else {
                }
                list.push.apply(list, Validator.buildValidatorExpression(name, members));
            }
            else {
                if (undefined !== define.extends) {
                }
                else {
                    list.push((0, exports.$expression)("null !== ".concat(name)));
                    list.push((0, exports.$expression)("&&"));
                    list.push((0, exports.$expression)("\"object\" === typeof ".concat(name)));
                }
                Object.keys(members).forEach(function (k) {
                    var key = text_1.Text.getPrimaryKeyName(k);
                    var value = members[k];
                    var base = (0, exports.convertToExpression)(Validator.buildValidatorExpression("".concat(name, ".").concat(key), value));
                    var current = types_1.Types.isOrElement(value) ?
                        Define.enParenthesis(base) :
                        base;
                    if (k === key) {
                        list.push((0, exports.$expression)("&&"));
                        list.push((0, exports.$expression)("\"".concat(key, "\" in ").concat(name)));
                        list.push((0, exports.$expression)("&&"));
                        list.push.apply(list, current);
                    }
                    else {
                        list.push((0, exports.$expression)("&&"));
                        list.push((0, exports.$expression)("("));
                        list.push((0, exports.$expression)("! (\"".concat(key, "\" in ").concat(name, ")")));
                        list.push((0, exports.$expression)("||"));
                        list.push.apply(list, current);
                        list.push((0, exports.$expression)(")"));
                    }
                });
            }
            return list;
        };
        Validator.buildInlineValidator = function (name, define) {
            return __spreadArray([
                (0, exports.$expression)("(value: unknown): value is ".concat(types_1.Types.isValueDefinition(define) ? "typeof " + name : name, " =>"))
            ], Validator.buildValidatorExpression("value", define), true);
        };
        Validator.buildObjectValidatorGetterCoreEntry = function (define) {
            if (types_1.Types.isReferElement(define)) {
                return [(0, exports.$expression)(Validator.buildValidatorName(define.$ref)),];
            }
            else {
                switch (define.$type) {
                    case "literal":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isJust"),], [(0, exports.$expression)(jsonable_1.Jsonable.stringify(define.literal)),]);
                    case "typeof":
                        return [(0, exports.$expression)(Validator.buildValidatorName(define.value.$ref)),];
                    case "itemof":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isEnum"),], [(0, exports.$expression)(define.value.$ref),]);
                    case "primitive-type":
                        switch (define.type) {
                            case "null":
                                return [(0, exports.$expression)("TypesPrime.isNull"),];
                            case "boolean":
                                return [(0, exports.$expression)("TypesPrime.isBoolean"),];
                            case "number":
                                return [(0, exports.$expression)("TypesPrime.isNumber"),];
                            case "string":
                                return [(0, exports.$expression)("TypesPrime.isString"),];
                        }
                        return [(0, exports.$expression)("TypesPrime.is".concat(text_1.Text.toUpperCamelCase(define.type))),];
                    case "type":
                        return Validator.buildObjectValidatorGetterCoreEntry(define.define);
                    case "enum-type":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isEnum"),], [(0, exports.$expression)(jsonable_1.Jsonable.stringify(define.members)),]);
                    case "array":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isArray"),], [Validator.buildObjectValidatorGetterCoreEntry(define.items),]);
                    case "and":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isAnd"),], define.types.map(function (i) { return Validator.buildObjectValidatorGetterCoreEntry(i); }));
                    case "or":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isOr"),], define.types.map(function (i) { return Validator.buildObjectValidatorGetterCoreEntry(i); }));
                    case "interface":
                        return Validator.buildObjectValidatorGetter(define);
                    case "dictionary":
                        return Validator.buildCall([(0, exports.$expression)("TypesPrime.isDictionaryObject"),], [Validator.buildObjectValidatorGetterCoreEntry(define.valueType),]);
                }
            }
        };
        Validator.buildObjectValidatorGetterCore = function (define) { return (0, exports.$iblock)(Object.entries(define.members).map(function (i) {
            var key = text_1.Text.getPrimaryKeyName(i[0]);
            var value = Validator.buildObjectValidatorGetterCoreEntry(i[1]);
            return (0, exports.$line)(__spreadArray([(0, exports.$expression)("".concat(key)), (0, exports.$expression)(":")], (key === i[0] ? value : Validator.buildCall([(0, exports.$expression)("TypesPrime.isOptional"),], [value,])), true));
        })); };
        Validator.buildObjectValidatorGetter = function (define) {
            var _a, _b;
            return ((_a = define.extends) !== null && _a !== void 0 ? _a : []).some(function (_) { return true; }) ? __spreadArray([
                (0, exports.$expression)("TypesPrime.mergeObjectValidator")
            ], Define.enParenthesis(__spreadArray(__spreadArray([], ((_b = define.extends) !== null && _b !== void 0 ? _b : []).map(function (i) { return (0, exports.$expression)("".concat(Validator.buildObjectValidatorGetterName(i.$ref), "(),")); }), true), [
                Validator.buildObjectValidatorGetterCore(define),
            ], false)), true) :
                Define.enParenthesis([Validator.buildObjectValidatorGetterCore(define),]);
        };
        Validator.buildFullValidator = function (name, define) {
            return __spreadArray([
                (0, exports.$expression)("(value: unknown, listner?: TypesError.Listener): value is ".concat(types_1.Types.isValueDefinition(define) ? "typeof " + name : name, " =>"))
            ], Validator.buildCall(Validator.buildObjectValidatorGetterCoreEntry(define), [(0, exports.$expression)("value"), (0, exports.$expression)("listner"),]), true);
        };
        Validator.isValidatorTarget = function (define) {
            return !(types_1.Types.isValueDefinition(define) && false === define.validator);
        };
        Validator.buildValidator = function (options, name, define) {
            if ("simple" === options.validatorOption) {
                var result = [
                    (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                        (0, exports.$expression)("const"),
                        (0, exports.$expression)(Validator.buildValidatorName(name)),
                        (0, exports.$expression)("=")
                    ], false), Validator.buildInlineValidator(name, define), true))
                ];
                return result;
            }
            if ("full" === options.validatorOption) {
                if ("interface" === define.$type) {
                    var result = __spreadArray(__spreadArray([], ("interface" === define.$type ?
                        [
                            (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                                (0, exports.$expression)("const"),
                                (0, exports.$expression)(Validator.buildObjectValidatorGetterName(name)),
                                (0, exports.$expression)("="),
                                (0, exports.$expression)("()"),
                                (0, exports.$expression)("=>"),
                                (0, exports.$expression)("<TypesPrime.ObjectValidator<".concat(name, ">>"))
                            ], false), Validator.buildObjectValidatorGetter(define), true))
                        ] :
                        []), true), [
                        (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                            (0, exports.$expression)("const"),
                            (0, exports.$expression)(Validator.buildValidatorName(name)),
                            (0, exports.$expression)("="),
                            (0, exports.$expression)("(value: unknown, listner?: TypesError.Listener): value is ".concat(name, " =>"))
                        ], false), Validator.buildCall(Validator.buildCall([(0, exports.$expression)("TypesPrime.isSpecificObject<".concat(name, ">")),], [Validator.buildCall([(0, exports.$expression)(Validator.buildObjectValidatorGetterName(name)),], [])]), [(0, exports.$expression)("value"), (0, exports.$expression)("listner"),]), true))
                    ], false);
                    return result;
                }
                else if ("value" === define.$type) {
                    if (types_1.Types.isReferElement(define.value)) {
                        var result = [
                            (0, exports.$line)(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                                (0, exports.$expression)("const"),
                                (0, exports.$expression)(Validator.buildValidatorName(name)),
                                (0, exports.$expression)("="),
                                (0, exports.$expression)(Validator.buildValidatorName(define.value.$ref)),
                            ], false))
                        ];
                        return result;
                    }
                    else {
                        var result = [
                            (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                                (0, exports.$expression)("const"),
                                (0, exports.$expression)(Validator.buildValidatorName(name)),
                                (0, exports.$expression)("=")
                            ], false), Validator.buildCall([(0, exports.$expression)("TypesPrime.isJust"),], [(0, exports.$expression)(name),]), true))
                        ];
                        return result;
                    }
                }
                else {
                    var result = [
                        (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                            (0, exports.$expression)("const"),
                            (0, exports.$expression)(Validator.buildValidatorName(name)),
                            (0, exports.$expression)("=")
                        ], false), Validator.buildFullValidator(name, define), true))
                    ];
                    return result;
                }
            }
            return [];
        };
    })(Validator = Build.Validator || (Build.Validator = {}));
})(Build || (exports.Build = Build = {}));
var Format;
(function (Format) {
    // data:code(object) to data:output(text)
    Format.getMaxLineLength = function (options) {
        return types_prime_1.TypesPrime.isUndefined(options.maxLineLength) ? config_json_1.default.maxLineLength : options.maxLineLength;
    };
    Format.buildIndent = function (options, indentDepth) {
        return Array.from({ length: indentDepth, })
            .map(function (_) { return "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(function (_) { return " "; }).join("") : options.indentUnit; })
            .join("");
    };
    Format.getReturnCode = function (_options) { return "\n"; };
    Format.expressions = function (code) {
        return code.map(function (i) { return i.expression; }).join(" ");
    };
    Format.getTokens = function (code) {
        switch (code.$code) {
            case "inline-block":
                return __spreadArray(__spreadArray(["{"], code.lines.map(function (i) { return Format.getTokens(i); }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []), true), ["}",], false);
            case "line":
                return __spreadArray(__spreadArray([], code.expressions.map(function (i) { return Format.getTokens(i); }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []), true), [","], false);
            case "expression":
                return [code.expression,];
        }
    };
    Format.separator = function (data) {
        var token = data.tokens[data.i];
        if ("" === data.buffer) {
            if ("" === data.result) {
                return Format.buildIndent(data.options, data.indentDepth);
            }
            else {
                return Format.buildIndent(data.options, data.indentDepth + 1);
            }
        }
        else {
            if ([")", "[]", ":", ".", ",", ";",].includes(token) ||
                (!data.buffer.endsWith("=") && !data.buffer.endsWith("=>") && "(" === token) ||
                data.buffer.endsWith("(") ||
                data.buffer.endsWith(".")
            // data.buffer.endsWith("...")
            ) {
                return "";
            }
        }
        return " ";
    };
    Format.temporaryAssembleLine = function (data, length) {
        var options = data.options, indentDepth = data.indentDepth, result = data.result, buffer = data.buffer, tokens = data.tokens, i = data.i;
        var iEnd = Math.min(data.tokens.length, data.i + length);
        while (i < iEnd) {
            buffer += Format.separator({ options: options, indentDepth: indentDepth, result: result, buffer: buffer, tokens: tokens, i: i, });
            buffer += data.tokens[i];
            ++i;
        }
        return buffer;
    };
    Format.isInLineComment = function (data) {
        var ix = data.tokens.indexOf("//");
        return 0 <= ix && ix <= data.i;
    };
    Format.isLineBreak = function (data) {
        var maxLineLength = Format.getMaxLineLength(data.options);
        if (null !== maxLineLength && !Format.isInLineComment(data)) {
            var options = data.options, indentDepth = data.indentDepth, result = data.result, buffer = data.buffer, tokens = data.tokens, i = data.i;
            ++i;
            if (data.i + 1 < tokens.length && maxLineLength <= Format.temporaryAssembleLine({ options: options, indentDepth: indentDepth, result: result, buffer: buffer, tokens: tokens, i: i, }, 1).length) {
                return !config_json_1.default.lineUnbreakableTokens.heads.includes(tokens[data.i]) && !config_json_1.default.lineUnbreakableTokens.tails.includes(tokens[data.i + 1]);
            }
            if (data.i + 2 < tokens.length && maxLineLength <= Format.temporaryAssembleLine({ options: options, indentDepth: indentDepth, result: result, buffer: buffer, tokens: tokens, i: i, }, 2).length) {
                return config_json_1.default.lineUnbreakableTokens.heads.includes(tokens[data.i + 1]) || config_json_1.default.lineUnbreakableTokens.tails.includes(tokens[data.i + 2]);
            }
        }
        return false;
    };
    Format.line = function (options, indentDepth, code) {
        var returnCode = Format.getReturnCode(options);
        var data = {
            options: options,
            indentDepth: indentDepth,
            result: "",
            buffer: "",
            tokens: code.expressions.map(function (i) { return Format.getTokens(i); }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []),
            i: 0,
        };
        while (data.i < data.tokens.length) {
            data.buffer = Format.temporaryAssembleLine(data, 1);
            if (Format.isLineBreak(data)) {
                data.result += data.buffer + returnCode;
                data.buffer = "";
            }
            ++data.i;
        }
        data.result += data.buffer;
        if (!Format.isInLineComment(data)) {
            data.result += ";";
        }
        data.result += returnCode;
        return data.result;
    };
    Format.inlineBlock = function (options, indentDepth, code) {
        return __spreadArray(__spreadArray(["{"], code.lines.map(function (i) { return Format.text(options, indentDepth + 1, i); }), true), ["}",], false).join(" ");
    };
    Format.block = function (options, indentDepth, code) {
        var _a;
        var currentIndent = Format.buildIndent(options, indentDepth);
        var returnCode = Format.getReturnCode(options);
        var result = "";
        if (0 < ((_a = code.header) !== null && _a !== void 0 ? _a : []).length) {
            result += currentIndent + Format.expressions(code.header) + returnCode;
        }
        result += currentIndent + "{" + returnCode;
        result += Format.text(options, indentDepth + 1, code.lines);
        result += currentIndent + "}" + returnCode;
        return result;
    };
    Format.text = function (options, indentDepth, code) {
        if (Array.isArray(code)) {
            return code.map(function (i) { return Format.text(options, indentDepth, i); }).join("");
        }
        else {
            switch (code.$code) {
                case "expression":
                    return Format.line(options, indentDepth, (0, exports.$line)([code]));
                case "line":
                    return Format.line(options, indentDepth, code);
                case "inline-block":
                    return Format.inlineBlock(options, indentDepth, code);
                case "block":
                    return Format.block(options, indentDepth, code);
            }
        }
    };
})(Format || (exports.Format = Format = {}));
try {
    var fget = function (path) { return fs_1.default.readFileSync(path, { encoding: "utf-8" }); };
    var rawSource = fget(jsonPath);
    var typeSource = jsonable_1.Jsonable.parse(rawSource);
    var errorListner = types_error_1.TypesError.makeListener(jsonPath);
    if (types_1.Types.isTypeSchema(typeSource, errorListner)) {
        var code = __spreadArray(__spreadArray(__spreadArray([], (0, exports.$comment)(typeSource), true), Build.Define.buildImports(typeSource.imports), true), Build.Define.buildDefineNamespaceCore(typeSource.options, typeSource.defines), true);
        var result = Format.text(typeSource.options, 0, code);
        if (typeSource.options.outputFile) {
            fs_1.default.writeFileSync(typeSource.options.outputFile, result, { encoding: "utf-8" });
            console.log(errorListner);
        }
        else {
            console.log(result);
        }
        console.log("\u2705 ".concat(jsonPath, " build end: ").concat(new Date(), " ( ").concat((getBuildTime() / 1000).toLocaleString(), "s )"));
    }
    else {
        console.error("🚫 Invalid TypeSchema");
        console.error(errorListner);
        console.log("\uD83D\uDEAB ".concat(jsonPath, " build failed: ").concat(new Date(), " ( ").concat((getBuildTime() / 1000).toLocaleString(), "s )"));
    }
}
catch (error) {
    console.error(error);
    console.log("\uD83D\uDEAB ".concat(jsonPath, " build failed: ").concat(new Date(), " ( ").concat((getBuildTime() / 1000).toLocaleString(), "s )"));
}
//# sourceMappingURL=index.js.map