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
        "string" === name ?
                    `${path}.${name}`:
                    `${path}[${name}]`;
    export const raiseError = <T extends boolean>(listner: Listener | undefined, requiredType: string, actualValue: string): false =>
    {
        if (listner)
        {
            listner.errors.push
            ({
                path: listner.path,
                requiredType,
                actualValue,
            });
        }
        return false;
    }
    export const valueToString = (value: unknown) =>
        undefined === value ? "undefined": JSON.stringify(value);
}
