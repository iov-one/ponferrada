import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const Note = (props: { style: React.CSSProperties }) => {
  const style: React.CSSProperties = {
    ...props.style,
    backgroundColor: '#3333bb',
  };

  return (
    <div style={style}>
      <Paper>
        <TextField />
      </Paper>
    </div>
  );
};

export default Note;
