import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import SelectField from './index';
import { Storybook } from '../../../utils/storybook';
import Form, { useForm } from '../Form';
import { Item } from './index';

const SelectFieldForm = (): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action('Form submit'),
  });

  const items = [
    { name: 'Create new account' },
    { name: 'IOV2' },
    { name: 'ETH3' },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <SelectField
        items={items}
        initial="IOV2"
        form={form}
        fieldName="SELECT_FIELD_ATTR"
        onChangeCallback={(item: Item) =>
          console.log(`received ---> ${item.name}`)
        }
      />
    </Form>
  );
};

storiesOf('Components /SelectFieldForm', module).add('Examples', () => (
  <Storybook>
    <SelectFieldForm />
  </Storybook>
));
