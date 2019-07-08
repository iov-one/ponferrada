/* eslint-disable no-console */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Storybook } from '../../../utils/storybook';
import Form, { useForm, ValidationError } from '../Form';
import CheckboxField from './index';

const CHECKBOX_FIELD = 'CHECKBOX_FIELD';

interface Props {
  readonly showError?: boolean;
  readonly label: string;
}

const CheckboxFieldForm = ({ showError, label }: Props): JSX.Element => {
  const validate = (_: object): object => {
    let errors: ValidationError = {};
    if (showError) {
      errors[CHECKBOX_FIELD] = 'Field error';
    }

    return errors;
  };

  const { form, handleSubmit } = useForm({
    onSubmit: () => {
      console.log('value checked, onSubmit');
      action('Form submit');
    },
    validate,
  });

  return (
    <Form onSubmit={handleSubmit}>
      <CheckboxField
        initial={false}
        form={form}
        fieldName={CHECKBOX_FIELD}
        label={label}
        onChangeCallback={(checked: boolean) => {
          console.log('value checked, onChangeCallback');
          action(`received ---> ${checked ? 'true' : 'false'}`);
        }}
      />
    </Form>
  );
};

storiesOf('Components /forms', module).add('CheckboxField', () => (
  <Storybook>
    <CheckboxFieldForm label="Checkbox field" />
    <CheckboxFieldForm label="Checkbox field with error" showError />
  </Storybook>
));
