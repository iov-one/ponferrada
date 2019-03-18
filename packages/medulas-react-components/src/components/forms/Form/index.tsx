import * as React from 'react';
import { useForm, useField } from 'react-final-form-hooks';

export { useField, useForm };

interface Props {
  readonly onSubmit: (
    values: object,
    callback?: (errors?: object) => void
  ) => object | Promise<object | undefined> | undefined | void;
  readonly children: React.ReactNode;
}

const Form = ({ onSubmit, children }: Props) => (
  <form onSubmit={onSubmit}>{children}</form>
);

export default Form;
