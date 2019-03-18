import { Button } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Form, { useForm, useField } from './index';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

const onSubmit = async (values: object) => {
  // eslint-disable-line
  await sleep(300);
  window.alert(JSON.stringify(values));
};

const validate = (values: any): object => {
  // eslint-disable-line
  let errors = {
    uniqueIdentifier: '',
  };
  if (!values.uniqueIdentifier) {
    errors.uniqueIdentifier = 'Required';
  } else if (values.uniqueIdentifier.length <= 4) {
    errors.uniqueIdentifier = 'Must be at least 4 chars';
  }
  return errors;
};

storiesOf('Components /forms', module).add(
  'Add react-final-form-hooks form',
  () => {
    const { form, values, pristine, submitting } = useForm({
      onSubmit,
      validate,
    });
    const uniqueIdentifier = useField('uniqueIdentifier', form);

    return (
      <Form onSubmit={onSubmit}>
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
        <pre>{JSON.stringify(values, undefined, 2)}</pre>
      </Form>
    );
  }
);
