import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import TextFieldForm from './index';
import { Storybook } from '../../../utils/storybook';
import { Grid } from '@material-ui/core';
import Form, { useForm } from '../Form';

interface Props {
  readonly name: string;
  readonly label: string;
  readonly defaultValue?: string;
  readonly helperText?: string;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly error?: boolean;
}

const TextField = ({
  name,
  label,
  defaultValue,
  helperText,
  disabled,
  placeholder,
  error,
}: Props): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action('Form submit'),
  });

  return (
    <Form onSubmit={handleSubmit}>
      <TextFieldForm
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        helperText={helperText}
        form={form}
        name={name}
        disabled={disabled}
        error={error}
      />
    </Form>
  );
};

/*InputLabelProps={{
  shrink: true,
}}*/

storiesOf('Components /TextFieldForm', module).add('Examples', () => (
  <Storybook>
    <Grid container spacing={5}>
      <Grid item xs={6}>
        <TextField
          name="field-with-error"
          label="Error"
          defaultValue="Standard Error"
          helperText="This is an error message"
          error
        />
      </Grid>
      <Grid item xs={6}>
        <TextField name="field-filled" label="Filled" defaultValue="test*iov" />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          name="standard-disabled"
          label="Disabled"
          defaultValue="Disabled input"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="standard-with-placeholder"
          label="Empty"
          placeholder="IOV or wallet address"
        />
      </Grid>
    </Grid>
  </Storybook>
));
