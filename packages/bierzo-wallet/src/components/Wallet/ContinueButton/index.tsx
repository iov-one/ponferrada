import { Button, withStyles } from '@material-ui/core';
import React from 'react';

const StyledButton = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
      width: '75%',
      height: '42px',
      borderRadius: '4px',
      backgroundColor: '#31e6c9',
      color: '#ffffff',
    },
  },
  label: {
    '&&': {
      textTransform: 'capitalize',
    },
  },
})(Button);

const ContinueButton = (props: { positioning: React.CSSProperties }) => {
  return <StyledButton style={props.positioning}>Continue</StyledButton>;
};

export default ContinueButton;
