import { EvilType } from "../../common/evil-type";
export declare namespace Jsonable {
    type JsonableValue = null | boolean | number | string;
    type JsonableArray = Jsonable[];
    type JsonableObject = {
        [key: string]: Jsonable;
    };
    type Jsonable = JsonableValue | JsonableArray | JsonableObject;
    const parse: (json: string) => Jsonable;
    const stringify: (value: Jsonable, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, space?: string | number) => string;
    type JsonablePartial<Target extends JsonableObject> = {
        [key in keyof Target]?: Target[key];
    } & JsonableObject;
    const isJsonableValue: EvilType.Validator.IsType<JsonableValue>;
    const isJsonableArray: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is JsonableArray;
    const isJsonableObject: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is JsonableObject;
    const isJsonable: (value: unknown, listner?: EvilType.Validator.ErrorListener) => value is Jsonable;
}
