import * as React from 'react';
import { useForm, useField } from 'react-final-form-hooks';

export { useForm, useField };

export interface FormValues {
  [key: string]: string;
}

export interface ValidationError {
  [key: string]: string;
}

interface Props {
  readonly onSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>,
  ) => Promise<object | undefined> | undefined;
  readonly children: React.ReactNode;
  readonly className?: string;
}

const Form = ({ onSubmit, className, children }: Props): JSX.Element => (
  <form className={className} onSubmit={onSubmit}>
    {children}
  </form>
);

export default Form;
