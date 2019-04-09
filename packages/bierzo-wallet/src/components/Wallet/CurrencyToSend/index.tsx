import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import React from 'react';

const StyledPaper = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: '40px',
    },
  },
})(Paper);

const StyledAvatar = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
      backgroundColor: '#ffe152',
      width: '72px',
      height: '72px',
      marginTop: '-76px',
    },
  },
})(Avatar);

const currencyContainer: React.CSSProperties = {
  display: 'flex',
};

const StyledTextField = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
    },
  },
})(TextField);

const StyledSelect = withStyles({
  root: {
    '&&': {
      outline: '1px solid red',
    },
  },
})(Select);

const CurrencyToSend = (props: { positioning: React.CSSProperties }) => {
  return (
    <StyledPaper style={props.positioning}>
      <StyledAvatar />
      <div style={currencyContainer}>
        <StyledTextField label="You send" />
        <StyledSelect />
      </div>
    </StyledPaper>
  );
};

export default CurrencyToSend;
