import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
import Block from 'medulas-react-components/lib/components/Block';
import Form, {
  FormValues,
  useForm,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import React from 'react';

const TEXTNOTE_FIELD = 'textNoteField';

const onSubmit = (): void => {};

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  if (formValues[TEXTNOTE_FIELD] && formValues[TEXTNOTE_FIELD].length > 150) {
    errors[TEXTNOTE_FIELD] = 'Can not be longer than 150 characters';
  }

  return errors;
};

const TextNote = (): JSX.Element => {
  const { form, handleSubmit } = useForm({
    onSubmit,
    validate,
  });

  return (
    <Paper>
      <Block padding={5}>
        <Block display="flex">
          <Block alignSelf="center">
            <FontAwesomeIcon icon={faStickyNote} color="#a2a6a8" size="lg" />
          </Block>
          <Block width="100%" marginLeft={2}>
            <Form onSubmit={handleSubmit}>
              <TextFieldForm name={TEXTNOTE_FIELD} form={form} placeholder="Add a note" multiline fullWidth />
            </Form>
          </Block>
        </Block>
      </Block>
    </Paper>
  );
};

export default TextNote;
