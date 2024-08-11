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
    export const getMatchRate = (listner: Listener, path: string = listner.path) =>
    {
        if (path in listner.matchRate)
        {
            return listner.matchRate[path];
        }
        const depth = getPathDepth(path);
        const childrenKeys = Object.keys(listner.matchRate).filter(i => 0 === i.indexOf(path) && getPathDepth(i) +1 === depth);
        return listner.matchRate[path] = childrenKeys.map(i => listner.matchRate[i]).reduce((a, b) => a +b, 0.0) /childrenKeys.length;
    };
    export const setMatch = (listner: Listener | undefined) => setMatchRate(listner, 1.0);
    export const raiseError = (listner: Listener, requiredType: string | (() => string), actualValue: unknown) =>
    {
        setMatchRate(listner, 0.0);
        listner.errors.push
        ({
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType: requiredType(),
            actualValue: valueToString(actualValue),
        });
        return false;
    }
    export const valueToString = (value: unknown) =>
        undefined === value ? "undefined": JSON.stringify(value);
    export const withErrorHandling = (isMatchType: boolean, listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) =>
    {
        if (listner)
        {
            if (isMatchType)
            {
                setMatch(listner);
            }
            else
            {
                raiseError(listner, requiredType, actualValue);
            }
        }
        return isMatchType;
    };
}
