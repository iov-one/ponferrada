import { FieldValidator } from "final-form";

type ValidationError = string | undefined;

export function composeValidators<T>(...validators: readonly FieldValidator<T>[]): FieldValidator<T> {
  return (value): ValidationError => {
    for (let validator of validators) {
      const validationError = validator(value, {});

      if (validationError) {
        return validationError;
      }
    }

    return undefined;
  };
}

/** This was checked running runtime tests and logging `typeof value` for the validators */
export type InputValue = string | undefined;

export const required: FieldValidator<InputValue> = (value): ValidationError => {
  return value ? undefined : "Required";
};

export const number: FieldValidator<InputValue> = (value): ValidationError => {
  // `+value` converts a string to number if possible. Returns NaN otherwise.
  return value && !Number.isNaN(+value) ? undefined : "Must be a number";
};

export const validAddress: FieldValidator<InputValue> = (value): ValidationError => {
  return (value || "").endsWith("*iov") ? undefined : "Invalid address";
};

export const lowerOrEqualThan = (max: number): FieldValidator<InputValue> => {
  return (value): ValidationError => {
    if (value && Number(value) > max) {
      return `Should be lower or equal than ${max}`;
    }

    return undefined;
  };
};

export const greaterOrEqualThan = (min: number): FieldValidator<InputValue> => {
  return (value): ValidationError => {
    if (value && Number(value) < min) {
      return `Should be greater or equal than ${min}`;
    }

    return undefined;
  };
};

export const notLongerThan = (maxLength: number): FieldValidator<InputValue> => {
  return (value): ValidationError => {
    if (value && value.length > maxLength) {
      return `Can not be longer than ${maxLength} characters`;
    }

    return undefined;
  };
};

export const longerThan = (minLength: number): FieldValidator<InputValue> => {
  return (value): ValidationError => {
    if (value && value.length < minLength) {
      return `Must be longer than ${minLength} characters`;
    }

    return undefined;
  };
};
