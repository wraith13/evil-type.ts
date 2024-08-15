export declare namespace TypeError {
    interface Error {
        path: string;
        requiredType: string;
        actualValue: string;
    }
    interface Listener {
        path: string;
        matchRate: {
            [path: string]: number;
        };
        errors: Error[];
    }
    const makeListener: (path?: string) => Listener;
    const nextListener: (name: string | number, listner: Listener | undefined) => Listener | undefined;
    const makePath: (path: string, name: string | number) => string;
    const getPathDepth: (path: string) => number;
    const getType: (isType: (v: unknown, listner?: TypeError.Listener) => boolean) => string[];
    const setMatchRate: (listner: Listener | undefined, matchRate: number) => boolean;
    const getMatchRate: (listner: Listener, path?: string) => number;
    const calculateMatchRate: (listner: Listener, path?: string) => number;
    const setMatch: (listner: Listener | undefined) => boolean;
    const raiseError: (listner: Listener, requiredType: string | (() => string), actualValue: unknown) => boolean;
    const valueToString: (value: unknown) => string;
    const withErrorHandling: (isMatchType: boolean, listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) => boolean;
}
