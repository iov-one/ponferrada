import * as React from 'react';
import { useForm, useField } from 'react-final-form-hooks';
import { Button } from 'medulas-react-components/lib/components/Button';
import { TextField } from 'medulas-react-components/lib/components/TextField';

const onSubmit = async (values: object) => {
  // eslint-disable-line
  window.alert(JSON.stringify(values));
};

const Signup = (): JSX.Element => {
  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit,
  });

  const uniqueIdentifier = useField('uniqueIdentifier', form);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Unique Identifier"
          placeholder="Unique Identifier"
          margin="normal"
          variant="standard"
          value={uniqueIdentifier.input.value}
          onChange={uniqueIdentifier.input.onChange}
          error={uniqueIdentifier.meta.error}
        />
        <Button type="submit" disabled={pristine || submitting}>
          Submit
        </Button>
      </form>
    </div>
  );
};
export default Signup;
