import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const ReceiverAddress = (props: { style: React.CSSProperties }) => {
  const style: React.CSSProperties = {
    ...props.style,
    backgroundColor: '#33bb33',
  };

  return (
    <div style={style}>
      <Paper>
        <TextField label="To" />
      </Paper>
    </div>
  );
};

export default ReceiverAddress;
