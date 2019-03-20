import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import { SizingBreakpoint } from '../Grid';

// TODO: Remove those props after BoxProps will be properly implemented.
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
  readonly width?: string | number;
  readonly textAlign?: 'left' | 'center' | 'right';
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBlock = Box as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const Block = ({ children, ...restProps }: Props): JSX.Element => {
  return <IovBlock {...restProps}>{children}</IovBlock>;
};

export default Block;
