import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { Storybook } from '../../../utils/storybook';
import Form, { useForm } from '../Form';
import SelectField, { Item } from './index';

const SelectFieldForm = (): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action('Form submit'),
  });

  const items = [{ name: 'Create new account' }, { name: 'IOV2' }, { name: 'ETH3' }];

  return (
    <Form onSubmit={handleSubmit}>
      <SelectField
        items={items}
        initial="IOV2"
        form={form}
        fieldName="SELECT_FIELD_ATTR"
        onChangeCallback={(item: Item) => console.log(`received ---> ${item.name}`)}
      />
    </Form>
  );
};

storiesOf('Components /forms', module).add('SelectField', () => (
  <Storybook>
    <SelectFieldForm />
  </Storybook>
));
