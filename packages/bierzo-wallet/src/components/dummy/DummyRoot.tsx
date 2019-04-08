import React from 'react';
import EditableLabel from './EditableLabel';

const DummyRoot = () => {
  const style: React.CSSProperties = {
    backgroundColor: '#33bb33',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={style}>
      <EditableLabel label="Edit the box to change this" />
      <EditableLabel label="This label is editable too" />
    </div>
  );
};

export default DummyRoot;
