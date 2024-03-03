export const isBoolean = (value: any): value is boolean => "boolean" === typeof value;
export const isNumber = (value: any): value is number => "number" === typeof value;
export const isString = (value: any): value is number => "string" === typeof value;
export const isValueType = <V>(cv: V) => (value: any): value is V => cv === value;
export const isAnd = <TypeA, TypeB>(isA: ((value: unknown) => value is TypeA), isB: ((value: unknown) => value is TypeB)) =>
    (value: unknown): value is TypeA & TypeB => isA(value) && isB(value);
export const isOr = <TypeA, TypeB>(isA: ((value: unknown) => value is TypeA), isB: ((value: unknown) => value is TypeB)) =>
    (value: unknown): value is TypeA | TypeB => isA(value) || isB(value);
export const isNever = (data: any, key: string) => ! (key in data);
export const isOptionalOr = <TypeA>(isA: ((value: unknown) => value is TypeA)) =>
    (data: any, key: string) => ( isNever(data, key) || isA(data[key]));
export interface ValidateResultEntry
{
    key: string;
    requiredType: string;
    actualData: unknown;
}
export interface ValidateResult
{
    isValid: boolean; // === (this.result.length <= 0)
    result: ValidateResultEntry[];
}
export const validateType =
    (requiredType: ValidateResultEntry["requiredType"], isA: ((data: any, key: string) => boolean)) =>
    (data: any, key: string): ValidateResultEntry | null =>
    {
        var result: ValidateResultEntry | null = null;
        if ( ! isA(data, key))
        {
            result =
            {
                key,
                requiredType,
                actualData: data[key],
            };
        }
        return result;
    };
export interface ValueTypeValidator
{
    requiredType: ValidateResultEntry["requiredType"];
    isRequiredType: (data: any, key: string) => boolean;
}
export const isValueTypeValidator = (value: unknown): value is ValueTypeValidator =>
    null !== value && "object" === typeof value &&
    "requiredType" in value && "string" === typeof value.requiredType &&
    "isRequiredType" in value && "function" === typeof value.isRequiredType;
export interface ArrayTypeValidator
{
    requiredType: ValidateResultEntry["requiredType"];
    isRequiredItemType: (data: any, key: string) => boolean;
}
export const isArrayTypeValidator = (value: unknown): value is ArrayTypeValidator =>
    null !== value && "object" === typeof value &&
    "requiredType" in value && "string" === typeof value.requiredType &&
    "isRequiredItemType" in value && "function" === typeof value.isRequiredItemType;
export interface ObjectTypeValidator
{
    requiredType: ValidateResultEntry["requiredType"];
    isRequiredMemberType:
    {
        [member: string]: TypeValidator
    };
};
export const isObjectTypeValidator = (value: unknown): value is ObjectTypeValidator =>
    null !== value && "object" === typeof value &&
    "requiredType" in value && "string" === typeof value.requiredType &&
    "isRequiredMemberType" in value &&
        null !== value.isRequiredMemberType && "object" === typeof value.isRequiredMemberType &&
        Object.keys(value.isRequiredMemberType).filter(member => ! isTypeValidator((value.isRequiredMemberType as any)[member])).length <= 0;
export interface OrTypeValidator
{
    requiredType?: ValidateResultEntry["requiredType"];
    isRequiredOrTypes: TypeValidator[];
};
export interface AndTypeValidator
{
    requiredType?: ValidateResultEntry["requiredType"];
    isRequiredAndTypes: TypeValidator[];
};
export type TypeValidator = ValueTypeValidator | ArrayTypeValidator | ObjectTypeValidator | OrTypeValidator | AndTypeValidator;
export const isTypeValidator = (value: unknown): value is TypeValidator =>
    isValueTypeValidator(value) || isArrayTypeValidator(value) || isObjectTypeValidator(value);
export const isRequiredMemberType = (isType: (value: unknown) => boolean) =>
    (data: any, key: string) => isType("" === (key ?? "") ? data: data[key]);
export const isRequiredMemberContantValueType = <T>(cv: T) => isRequiredMemberType(value => value === cv);
export const ContantValueTypeValidator = <T>(cv: T): ValueTypeValidator =>
({
    requiredType: JSON.stringify(cv),
    isRequiredType: isRequiredMemberContantValueType(cv),
});
export const OptionalValidator: ValueTypeValidator =
{
    requiredType: "optional",
    isRequiredType: (data, key) => !(key in data),
};
export const BooleanValidator: ValueTypeValidator =
{
    requiredType: "boolean",
    isRequiredType: (data, key) => isBoolean(data[key]),
};
export const NumberValidator: ValueTypeValidator =
{
    requiredType: "number",
    isRequiredType: (data, key) => isNumber(data[key]),
};
export const StringValidator: ValueTypeValidator =
{
    requiredType: "string",
    isRequiredType: (data, key) => isString(data[key]),
};
