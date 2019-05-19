import { FormApi } from 'final-form';
import Block from 'medulas-react-components/lib/components/Block';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import { notLongerThan } from 'medulas-react-components/lib/utils/forms/validators';
import React from 'react';

import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';

const TEXTNOTE_FIELD = 'textNoteField';

interface Props {
  form: FormApi;
}

const TextNote = (props: Props): JSX.Element => {
  return (
    <Paper>
      <Block padding={5}>
        <Block display="flex">
          <Block alignSelf="center">
            <FontAwesomeIcon icon={faStickyNote} color="#a2a6a8" size="lg" />
          </Block>
          <Block width="100%" marginLeft={2}>
            <TextFieldForm
              name={TEXTNOTE_FIELD}
              form={props.form}
              validate={notLongerThan(150)}
              placeholder="Add a note"
              multiline
              rows="2"
              fullWidth
              margin="none"
            />
          </Block>
        </Block>
      </Block>
    </Paper>
  );
};

export default TextNote;
