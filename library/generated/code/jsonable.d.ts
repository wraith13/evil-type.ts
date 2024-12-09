import { EvilType } from "../../common/evil-type";
export { EvilType };
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
    const isJsonableArray: EvilType.Validator.IsType<JsonableArray>;
    const isJsonableObject: EvilType.Validator.IsType<JsonableObject>;
    const isJsonable: EvilType.Validator.IsType<Jsonable>;
}
