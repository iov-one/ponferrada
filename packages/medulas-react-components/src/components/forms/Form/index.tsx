import * as React from 'react';
import { useField, useForm } from 'react-final-form-hooks';

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
}

const Form = ({ onSubmit, children }: Props): JSX.Element => <form onSubmit={onSubmit}>{children}</form>;

export default Form;
