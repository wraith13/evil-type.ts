export module TypeError
{
    export interface Error
    {
        path: string;
        requiredType: string;
        actualValue: string;
    }
    export interface Listener
    {
        path: string;
        matchRate: { [path: string]: number; };
        errors: Error[];
    }
    export const makeListener = (path: string = ""): Listener =>
    ({
        path,
        matchRate: { },
        errors: [],
    });
    export const nextListener = (name: string | number, listner: Listener | undefined): Listener | undefined =>
        listner ?
        {
            path: makePath(listner.path, name),
            matchRate: listner.matchRate,
            errors: listner.errors,
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
        return transactionListner.errors
            .map(i => i.requiredType.split(" | "))
            .reduce((a, b) => [...a, ...b], [])
            .filter((i, ix, list) => ix === list.indexOf(i));
    };
    export const setMatchRate = (listner: Listener | undefined, matchRate: number) =>
    {
        if (listner)
        {
            listner.matchRate[listner.path] = matchRate;
        }
        return 1.0 <= matchRate;
    };
    export const setMatch = (listner: Listener | undefined) => setMatchRate(listner, 1.0);
    export const raiseError = (listner: Listener, requiredType: string | ((v: unknown, listner?: TypeError.Listener) => boolean), actualValue: unknown) =>
    {
        setMatchRate(listner, 0.0);
        listner.errors.push
        ({
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType: getType(requiredType).join(" | "),
            actualValue: valueToString(actualValue),
        });
        return false;
    }
    export const valueToString = (value: unknown) =>
        undefined === value ? "undefined": JSON.stringify(value);
}
