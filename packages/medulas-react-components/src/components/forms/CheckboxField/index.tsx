import { FormApi, FieldSubscription } from 'final-form';
import { useField } from 'react-final-form-hooks';
import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Omit } from '@material-ui/core';

interface Props extends Omit<CheckboxProps, 'form'> {
  readonly fieldName: string;
  readonly label?: string;
  readonly initial: boolean;
  readonly form: FormApi;
  readonly onChangeCallback?: (checked: boolean) => void;
  readonly subscription?: FieldSubscription;
}

const CheckboxField = ({ fieldName, form, initial, onChangeCallback, label }: Props): JSX.Element => {
  const { input } = useField(fieldName, form);

  const { name, onChange, value, ...restInput } = input;
  const inputProps = { name, ...restInput };

  React.useEffect(() => {
    try {
      console.log(value);
      const firstRender = value === '';
      if (firstRender) {
        onChange(initial);
      }
    } catch (err) {}
  }, [input]);

  const onCheckBoxChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    console.log('value checked, onCheckBoxChange');
    onChange(checked);
    if (onChangeCallback) {
      onChangeCallback(checked);
    }
  };

  const control = <Checkbox checked={value} onChange={onCheckBoxChange} inputProps={inputProps} />;

  return <FormControlLabel control={control} label={label} />;
};

export default CheckboxField;
