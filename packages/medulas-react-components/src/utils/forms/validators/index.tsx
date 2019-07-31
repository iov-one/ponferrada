import { FieldValidator } from 'final-form';

type ValidationError = string | undefined;

export const composeValidators = (...validators: FieldValidator[]): FieldValidator => {
  return (value): ValidationError => {
    for (let validator of validators) {
      const validationError = validator(value, {});

      if (validationError) {
        return validationError;
      }
    }

    return undefined;
  };
};

export const required: FieldValidator = (value): ValidationError => {
  return value ? undefined : 'Required';
};

export const number: FieldValidator = (value): ValidationError => {
  return Number.isNaN(value) ? 'Must be a number' : undefined;
};

export const validAddress: FieldValidator = (value): ValidationError => {
  return value.endsWith('*iov') ? undefined : 'Invalid address';
};

export const lowerOrEqualThan = (max: number): FieldValidator => {
  return (value): ValidationError => {
    if (value && value > max) {
      return `Should be lower or equal than ${max}`;
    }

    return undefined;
  };
};

export const greaterOrEqualThan = (min: number): FieldValidator => {
  return (value): ValidationError => {
    if (value && value < min) {
      return `Should be greater or equal than ${min}`;
    }

    return undefined;
  };
};

export const notLongerThan = (maxLength: number): FieldValidator => {
  return (value): ValidationError => {
    if (value && value.length > maxLength) {
      return `Can not be longer than ${maxLength} characters`;
    }

    return undefined;
  };
};

export const longerThan = (minLength: number): FieldValidator => {
  return (value): ValidationError => {
    if (value && value.length < minLength) {
      return `Must be longer than ${minLength} characters`;
    }

    return undefined;
  };
};
