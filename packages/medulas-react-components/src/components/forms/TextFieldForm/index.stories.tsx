import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import TextFieldForm from './index';
import { Storybook } from '../../../utils/storybook';
import Grid, { SizingBreakpoint } from '../../Grid';
import GridItem from '../../GridItem';
import Form, { useForm } from '../Form';

interface Props {
  readonly name: string;
  readonly label: string;
  readonly defaultValue?: string;
  readonly helperText?: string;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly error?: boolean;
}

const TextField = ({
  name,
  label,
  defaultValue,
  helperText,
  disabled,
  placeholder,
  error,
}: Props): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit: action('Form submit'),
  });

  return (
    <Form onSubmit={handleSubmit}>
      <TextFieldForm
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        helperText={helperText}
        form={form}
        name={name}
        disabled={disabled}
        error={error}
      />
    </Form>
  );
};

const gridItemWidth: SizingBreakpoint = {
  xs: '100%',
  sm: '50%',
};

storiesOf('Components /forms', module).add(
  'TextField',
  (): JSX.Element => (
    <Storybook>
      <Grid flexWrap="wrap">
        <GridItem marginBottom={4} width={gridItemWidth}>
          <TextField
            name="field-with-error"
            label="Error"
            defaultValue="Standard Error"
            helperText="This is an error message"
            error
          />
        </GridItem>
        <GridItem marginBottom={4} width={gridItemWidth}>
          <TextField
            name="field-filled"
            label="Filled"
            defaultValue="test*iov"
          />
        </GridItem>
        <GridItem marginBottom={4} width={gridItemWidth}>
          <TextField
            disabled
            name="standard-disabled"
            label="Disabled"
            defaultValue="Disabled input"
          />
        </GridItem>
        <GridItem marginBottom={4} width={gridItemWidth}>
          <TextField
            name="standard-with-placeholder"
            label="Empty"
            placeholder="IOV or wallet address"
          />
        </GridItem>
      </Grid>
    </Storybook>
  )
);
