import * as React from 'react';
import { unstable_Box as MuiBox, BoxProps } from '@material-ui/core/Box';

interface Props extends BoxProps {
  readonly children?: React.ReactNode;
  readonly margin?: number;
  readonly marginLeft?: number;
  readonly marginTop?: number;
  readonly marginRight?: number;
  readonly marginBottom?: number;
  readonly padding?: number;
  readonly paddingTop?: number;
  readonly paddingRight?: number;
  readonly paddingBottom?: number;
  readonly paddingLeft?: number;
  readonly textAlign?: 'left' | 'center' | 'right';
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBlock = MuiBox as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const Block = ({ children, ...restProps }: Props): JSX.Element => {
  return <IovBlock {...restProps}>{children}</IovBlock>;
};
