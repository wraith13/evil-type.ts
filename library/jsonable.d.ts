export declare namespace Jsonable {
    type JsonableValue = null | boolean | number | string;
    const isJsonableValue: (value: unknown) => value is JsonableValue;
    interface JsonableObject {
        [key: string]: Jsonable;
    }
    const isJsonableObject: (value: unknown) => value is JsonableObject;
    type Jsonable = JsonableValue | Jsonable[] | JsonableObject;
    const isJsonable: (value: unknown) => value is Jsonable;
    type JsonablePartial<Target> = {
        [key in keyof Target]?: Target[key];
    } & JsonableObject;
    const parse: (json: string) => Jsonable;
    const stringify: (value: Jsonable) => string;
}
