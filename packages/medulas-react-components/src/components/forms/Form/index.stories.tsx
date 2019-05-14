import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Storybook } from '../../../utils/storybook';
import Button from '../../Button';
import Block from '../../Block';
import SelectFieldForm, { Item } from '../SelectFieldForm';
import TextFieldForm from '../TextFieldForm';
import CheckboxField from '../CheckboxField';
import Form, { useForm, FormValues, ValidationError } from './index';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // eslint-disable-line

const onSubmit = async (values: FormValues): Promise<void> => {
  console.log('Simulate before');
  await sleep(2000);
  console.log(values);
};

const TEXT_FIELD = 'textFieldUniqueIdentifier';
const SELECT_FIELD = 'selectFieldUniqueIdentifier';
const CHECKBOX_FIELD = 'checkboxFieldUniqueIdentifier';

const validate = (values: FormValues): object => {
  let errors: ValidationError = {};
  if (!values[TEXT_FIELD]) {
    errors[TEXT_FIELD] = 'Required';
  }
  if (values[TEXT_FIELD] && values[TEXT_FIELD].length <= 4) {
    errors[TEXT_FIELD] = 'Must be at least 4 chars';
  }

  return errors;
};

const FormStory = (): JSX.Element => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate,
  });

  const items = [{ name: 'Create new account' }, { name: 'IOV2' }, { name: 'ETH3' }];

  return (
    <Form onSubmit={handleSubmit}>
      <TextFieldForm
        label="Unique Identifier"
        placeholder="Unique Identifier"
        form={form}
        name={TEXT_FIELD}
      />
      <Block display="block" marginBottom={2}>
        <SelectFieldForm
          items={items}
          initial="IOV2"
          form={form}
          fieldName={SELECT_FIELD}
          onChangeCallback={(item: Item) => console.log(`received ---> ${item.name}`)}
        />
      </Block>
      <Block display="block" marginBottom={2}>
        <CheckboxField
          initial={true}
          form={form}
          fieldName={CHECKBOX_FIELD}
          label="Checkbox field"
          onChangeCallback={(checked: boolean) => console.log(`received ---> ${checked ? 'true' : 'false'}`)}
        />
      </Block>

      <Button type="submit" disabled={pristine || submitting}>
        Submit
      </Button>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
    </Form>
  );
};

storiesOf('Components/forms', module).add(
  'Form',
  (): JSX.Element => (
    <Storybook>
      <Block marginTop={2} />
      <FormStory />
    </Storybook>
  ),
);
