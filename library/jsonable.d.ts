export declare namespace Jsonable {
    type JsonableValue = null | boolean | number | string;
    const isJsonableValue: (value: unknown) => value is JsonableValue;
    type JsonableArray = Jsonable[];
    const isJsonableArray: (value: unknown) => value is JsonableArray;
    interface JsonableObject {
        [key: string]: Jsonable;
    }
    const isJsonableObject: (value: unknown) => value is JsonableObject;
    type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    const isJsonable: (value: unknown) => value is Jsonable;
    const parse: (json: string) => Jsonable;
    const stringify: (value: Jsonable) => string;
    type JsonablePartial<Target> = {
        [key in keyof Target]?: Target[key];
    } & JsonableObject;
}
