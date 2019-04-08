import { Button } from '@material-ui/core';
import React from 'react';

const Continue = (props: { style: React.CSSProperties }) => {
  const style: React.CSSProperties = {
    ...props.style,
    backgroundColor: '#bbbb33',
  };

  return (
    <div style={style}>
      <Button variant="contained">Continue</Button>
    </div>
  );
};

export default Continue;
