import * as React from 'react';
import { unstable_Box as MuiBox, BoxProps } from '@material-ui/core/Box';

interface Props extends BoxProps {
  readonly children: React.ReactNode;
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBox = MuiBox as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const Box = ({ children }: Props): JSX.Element => {
  return <IovBox display="flex">{children}</IovBox>;
};

export default Box;
