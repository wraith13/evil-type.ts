export declare namespace TypesError {
    interface Error {
        type: "solid" | "fragment";
        path: string;
        requiredType: string;
        actualValue: string;
    }
    interface Listener {
        path: string;
        matchRate: {
            [path: string]: boolean | number;
        };
        errors: Error[];
    }
    const makeListener: (path?: string) => Listener;
    const nextListener: (name: string | number, listner: Listener | undefined) => Listener | undefined;
    const makePath: (path: string, name: string | number) => string;
    const getPathDepth: (path: string) => number;
    const getType: (isType: (v: unknown, listner?: TypesError.Listener) => boolean) => string[];
    const setMatchRate: (listner: Listener | undefined, matchRate: boolean | number) => boolean;
    const getMatchRate: (listner: Listener, path?: string) => number | boolean;
    const calculateMatchRate: (listner: Listener, path?: string) => number;
    const setMatch: (listner: Listener | undefined) => void;
    const raiseError: (listner: Listener, requiredType: string | (() => string), actualValue: unknown) => boolean;
    const aggregateErros: (listner: Listener, modulus: number, errors: Error[], fullErrors: Error[]) => void;
    const valueToString: (value: unknown) => string;
    const withErrorHandling: (isMatchType: boolean, listner: Listener | undefined, requiredType: string | (() => string), actualValue: unknown) => boolean;
}
