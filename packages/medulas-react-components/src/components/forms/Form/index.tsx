import * as React from 'react';
import { useForm, useField, FormRenderProps } from 'react-final-form-hooks';
import { FormApi } from 'final-form';

export { useField };

interface Props extends FormRenderProps {
  readonly onSubmit: (
    values: object,
    form: FormApi,
    callback?: (errors?: object) => void
  ) => object | Promise<object | undefined> | undefined | void;
  readonly handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<object | undefined> | undefined;
  readonly children: React.ReactNode;
}

export const useIovForm = (onSubmit: any, validate: any): FormRenderProps => {
  // eslint-disable-line
  const formRenderProps = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    validate, // a record-level validation function to check all form values
  });
  return formRenderProps;
};

const Form = ({
  onSubmit, // eslint-disable-line
  handleSubmit,
  children,
  ...props
}: Props): JSX.Element => {
  return (
    <form onSubmit={handleSubmit} {...props}>
      {' '}
      {children}{' '}
    </form>
  );
};

export default Form;
