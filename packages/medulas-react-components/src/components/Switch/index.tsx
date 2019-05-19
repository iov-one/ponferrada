import * as React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiSwitch, { SwitchProps } from '@material-ui/core/Switch';

interface Props extends SwitchProps {
  readonly label?: string;
}

const Switch = ({ label, ...restProps }: Props): JSX.Element => {
  const control = <MuiSwitch {...restProps} />;

  // FormControlLabel allows us to click on the label and toggle switch
  return <FormControlLabel control={control} label={label} />;
};

export default Switch;
