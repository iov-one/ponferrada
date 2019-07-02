import { FormApi, FieldSubscription } from 'final-form';
import { useField } from 'react-final-form-hooks';
import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Omit, FormControl, FormHelperText, makeStyles, Theme } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const useStyles = makeStyles<Theme>({
  root: {
    marginTop: 0,
  },
});

interface Props extends Omit<CheckboxProps, 'form'> {
  readonly fieldName: string;
  readonly label?: React.ReactNode | string;
  readonly initial: boolean;
  readonly form: FormApi;
  readonly onChangeCallback?: (checked: boolean) => void;
  readonly subscription?: FieldSubscription;
}

const CheckboxField = ({ fieldName, form, initial, onChangeCallback, label }: Props): JSX.Element => {
  const classes = useStyles();
  const { input, meta } = useField(fieldName, form);

  const error = meta.error && (meta.touched || !meta.pristine);
  const { name, onChange, value, ...restInput } = input;
  const inputProps = { name, ...restInput };

  React.useEffect(() => {
    try {
      const firstRender = value === '';
      if (firstRender) {
        onChange(initial);
      }
    } catch (err) {}
  }, [initial, input, onChange, value]);

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

  return (
    <FormControl error={error}>
      <FormControlLabel control={control} label={label} />
      {error && <FormHelperText className={classes.root}>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default CheckboxField;
