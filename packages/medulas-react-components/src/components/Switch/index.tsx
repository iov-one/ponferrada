import * as React from 'react';
import MuiSwitch, { SwitchProps } from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface Props extends SwitchProps {
  readonly label?: string;
}

const Switch = ({ label, ...restProps }: Props): JSX.Element => (
  <FormControlLabel control={<MuiSwitch {...restProps} />} label={label} />
);

export default Switch;
