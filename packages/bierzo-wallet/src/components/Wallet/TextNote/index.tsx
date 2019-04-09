import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import React from 'react';

const StyledPaper = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
      width: '100%',
      padding: '40px',
    },
  },
})(Paper);

const StyledTextField = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
      width: '100%',
      height: '50px',
    },
  },
})(TextField);

const TextNote = (props: { positioning: React.CSSProperties }) => {
  return (
    <StyledPaper style={props.positioning}>
      <StyledTextField label="Add a note" />
    </StyledPaper>
  );
};

export default TextNote;
