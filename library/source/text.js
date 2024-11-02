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
    Text.toLowerCamelCase = function (name) {
        return "".concat(name.slice(0, 1).toLowerCase()).concat(name.slice(1));
    };
    Text.getPrimaryKeyName = function (key) { return key.replace(/\?$/, ""); };
    Text.isValidIdentifier = function (identifier) {
        return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(identifier);
    };
})(Text || (exports.Text = Text = {}));
//# sourceMappingURL=text.js.map