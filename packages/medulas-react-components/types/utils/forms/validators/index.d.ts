import { FieldValidator } from "final-form";
export declare function composeValidators<T>(...validators: readonly FieldValidator<T>[]): FieldValidator<T>;
/** This was checked running runtime tests and logging `typeof value` for the validators */
export declare type FieldInputValue = string | undefined;
export declare const required: FieldValidator<FieldInputValue>;
export declare const number: FieldValidator<FieldInputValue>;
export declare const validAddress: FieldValidator<FieldInputValue>;
export declare const lowerOrEqualThan: (max: number) => FieldValidator<string | undefined>;
export declare const greaterOrEqualThan: (min: number) => FieldValidator<string | undefined>;
export declare const notLongerThan: (maxLength: number) => FieldValidator<string | undefined>;
export declare const longerThan: (minLength: number) => FieldValidator<string | undefined>;
