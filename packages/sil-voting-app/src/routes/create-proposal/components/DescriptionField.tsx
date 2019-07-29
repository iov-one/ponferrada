import { FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

const DESCRIPTION_FIELD = 'Description';
const DESCRIPTION_PLACEHOLDER = 'Enter Description of the proposal';

interface Props {
  form: FormApi;
}

const DescriptionField = ({ form }: Props): JSX.Element => {
  return (
    <Block marginTop={2}>
      <Typography>{DESCRIPTION_FIELD}</Typography>
      <TextFieldForm
        name={DESCRIPTION_FIELD}
        form={form}
        placeholder={DESCRIPTION_PLACEHOLDER}
        multiline
        rows="2"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default DescriptionField;
