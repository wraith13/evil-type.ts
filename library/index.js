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
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Types = void 0;
    var Types;
    (function (Types) {
        Types.schema = "https://raw.githubusercontent.com/wraith13/evil-type.ts/master/resource/type-schema.json#";
        Types.isJsonableValue = function (value) {
            return null === value ||
                "boolean" === typeof value ||
                "number" === typeof value ||
                "string" === typeof value;
        };
        Types.isJsonableObject = function (value) {
            return null !== value &&
                "object" === typeof value &&
                Object.values(value).filter(function (v) { return !Types.isJsonable(v); }).length <= 0;
        };
        Types.isJsonable = function (value) {
            return Types.isJsonableValue(value) ||
                (Array.isArray(value) && value.filter(function (v) { return !Types.isJsonable(v); }).length <= 0) ||
                Types.isJsonableObject(value);
        };
        Types.isRefer = function (value) {
            return null !== value &&
                "object" === typeof value &&
                "$ref" in value && "string" === typeof value.$ref;
        };
        Types.isAlphaDefine = function (value) {
            return null !== value &&
                "object" === typeof value &&
                (!("export" in value) || "boolean" === typeof value.export) &&
                "$type" in value && "string" === typeof value.$type;
        };
        Types.isModuleDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "module" === value.$type &&
                "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).filter(function (v) { return !Types.isDefine(v); }).length <= 0;
        };
        Types.isValueDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "value" === value.$type &&
                "value" in value && Types.isJsonable(value);
        };
        Types.isPrimitiveTypeDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "primitive-type" === value.$type &&
                "define" in value && ("undefined" === value.define || "boolean" === value.define || "number" === value.define || "string" === value.define);
        };
        Types.isTypeDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "type" === value.$type &&
                "define" in value && Types.isTypeOrInterfaceOrRefer(value.define);
        };
        Types.isInterfaceDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "interface" === value.$type &&
                "members" in value && null !== value.members && "object" === typeof value.members && Object.values(value.members).filter(function (v) { return !Types.isTypeOrInterfaceOrRefer(v); }).length <= 0;
        };
        Types.isArrayDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "array" === value.$type &&
                "items" in value && Types.isTypeOrInterfaceOrRefer(value.items);
        };
        Types.isOrDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "or" === value.$type &&
                "types" in value && Array.isArray(value.types) && value.types.filter(function (i) { return !Types.isTypeOrInterfaceOrRefer(i); }).length <= 0;
        };
        Types.isAndDefine = function (value) {
            return Types.isAlphaDefine(value) &&
                "and" === value.$type &&
                "types" in value && Array.isArray(value.types) && value.types.filter(function (i) { return !Types.isTypeOrInterfaceOrRefer(i); }).length <= 0;
        };
        Types.isTypeOrInterface = function (value) {
            return Types.isPrimitiveTypeDefine(value) ||
                Types.isTypeDefine(value) ||
                Types.isInterfaceDefine(value) ||
                Types.isArrayDefine(value) ||
                Types.isOrDefine(value) ||
                Types.isAndDefine(value);
        };
        Types.isTypeOrInterfaceOrRefer = function (value) {
            return Types.isTypeOrInterface(value) || Types.isRefer(value);
        };
        Types.isDefine = function (value) {
            return Types.isModuleDefine(value) || Types.isValueDefine(value) || Types.isTypeOrInterface(value);
        };
        Types.isDefineOrRefer = function (value) {
            return Types.isDefine(value) || Types.isRefer(value);
        };
    })(Types || (exports.Types = Types = {}));
});
define("text", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Text = void 0;
    var Text;
    (function (Text) {
        Text.getNameSpace = function (name) {
            return name.split(".").slice(0, -1).join(".");
        };
        Text.getNameBody = function (name) {
            return name.split(".").slice(-1)[0];
        };
        Text.toUpperCamelCase = function (name) {
            return "".concat(name.slice(0, 1).toUpperCase()).concat(name.slice(1));
        };
    })(Text || (exports.Text = Text = {}));
});
define("index", ["require", "exports", "fs", "types", "text"], function (require, exports, fs_1, types_1, text_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Format = exports.Build = exports.$block = exports.$iblock = exports.$line = exports.$expression = exports.convertToExpression = void 0;
    fs_1 = __importDefault(fs_1);
    var startAt = new Date();
    var getBuildTime = function () { return new Date().getTime() - startAt.getTime(); };
    var jsonPath = process.argv[2];
    console.log("\uD83D\uDE80 ".concat(jsonPath, " build start: ").concat(startAt));
    // const removeNullFilter = <ElementType>(list: (ElementType | null)[]): ElementType[] =>
    //     list.filter(i => null !== i) as ElementType[];
    var kindofJoinExpression = function (list, separator) {
        return list.reduce(function (a, b) { return (Array.isArray(a) ? a : [a]).concat(Array.isArray(b) ? __spreadArray([separator], b, true) : [separator, b]); }, []);
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
                    {
                        var line = (0, exports.convertToExpression)(i.expressions);
                        var last = line[line.length - 1];
                        last.expression += ";";
                        result.concat.apply(result, line);
                    }
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
    var $iblock = function (lines) { return ({ $code: "inline-block", lines: lines, }); };
    exports.$iblock = $iblock;
    var $block = function (header, lines) { return ({ $code: "block", header: header, lines: lines, }); };
    exports.$block = $block;
    var Build;
    (function (Build) {
        // data:input(json) to data:code(object)
        Build.buildExport = function (define) { var _a; return ("export" in define && ((_a = define.export) !== null && _a !== void 0 ? _a : true)) ? [(0, exports.$expression)("export")] : []; };
        Build.makeValueBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("const"),
                define: [(0, exports.$expression)(JSON.stringify(define.value))],
                validator: function (name) { return Validator.buildValueValidatorExpression(name, define.value); },
            });
        };
        Build.makePrimitiveTypeBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("const"),
                define: [(0, exports.$expression)(JSON.stringify(define.define))],
                validator: function (name) { return [(0, exports.$expression)("\"".concat(define.$type, "\" === typeof ").concat(name)),]; },
            });
        };
        Build.makeTypeBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("type"),
                define: [(0, exports.$expression)(JSON.stringify(define.define))],
                validator: function (name) { return Validator.buildValidatorExpression(name, define.define); },
            });
        };
        Build.makeArrayTypeBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("type"),
                define: [(0, exports.$expression)(JSON.stringify(define.items) + "[]")],
                validator: function (name) {
                    return __spreadArray(__spreadArray([
                        (0, exports.$expression)("Array.isArray(".concat(name, ")")),
                        (0, exports.$expression)("&&"),
                        (0, exports.$expression)("!"),
                        (0, exports.$expression)("".concat(name, ".some(")),
                        (0, exports.$expression)("i"),
                        (0, exports.$expression)("=>")
                    ], Validator.buildValidatorExpression("i", define.items), true), [
                        (0, exports.$expression)(")")
                    ], false);
                }
            });
        };
        Build.makeAndTypeBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("type"),
                define: kindofJoinExpression(define.types.map(function (i) { return Define.buildInlineDefine(i); }), (0, exports.$expression)("&&")),
                validator: function (name) { return kindofJoinExpression(define.types.map(function (i) { return Validator.buildValidatorExpression(name, i); }), (0, exports.$expression)("&&")); },
            });
        };
        Build.makeOrTypeBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("type"),
                define: kindofJoinExpression(define.types.map(function (i) { return Define.buildInlineDefine(i); }), (0, exports.$expression)("||")),
                validator: function (name) { return kindofJoinExpression(define.types.map(function (i) { return Validator.buildValidatorExpression(name, i); }), (0, exports.$expression)("||")); },
            });
        };
        Build.makeInterfaceBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("interface"),
                define: Define.buildDefineInlineInterface(define),
                validator: function (name) { return Validator.buildInterfaceValidator(name, define); },
            });
        };
        Build.makeModuleBuilder = function (define) {
            return ({
                declarator: (0, exports.$expression)("module"),
                define: Define.buildDefineModuleCore(define),
            });
        };
        Build.getBuilder = function (define) {
            switch (define.$type) {
                case "value":
                    return Build.makeValueBuilder(define);
                case "primitive-type":
                    return Build.makePrimitiveTypeBuilder(define);
                case "type":
                    return Build.makeTypeBuilder(define);
                case "array":
                    return Build.makeArrayTypeBuilder(define);
                case "and":
                    return Build.makeAndTypeBuilder(define);
                case "or":
                    return Build.makeOrTypeBuilder(define);
                case "interface":
                    return Build.makeInterfaceBuilder(define);
                case "module":
                    return Build.makeModuleBuilder(define);
            }
        };
        Build.getValidator = function (define) {
            return Build.getBuilder(define).validator;
        };
        var Define;
        (function (Define) {
            Define.buildDefineLine = function (declarator, name, define) {
                return (0, exports.$line)(Build.buildExport(define).concat(__spreadArray([(0, exports.$expression)(declarator), (0, exports.$expression)(name), (0, exports.$expression)("=")], (0, exports.convertToExpression)(Define.buildInlineDefine(define)), true)));
            };
            Define.buildInlineDefineValue = function (value) { return (0, exports.$expression)(JSON.stringify(value.value)); };
            Define.buildDefineValue = function (name, value) {
                return Define.buildDefineLine("const", name, value);
            };
            //export const buildValueValidator = (name: string, value: Types.ValueDefine) =>
            //    Validator.buildValidatorLine("const", name, value);
            Define.buildInlineDefinePrimitiveType = function (value) {
                return (0, exports.$expression)(value.define);
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
            Define.buildInlineDefineArray = function (value) {
                return [(0, exports.$expression)(Define.buildInlineDefine(value.items) + "[]"),];
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
                var header = Build.buildExport(value).concat(["interface", name].filter(function (i) { return null !== i; }).map(function (i) { return (0, exports.$expression)(i); }));
                var lines = Define.buildDefineInlineInterface(value);
                return (0, exports.$block)(header, [lines]);
            };
            Define.buildDefineModuleCore = function (value) {
                return __spreadArray([], Object.entries(value.members).map(function (i) { return types_1.Types.isModuleDefine(i[1]) ?
                    [Define.buildDefine(i[0], i[1])] :
                    [Define.buildDefine(i[0], i[1]), Validator.buildValidator(i[0], i[1]),]; }).reduce(function (a, b) { return a.concat(b); }, []), true);
            };
            Define.buildDefineModule = function (name, value) {
                var header = Build.buildExport(value).concat([(0, exports.$expression)("module"), (0, exports.$expression)(name)]);
                var lines = Define.buildDefineModuleCore(value);
                return (0, exports.$block)(header, lines);
            };
            Define.buildDefine = function (name, define) {
                switch (define.$type) {
                    case "module":
                        return Define.buildDefineModule(name, define);
                    default:
                        return Define.buildDefineLine(Build.getBuilder(define).declarator.expression, name, define);
                }
            };
            Define.buildInlineDefine = function (define) {
                if (types_1.Types.isRefer(define)) {
                    return [(0, exports.$expression)(define.$ref),];
                }
                else {
                    switch (define.$type) {
                        case "value":
                            return [Define.buildInlineDefineValue(define),];
                        case "primitive-type":
                            return [Define.buildInlineDefinePrimitiveType(define),];
                        case "type":
                            return Define.buildInlineDefine(define.define);
                        case "array":
                            return Define.buildInlineDefineArray(define);
                        case "and":
                            return Define.buildInlineDefineAnd(define);
                        case "or":
                            return Define.buildInlineDefineOr(define);
                        case "interface":
                            return [Define.buildDefineInlineInterface(define),];
                    }
                }
            };
        })(Define = Build.Define || (Build.Define = {}));
        var Validator;
        (function (Validator) {
            Validator.buildValueValidatorExpression = function (name, value) {
                if (null !== value && "object" === typeof value) {
                    if (Array.isArray(value)) {
                        var list_1 = [];
                        list_1.push((0, exports.$expression)("Array.isArray(".concat(name, ")")));
                        list_1.push((0, exports.$expression)("".concat(value.length, " <= ").concat(name, ".length")));
                        value.forEach(function (i, ix) { return list_1 = list_1.concat(Validator.buildValueValidatorExpression("".concat(name, "[").concat(ix, "]"), i)); });
                        return kindofJoinExpression(list_1, (0, exports.$expression)("&&"));
                    }
                    else {
                        var list_2 = [];
                        list_2.push((0, exports.$expression)("null !== ".concat(name)));
                        list_2.push((0, exports.$expression)("\"object\" === typeof ".concat(name)));
                        Object.keys(value).forEach(function (key) {
                            {
                                list_2.push((0, exports.$expression)("\"".concat(key, "\" in ").concat(name)));
                                list_2.push.apply(list_2, Validator.buildValueValidatorExpression("".concat(name, ".").concat(key), value[key]));
                            }
                        });
                        return kindofJoinExpression(list_2, (0, exports.$expression)("&&"));
                    }
                }
                if (undefined === value) {
                    return [(0, exports.$expression)("undefined"), (0, exports.$expression)("==="), (0, exports.$expression)(name),];
                }
                else {
                    return [(0, exports.$expression)(JSON.stringify(value)), (0, exports.$expression)("==="), (0, exports.$expression)(name),];
                }
            };
            Validator.buildInlineValueValidator = function (define) {
                return (0, exports.$expression)("(value: unknown): value is ".concat(Define.buildInlineDefineValue(define), " => ").concat(Validator.buildValueValidatorExpression("value", define.value), ";"));
            };
            Validator.buildValidatorLine = function (declarator, name, define) {
                return Build.buildExport(define).concat(__spreadArray([(0, exports.$expression)(declarator), (0, exports.$expression)(name), (0, exports.$expression)("=")], (0, exports.convertToExpression)(Validator.buildInlineValidator(name, define)), true));
            };
            Validator.buildValidatorName = function (name) {
                return text_1.Text.getNameSpace(name).split(".").concat(["is".concat(text_1.Text.toUpperCamelCase(text_1.Text.getNameBody(name)))]).join(".");
            };
            Validator.buildValidatorExpression = function (name, define) {
                return types_1.Types.isRefer(define) ?
                    [(0, exports.$expression)("".concat(Validator.buildValidatorName(define.$ref), "(").concat(name, ")"))] :
                    Build.getValidator(define)(name);
            };
            Validator.buildInterfaceValidator = function (name, define) {
                var list = [];
                list.push((0, exports.$expression)("null !== ".concat(name)));
                list.push((0, exports.$expression)("\"object\" === typeof ".concat(name)));
                Object.keys(define.members).forEach(function (key) {
                    {
                        list.push((0, exports.$expression)("\"".concat(key, "\" in ").concat(name)));
                        list.push.apply(list, (0, exports.convertToExpression)(Validator.buildValidatorExpression("".concat(name, ".").concat(key), define.members[key])));
                    }
                });
                return kindofJoinExpression(list, (0, exports.$expression)("&&"));
            };
            Validator.buildInlineValidator = function (name, define) {
                return __spreadArray([
                    (0, exports.$expression)("(value: unknown): value is ".concat(name, " =>"))
                ], Validator.buildValidatorExpression("value", define), true);
            };
            Validator.buildValidator = function (name, define) {
                return (0, exports.$line)([(0, exports.$expression)("const"), (0, exports.$expression)(Validator.buildValidatorName(name))]
                    .concat(Validator.buildInlineValidator(name, define)));
            };
        })(Validator = Build.Validator || (Build.Validator = {}));
    })(Build || (exports.Build = Build = {}));
    var Format;
    (function (Format) {
        // data:code(object) to data:output(text)
        Format.buildIndent = function (options, indentDepth) {
            return Array.from({ length: indentDepth, })
                .map(function (_) { return "number" === typeof options.indentUnit ? Array.from({ length: options.indentUnit, }).map(function (_) { return " "; }).join("") : options.indentUnit; })
                .join("");
        };
        Format.getReturnCode = function (_options) { return "\n"; };
        Format.expressions = function (code) {
            return code.join(" ");
        };
        Format.tokens = function (code) {
            switch (code.$code) {
                case "inline-block":
                    return code.lines.map(function (i) { return Format.tokens(i); }).reduce(function (a, b) { return a.concat(b); }, []);
                case "line":
                    return code.expressions.map(function (i) { return Format.tokens(i); }).reduce(function (a, b) { return a.concat(b); }, []);
                case "expression":
                    return [code.expression];
            }
        };
        Format.line = function (options, indentDepth, code) {
            return Format.buildIndent(options, indentDepth)
                + code.expressions.map(function (i) { return Format.tokens(i); }).reduce(function (a, b) { return a.concat(b); }, []).join(" ")
                + ";"
                + Format.getReturnCode(options);
        };
        Format.inlineBlock = function (options, indentDepth, code) {
            return __spreadArray(__spreadArray(["{"], code.lines.map(function (i) { return Format.text(options, indentDepth + 1, i); }), true), ["}"], false).join(" ");
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
                return code.map(function (i) { return Format.text(options, indentDepth, i); }).join(Format.getReturnCode(options));
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
        console.log("\u2705 ".concat(jsonPath, " build end: ").concat(new Date(), " ( ").concat((getBuildTime() / 1000).toLocaleString(), "s )"));
        var typeSource = JSON.parse(fget(jsonPath));
        var result = Format.text(typeSource.options, 0, Object.entries(typeSource.defines)
            .map(function (i) { return Build.Define.buildDefine(i[0], i[1]); }));
        console.log(result);
    }
    catch (error) {
        console.error(error);
        console.log("\uD83D\uDEAB ".concat(jsonPath, " build failed: ").concat(new Date(), " ( ").concat((getBuildTime() / 1000).toLocaleString(), "s )"));
    }
});
// how to run: `node ./index.js .......`
//# sourceMappingURL=index.js.map