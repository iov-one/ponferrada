import { Button } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import TextFieldForm from '../TextFieldForm';
import { Storybook } from '../../../utils/storybook';
import Form, { useForm, useField } from './index';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

const onSubmit = async (values: object): Promise<void> => {
  // eslint-disable-line
  console.log('Simulate before');
  await sleep(7000);
  console.log(values);
  console.log('Simulate after');
};

const FIELD_NAME = 'uniqueIdentifier';

// eslint-disable-next-line
const validate = (values: any): object => {
  let errors = {};
  if (!values.uniqueIdentifier) {
    errors[FIELD_NAME] = 'Required';
  } else if (values.uniqueIdentifier.length <= 4) {
    errors[FIELD_NAME] = 'Must be at least 4 chars';
  }
  return errors;
};

const FormStory = (): JSX.Element => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate,
  });

  const { input, meta } = useField(FIELD_NAME, form);

  return (
    <Form onSubmit={handleSubmit}>
      <TextFieldForm
        label="Unique Identifier"
        placeholder="Unique Identifier"
        margin="normal"
        variant="standard"
        value={input.value}
        onChange={input.onChange}
        form={form}
        name={input.name}
        meta={meta}
      />
      <Button type="submit" disabled={pristine || submitting}>
        Submit
      </Button>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
    </Form>
  );
};

storiesOf('Components /forms', module).add('Form', () => (
  <Storybook>
    <FormStory />
  </Storybook>
));
