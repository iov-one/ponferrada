import { Button } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Form, useIovForm, useField } from './index';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

const onSubmit = async (values: object) => {
  // eslint-disable-line
  await sleep(300);
  window.alert(JSON.stringify(values));
};

const validate = (values: any): string | undefined => {
  // eslint-disable-line
  let errors = '';
  if (!values.uniqueIdentifier) {
    errors = 'Required';
  } else if (values.uniqueIdentifier.length <= 4) {
    errors = 'Must be at least 4 chars';
  }
  return errors;
};

const { form, handleSubmit, values, pristine, submitting } = useIovForm(
  onSubmit,
  validate
);
const uniqueIdentifier = useField('uniqueIdentifier', form);

storiesOf('Components /forms', module).add('Add react-final-form form', () => (
  <Form onSubmit={handleSubmit} form={form}>
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
));
