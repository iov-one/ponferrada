import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { ChangeEvent, useState } from 'react';

export const TextNote = () => {
  const [validity, setValidity] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValidity('');

    if (event.target.value.length > 150) {
      setValidity('Can not be longer than 150 characters');
    }
  };

  return (
    <Paper>
      <Block padding={5}>
        <Block display="flex">
          <Block alignSelf="center">
            <FontAwesomeIcon icon={faStickyNote} color="#a2a6a8" size="lg" />
          </Block>
          <Block width="100%" marginLeft={2}>
            <TextField multiline placeholder="Add a note" fullWidth onChange={handleChange} />
          </Block>
        </Block>
        <Block marginTop={1} marginLeft={4}>
          <Typography color="error" variant="subtitle2">
            {validity}
          </Typography>
        </Block>
      </Block>
    </Paper>
  );
};
