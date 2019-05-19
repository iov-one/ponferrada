import { FieldSubscription, FormApi } from 'final-form';
import * as React from 'react';
import { useField } from 'react-final-form-hooks';

import { Omit } from '@material-ui/core';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

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
      const firstRender = value === '';
      if (firstRender) {
        onChange(initial);
      }
    } catch (err) {}
  }, [input]);

  const onCheckBoxChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    onChange(checked);
    if (onChangeCallback) {
      onChangeCallback(checked);
    }
  };

  const control = (
    <Checkbox
      checked={!!value}
      color="primary"
      onChange={onCheckBoxChange}
      inputProps={inputProps}
      icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
      checkedIcon={<CheckBoxIcon fontSize="large" />}
    />
  );

  return <FormControlLabel control={control} label={label} />;
};

export default CheckboxField;
