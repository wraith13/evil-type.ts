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
var stringifyTokens = function (json) {
    return jsonable_1.Jsonable.stringify(json, null, 1).split(/[\r\n]+[\t ]*/)
        .map(function (i) { return (0, exports.$expression)(i); });
};
var Build;
(function (Build) {
    Build.buildExport = function (data) { var _a, _b, _c; return ((_c = (_a = data.value.export) !== null && _a !== void 0 ? _a : (_b = data.options.default) === null || _b === void 0 ? void 0 : _b.export) !== null && _c !== void 0 ? _c : true) ? [(0, exports.$expression)("export"),] : []; };
    Build.getAdditionalProperties = function (data) { var _a, _b; return (_a = data.value.additionalProperties) !== null && _a !== void 0 ? _a : (_b = data.options.default) === null || _b === void 0 ? void 0 : _b.additionalProperties; };
    Build.buildExtends = function (define) {
        return undefined !== define.extends ? __spreadArray([(0, exports.$expression)("extends")], define.extends.map(function (i, ix, list) { return (0, exports.$expression)(ix < (list.length - 1) ? "".concat(i.$ref, ",") : "".concat(i.$ref)); }), true) : [];
    };
    Build.asConst = [(0, exports.$expression)("as"), (0, exports.$expression)("const"),];
    Build.buildLiteralAsConst = function (literal) {
        return __spreadArray(__spreadArray([], stringifyTokens(literal), true), Build.asConst, true);
    };
    ;
    Build.nextProcess = function (current, key, value) {
        return null === key ?
            Object.assign({}, current, { value: value, }) :
            Object.assign({}, current, { path: Build.nextPath(current.path, key), key: key, value: value, });
    };
    Build.nextPath = function (path, key) {
        return null === key ?
            path :
            "" === path ?
                key :
                "".concat(path, ".").concat(key);
    };
    Build.makeDefinitionFlatMap = function (defines) {
        var result = {};
        Object.entries(defines).forEach(function (i) {
            var key = i[0];
            var value = i[1];
            if (type_1.Type.isDefinition(value)) {
                result[key] = value;
                if (type_1.Type.isNamespaceDefinition(value)) {
                    Object.entries(Build.makeDefinitionFlatMap(value.members))
                        .forEach(function (j) { return result["".concat(key, ".").concat(j[0])] = j[1]; });
                }
            }
        });
        return result;
    };
    Build.getAbsolutePath = function (data, value, context) {
        if (context === void 0) { context = data.path; }
        if ("" === context) {
            return value.$ref;
        }
        else {
            var path = "".concat(context, ".").concat(value.$ref);
            if (data.definitions[path]) {
                return path;
            }
            return Build.getAbsolutePath(data, value, text_1.Text.getNameSpace(context));
        }
    };
    Build.getDefinition = function (data) {
        var path = Build.getAbsolutePath(data, data.value);
        return Object.assign({}, data, { path: path, value: data.definitions[path], });
    };
    Build.resolveRefer = function (data) {
        if (type_1.Type.isReferElement(data.value)) {
            var next = Build.getDefinition(Build.nextProcess(data, null, data.value));
            if (type_1.Type.isTypeOrValueOfRefer(next.value)) {
                return Build.resolveRefer(next);
            }
            else {
                return Build.nextProcess(data, null, data.value);
            }
        }
        if (type_1.Type.isValueDefinition(data.value)) {
            if (type_1.Type.isReferElement(data.value.value)) {
                return Build.resolveRefer(Build.nextProcess(data, null, data.value.value));
            }
            else {
                return Build.nextProcess(data, null, data.value.value);
            }
        }
        if (type_1.Type.isTypeDefinition(data.value)) {
            return Build.resolveRefer(Build.nextProcess(data, null, data.value.define));
        }
        if (type_1.Type.isMemberofElement(data.value)) {
            return Build.resolveRefer(Build.getMemberofTarget(Build.nextProcess(data, null, data.value)));
        }
        return Build.nextProcess(data, null, data.value);
    };
    Build.getKeyofTarget = function (data) { return Build.resolveRefer(Build.nextProcess(data, null, type_1.Type.isTypeofElement(data.value.value) ?
        data.value.value.value :
        data.value.value)); };
    Build.getMemberofTarget = function (data) {
        var _a;
        var entry = Build.resolveRefer(Build.nextProcess(data, null, data.value.value));
        if (type_1.Type.isLiteralElement(entry.value)) {
            if (evil_type_1.EvilType.Validator.isObject(entry.value.const) && data.value.key in entry.value.const) {
                var value = entry.value.const[data.value.key];
                if (jsonable_1.Jsonable.isJsonable(value)) {
                    return Build.nextProcess(entry, "".concat(data.value.key), { const: value });
                }
            }
        }
        else if (type_1.Type.isType(entry.value)) {
            switch (entry.value.type) {
                case "interface":
                    return Build.nextProcess(entry, "".concat(data.value.key), (_a = entry.value.members[data.value.key]) !== null && _a !== void 0 ? _a : { "type": "never" });
                case "dictionary":
                    return Build.nextProcess(entry, "".concat(data.value.key), entry.value.valueType);
                case "or":
                    return Build.nextProcess(entry, "".concat(data.value.key), {
                        type: "or",
                        types: entry.value.types.map(function (i) { return Build.getMemberofTarget(Build.nextProcess(entry, null, {
                            type: "memberof",
                            value: i,
                            key: data.value.key,
                        })).value; })
                    });
                case "and":
                    return Build.nextProcess(entry, "".concat(data.value.key), {
                        type: "and",
                        types: entry.value.types.map(function (i) { return Build.getMemberofTarget(Build.nextProcess(entry, null, {
                            type: "memberof",
                            value: i,
                            key: data.value.key,
                        })).value; })
                    });
            }
        }
        return Build.nextProcess(entry, "".concat(data.value.key), { "type": "never" });
    };
    Build.getSafeInteger = function (data) {
        var _a, _b;
        if ((type_1.Type.isIntegerType(data.value)) && undefined !== data.value.safeInteger) {
            return data.value.safeInteger;
        }
        return (_b = (_a = data.options.default) === null || _a === void 0 ? void 0 : _a.safeInteger) !== null && _b !== void 0 ? _b : config_json_1.default.safeInteger;
    };
    Build.getSafeNumber = function (data) {
        var _a, _b;
        if ((type_1.Type.isNumberType(data.value)) && undefined !== data.value.safeNumber) {
            return data.value.safeNumber;
        }
        return (_b = (_a = data.options.default) === null || _a === void 0 ? void 0 : _a.safeNumber) !== null && _b !== void 0 ? _b : config_json_1.default.safeNumber;
    };
    Build.getRegexpFlags = function (data) {
        var _a, _b;
        if ((type_1.Type.isPatternStringType(data.value) || type_1.Type.isFormatStringType(data.value)) && undefined !== data.value.regexpFlags) {
            return data.value.regexpFlags;
        }
        return (_b = (_a = data.options.default) === null || _a === void 0 ? void 0 : _a.regexpFlags) !== null && _b !== void 0 ? _b : config_json_1.default.regexpFlags;
    };
    Build.getLiteral = function (data) {
        var definition = Build.getDefinition(data);
        if (type_1.Type.isValueDefinition(definition.value)) {
            if (type_1.Type.isLiteralElement(definition.value.value)) {
                return definition.value.value;
            }
            else {
                return Build.getLiteral(Build.nextProcess(definition, null, definition.value.value));
            }
        }
        return null;
    };
    Build.getKeys = function (data) {
        var result = [];
        if (data.value.extends) {
            data.value.extends.forEach(function (i) {
                var current = Build.resolveRefer(Build.nextProcess(data, null, i));
                if (type_1.Type.isInterfaceDefinition(current.value)) {
                    result.push.apply(result, Build.getKeys(Build.nextProcess(current, null, current.value)));
                }
            });
        }
        result.push.apply(result, Object.keys(data.value.members));
        return result;
    };
    Build.getActualKeys = function (data) {
        var target = Build.resolveRefer(data);
        if (type_1.Type.isLiteralElement(target.value)) {
            if (evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)(target.value.const)) {
                return target.value.const;
            }
            else {
                return [];
            }
        }
        if (type_1.Type.isType(target.value)) {
            switch (target.value.type) {
                case "keyof":
                    {
                        var entry = Build.getKeyofTarget(Build.nextProcess(target, null, target.value));
                        if (type_1.Type.isInterfaceDefinition(entry.value)) {
                            return Build.getKeys(Build.nextProcess(entry, null, entry.value));
                        }
                        else if (type_1.Type.isDictionaryDefinition(entry.value)) {
                            if (undefined !== entry.value.keyin) {
                                return Build.getActualKeys(Build.nextProcess(entry, null, entry.value.keyin));
                            }
                        }
                        else if (type_1.Type.isLiteralElement(entry.value)) {
                            if (evil_type_1.EvilType.Validator.isObject(entry.value.const)) {
                                return Object.keys(entry.value.const);
                            }
                        }
                        return [];
                    }
                case "itemof":
                    {
                        var entry = Build.resolveRefer(Build.nextProcess(target, null, target.value.value));
                        if (type_1.Type.isLiteralElement(entry.value)) {
                            if (evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)(entry.value.const)) {
                                return entry.value.const;
                            }
                        }
                        return [];
                    }
                case "enum-type":
                    return target.value.members.map(function (i) { return "".concat(i); });
                case "or":
                    return target.value.types.map(function (i) { return Build.getActualKeys(Build.nextProcess(target, null, i)); }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
            }
        }
        return [];
    };
    Build.applyOptionality = function (key, optionality) {
        switch (optionality !== null && optionality !== void 0 ? optionality : "as-is") {
            case "as-is":
                return key;
            case "partial":
                return key.replace(/\??$/, "?");
            case "required":
                return text_1.Text.getPrimaryKeyName(key);
        }
    };
    Build.isDetailedDictionary = function (data) {
        return undefined !== data.value.keyin;
    };
    Build.dictionaryToInterface = function (data) {
        var result = {
            type: "interface",
            members: {}
        };
        Build.getActualKeys(Build.nextProcess(data, null, data.value.keyin))
            .forEach(function (key) { return result.members[Build.applyOptionality(key, data.value.optionality)] = data.value.valueType; });
        if (undefined !== data.value.additionalProperties) {
            result.additionalProperties = data.value.additionalProperties;
        }
        return Build.nextProcess(data, null, result);
    };
    Build.isKindofNeverType = function (data) {
        var target = Build.resolveRefer(data);
        if (type_1.Type.isLiteralElement(target.value)) {
            return false;
        }
        if (type_1.Type.isType(target.value)) {
            switch (target.value.type) {
                case "typeof":
                    return false;
                case "keyof":
                    {
                        var entry_1 = Build.getKeyofTarget(Build.nextProcess(target, null, target.value));
                        if (type_1.Type.isInterfaceDefinition(entry_1.value)) {
                            return 0 === Object.entries(entry_1.value.members).filter(function (i) { return !Build.isKindofNeverType(Build.nextProcess(entry_1, i[0], i[1])); }).length;
                        }
                        else if (type_1.Type.isDictionaryDefinition(entry_1.value)) {
                            return undefined !== entry_1.value.keyin && 0 === Build.getActualKeys(Build.nextProcess(entry_1, null, entry_1.value.keyin)).length;
                        }
                        else if (type_1.Type.isLiteralElement(entry_1.value)) {
                            return !evil_type_1.EvilType.Validator.isObject(entry_1.value.const) || Object.keys(entry_1.value.const).length <= 0;
                        }
                        else {
                            return false;
                        }
                    }
                    break;
                case "itemof":
                    {
                        var literal = Build.getLiteral(Build.nextProcess(target, null, target.value.value));
                        if (literal) {
                            return !Array.isArray(literal.const) || 0 === literal.const.length;
                        }
                        else {
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
                    return Build.isKindofNeverType(Build.nextProcess(target, null, target.value.define));
                case "enum-type":
                    return 0 === target.value.members.length;
                case "array":
                    return false;
                case "and":
                    return 0 === target.value.types.length || target.value.types.some(function (i) { return Build.isKindofNeverType(Build.nextProcess(target, null, i)); });
                case "or":
                    return 0 === target.value.types.length || target.value.types.every(function (i) { return Build.isKindofNeverType(Build.nextProcess(target, null, i)); });
                case "interface":
                    //return target.value.extends?.some?.(i => isKindofNeverType(nextProcess(target, null, i))) ?? false;
                    return false;
                case "dictionary":
                    //return isKindofNeverType(nextProcess(target, null, target.value.valueType));
                    return false;
            }
        }
        return false;
    };
    var Define;
    (function (Define) {
        Define.makeProcess = function (source) {
            return ({
                source: source,
                options: source.options,
                definitions: Build.makeDefinitionFlatMap(source.defines),
                path: "",
                key: "",
                value: source.defines,
            });
        };
        Define.buildDefineLine = function (declarator, data, postEpressions) {
            if (postEpressions === void 0) { postEpressions = []; }
            return (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(data), true), [(0, exports.$expression)(declarator), (0, exports.$expression)(data.key), (0, exports.$expression)("=")], false), (0, exports.convertToExpression)(Define.buildInlineDefine(data)), true), postEpressions, true));
        };
        Define.buildInlineDefineLiteral = function (define) {
            return __spreadArray([], stringifyTokens(define.const), true);
        };
        Define.buildInlineDefinePrimitiveType = function (value) {
            switch (value.type) {
                case "integer":
                    return (0, exports.$expression)("number");
                default:
                    return (0, exports.$expression)(value.type);
            }
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
        Define.buildInlineDefineArray = function (data) {
            return __spreadArray(__spreadArray([], Define.enParenthesisIfNeed(Define.buildInlineDefine(Build.nextProcess(data, null, data.value.items))), true), [(0, exports.$expression)("[]"),], false);
        };
        Define.buildOptionality = function (optionality) {
            switch (optionality !== null && optionality !== void 0 ? optionality : "as-is") {
                case "as-is":
                    return [];
                case "partial":
                    return [(0, exports.$expression)("?"),];
                case "required":
                    return [(0, exports.$expression)("-?"),];
            }
        };
        Define.buildDictionaryKeyin = function (data) {
            return undefined === data.value.keyin ?
                [(0, exports.$expression)("["), (0, exports.$expression)("key:"), (0, exports.$expression)("string"), (0, exports.$expression)("]:"),] : __spreadArray(__spreadArray(__spreadArray(__spreadArray([
                (0, exports.$expression)("["),
                (0, exports.$expression)("key"),
                (0, exports.$expression)("in")
            ], Define.buildInlineDefine(Build.nextProcess(data, null, data.value.keyin)), true), [
                (0, exports.$expression)("]")
            ], false), Define.buildOptionality(data.value.optionality), true), [
                (0, exports.$expression)(":"),
            ], false);
        };
        Define.buildInlineDefineDictionary = function (data) {
            return (0, exports.$iblock)([(0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Define.buildDictionaryKeyin(data), true), Define.buildInlineDefine(Build.nextProcess(data, null, data.value.valueType)), true), [(0, exports.$expression)(";"),], false))]);
        };
        Define.buildInlineDefineAnd = function (data) {
            return kindofJoinExpression(data.value.types.map(function (i) { return Define.enParenthesisIfNeed(Define.buildInlineDefine(Build.nextProcess(data, null, i))); }), (0, exports.$expression)("&"));
        };
        Define.buildInlineDefineOr = function (data) {
            return kindofJoinExpression(data.value.types.map(function (i) { return Define.enParenthesisIfNeed(Define.buildInlineDefine(Build.nextProcess(data, null, i))); }), (0, exports.$expression)("|"));
        };
        Define.buildDefineInlineInterface = function (data) { return (0, exports.$iblock)(Object.keys(data.value.members)
            .map(function (name) { return (0, exports.$line)(__spreadArray(__spreadArray([(0, exports.$expression)(name + ":")], Define.buildInlineDefine(Build.nextProcess(data, name, data.value.members[name])), true), [(0, exports.$expression)(";"),], false)); })); };
        Define.buildDefineInterface = function (data) {
            var header = __spreadArray(__spreadArray(__spreadArray([], Build.buildExport(data), true), ["interface", data.key].map(function (i) { return (0, exports.$expression)(i); }), true), Build.buildExtends(data.value), true);
            var lines = Object.keys(data.value.members)
                .map(function (name) { return (0, exports.$line)(__spreadArray([(0, exports.$expression)(name + ":")], Define.buildInlineDefine(Build.nextProcess(data, name, data.value.members[name])), true)); });
            return (0, exports.$block)(header, lines);
        };
        Define.buildDefineDictionary = function (data) {
            var header = __spreadArray(__spreadArray(__spreadArray([], Build.buildExport(data), true), ["type", data.key].map(function (i) { return (0, exports.$expression)(i); }), true), [(0, exports.$expression)("=")], false);
            return (0, exports.$block)(header, [(0, exports.$line)(__spreadArray(__spreadArray([], Define.buildDictionaryKeyin(data), true), Define.buildInlineDefine(Build.nextProcess(data, null, data.value.valueType)), true))]);
        };
        Define.buildDefineNamespaceCore = function (data) {
            return __spreadArray(__spreadArray(__spreadArray([], Object.entries(data.value)
                .map(function (i) { return Build.Define.buildDefine(Build.nextProcess(data, i[0], i[1])); }), true), Object.entries(data.value)
                .map(function (i) { return type_1.Type.isTypeOrValue(i[1]) && Build.Validator.isValidatorTarget(i[1]) ? Build.Validator.buildValidator(Build.nextProcess(data, i[0], i[1])) : []; }), true), Object.entries(data.value)
                .map(function (i) { return type_1.Type.isInterfaceDefinition(i[1]) ? Build.Validator.buildValidatorObject(Build.nextProcess(data, i[0], i[1])) : []; }), true).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
        };
        Define.buildDefineNamespace = function (data) {
            var header = __spreadArray(__spreadArray([], Build.buildExport(data), true), [(0, exports.$expression)("namespace"), (0, exports.$expression)(data.key),], false);
            var lines = Define.buildDefineNamespaceCore(Build.nextProcess(data, null, data.value.members));
            return (0, exports.$block)(header, lines);
        };
        Define.buildImports = function (imports) {
            return undefined === imports ? [] : imports.map(function (i) { return (0, exports.$line)([(0, exports.$expression)("import"), (0, exports.$expression)(i.import), (0, exports.$expression)("from"), (0, exports.$expression)(jsonable_1.Jsonable.stringify(i.from))]); });
        };
        Define.buildDefine = function (data) {
            switch (data.value.type) {
                case "code":
                    return [(0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], (0, exports.$comment)(data.value), true), Build.buildExport(data), true), data.value.tokens.map(function (i) { return (0, exports.$expression)(i); }), true)),];
                case "interface":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(data.value), true), [Define.buildDefineInterface(Build.nextProcess(data, null, data.value)),], false);
                case "dictionary":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(data.value), true), [Define.buildDefineDictionary(Build.nextProcess(data, null, data.value)),], false);
                case "namespace":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(data.value), true), [Define.buildDefineNamespace(Build.nextProcess(data, null, data.value)),], false);
                case "type":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(data.value), true), [Define.buildDefineLine("type", Build.nextProcess(data, null, data.value)),], false);
                case "value":
                    return __spreadArray(__spreadArray([], (0, exports.$comment)(data.value), true), [Define.buildDefineLine("const", Build.nextProcess(data, null, data.value), type_1.Type.isLiteralElement(data.value.value) ? Build.asConst : []),], false);
            }
        };
        Define.buildInlineDefine = function (data) {
            if (type_1.Type.isReferElement(data.value)) {
                return [(0, exports.$expression)(data.value.$ref),];
            }
            else if (type_1.Type.isLiteralElement(data.value)) {
                return Define.buildInlineDefineLiteral(data.value);
            }
            else {
                switch (data.value.type) {
                    case "typeof":
                        return __spreadArray([(0, exports.$expression)("typeof")], Define.buildInlineDefine(Build.nextProcess(data, null, data.value.value)), true);
                    case "keyof":
                        return __spreadArray([(0, exports.$expression)("keyof")], Define.buildInlineDefine(Build.nextProcess(data, null, data.value.value)), true);
                    case "itemof":
                        return [(0, exports.$expression)("typeof"), (0, exports.$expression)("".concat(data.value.value.$ref, "[number]")),];
                    case "memberof":
                        return [(0, exports.$expression)("".concat(data.value.value.$ref, "[\"").concat(data.value.key, "\"]")),];
                    case "value":
                        return Define.buildInlineDefine(Build.nextProcess(data, null, data.value.value));
                    case "never":
                    case "any":
                    case "unknown":
                    case "null":
                    case "boolean":
                    case "integer":
                    case "number":
                    case "string":
                        return [Define.buildInlineDefinePrimitiveType(data.value),];
                    case "type":
                        return Define.buildInlineDefine(Build.nextProcess(data, null, data.value.define));
                    case "enum-type":
                        return Define.buildInlineDefineEnum(data.value);
                    case "array":
                        return Define.buildInlineDefineArray(Build.nextProcess(data, null, data.value));
                    case "and":
                        return Define.buildInlineDefineAnd(Build.nextProcess(data, null, data.value));
                    case "or":
                        return Define.buildInlineDefineOr(Build.nextProcess(data, null, data.value));
                    case "interface":
                        return [Define.buildDefineInlineInterface(Build.nextProcess(data, null, data.value)),];
                    case "dictionary":
                        return [Define.buildInlineDefineDictionary(Build.nextProcess(data, null, data.value)),];
                }
            }
        };
    })(Define = Build.Define || (Build.Define = {}));
    var Validator;
    (function (Validator) {
        Validator.isRegularIdentifier = function (key) {
            return 0 <= key.length &&
                !/^\d/.test(key) &&
                /^[$\w]+$/.test(key);
        };
        Validator.buildObjectMember = function (name, key) {
            return Validator.isRegularIdentifier(key) ? "".concat(name, ".").concat(key) : "".concat(name, "[").concat(jsonable_1.Jsonable.stringify(key), "]");
        };
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
                        list_2.push((0, exports.$expression)("".concat(jsonable_1.Jsonable.stringify(key), " in ").concat(name)));
                        list_2.push((0, exports.$expression)("&&"));
                        list_2.push.apply(list_2, Validator.buildLiterarlValidatorExpression(Validator.buildObjectMember(name, key), value[key]));
                    });
                    return list_2;
                }
            }
            if (undefined === value) {
                return [(0, exports.$expression)("undefined"), (0, exports.$expression)("==="), (0, exports.$expression)(name),];
            }
            else if (null !== value && "object" === typeof value) {
                return [(0, exports.$expression)(jsonable_1.Jsonable.stringify(jsonable_1.Jsonable.stringify(value))), (0, exports.$expression)("==="), (0, exports.$expression)("JSON.stringify(".concat(name, ")")),];
            }
            else {
                return [(0, exports.$expression)(jsonable_1.Jsonable.stringify(value)), (0, exports.$expression)("==="), (0, exports.$expression)(name),];
            }
        };
        Validator.buildObjectValidatorObjectName = function (name) {
            return __spreadArray(__spreadArray([], text_1.Text.getNameSpace(name).split("."), true), ["".concat(text_1.Text.toLowerCamelCase(text_1.Text.getNameBody(name)), "ValidatorObject"),], false).filter(function (i) { return "" !== i; }).join(".");
        };
        Validator.buildValidatorName = function (name) {
            return __spreadArray(__spreadArray([], text_1.Text.getNameSpace(name).split("."), true), ["is".concat(text_1.Text.toUpperCamelCase(text_1.Text.getNameBody(name))),], false).filter(function (i) { return "" !== i; }).join(".");
        };
        Validator.buildValidatorExpression = function (name, data) {
            if (type_1.Type.isReferElement(data.value)) {
                return [(0, exports.$expression)("".concat(Validator.buildValidatorName(data.value.$ref), "(").concat(name, ")")),];
            }
            else if (type_1.Type.isLiteralElement(data.value)) {
                return Validator.buildLiterarlValidatorExpression(name, data.value.const);
            }
            else {
                switch (data.value.type) {
                    case "typeof":
                        return Validator.buildValidatorExpression(name, Build.nextProcess(data, null, data.value.value));
                    case "keyof":
                        return Validator.buildKeyofValidator(name, Build.nextProcess(data, null, data.value));
                    case "itemof":
                        return [(0, exports.$expression)("".concat(data.value.value.$ref, ".includes(").concat(name, " as any)")),];
                    case "memberof":
                        {
                            var target = Build.resolveRefer(data);
                            if (!type_1.Type.isMemberofElement(target.value)) {
                                return Validator.buildValidatorExpression(name, target);
                            }
                            else {
                                return [(0, exports.$expression)("false"),];
                            }
                        }
                    case "value":
                        return Validator.buildValidatorExpression(name, Build.nextProcess(data, null, data.value.value));
                    case "never":
                        return [(0, exports.$expression)("false"),];
                    case "any":
                        return [(0, exports.$expression)("true"),];
                    case "unknown":
                        return [(0, exports.$expression)("true"),];
                    case "null":
                        return [(0, exports.$expression)("\"".concat(data.value.type, "\" === ").concat(name)),];
                    case "boolean":
                        return [(0, exports.$expression)("\"".concat(data.value.type, "\" === typeof ").concat(name)),];
                    case "integer":
                        return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                            (0, exports.$expression)("\"".concat(data.value.type, "\" === typeof ").concat(name)),
                            (0, exports.$expression)("&&"), true !== Build.getSafeInteger(data) ? (0, exports.$expression)("Number.isSafeInteger") : (0, exports.$expression)("Number.isInteger"), (0, exports.$expression)("("), (0, exports.$expression)(name), (0, exports.$expression)(")")
                        ], (undefined !== data.value.minimum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(data.value.minimum)), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(name)),] : []), true), (undefined !== data.value.exclusiveMinimum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(data.value.exclusiveMinimum)), (0, exports.$expression)("<"), (0, exports.$expression)("".concat(name)),] : []), true), (undefined !== data.value.maximum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(data.value.maximum)),] : []), true), (undefined !== data.value.exclusiveMaximum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("<"), (0, exports.$expression)("".concat(data.value.exclusiveMaximum)),] : []), true), (undefined !== data.value.multipleOf ? [(0, exports.$expression)("&&"), (0, exports.$expression)("0"), (0, exports.$expression)("==="), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("%"), (0, exports.$expression)("".concat(data.value.multipleOf)),] : []), true);
                    case "number":
                        return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                            (0, exports.$expression)("\"".concat(data.value.type, "\" === typeof ").concat(name))
                        ], (true !== Build.getSafeNumber(data) ? [(0, exports.$expression)("&&"), (0, exports.$expression)("Number.isFinite"), (0, exports.$expression)("("), (0, exports.$expression)(name), (0, exports.$expression)(")"),] : []), true), (undefined !== data.value.minimum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(data.value.minimum)), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(name)),] : []), true), (undefined !== data.value.exclusiveMinimum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(data.value.exclusiveMinimum)), (0, exports.$expression)("<"), (0, exports.$expression)("".concat(name)),] : []), true), (undefined !== data.value.maximum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(data.value.maximum)),] : []), true), (undefined !== data.value.exclusiveMaximum ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("<"), (0, exports.$expression)("".concat(data.value.exclusiveMaximum)),] : []), true), (undefined !== data.value.multipleOf ? [(0, exports.$expression)("&&"), (0, exports.$expression)("0"), (0, exports.$expression)("==="), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("%"), (0, exports.$expression)("".concat(data.value.multipleOf)),] : []), true);
                    case "string":
                        return __spreadArray(__spreadArray(__spreadArray(__spreadArray([
                            (0, exports.$expression)("\"".concat(data.value.type, "\" === typeof ").concat(name))
                        ], (undefined !== data.value.minLength ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(data.value.minLength)), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(name, ".length")),] : []), true), (undefined !== data.value.maxLength ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name, ".length")), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(data.value.maxLength)),] : []), true), (type_1.Type.isPatternStringType(data.value) ? [(0, exports.$expression)("new"), (0, exports.$expression)("RegExp"), (0, exports.$expression)("("), (0, exports.$expression)(jsonable_1.Jsonable.stringify(data.value.pattern)), (0, exports.$expression)(","), (0, exports.$expression)(jsonable_1.Jsonable.stringify(Build.getRegexpFlags(data))), (0, exports.$expression)(")"), (0, exports.$expression)(".test(".concat(name, ")"))] : []), true), (type_1.Type.isFormatStringType(data.value) ? [(0, exports.$expression)("new"), (0, exports.$expression)("RegExp"), (0, exports.$expression)("("), (0, exports.$expression)(jsonable_1.Jsonable.stringify(type_1.Type.StringFormatMap[data.value.format])), (0, exports.$expression)(","), (0, exports.$expression)(jsonable_1.Jsonable.stringify(Build.getRegexpFlags(data))), (0, exports.$expression)(")"), (0, exports.$expression)(".test(".concat(name, ")"))] : []), true);
                    case "type":
                        return Validator.buildValidatorExpression(name, Build.nextProcess(data, null, data.value.define));
                    case "enum-type":
                        return __spreadArray(__spreadArray([], stringifyTokens(data.value.members), true), [(0, exports.$expression)("."), (0, exports.$expression)("includes(".concat(name, " as any)")),], false);
                    case "array":
                        return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                            (0, exports.$expression)("Array.isArray(".concat(name, ")"))
                        ], (undefined !== data.value.minItems ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(data.value.minItems)), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(name, ".length")),] : []), true), (undefined !== data.value.maxItems ? [(0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name, ".length")), (0, exports.$expression)("<="), (0, exports.$expression)("".concat(data.value.maxItems)),] : []), true), (true === data.value.uniqueItems ?
                            [
                                (0, exports.$expression)("&&"), (0, exports.$expression)("".concat(name)), (0, exports.$expression)("."), (0, exports.$expression)("map"), (0, exports.$expression)("("), (0, exports.$expression)("i"), (0, exports.$expression)("=>"),
                                (0, exports.$expression)("JSON"), (0, exports.$expression)("."), (0, exports.$expression)("stringify"), (0, exports.$expression)("("), (0, exports.$expression)("i"), (0, exports.$expression)(")"), (0, exports.$expression)(")"),
                                (0, exports.$expression)("."), (0, exports.$expression)("every"), (0, exports.$expression)("("), (0, exports.$expression)("("), (0, exports.$expression)("i"), (0, exports.$expression)(","), (0, exports.$expression)("ix"),
                                (0, exports.$expression)(","), (0, exports.$expression)("list"), (0, exports.$expression)(")"), (0, exports.$expression)("=>"), (0, exports.$expression)("ix"), (0, exports.$expression)("==="), (0, exports.$expression)("list"),
                                (0, exports.$expression)("."), (0, exports.$expression)("indexOf"), (0, exports.$expression)("("), (0, exports.$expression)("i"), (0, exports.$expression)(")"), (0, exports.$expression)(")"),
                            ] :
                            []), true), [
                            (0, exports.$expression)("&&"),
                            (0, exports.$expression)("".concat(name, ".every(")),
                            (0, exports.$expression)("i"),
                            (0, exports.$expression)("=>")
                        ], false), Validator.buildValidatorExpression("i", Build.nextProcess(data, null, data.value.items)), true), [
                            (0, exports.$expression)(")")
                        ], false);
                    case "and":
                        return kindofJoinExpression(data.value.types.map(function (i) { return evil_type_1.EvilType.Validator.isObject(i) ?
                            Define.enParenthesis(Validator.buildValidatorExpression(name, Build.nextProcess(data, null, i))) :
                            Validator.buildValidatorExpression(name, i); }), (0, exports.$expression)("&&"));
                    case "or":
                        return kindofJoinExpression(data.value.types.map(function (i) { return Validator.buildValidatorExpression(name, Build.nextProcess(data, null, i)); }), (0, exports.$expression)("||"));
                    case "interface":
                        return Validator.buildInterfaceValidator(name, Build.nextProcess(data, null, data.value));
                    case "dictionary":
                        {
                            var entry = Build.nextProcess(data, null, data.value);
                            if (Build.isDetailedDictionary(entry)) {
                                return Validator.buildInterfaceValidator(name, Build.dictionaryToInterface(entry));
                            }
                            else {
                                return __spreadArray(__spreadArray([
                                    (0, exports.$expression)("null !== ".concat(name)),
                                    (0, exports.$expression)("&&"),
                                    (0, exports.$expression)("\"object\" === typeof ".concat(name)),
                                    (0, exports.$expression)("&&"),
                                    (0, exports.$expression)("Object.values(".concat(name, ").every(")),
                                    (0, exports.$expression)("i"),
                                    (0, exports.$expression)("=>")
                                ], Validator.buildValidatorExpression("i", Build.nextProcess(data, null, data.value.valueType)), true), [
                                    (0, exports.$expression)(")"),
                                ], false);
                            }
                        }
                }
            }
        };
        Validator.buildKeyofValidator = function (name, data) {
            var target = Build.getKeyofTarget(Build.nextProcess(data, null, data.value));
            if (type_1.Type.isInterfaceDefinition(target.value)) {
                return __spreadArray(__spreadArray([], stringifyTokens(Build.getKeys(Build.nextProcess(data, null, target.value)).map(function (i) { return text_1.Text.getPrimaryKeyName(i); })), true), [(0, exports.$expression)("."), (0, exports.$expression)("includes(".concat(name, " as any)")),], false);
            }
            else if (type_1.Type.isDictionaryDefinition(target.value)) {
                if (undefined !== target.value.keyin) {
                    return __spreadArray(__spreadArray([], stringifyTokens(Build.getActualKeys(Build.nextProcess(data, null, target.value.keyin)).map(function (i) { return text_1.Text.getPrimaryKeyName(i); })), true), [(0, exports.$expression)("."), (0, exports.$expression)("includes(".concat(name, " as any)")),], false);
                }
                else {
                    return [(0, exports.$expression)("\"string\" === typeof ".concat(name)),];
                }
            }
            else if (type_1.Type.isLiteralElement(target.value)) {
                if (evil_type_1.EvilType.Validator.isObject(target.value.const)) {
                    return __spreadArray(__spreadArray([], stringifyTokens(Object.keys(target.value.const)), true), [(0, exports.$expression)("."), (0, exports.$expression)("includes(".concat(name, " as any)")),], false);
                }
                else {
                    return [(0, exports.$expression)("false"),];
                }
            }
            else {
                return [(0, exports.$expression)("\"string\" === typeof ".concat(name)),];
            }
        };
        Validator.rejectAdditionalProperties = function (name, regularKeys) {
            var list = [];
            list.push((0, exports.$expression)("&&"));
            list.push((0, exports.$expression)("Object"));
            list.push((0, exports.$expression)("."));
            list.push((0, exports.$expression)("keys"));
            list.push((0, exports.$expression)("("));
            list.push((0, exports.$expression)(name));
            list.push((0, exports.$expression)(")"));
            list.push((0, exports.$expression)("."));
            list.push((0, exports.$expression)("filter"));
            list.push((0, exports.$expression)("("));
            list.push((0, exports.$expression)("key"));
            list.push((0, exports.$expression)("=>"));
            list.push((0, exports.$expression)("!"));
            list.push.apply(list, stringifyTokens(regularKeys));
            list.push((0, exports.$expression)("."));
            list.push((0, exports.$expression)("includes(key)"));
            list.push((0, exports.$expression)(")"));
            list.push((0, exports.$expression)("."));
            list.push((0, exports.$expression)("length"));
            list.push((0, exports.$expression)("<="));
            list.push((0, exports.$expression)("0"));
            return list;
        };
        Validator.buildInterfaceValidator = function (name, data) {
            var list = [];
            var members = data.value.members;
            if (undefined !== data.value.extends) {
                data.value.extends.forEach(function (i, ix, _l) {
                    if (0 < ix) {
                        list.push((0, exports.$expression)("&&"));
                    }
                    list.push.apply(list, (0, exports.convertToExpression)(Validator.buildValidatorExpression(name, Build.nextProcess(data, null, i))));
                });
            }
            if (undefined !== data.value.extends) {
            }
            else {
                list.push((0, exports.$expression)("null !== ".concat(name)));
                list.push((0, exports.$expression)("&&"));
                list.push((0, exports.$expression)("\"object\" === typeof ".concat(name)));
            }
            Object.keys(members).forEach(function (k) {
                var key = text_1.Text.getPrimaryKeyName(k);
                var value = members[k];
                if (Build.isKindofNeverType(Build.nextProcess(data, key, value))) {
                    list.push((0, exports.$expression)("&&"));
                    list.push((0, exports.$expression)("! ".concat(jsonable_1.Jsonable.stringify(key), " in ").concat(name)));
                }
                else {
                    var base = (0, exports.convertToExpression)(Validator.buildValidatorExpression(Validator.buildObjectMember(name, key), Build.nextProcess(data, key, value)));
                    var current = type_1.Type.isOrElement(value) ?
                        Define.enParenthesis(base) :
                        base;
                    if (k === key) {
                        list.push((0, exports.$expression)("&&"));
                        list.push((0, exports.$expression)("".concat(jsonable_1.Jsonable.stringify(key), " in ").concat(name)));
                        list.push((0, exports.$expression)("&&"));
                        list.push.apply(list, current);
                    }
                    else {
                        list.push((0, exports.$expression)("&&"));
                        list.push((0, exports.$expression)("("));
                        list.push((0, exports.$expression)("! (".concat(jsonable_1.Jsonable.stringify(key), " in ").concat(name, ")")));
                        list.push((0, exports.$expression)("||"));
                        list.push.apply(list, current);
                        list.push((0, exports.$expression)(")"));
                    }
                }
            });
            if (false === Build.getAdditionalProperties(data)) {
                list.push.apply(list, Validator.rejectAdditionalProperties(name, Object.keys(data.value.members).map(function (key) { return text_1.Text.getPrimaryKeyName(key); })));
            }
            return list;
        };
        Validator.buildInlineValidator = function (name, data) {
            return __spreadArray([
                (0, exports.$expression)("(value: unknown): value is ".concat(type_1.Type.isValueDefinition(data.value) ? "typeof " + name : name, " =>"))
            ], Validator.buildValidatorExpression("value", data), true);
        };
        Validator.buildObjectValidatorGetterCoreEntry = function (data) {
            if (type_1.Type.isReferElement(data.value)) {
                return [(0, exports.$expression)(Validator.buildValidatorName(data.value.$ref)),];
            }
            else if (type_1.Type.isLiteralElement(data.value)) {
                return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isJust"),], [Build.buildLiteralAsConst(data.value.const),]);
            }
            else {
                switch (data.value.type) {
                    case "typeof":
                        return [(0, exports.$expression)(Validator.buildValidatorName(data.value.value.$ref)),];
                    case "keyof":
                        {
                            var target = Build.getKeyofTarget(Build.nextProcess(data, null, data.value));
                            if (type_1.Type.isInterfaceDefinition(target.value)) {
                                return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [Build.buildLiteralAsConst(Build.getKeys(Build.nextProcess(target, null, target.value)).map(function (i) { return text_1.Text.getPrimaryKeyName(i); })),]);
                            }
                            else if (type_1.Type.isDictionaryDefinition(target.value)) {
                                if (undefined !== target.value.keyin) {
                                    return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [Build.buildLiteralAsConst(Build.getActualKeys(Build.nextProcess(target, null, target.value.keyin)).map(function (i) { return text_1.Text.getPrimaryKeyName(i); })),]);
                                }
                                else {
                                    return [(0, exports.$expression)("EvilType.Validator.isString"),];
                                }
                            }
                            else if (type_1.Type.isLiteralElement(target.value)) {
                                if (evil_type_1.EvilType.Validator.isObject(target.value.const)) {
                                    return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [Build.buildLiteralAsConst(Object.keys(target.value.const)),]);
                                }
                                else {
                                    return [(0, exports.$expression)("EvilType.Validator.isNever"),];
                                }
                            }
                            else {
                                return [(0, exports.$expression)("EvilType.Validator.isString"),];
                            }
                        }
                    case "itemof":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [(0, exports.$expression)(data.value.value.$ref),]);
                    case "memberof":
                        {
                            var target = Build.resolveRefer(data);
                            if (!type_1.Type.isMemberofElement(target.value)) {
                                return Validator.buildObjectValidatorGetterCoreEntry(target);
                            }
                            else {
                                return [(0, exports.$expression)("EvilType.Validator.isNever"),];
                            }
                        }
                    case "never":
                        return [(0, exports.$expression)("EvilType.Validator.isNever"),];
                    case "any":
                        return [(0, exports.$expression)("EvilType.Validator.isAny"),];
                    case "unknown":
                        return [(0, exports.$expression)("EvilType.Validator.isUnknown"),];
                    case "null":
                        return [(0, exports.$expression)("EvilType.Validator.isNull"),];
                    case "boolean":
                        return [(0, exports.$expression)("EvilType.Validator.isBoolean"),];
                    case "integer":
                        var integerOptions = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (undefined !== data.value.minimum ? [(0, exports.$expression)("minimum:".concat(data.value.minimum, ",")),] : []), true), (undefined !== data.value.exclusiveMinimum ? [(0, exports.$expression)("exclusiveMinimum:".concat(data.value.exclusiveMinimum, ",")),] : []), true), (undefined !== data.value.maximum ? [(0, exports.$expression)("maximum:".concat(data.value.maximum, ",")),] : []), true), (undefined !== data.value.exclusiveMaximum ? [(0, exports.$expression)("exclusiveMaximum:".concat(data.value.exclusiveMaximum, ",")),] : []), true), (undefined !== data.value.multipleOf ? [(0, exports.$expression)("multipleOf:".concat(data.value.multipleOf, ",")),] : []), true);
                        if (0 < integerOptions.length) {
                            return __spreadArray(__spreadArray([
                                (0, exports.$expression)("EvilType.Validator.isDetailedInteger"),
                                (0, exports.$expression)("("),
                                (0, exports.$expression)("{")
                            ], integerOptions, true), [
                                (0, exports.$expression)("},"),
                                (0, exports.$expression)("".concat(jsonable_1.Jsonable.stringify(Build.getSafeNumber(data)), ",")),
                                (0, exports.$expression)(")"),
                            ], false);
                        }
                        else {
                            return [
                                Build.getSafeInteger(data) ?
                                    (0, exports.$expression)("EvilType.Validator.isSafeInteger") :
                                    (0, exports.$expression)("EvilType.Validator.isInteger"),
                            ];
                        }
                    case "number":
                        var numberOptions = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (undefined !== data.value.minimum ? [(0, exports.$expression)("minimum:".concat(data.value.minimum, ",")),] : []), true), (undefined !== data.value.exclusiveMinimum ? [(0, exports.$expression)("exclusiveMinimum:".concat(data.value.exclusiveMinimum, ",")),] : []), true), (undefined !== data.value.maximum ? [(0, exports.$expression)("maximum:".concat(data.value.maximum, ",")),] : []), true), (undefined !== data.value.exclusiveMaximum ? [(0, exports.$expression)("exclusiveMaximum:".concat(data.value.exclusiveMaximum, ",")),] : []), true), (undefined !== data.value.multipleOf ? [(0, exports.$expression)("multipleOf:".concat(data.value.multipleOf, ",")),] : []), true);
                        if (0 < numberOptions.length) {
                            return __spreadArray(__spreadArray([
                                (0, exports.$expression)("EvilType.Validator.isDetailedNumber"),
                                (0, exports.$expression)("("),
                                (0, exports.$expression)("{")
                            ], numberOptions, true), [
                                (0, exports.$expression)("},"),
                                (0, exports.$expression)("".concat(jsonable_1.Jsonable.stringify(Build.getSafeNumber(data)), ",")),
                                (0, exports.$expression)(")"),
                            ], false);
                        }
                        else {
                            return [
                                Build.getSafeNumber(data) ?
                                    (0, exports.$expression)("EvilType.Validator.isSafeNumber") :
                                    (0, exports.$expression)("EvilType.Validator.isNumber"),
                            ];
                        }
                    case "string":
                        var stringOptions = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (undefined !== data.value.minLength ? [(0, exports.$expression)("minLength:".concat(data.value.minLength, ",")),] : []), true), (undefined !== data.value.maxLength ? [(0, exports.$expression)("maxLength:".concat(data.value.maxLength, ",")),] : []), true), (type_1.Type.isPatternStringType(data.value) ? [(0, exports.$expression)("pattern:".concat(jsonable_1.Jsonable.stringify(data.value.pattern), ",")),] : []), true), (type_1.Type.isFormatStringType(data.value) ? [(0, exports.$expression)("pattern:".concat(jsonable_1.Jsonable.stringify(type_1.Type.StringFormatMap[data.value.format]), ",")), (0, exports.$expression)("pattern:".concat(jsonable_1.Jsonable.stringify(data.value.format), ",")),] : []), true);
                        if (0 < stringOptions.length) {
                            return __spreadArray(__spreadArray([
                                (0, exports.$expression)("EvilType.Validator.isDetailedString"),
                                (0, exports.$expression)("("),
                                (0, exports.$expression)("{")
                            ], stringOptions, true), [
                                (0, exports.$expression)("},"),
                                (0, exports.$expression)("regexpFlags:".concat(jsonable_1.Jsonable.stringify(Build.getRegexpFlags(data)), ",")),
                                (0, exports.$expression)(")"),
                            ], false);
                        }
                        else {
                            return [(0, exports.$expression)("EvilType.Validator.isString"),];
                        }
                    case "type":
                        return Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, null, data.value.define));
                    case "enum-type":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isEnum"),], [Build.buildLiteralAsConst(data.value.members),]);
                    case "array":
                        var arrayOptions = __spreadArray(__spreadArray(__spreadArray([], (undefined !== data.value.minItems ? [(0, exports.$expression)("minItems:".concat(data.value.minItems, ",")),] : []), true), (undefined !== data.value.maxItems ? [(0, exports.$expression)("maxItems:".concat(data.value.maxItems, ",")),] : []), true), (undefined !== data.value.uniqueItems ? [(0, exports.$expression)("maxItems:".concat(data.value.maxItems, ",")),] : []), true);
                        if (0 < arrayOptions.length) {
                            return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isArray"),], [
                                Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, null, data.value.items)),
                                __spreadArray(__spreadArray([(0, exports.$expression)("{")], arrayOptions, true), [(0, exports.$expression)("},"),], false),
                            ]);
                        }
                        else {
                            return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isArray"),], [Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, null, data.value.items)),]);
                        }
                    case "and":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isAnd"),], data.value.types.map(function (i) { return Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, null, i)); }));
                    case "or":
                        return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isOr"),], data.value.types.map(function (i) { return Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, null, i)); }));
                    case "interface":
                        return Validator.buildObjectValidator(Build.nextProcess(data, null, data.value));
                    case "dictionary":
                        {
                            var entry = Build.nextProcess(data, null, data.value);
                            if (Build.isDetailedDictionary(entry)) {
                                return Validator.buildObjectValidator(Build.dictionaryToInterface(entry));
                            }
                            else {
                                return Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isDictionaryObject"),], [Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, null, data.value.valueType)),]);
                            }
                        }
                }
            }
        };
        Validator.buildObjectValidatorGetterCore = function (data) { return (0, exports.$iblock)(Object.entries(data.value.members).map(function (i) {
            var key = text_1.Text.getPrimaryKeyName(i[0]);
            var value = Build.isKindofNeverType(Build.nextProcess(data, key, i[1])) ?
                Build.buildLiteralAsConst({ $type: "never-type-guard", }) :
                Validator.buildObjectValidatorGetterCoreEntry(Build.nextProcess(data, key, i[1]));
            return (0, exports.$line)(__spreadArray(__spreadArray([
                (0, exports.$expression)(text_1.Text.isValidIdentifier(key) ? key : JSON.stringify(key)),
                (0, exports.$expression)(":")
            ], (key === i[0] ? value : Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isOptional"),], [value,])), true), [
                (0, exports.$expression)(","),
            ], false));
        })); };
        Validator.buildObjectValidator = function (data) {
            var _a, _b;
            return ((_a = data.value.extends) !== null && _a !== void 0 ? _a : []).some(function (_) { return true; }) ? __spreadArray([
                (0, exports.$expression)("EvilType.Validator.mergeObjectValidator")
            ], Define.enParenthesis(__spreadArray(__spreadArray([], ((_b = data.value.extends) !== null && _b !== void 0 ? _b : []).map(function (i) { return (0, exports.$expression)("".concat(Validator.buildObjectValidatorObjectName(i.$ref), ",")); }), true), [
                Validator.buildObjectValidatorGetterCore(data),
            ], false)), true) :
                Define.enParenthesis([Validator.buildObjectValidatorGetterCore(data),]);
        };
        Validator.isLazyValidator = function (data) {
            if (type_1.Type.isLiteralElement(data.value)) {
                return false;
            }
            if (type_1.Type.isType(data.value)) {
                switch (data.value.type) {
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
                        return Validator.isLazyValidator(Build.nextProcess(data, null, data.value.define));
                    case "array":
                        return Validator.isLazyValidator(Build.nextProcess(data, null, data.value.items));
                    case "dictionary":
                        return undefined !== data.value.keyin || Validator.isLazyValidator(Build.nextProcess(data, null, data.value.valueType));
                    case "keyof":
                        return false;
                    case "memberof":
                        return Validator.isLazyValidator(Build.getMemberofTarget(Build.nextProcess(data, null, data.value)));
                    case "and":
                    case "or":
                        return data.value.types.some(function (i) { return Validator.isLazyValidator(Build.nextProcess(data, null, i)); });
                    case "interface":
                        return true;
                }
            }
            return true;
        };
        Validator.buildFullValidator = function (data) { return Validator.isLazyValidator(data) ? __spreadArray([], Validator.buildCall([(0, exports.$expression)("EvilType.lazy"),], [__spreadArray([(0, exports.$expression)("()"), (0, exports.$expression)("=>")], Validator.buildObjectValidatorGetterCoreEntry(data), true),]), true) :
            Validator.buildObjectValidatorGetterCoreEntry(data); };
        Validator.isValidatorTarget = function (define) {
            return !(type_1.Type.isValueDefinition(define) && false === define.validator);
        };
        Validator.buildValidator = function (data) {
            if ("simple" === data.options.validatorOption) {
                var result_2 = [
                    (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(data), true), [
                        (0, exports.$expression)("const"),
                        (0, exports.$expression)(Validator.buildValidatorName(data.key)),
                        (0, exports.$expression)("=")
                    ], false), Validator.buildInlineValidator(data.key, data), true))
                ];
                return result_2;
            }
            if ("full" === data.options.validatorOption) {
                var result_3 = __spreadArray(__spreadArray([], Build.buildExport(data), true), [
                    (0, exports.$expression)("const"),
                    (0, exports.$expression)(Validator.buildValidatorName(data.key)),
                ], false);
                if ("interface" === data.value.type) {
                    result_3.push.apply(result_3, __spreadArray([(0, exports.$expression)("=")], Validator.buildCall([(0, exports.$expression)("EvilType.lazy"),], [
                        __spreadArray([
                            (0, exports.$expression)("()"),
                            (0, exports.$expression)("=>")
                        ], Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isSpecificObject"),], __spreadArray([
                            (0, exports.$expression)(Validator.buildObjectValidatorObjectName(data.key))
                        ], (false === Build.getAdditionalProperties(Build.nextProcess(data, null, data.value)) ? [(0, exports.$expression)("false"),] : []), true)), true)
                    ])
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
                    , false));
                }
                else if ("value" === data.value.type) {
                    if (type_1.Type.isReferElement(data.value.value)) {
                        result_3.push((0, exports.$expression)("="), (0, exports.$expression)(Validator.buildValidatorName(data.value.value.$ref)));
                    }
                    else {
                        result_3.push.apply(result_3, __spreadArray([(0, exports.$expression)("=")], Validator.buildCall([(0, exports.$expression)("EvilType.Validator.isJust"),], [(0, exports.$expression)(data.key),]), false));
                    }
                }
                else {
                    result_3.push.apply(result_3, __spreadArray(__spreadArray(__spreadArray([], [(0, exports.$expression)(":"), (0, exports.$expression)("EvilType.Validator.IsType<".concat(data.key, ">"))], false), [(0, exports.$expression)("=")], false), Validator.buildFullValidator(Build.nextProcess(data, null, data.value)), false));
                }
                return [(0, exports.$line)(result_3)];
            }
            return [];
        };
        Validator.buildValidatorObject = function (data) {
            if ("full" === data.options.validatorOption) {
                var result_4 = [
                    (0, exports.$line)(__spreadArray(__spreadArray(__spreadArray([], Build.buildExport(data), true), [
                        (0, exports.$expression)("const"),
                        (0, exports.$expression)(Validator.buildObjectValidatorObjectName(data.key)),
                        (0, exports.$expression)(":"),
                        (0, exports.$expression)("EvilType.Validator.ObjectValidator<".concat(data.key, ">")),
                        (0, exports.$expression)("=")
                    ], false), Validator.buildObjectValidator(data), true))
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
                options: source.options,
                schema: schema,
                definitions: Build.makeDefinitionFlatMap(source.defines),
                path: "",
                key: "",
                value: source.defines,
            });
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
        Schema.build = function (data) {
            var result = {};
            if (data.schema.$id) {
                result["$id"] = data.schema.$id;
            }
            result["$schema"] = "http://json-schema.org/draft-07/schema#";
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
                switch (value.type) {
                    case "value":
                        result[key] = Schema.buildValue(Build.nextProcess(data, null, value));
                        break;
                    case "code":
                        //  nothing
                        break;
                    case "namespace":
                        {
                            var members = Schema.buildDefinitions(Build.nextProcess(data, key, value.members));
                            Object.entries(members).forEach(function (j) { return result["".concat(key, ".").concat(j[0])] = j[1]; });
                        }
                        break;
                    default:
                        result[key] = Schema.buildType(Build.nextProcess(data, null, value));
                }
            });
            return result;
        };
        Schema.buildLiteral = function (data) {
            var result = {
                const: data.value.const,
            };
            return result;
        };
        Schema.buildValue = function (data) {
            return type_1.Type.isLiteralElement(data.value.value) ?
                Schema.buildLiteral(Build.nextProcess(data, null, data.value.value)) :
                Schema.buildRefer(Build.nextProcess(data, null, data.value.value));
        };
        Schema.buildType = function (data) {
            if (type_1.Type.isLiteralElement(data.value)) {
                return Schema.buildLiteral(Build.nextProcess(data, null, data.value));
            }
            switch (data.value.type) {
                case "never":
                case "any":
                case "unknown":
                case "null":
                case "boolean":
                case "integer":
                case "number":
                case "string":
                    return Schema.buildPrimitiveType(Build.nextProcess(data, null, data.value));
                case "type":
                    return Schema.buildTypeOrRefer(Build.nextProcess(data, null, data.value.define));
                case "interface":
                    return Schema.buildInterface(Build.nextProcess(data, null, data.value));
                case "dictionary":
                    {
                        var entry = Build.nextProcess(data, null, data.value);
                        if (Build.isDetailedDictionary(entry)) {
                            return Schema.buildInterface(Build.dictionaryToInterface(entry));
                        }
                        else {
                            return Schema.buildDictionary(entry);
                        }
                    }
                case "enum-type":
                    return Schema.buildEnumType(Build.nextProcess(data, null, data.value));
                case "typeof":
                    return Schema.buildTypeOf(Build.nextProcess(data, null, data.value));
                case "keyof":
                    return Schema.buildKeyOf(Build.nextProcess(data, null, data.value));
                case "itemof":
                    return Schema.buildItemOf(Build.nextProcess(data, null, data.value));
                case "memberof":
                    return Schema.buildMemberOf(Build.nextProcess(data, null, data.value));
                case "array":
                    return Schema.buildArray(Build.nextProcess(data, null, data.value));
                case "or":
                    return Schema.buildOr(Build.nextProcess(data, null, data.value));
                case "and":
                    return Schema.buildAnd(Build.nextProcess(data, null, data.value));
            }
            var result = {};
            return result;
        };
        Schema.setCommonProperties = function (result, data) {
            if (data.value.default) {
                result["default"] = data.value.default;
            }
            if (data.value.title) {
                result["title"] = data.value.title;
            }
            if (data.value.description) {
                result["description"] = data.value.description;
            }
            return result;
        };
        Schema.buildPrimitiveType = function (data) {
            var result = {};
            switch (data.value.type) {
                case "any":
                case "unknown":
                    break;
                default:
                    result["type"] = data.value.type;
                    break;
            }
            if ("integer" === data.value.type || "number" === data.value.type) {
                if (undefined !== data.value.minimum) {
                    result["minimum"] = data.value.minimum;
                }
                if (undefined !== data.value.exclusiveMinimum) {
                    result["exclusiveMinimum"] = data.value.exclusiveMinimum;
                }
                if (undefined !== data.value.maximum) {
                    result["maximum"] = data.value.maximum;
                }
                if (undefined !== data.value.exclusiveMaximum) {
                    result["exclusiveMaximum"] = data.value.exclusiveMaximum;
                }
                if (undefined !== data.value.multipleOf) {
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
            if ("string" === data.value.type) {
                if (undefined !== data.value.minLength) {
                    result["minLength"] = data.value.minLength;
                }
                if (undefined !== data.value.maxLength) {
                    result["maxLength"] = data.value.maxLength;
                }
                if ("pattern" in data.value) {
                    result["pattern"] = data.value.pattern;
                }
                if ("format" in data.value) {
                    result["pattern"] = type_1.Type.StringFormatMap[data.value.format];
                    result["format"] = data.value.format;
                }
                // これは TypeScript のコードでしか使わない値なので JSON Schema には吐かない
                // if ("regexpFlags" in data.value && "string" === typeof data.value.regexpFlags)
                // {
                //     result["regexpFlags"] = data.value.regexpFlags;
                // }
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildInterface = function (data) {
            var properties = {};
            var result = {
                type: "object",
                properties: properties,
                //additionalProperties: false,
                required: Object.keys(data.value.members).filter(function (i) { return !(i.endsWith("?") || Build.isKindofNeverType(Build.nextProcess(data, i, data.value.members[i]))); }),
            };
            var notRequired = [];
            if (data.value.extends) {
                // additionalProperties: false と allOf の組み合わせは残念な事になるので極力使わない。( additionalProperties: false が、 allOf の参照先の properties も参照元の Properties も使えなくしてしまうので、この組み合わせは使えたもんじゃない。 )
                var allOf_1 = [];
                data.value.extends.forEach(function (i) {
                    var current = Build.resolveRefer(Build.nextProcess(data, null, i));
                    if (type_1.Type.isInterfaceDefinition(current.value)) {
                        var base = Schema.buildInterface(current);
                        Object.assign(properties, base["properties"]);
                        var required_1 = result["required"];
                        required_1.push.apply(required_1, base["required"].filter(function (j) { return !required_1.includes(j); }));
                        var not = base["not"];
                        if (jsonable_1.Jsonable.isJsonableObject(not)) {
                            var baseNotRequired = not["required"];
                            if (evil_type_1.EvilType.Validator.isArray(evil_type_1.EvilType.Validator.isString)(baseNotRequired)) {
                                notRequired.push.apply(notRequired, baseNotRequired);
                            }
                        }
                    }
                    else {
                        allOf_1.push(Schema.buildRefer(Build.nextProcess(data, null, i)));
                    }
                });
                if (allOf_1.some(function (_i) { return true; })) {
                    result["allOf"] = allOf_1;
                }
            }
            Object.entries(data.value.members).forEach(function (i) {
                var key = text_1.Text.getPrimaryKeyName(i[0]);
                var value = i[1];
                if (Build.isKindofNeverType(Build.nextProcess(data, key, value))) {
                    notRequired.push(key);
                }
                else {
                    properties[key] = Schema.buildTypeOrRefer(Build.nextProcess(data, key, value));
                }
            });
            var additionalProperties = Build.getAdditionalProperties(data);
            if ("boolean" === typeof additionalProperties) {
                result["additionalProperties"] = additionalProperties;
            }
            if (notRequired.some(function (_) { return true; })) {
                result["not"] =
                    {
                        required: notRequired,
                    };
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildDictionary = function (data) {
            var _a;
            var result = {
                type: "object",
            };
            var valueType = Schema.buildTypeOrRefer(Build.nextProcess(data, null, data.value.valueType));
            if (undefined === data.value.keyin) {
                result["additionalProperties"] = valueType;
            }
            else {
                // ここには到達しない
                var properties_1 = {};
                var keys = Build.getActualKeys(Build.nextProcess(data, null, data.value.keyin));
                keys.map(function (i) { return text_1.Text.getPrimaryKeyName(i); }).forEach(function (key) { return properties_1[key] = valueType; });
                result["properties"] = properties_1;
                switch ((_a = data.value.optionality) !== null && _a !== void 0 ? _a : "as-is") {
                    case "as-is":
                        result["required"] = keys.filter(function (i) { return !i.endsWith("?"); });
                        break;
                    case "partial":
                        result["required"] = [];
                        break;
                    case "required":
                        result["required"] = keys.map(function (i) { return text_1.Text.getPrimaryKeyName(i); });
                        break;
                }
                var additionalProperties = Build.getAdditionalProperties(data);
                if ("boolean" === typeof additionalProperties) {
                    result["additionalProperties"] = additionalProperties;
                }
            }
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
            var literal = Build.getLiteral(Build.nextProcess(data, null, data.value.value));
            if (literal) {
                result["const"] = literal.const;
            }
            else {
                console.error("\uD83D\uDEAB Can not resolve refer: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref })));
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildKeyOf = function (data) {
            var result = {};
            var target = Build.getKeyofTarget(Build.nextProcess(data, null, data.value));
            if (type_1.Type.isInterfaceDefinition(target.value)) {
                result["enum"] = Build.getKeys(Build.nextProcess(target, null, target.value)).map(function (i) { return text_1.Text.getPrimaryKeyName(i); });
            }
            else if (type_1.Type.isDictionaryDefinition(target.value)) {
                if (undefined !== target.value.keyin) {
                    result["enum"] = Build.getActualKeys(Build.nextProcess(target, null, target.value.keyin)).map(function (i) { return text_1.Text.getPrimaryKeyName(i); });
                }
                else {
                    result["type"] = "string";
                }
            }
            else if (type_1.Type.isLiteralElement(target.value)) {
                if (evil_type_1.EvilType.Validator.isObject(target.value.const)) {
                    result["enum"] = Object.keys(target.value.const);
                }
                else {
                    result["enum"] = [];
                }
            }
            else {
                result["type"] = "string";
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildItemOf = function (data) {
            var result = {};
            var literal = Build.getLiteral(Build.nextProcess(data, null, data.value.value));
            if (literal) {
                if (Array.isArray(literal.const)) {
                    result["enum"] = literal.const;
                }
                else {
                    console.error("\uD83D\uDEAB Not array itemof: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref, literal: literal.const })));
                }
            }
            else {
                console.error("\uD83D\uDEAB Can not resolve refer: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref })));
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildMemberOf = function (data) {
            var target = Build.getMemberofTarget(data);
            if (type_1.Type.isMemberofElement(target.value)) {
                console.error("\uD83D\uDEAB Can not resolve memberof: ".concat(JSON.stringify({ path: data.path, $ref: data.value.value.$ref, key: data.value.key, })));
                var result_5 = {};
                return Schema.setCommonProperties(result_5, data);
            }
            else {
                return Schema.buildTypeOrRefer(target);
            }
        };
        Schema.buildRefer = function (data) {
            var _a;
            var path = Build.getAbsolutePath(data, data.value);
            var result = {
                $ref: (_a = Schema.resolveExternalRefer(data, path)) !== null && _a !== void 0 ? _a : "#/".concat(Const.definitions, "/").concat(path),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildArray = function (data) {
            var result = {
                type: "array",
                items: Schema.buildTypeOrRefer(Build.nextProcess(data, null, data.value.items)),
            };
            if (undefined !== data.value.minItems) {
                result["minItems"] = data.value.minItems;
            }
            if (undefined !== data.value.maxItems) {
                result["maxItems"] = data.value.maxItems;
            }
            if (undefined !== data.value.uniqueItems) {
                result["uniqueItems"] = data.value.uniqueItems;
            }
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildOr = function (data) {
            var result = {
                oneOf: data.value.types.map(function (i) { return Schema.buildTypeOrRefer(Build.nextProcess(data, null, i)); }),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildAnd = function (data) {
            var result = {
                allOf: data.value.types.map(function (i) { return Schema.buildTypeOrRefer(Build.nextProcess(data, null, i)); }),
            };
            return Schema.setCommonProperties(result, data);
        };
        Schema.buildTypeOrRefer = function (data) {
            return type_1.Type.isReferElement(data.value) ?
                Schema.buildRefer(Build.nextProcess(data, null, data.value)) :
                Schema.buildType(Build.nextProcess(data, null, data.value));
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
                return __spreadArray([], code.expressions.map(function (i) { return Format.getTokens(i); }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []), true);
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
            var options = data.options, indentDepth = data.indentDepth, result_6 = data.result, buffer = data.buffer, tokens = data.tokens, i = data.i;
            ++i;
            if (data.i + 1 < tokens.length && maxLineLength <= Format.temporaryAssembleLine({ options: options, indentDepth: indentDepth, result: result_6, buffer: buffer, tokens: tokens, i: i, }, 1).length) {
                return !config_json_1.default.lineUnbreakableTokens.heads.includes(tokens[data.i]) && !config_json_1.default.lineUnbreakableTokens.tails.includes(tokens[data.i + 1]);
            }
            if (data.i + 2 < tokens.length && maxLineLength <= Format.temporaryAssembleLine({ options: options, indentDepth: indentDepth, result: result_6, buffer: buffer, tokens: tokens, i: i, }, 2).length) {
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
        var _a, _b;
        var currentIndent = Format.buildIndent(options, indentDepth);
        var returnCode = Format.getReturnCode(options);
        var result = "";
        if ("allman" === options.indentStyle) {
            if (0 < ((_a = code.header) !== null && _a !== void 0 ? _a : []).length) {
                result += currentIndent + Format.expressions(code.header) + returnCode;
            }
            result += currentIndent + "{" + returnCode;
        }
        else {
            if (0 < ((_b = code.header) !== null && _b !== void 0 ? _b : []).length) {
                result += currentIndent + Format.expressions(code.header) + " " + "{" + returnCode;
            }
        }
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
            var code = __spreadArray(__spreadArray(__spreadArray([], (0, exports.$comment)(typeSource), true), Build.Define.buildImports(typeSource.imports), true), Build.Define.buildDefineNamespaceCore(Build.Define.makeProcess(typeSource)), true);
            var result_7 = Format.text(typeSource.options, 0, code);
            fs_1.default.writeFileSync(resolvePath(typeSource.options.outputFile), result_7, { encoding: "utf-8" });
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