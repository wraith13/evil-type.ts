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
var evil_type_1 = require("../common/evil-type");
var jsonable_1 = require("../generated/code/jsonable");
var type_1 = require("../generated/code/type");
var text_1 = require("./text");
var config_json_1 = __importDefault(require("../resource/config.json"));
if (3 !== process.argv.length) {
    console.error("🚫 Unmatch command parameter.");
    console.error("You can specify one type definition JSON file.");
    console.error("See ".concat(config_json_1.default.repository));
    process.exit(1);
}
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
    Build.buildExport = function (define) { var _a; return ("export" in define && ((_a = define.export) !== null && _a !== void 0 ? _a : true)) ? [(0, exports.$expression)("export")] : []; };
    Build.buildExtends = function (define) {
        return undefined !== define.extends ? __spreadArray([(0, exports.$expression)("extends")], define.extends.map(function (i, ix, list) { return (0, exports.$expression)(ix < (list.length - 1) ? "".concat(i.$ref, ",") : "".concat(i.$ref)); }), true) : [];
    };
    Build.asConst = [(0, exports.$expression)("as"), (0, exports.$expression)("const"),];
    Build.buildLiteralAsConst = function (literal) {
        return __spreadArray([(0, exports.$expression)(jsonable_1.Jsonable.stringify(literal))], Build.asConst, true);
    };
    var Define;
    (function (Define) {
        Define.buildDefineLine = function (declarator, name, define, postEpressions) {
            if (postEpressions === void 0) { postEpressions = []; }
            return (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [(0, exports.$expression)(declarator), (0, exports.$expression)(name), (0, exports.$expression)("=")], false), (0, exports.convertToExpression)(Define.buildInlineDefine(define)), true), postEpressions, true));
        };
        Define.buildInlineDefineLiteral = function (define) {
            return [(0, exports.$expression)(jsonable_1.Jsonable.stringify(define.literal))];
        };
        Define.buildInlineDefinePrimitiveType = function (value) {
            switch (value.type) {
                case "integer":
                    return (0, exports.$expression)("number");
                default:
                    return (0, exports.$expression)(value.type);
            }
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
            return __spreadArray(__spreadArray(__spreadArray([], Object.entries(members)
                .map(function (i) { return Build.Define.buildDefine(options, i[0], i[1]); }), true), Object.entries(members)
                .map(function (i) { return type_1.Type.isTypeOrValue(i[1]) && Build.Validator.isValidatorTarget(i[1]) ? Build.Validator.buildValidator(options, i[0], i[1]) : []; }), true), Object.entries(members)
                .map(function (i) { return type_1.Type.isInterfaceDefinition(i[1]) ? Build.Validator.buildValidatorObject(options, i[0], i[1]) : []; }), true).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
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
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(define), true), [Define.buildDefineLine("const", name, define, type_1.Type.isLiteralElement(define.value) ? Build.asConst : []),], false);
            }
        };
        Define.buildInlineDefine = function (define) {
            if (type_1.Type.isReferElement(define)) {
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
        Validator.buildObjectValidatorObjectName = function (name) {
            return __spreadArray(__spreadArray([], text_1.Text.getNameSpace(name).split("."), true), ["".concat(text_1.Text.toLowerCamelCase(text_1.Text.getNameBody(name)), "ValidatorObject"),], false).filter(function (i) { return "" !== i; }).join(".");
        };
        Validator.buildValidatorName = function (name) {
            return __spreadArray(__spreadArray([], text_1.Text.getNameSpace(name).split("."), true), ["is".concat(text_1.Text.toUpperCamelCase(text_1.Text.getNameBody(name))),], false).filter(function (i) { return "" !== i; }).join(".");
        };
        Validator.buildValidatorExpression = function (name, define) {
            if (type_1.Type.isReferElement(define)) {
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
                        switch (define.type) {
                            case "null":
                                return [(0, exports.$expression)("\"".concat(define.type, "\" === ").concat(name)),];
                            case "integer":
                                return [(0, exports.$expression)("Number.isInteger"), (0, exports.$expression)("("), (0, exports.$expression)(name), (0, exports.$expression)(")"),];
                            default:
                                return [(0, exports.$expression)("\"".concat(define.type, "\" === typeof ").concat(name)),];
                        }
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
                        return kindofJoinExpression(define.types.map(function (i) { return evil_type_1.EvilType.Validator.isObject(i) ?
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
            if (type_1.Type.isDictionaryDefinition(members)) {
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
                    var current = type_1.Type.isOrElement(value) ?
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
                (0, exports.$expression)("(value: unknown): value is ".concat(type_1.Type.isValueDefinition(define) ? "typeof " + name : name, " =>"))
            ], Validator.buildValidatorExpression("value", define), true);
        };
        Validator.buildObjectValidatorGetterCoreEntry = function (define) {
            if (type_1.Type.isReferElement(define)) {
                return [(0, exports.$expression)(Validator.buildValidatorName(define.$ref)),];
            }
            else {
                switch (define.$type) {
                    case "literal":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isJust"),], [Build.buildLiteralAsConst(define.literal),]);
                    case "typeof":
                        return [(0, exports.$expression)(Validator.buildValidatorName(define.value.$ref)),];
                    case "itemof":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [(0, exports.$expression)(define.value.$ref),]);
                    case "primitive-type":
                        switch (define.type) {
                            case "null":
                                return [(0, exports.$expression)("EvilType.Validator.isNull"),];
                            case "boolean":
                                return [(0, exports.$expression)("EvilType.Validator.isBoolean"),];
                            case "number":
                                return [(0, exports.$expression)("EvilType.Validator.isNumber"),];
                            case "integer":
                                return [(0, exports.$expression)("EvilType.Validator.isInteger"),];
                            case "string":
                                return [(0, exports.$expression)("EvilType.Validator.isString"),];
                        }
                    //return [ $expression(`EvilType.Validator.is${Text.toUpperCamelCase(define.type)}`), ];
                    case "type":
                        return Validator.buildObjectValidatorGetterCoreEntry(define.define);
                    case "enum-type":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [Build.buildLiteralAsConst(define.members),]);
                    case "array":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isArray"),], [Validator.buildObjectValidatorGetterCoreEntry(define.items),]);
                    case "and":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isAnd"),], define.types.map(function (i) { return Validator.buildObjectValidatorGetterCoreEntry(i); }));
                    case "or":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isOr"),], define.types.map(function (i) { return Validator.buildObjectValidatorGetterCoreEntry(i); }));
                    case "interface":
                        return Validator.buildObjectValidator(define);
                    case "dictionary":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isDictionaryObject"),], [Validator.buildObjectValidatorGetterCoreEntry(define.valueType),]);
                }
            }
        };
        Validator.buildObjectValidatorGetterCore = function (define) { return (0, exports.$iblock)(Object.entries(define.members).map(function (i) {
            var key = text_1.Text.getPrimaryKeyName(i[0]);
            var value = Validator.buildObjectValidatorGetterCoreEntry(i[1]);
            return (0, exports.$line)(__spreadArray([(0, exports.$expression)("".concat(key)), (0, exports.$expression)(":")], (key === i[0] ? value : Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isOptional"),], [value,])), true));
        })); };
        Validator.buildObjectValidator = function (define) {
            var _a, _b;
            return ((_a = define.extends) !== null && _a !== void 0 ? _a : []).some(function (_) { return true; }) ? __spreadArray([
                (0, exports.$expression)("EvilType.Validator.mergeObjectValidator")
            ], Define.enParenthesis(__spreadArray(__spreadArray([], ((_b = define.extends) !== null && _b !== void 0 ? _b : []).map(function (i) { return (0, exports.$expression)("".concat(Validator.buildObjectValidatorObjectName(i.$ref), ",")); }), true), [
                Validator.buildObjectValidatorGetterCore(define),
            ], false)), true) :
                Define.enParenthesis([Validator.buildObjectValidatorGetterCore(define),]);
        };
        Validator.isLazyValidator = function (define) {
            if (type_1.Type.isType(define)) {
                switch (define.$type) {
                    case "enum-type":
                    case "itemof":
                    case "literal":
                    case "primitive-type":
                    case "typeof":
                        return false;
                    case "type":
                        return Validator.isLazyValidator(define.define);
                    case "array":
                        return Validator.isLazyValidator(define.items);
                    case "dictionary":
                        return Validator.isLazyValidator(define.valueType);
                    case "and":
                    case "or":
                        return define.types.some(function (i) { return Validator.isLazyValidator(i); });
                    case "interface":
                        return true;
                }
            }
            return true;
        };
        Validator.buildFullValidator = function (_name, define) { return Validator.isLazyValidator(define) ? __spreadArray([], Validator.buildCall([(0, exports.$expression)("EvilType.lazy"),], [__spreadArray([(0, exports.$expression)("()"), (0, exports.$expression)("=>")], Validator.buildObjectValidatorGetterCoreEntry(define), true),]), true) :
            Validator.buildObjectValidatorGetterCoreEntry(define); };
        Validator.isValidatorTarget = function (define) {
            return !(type_1.Type.isValueDefinition(define) && false === define.validator);
        };
        Validator.buildValidator = function (options, name, define) {
            if ("simple" === options.validatorOption) {
                var result_2 = [
                    (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                        (0, exports.$expression)("const"),
                        (0, exports.$expression)(Validator.buildValidatorName(name)),
                        (0, exports.$expression)("=")
                    ], false), Validator.buildInlineValidator(name, define), true))
                ];
                return result_2;
            }
            if ("full" === options.validatorOption) {
                var result_3 = __spreadArray(__spreadArray([], Build.buildExport(define), true), [
                    (0, exports.$expression)("const"),
                    (0, exports.$expression)(Validator.buildValidatorName(name)),
                ], false);
                if ("interface" === define.$type) {
                    result_3.push.apply(result_3, __spreadArray([(0, exports.$expression)("=")], Validator.buildCall([(0, exports.$expression)("EvilType.lazy"),], [
                        __spreadArray([
                            (0, exports.$expression)("()"),
                            (0, exports.$expression)("=>")
                        ], Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isSpecificObject"),], __spreadArray([(0, exports.$expression)(Validator.buildObjectValidatorObjectName(name))], (undefined !== define.additionalProperties ? [(0, exports.$expression)(jsonable_1.Jsonable.stringify(define.additionalProperties)),] : []), true)), true)
                    ])
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
                    , false));
                }
                else if ("value" === define.$type) {
                    if (type_1.Type.isReferElement(define.value)) {
                        result_3.push((0, exports.$expression)("="), (0, exports.$expression)(Validator.buildValidatorName(define.value.$ref)));
                    }
                    else {
                        result_3.push.apply(result_3, __spreadArray([(0, exports.$expression)("=")], Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isJust"),], [(0, exports.$expression)(name),]), false));
                    }
                }
                else {
                    result_3.push.apply(result_3, __spreadArray(__spreadArray(__spreadArray([], [(0, exports.$expression)(":"), (0, exports.$expression)("EvilType.Validator.IsType<".concat(name, ">"))], false), [(0, exports.$expression)("=")], false), Validator.buildFullValidator(name, define), false));
                }
                return [(0, exports.$line)(result_3)];
            }
            return [];
        };
        Validator.buildValidatorObject = function (options, name, define) {
            if ("full" === options.validatorOption) {
                var result_4 = [
                    (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(define), true), [
                        (0, exports.$expression)("const"),
                        (0, exports.$expression)(Validator.buildObjectValidatorObjectName(name)),
                        (0, exports.$expression)(":"),
                        (0, exports.$expression)("EvilType.Validator.ObjectValidator<".concat(name, ">")),
                        (0, exports.$expression)("=")
                    ], false), Validator.buildObjectValidator(define), true))
                ];
                return result_4;
            }
            return [];
        };
    })(Validator = Build.Validator || (Build.Validator = {}));
    var Schema;
    (function (Schema) {
        var Const;
        (function (Const) {
            Const.definitions = "definitions";
        })(Const = Schema.Const || (Schema.Const = {}));
        Schema.makeProcess = function (source, schema) {
            return ({
                source: source,
                schema: schema,
                definitions: Schema.makeDefinitionFlatMap(source.defines),
                path: "",
                value: source.defines,
            });
        };
        Schema.nextProcess = function (current, key, value) {
            return ({
                source: current.source,
                schema: current.schema,
                definitions: current.definitions,
                path: Schema.nextPath(current.path, key),
                value: value,
            });
        };
        Schema.nextPath = function (path, key) {
            return null === key ?
                path :
                "" === path ?
                    key :
                    "".concat(path, ".").concat(key);
        };
        Schema.makeDefinitionFlatMap = function (defines) {
            var result = {};
            Object.entries(defines).forEach(function (i) {
                var key = i[0];
                var value = i[1];
                if (type_1.Type.isDefinition(value)) {
                    result[key] = value;
                    if (type_1.Type.isNamespaceDefinition(value)) {
                        Object.entries(Schema.makeDefinitionFlatMap(value.members))
                            .forEach(function (j) { return result["".concat(key, ".").concat(j[0])] = j[1]; });
                    }
                }
            });
            return result;
        };
        Schema.getAbsolutePath = function (data, value, context) {
            if (context === void 0) { context = data.path; }
            if ("" === context) {
                return value.$ref;
            }
            else {
                var path = "".concat(context, ".").concat(value.$ref);
                if (data.definitions[path]) {
                    return path;
                }
                return Schema.getAbsolutePath(data, value, text_1.Text.getNameSpace(context));
            }
        };
        Schema.resolveExternalRefer = function (data, absolutePath) {
            if (data.schema.externalReferMapping) {
                var key = Object.keys(data.schema.externalReferMapping)
                    .filter(function (i) { return i === absolutePath || absolutePath.startsWith("".concat(i, ".")); })
                    .sort(evil_type_1.EvilType.comparer(function (i) { return -i.length; }))[0];
                if (key) {
                    return data.schema.externalReferMapping[key] + absolutePath.slice(key.length);
                }
            }
            return null;
        };
        Schema.getDefinition = function (data, value) {
            var path = Schema.getAbsolutePath(data, value);
            var result = {
                source: data.source,
                schema: data.schema,
                definitions: data.definitions,
                path: path,
                value: data.definitions[path],
            };
            return result;
        };
        Schema.getLiteral = function (data, value) {
            var definition = Schema.getDefinition(data, value);
            if (type_1.Type.isValueDefinition(definition.value)) {
                if (type_1.Type.isLiteralElement(definition.value.value)) {
                    return definition.value.value;
                }
                else {
                    return Schema.getLiteral(definition, definition.value.value);
                }
            }
            return null;
        };
        Schema.build = function (data) {
            var result = {
                $id: data.schema.$id,
                $schema: "http://json-schema.org/draft-07/schema#",
            };
            if (data.schema.$ref) {
                result["$ref"] = "#/".concat(Const.definitions, "/").concat(data.schema.$ref);
            }
            result[Const.definitions] = Schema.buildDefinitions(data);
            return result;
        };
        Schema.buildDefinitions = function (data) {
            var result = {};
            Object.entries(data.value).forEach(function (i) {
                var key = i[0];
                var value = i[1];
                switch (value.$type) {
                    case "value":
                        result[key] = Schema.buildValue(Schema.nextProcess(data, null, value));
                        break;
                    case "code":
                        //  nothing
                        break;
                    case "namespace":
                        {
                            var members = Schema.buildDefinitions(Schema.nextProcess(data, key, value.members));
                            Object.entries(members).forEach(function (j) { return result["".concat(key, ".").concat(j[0])] = j[1]; });
                        }
                        break;
                    default:
                        result[key] = Schema.buildType(Schema.nextProcess(data, null, value));
                }
            });
            return result;
        };
        Schema.buildLiteral = function (data) {
            var result = {
                const: data.value.literal,
                //enum: [ value.literal, ],
            };
            return result;
        };
        Schema.buildValue = function (data) {
            return type_1.Type.isLiteralElement(data.value.value) ?
                Schema.buildLiteral(Schema.nextProcess(data, null, data.value.value)) :
                Schema.buildRefer(Schema.nextProcess(data, null, data.value.value));
        };
        Schema.buildType = function (data) {
            switch (data.value.$type) {
                case "primitive-type":
                    return Schema.buildPrimitiveType(Schema.nextProcess(data, null, data.value));
                case "type":
                    return Schema.buildTypeOrRefer(Schema.nextProcess(data, null, data.value.define));
                case "interface":
                    return Schema.buildInterface(Schema.nextProcess(data, null, data.value));
                case "dictionary":
                    return Schema.buildDictionary(Schema.nextProcess(data, null, data.value));
                case "enum-type":
                    return Schema.buildEnumType(Schema.nextProcess(data, null, data.value));
                case "typeof":
                    return Schema.buildTypeOf(Schema.nextProcess(data, null, data.value));
                case "itemof":
                    return Schema.buildItemOf(Schema.nextProcess(data, null, data.value));
                case "array":
                    return Schema.buildArray(Schema.nextProcess(data, null, data.value));
                case "or":
                    return Schema.buildOr(Schema.nextProcess(data, null, data.value));
                case "and":
                    return Schema.buildAnd(Schema.nextProcess(data, null, data.value));
                case "literal":
                    return Schema.buildLiteral(Schema.nextProcess(data, null, data.value));
            }
            var result = {};
            return result;
        };
        Schema.setCommonProperties = function (result, data) {
            if (data.value.title) {
                result["title"] = data.value.title;
            }
            if (data.value.description) {
                result["description"] = data.value.description;
            }
            return result;
        };
        Schema.buildPrimitiveType = function (data) {
            var result = {
                type: data.value.type,
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildInterface = function (data) {
            var properties = {};
            var result = {
                type: "object",
                properties: properties,
                //additionalProperties: false,
                required: Object.keys(data.value.members).filter(function (i) { return !i.endsWith("?"); }),
            };
            if (data.value.extends) {
                // additionalProperties: false と allOf の組み合わせは残念な事になるので極力使わない。( additionalProperties: false が、 allOf の参照先の properties も参照元の Properties も使えなくしてしまうので、この組み合わせは使えたもんじゃない。 )
                var allOf_1 = [];
                data.value.extends.forEach(function (i) {
                    var current = Schema.getDefinition(data, i);
                    if (type_1.Type.isInterfaceDefinition(current.value)) {
                        var base = Schema.buildInterface(current);
                        Object.assign(properties, base["properties"]);
                        var required_1 = result["required"];
                        required_1.push.apply(required_1, base["required"].filter(function (j) { return !required_1.includes(j); }));
                    }
                    else {
                        allOf_1.push(Schema.buildRefer(Schema.nextProcess(data, null, i)));
                    }
                });
                if (allOf_1.some(function (_i) { return true; })) {
                    result["allOf"] = allOf_1;
                }
            }
            Object.entries(data.value.members).forEach(function (i) {
                var key = text_1.Text.getPrimaryKeyName(i[0]);
                var value = i[1];
                properties[key] = Schema.buildTypeOrRefer(Schema.nextProcess(data, null, value));
            });
            if ("boolean" === typeof data.value.additionalProperties) {
                result["additionalProperties"] = data.value.additionalProperties;
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildDictionary = function (data) {
            var result = {
                type: "object",
                additionalProperties: Schema.buildTypeOrRefer(Schema.nextProcess(data, null, data.value.valueType)),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildEnumType = function (data) {
            var result = {
                enum: data.value.members,
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildTypeOf = function (data) {
            var result = {};
            var literal = Schema.getLiteral(data, data.value.value);
            if (literal) {
                result["const"] = literal.literal;
            }
            else {
                console.error("\uD83D\uDEAB Can not resolve refer: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref })));
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildItemOf = function (data) {
            var result = {};
            var literal = Schema.getLiteral(data, data.value.value);
            if (literal) {
                if (Array.isArray(literal.literal)) {
                    result["enum"] = literal.literal;
                }
                else {
                    console.error("\uD83D\uDEAB Not array itemof: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref, literal: literal.literal })));
                }
            }
            else {
                console.error("\uD83D\uDEAB Can not resolve refer: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref })));
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildRefer = function (data) {
            var _a;
            var path = Schema.getAbsolutePath(data, data.value);
            var result = {
                $ref: (_a = Schema.resolveExternalRefer(data, path)) !== null && _a !== void 0 ? _a : "#/".concat(Const.definitions, "/").concat(path),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildArray = function (data) {
            var result = {
                type: "array",
                items: Schema.buildTypeOrRefer(Schema.nextProcess(data, null, data.value.items)),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildOr = function (data) {
            var result = {
                oneOf: data.value.types.map(function (i) { return Schema.buildTypeOrRefer(Schema.nextProcess(data, null, i)); }),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildAnd = function (data) {
            var result = {
                allOf: data.value.types.map(function (i) { return Schema.buildTypeOrRefer(Schema.nextProcess(data, null, i)); }),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildTypeOrRefer = function (data) {
            return type_1.Type.isReferElement(data.value) ?
                Schema.buildRefer(Schema.nextProcess(data, null, data.value)) :
                Schema.buildType(Schema.nextProcess(data, null, data.value));
        };
    })(Schema = Build.Schema || (Build.Schema = {}));
})(Build || (exports.Build = Build = {}));
var Format;
(function (Format) {
    // data:code(object) to data:output(text)
    Format.getMaxLineLength = function (options) {
        return evil_type_1.EvilType.Validator.isUndefined(options.maxLineLength) ? config_json_1.default.maxLineLength : options.maxLineLength;
    };
    Format.buildIndent = function (options, indentDepth) {
        return Array.from({ length: indentDepth, })
            .map(function (_) { return "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(function (_) { return " "; }).join("") : "\t"; })
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
            if (!data.buffer.endsWith("|") && !data.buffer.endsWith("&") && !token.startsWith("!")) {
                if ([")", "[]", ":", ".", ",", ";",].includes(token) ||
                    (!data.buffer.endsWith("=") && !data.buffer.endsWith("=>") && "(" === token) ||
                    data.buffer.endsWith("(") ||
                    data.buffer.endsWith(".")
                // data.buffer.endsWith("...")
                ) {
                    return "";
                }
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
            var options = data.options, indentDepth = data.indentDepth, result_5 = data.result, buffer = data.buffer, tokens = data.tokens, i = data.i;
            ++i;
            if (data.i + 1 < tokens.length && maxLineLength <= Format.temporaryAssembleLine({ options: options, indentDepth: indentDepth, result: result_5, buffer: buffer, tokens: tokens, i: i, }, 1).length) {
                return !config_json_1.default.lineUnbreakableTokens.heads.includes(tokens[data.i]) && !config_json_1.default.lineUnbreakableTokens.tails.includes(tokens[data.i + 1]);
            }
            if (data.i + 2 < tokens.length && maxLineLength <= Format.temporaryAssembleLine({ options: options, indentDepth: indentDepth, result: result_5, buffer: buffer, tokens: tokens, i: i, }, 2).length) {
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
var build = function (jsonPath) {
    try {
        var fget = function (path) { return fs_1.default.readFileSync(path, { encoding: "utf-8" }); };
        var rawSource = fget(jsonPath);
        var typeSource = jsonable_1.Jsonable.parse(rawSource);
        var errorListner = evil_type_1.EvilType.Validator.makeErrorListener(jsonPath);
        var resolvePath = function (path) {
            if (path.startsWith("./") || path.startsWith("../")) {
                var base = jsonPath.split("/").slice(0, -1);
                var current = path;
                while (true) {
                    if (current.startsWith("./")) {
                        current = current.slice(2);
                    }
                    else if (current.startsWith("../")) {
                        current = current.slice(3);
                        base = base.slice(0, -1);
                    }
                    else {
                        return __spreadArray(__spreadArray([], base, true), [current], false).join("/");
                    }
                }
            }
            else {
                return path;
            }
        };
        if (type_1.Type.isTypeSchema(typeSource, errorListner)) {
            var code = __spreadArray(__spreadArray(__spreadArray([], (0, exports.$comment)(typeSource), true), Build.Define.buildImports(typeSource.imports), true), Build.Define.buildDefineNamespaceCore(typeSource.options, typeSource.defines), true);
            var result_6 = Format.text(typeSource.options, 0, code);
            fs_1.default.writeFileSync(resolvePath(typeSource.options.outputFile), result_6, { encoding: "utf-8" });
            if (typeSource.options.schema) {
                var schema = Build.Schema.build(Build.Schema.makeProcess(typeSource, typeSource.options.schema));
                fs_1.default.writeFileSync(resolvePath(typeSource.options.schema.outputFile), jsonable_1.Jsonable.stringify(schema, null, 4), { encoding: "utf-8" });
            }
            return true;
        }
        else {
            console.error("🚫 Invalid TypeSchema");
            console.error(errorListner);
            console.error("See ".concat(config_json_1.default.repository));
        }
    }
    catch (error) {
        console.error(error);
    }
    return false;
};
var result = build(jsonPath);
var emoji = result ? "✅" : "🚫";
var text = result ? "end" : "failed";
console.log("".concat(emoji, " ").concat(jsonPath, " build ").concat(text, ": ").concat(new Date(), " ( ").concat((getBuildTime() / 1000).toLocaleString(), "s )"));
//# sourceMappingURL=index.js.map