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
//# sourceMappingURL=text.js.map