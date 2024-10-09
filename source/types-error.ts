export namespace TypesError
{
    export interface Error
    {
        type: "solid" | "fragment";
        path: string;
        requiredType: string;
        actualValue: string;
    }
    export interface Listener
    {
        path: string;
        matchRate: { [path: string]: boolean | number; }; // true: matched, false: error, number: rate
        errors: Error[];
    }
    export const makeListener = (path: string = ""): Listener =>
    ({
        path,
        matchRate: { },
        errors: [ ],
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
    {
        const base = path.includes("#") ? path: `${path}#`;
        const separator = base.endsWith("#") || "string" !== typeof name ? "": ".";
        const tail = "string" === typeof name ? name: `[${name}]`;
        return base +separator +tail;
    };
    export const getPathDepth = (path: string) =>
        path.split(".").length + path.split("[").length -2;
    export const getType = (isType: ((v: unknown, listner?: TypesError.Listener) => boolean)) =>
    {
        const transactionListner = makeListener();
        isType(undefined, transactionListner);
        return transactionListner.errors
            .map(i => i.requiredType.split(" | "))
            .reduce((a, b) => [...a, ...b], [])
            .filter((i, ix, list) => ix === list.indexOf(i));
    };
    export const isMtached = (matchRate: boolean | number) => true === matchRate;
    export const matchRateToNumber = (matchRate: boolean | number): number =>
    {
        switch(matchRate)
        {
        case false:
            return 0;
        case true:
            return 1;
        default:
            return matchRate;
        }
    }
    export const setMatchRate = (listner: Listener | undefined, matchRate: boolean | number) =>
    {
        if (listner)
        {
            listner.matchRate[listner.path] = matchRate;
        }
        return isMtached(matchRate);
    };
    export const getMatchRate = (listner: Listener, path: string = listner.path) =>
    {
        if (path in listner.matchRate)
        {
            return listner.matchRate[path];
        }
        return calculateMatchRate(listner, path);
    };
    export const calculateMatchRate = (listner: Listener, path: string = listner.path) =>
    {
        const depth = getPathDepth(path);
        const childrenKeys = Object.keys(listner.matchRate)
            .filter(i => 0 === i.indexOf(path) && getPathDepth(i) === depth +1);
        const length = childrenKeys.length;
        const sum = childrenKeys
            .map(i => listner.matchRate[i])
            .map(i => matchRateToNumber(i))
            .reduce((a, b) => a +b, 0.0);
        const result = 0 < length ? sum /length: true;
        if (true === result || 1.0 <= result)
        {
            console.error("🦋 FIXME: \"MatchWithErrors\": " +JSON.stringify({ sum, length, result, listner}));
        }
        return listner.matchRate[path] = result;
    };
    export const setMatch = (listner: Listener | undefined) =>
    {
        if (listner)
        {
            const paths = Object.keys(listner.matchRate)
                .filter(path => 0 === path.indexOf(listner.path));
            if (paths.every(path => isMtached(listner.matchRate[path])))
            {
                paths.forEach(path => delete listner.matchRate[path]);
            }
        }
        setMatchRate(listner, true);
    };
    export const raiseError = (listner: Listener, requiredType: string | (() => string), actualValue: unknown) =>
    {
        setMatchRate(listner, false);
        listner.errors.push
        ({
            type: "solid",
            path: listner.path,
            requiredType: "string" === typeof requiredType ? requiredType: requiredType(),
            actualValue: valueToString(actualValue),
        });
        return false;
    };
    export const orErros = (listner: Listener, modulus: number, errors: Error[], fullErrors: Error[]) =>
    {
        const paths = errors.map(i => i.path).filter((i, ix, list) => ix === list.indexOf(i));
        listner.errors.push
        (
            ...paths.map
            (
                path =>
                ({
                    type: modulus <= fullErrors.filter(i => "solid" === i.type && i.path === path).length ?
                        "solid" as const:
                        "fragment" as const,
                    path,
                    requiredType: errors
                        .filter(i => i.path === path)
                        .map(i => i.requiredType)
                        .map(i => i.split(" | "))
                        .reduce((a, b) => [...a, ...b], [])
                        .filter((i, ix, list) => ix === list.indexOf(i))
                        .join(" | "),
                    actualValue: errors.filter(i => i.path === path).map(i => i.actualValue)[0],
                })
            )
        );
    };
    export const andErros = (listner: Listener, modulus: number, errors: Error[], fullErrors: Error[]) =>
    {
        // このコードは現状、 orErros をコピーしただけのモックです。
        const paths = errors.map(i => i.path).filter((i, ix, list) => ix === list.indexOf(i));
        listner.errors.push
        (
            ...paths.map
            (
                path =>
                ({
                    type: modulus <= fullErrors.filter(i => "solid" === i.type && i.path === path).length ?
                        "solid" as const:
                        "fragment" as const,
                    path,
                    requiredType: errors
                        .filter(i => i.path === path)
                        .map(i => i.requiredType)
                        .map(i => i.split(" & "))
                        .reduce((a, b) => [...a, ...b], [])
                        .filter((i, ix, list) => ix === list.indexOf(i))
                        .join(" & "),
                    actualValue: errors.filter(i => i.path === path).map(i => i.actualValue)[0],
                })
            )
        );
    };
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
