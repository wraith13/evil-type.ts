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
    export const next = (name: string, listner: Listener | undefined): Listener | undefined =>
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
}