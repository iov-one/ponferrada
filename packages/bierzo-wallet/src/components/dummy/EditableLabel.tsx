import TextField from '@material-ui/core/TextField';
import React, { ChangeEvent, useState } from 'react';

const EditableLabel = (props: { label: string }) => {
  const defaultLabel = props.label;
  const [label, setLabel] = useState(defaultLabel);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLabel = event.target.value ? event.target.value : defaultLabel;
    setLabel(newLabel);
  };

  return <TextField label={label} variant="outlined" onChange={handleChange} />;
};

export default EditableLabel;
