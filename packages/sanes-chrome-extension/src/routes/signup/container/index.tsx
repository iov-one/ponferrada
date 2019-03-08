import * as React from 'react';
import { useForm, useField } from 'react-final-form-hooks';
import { Button } from 'medulas-react-components/lib/components/Button';

const onSubmit = async (values: object) => {
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
        <div>
          <label>Unique Identifier</label>
          <input {...uniqueIdentifier.input} placeholder="Unique Identifier" />
          {uniqueIdentifier.meta.touched && uniqueIdentifier.meta.error && (
            <span>{uniqueIdentifier.meta.error}</span>
          )}
        </div>
        <Button type="submit" disabled={pristine || submitting}>
          Submit
        </Button>
      </form>
    </div>
  );
};
export default Signup;
