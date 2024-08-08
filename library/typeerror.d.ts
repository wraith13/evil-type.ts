export declare namespace TypeError {
    interface Entry {
        path: string;
        requiredType: string;
        actualValue: string;
    }
    interface Listener {
        path: string;
        errors: Entry[];
    }
    const makeListener: (path?: string) => Listener;
    const nextListener: (name: string | number, listner: Listener | undefined) => Listener | undefined;
    const makePath: (path: string, name: string | number) => string;
    const getPathDepth: (path: string) => number;
    const raiseError: (listner: Listener, requiredType: string, actualValue: unknown) => boolean;
    const valueToString: (value: unknown) => string;
}
