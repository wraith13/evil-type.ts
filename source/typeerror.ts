export module TypeError
{
    export interface MatchResult
    {
        result: "match";
        path: string;
    }
    export interface ErrorResult
    {
        result: "error";
        path: string;
        requiredType: string;
        actualValue: string;
    }
    export type Result = MatchResult | ErrorResult;
    export interface Listener
    {
        path: string;
        results: Result[];
    }
    export const makeListener = (path: string = ""): Listener =>
    ({
        path,
        results: [],
    });
    export const nextListener = (name: string | number, listner: Listener | undefined): Listener | undefined =>
        listner ?
        {
            path: makePath(listner.path, name),
            results: listner.results,
        }:
        undefined;
    export const makePath = (path: string, name: string | number) =>
        "string" === typeof name ?
                    `${path}.${name}`:
                    `${path}[${name}]`;
    export const getPathDepth = (path: string) =>
        path.split(".").length + path.split("[").length -2;
    export const getType = (isType: ((v: unknown, listner?: TypeError.Listener) => boolean)) =>
    {
        const transactionListner = makeListener();
        isType(undefined, transactionListner);
        return transactionListner.results
            .filter(i => "error" === i.result)
            .map(i => i.requiredType.split(" | "))
            .reduce((a, b) => [...a, ...b], [])
            .filter((i, ix, list) => ix === list.indexOf(i));
    };
    export const raiseError = (listner: Listener, requiredType: string | ((v: unknown, listner?: TypeError.Listener) => boolean), actualValue: unknown) =>
    {
        listner.results.push
        ({
            result: "error",
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType: getType(requiredType).join(" | "),
            actualValue: valueToString(actualValue),
        });
        return false;
    }
    export const valueToString = (value: unknown) =>
        undefined === value ? "undefined": JSON.stringify(value);
}
