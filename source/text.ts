export module Text
{
    export const getNameSpace = (name: string) =>
        name.split(".").slice(0, -1).join(".");
    export const getNameBody = (name: string) =>
        name.split(".").slice(-1)[0];
    export const toUpperCamelCase = (name: string) =>
        `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;
    export const getPrimaryKeyName = (key: string) =>key.replace(/\?$/, "");
}
