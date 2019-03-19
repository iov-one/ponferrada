import * as React from 'react';
import { useForm, useField } from 'react-final-form-hooks';

export { useForm, useField };

interface Props {
  readonly onSubmit: (
    values: object,
    callback?: (errors?: object) => void
  ) => object | Promise<object | undefined> | undefined | void;
  readonly children: React.ReactNode;
}

const Form = ({ onSubmit, children }: Props): JSX.Element => (
  <form onSubmit={onSubmit}>{children}</form>
);

export default Form;
