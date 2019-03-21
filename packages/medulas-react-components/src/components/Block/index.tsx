import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import { SizingBreakpoint } from '../Grid';

// TODO: Remove those props after BoxProps will be properly implemented.
interface Props extends BoxProps {
  readonly children?: React.ReactNode;
  //Sizing Props
  readonly width?: string | number | SizingBreakpoint;
  readonly minWidth?: string | number | SizingBreakpoint;
  readonly maxWidth?: string | number | SizingBreakpoint;
  readonly height?: string | number | SizingBreakpoint;
  readonly minHeight?: string | number | SizingBreakpoint;
  readonly maxHeight?: string | number | SizingBreakpoint;
  //Spacing Props
  readonly margin?: string | number | SizingBreakpoint;
  readonly marginLeft?: string | number | SizingBreakpoint;
  readonly marginTop?: string | number | SizingBreakpoint;
  readonly marginRight?: string | number | SizingBreakpoint;
  readonly marginBottom?: string | number | SizingBreakpoint;
  readonly padding?: string | number | SizingBreakpoint;
  readonly paddingTop?: string | number | SizingBreakpoint;
  readonly paddingRight?: string | number | SizingBreakpoint;
  readonly paddingBottom?: string | number | SizingBreakpoint;
  readonly paddingLeft?: string | number | SizingBreakpoint;
  readonly textAlign?: 'left' | 'center' | 'right';
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBlock = Box as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const Block = ({ children, ...restProps }: Props): JSX.Element => {
  return <IovBlock {...restProps}>{children}</IovBlock>;
};

export default Block;
