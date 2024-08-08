export module TypeError
{
    export interface Entry
    {
        path: string;
        requiredType: string;
        actualValue: string;
    }
    export interface Listener
    {
        path: string;
        errors: Entry[];
    }
    export const makeListener = (path: string = ""): Listener =>
    ({
        path,
        errors: [],
    });
    export const nextListener = (name: string | number, listner: Listener | undefined): Listener | undefined =>
        listner ?
        {
            path: makePath(listner.path, name),
            errors: listner.errors,
        }:
        undefined;
    export const makePath = (path: string, name: string | number) =>
        "string" === typeof name ?
                    `${path}.${name}`:
                    `${path}[${name}]`;
    export const getPathDepth = (path: string) =>
        path.split(".").length + path.split("[").length -2;
    export const raiseError = (listner: Listener, requiredType: string, actualValue: unknown) =>
    {
        listner.errors.push
        ({
            path: listner.path,
            requiredType,
            actualValue: valueToString(actualValue),
        });
        return false;
    }
    export const valueToString = (value: unknown) =>
        undefined === value ? "undefined": JSON.stringify(value);
}
