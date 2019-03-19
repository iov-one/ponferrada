import { Button } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Form, { useForm, useField } from './index';
import TextFieldForm from '../TextFieldForm';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

const onSubmit = async (values: object): Promise<void> => {
  // eslint-disable-line
  await sleep(300);
  window.alert(JSON.stringify(values));
};

// eslint-disable-next-line
const validate = (values: any): object => {
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

const FIELD_NAME = 'test';

storiesOf('Components /forms', module).add('Form', () => (
  <Storybook>
    <FormStory />
  </Storybook>
));
