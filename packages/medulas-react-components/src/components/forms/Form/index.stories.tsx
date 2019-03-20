import { Button } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as React from 'react';
import TextFieldForm from '../TextFieldForm';
import { Storybook } from '../../../utils/storybook';
import Form, { useForm, FormValues, ValidationError } from './index';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

const onSubmit = async (values: FormValues): Promise<void> => {
  // eslint-disable-line
  console.log('Simulate before');
  await sleep(7000);
  console.log(values);
};

const FIELD_NAME = 'uniqueIdentifier';

// eslint-disable-next-line
const validate = (values: FormValues): object => {
  let errors: ValidationError = {};
  if (!values[FIELD_NAME]) {
    errors[FIELD_NAME] = 'Required';
  } else if (values[FIELD_NAME].length <= 4) {
    errors[FIELD_NAME] = 'Must be at least 4 chars';
  }
  return errors;
};

const FormStory = (): JSX.Element => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate,
  });

  return (
    <Form onSubmit={handleSubmit}>
      <TextFieldForm
        label="Unique Identifier"
        placeholder="Unique Identifier"
        form={form}
        name={FIELD_NAME}
      />
      <Button type="submit" disabled={pristine || submitting}>
        Submit
      </Button>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
    </Form>
  );
};

storiesOf('Components /forms', module).add(
  'Add react-final-form-hooks form',
  () => (
    <Storybook>
      <FormStory />
    </Storybook>
  )
);
