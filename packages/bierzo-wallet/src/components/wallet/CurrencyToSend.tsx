import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const CurrencyToSend = (props: { style: React.CSSProperties }) => {
  const style: React.CSSProperties = {
    ...props.style,
    backgroundColor: '#bb3333',
  };

  return (
    <div style={style}>
      <Paper>
        <Avatar />
        <TextField label="You send" />
        <Select />
      </Paper>
    </div>
  );
};

export default CurrencyToSend;
