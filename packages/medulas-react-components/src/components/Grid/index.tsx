import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

// TODO: Remove those props after BoxProps will be properly implemented.
interface Props extends BoxProps {
  readonly children?: React.ReactNode;
  readonly flexDirection?:
    | 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse'
    | 'initial'
    | 'inherit';
  readonly flexWrap?:
    | 'nowrap'
    | 'wrap'
    | 'wrap-reverse'
    | 'initial'
    | 'inherit';
  readonly justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'initial'
    | 'inherit';
  readonly alignItems?:
    | 'stretch'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'initial'
    | 'inherit';
  readonly alignContent?:
    | 'stretch'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'initial'
    | 'inherit';
  readonly order?: number;
  readonly flexGrow?: number;
  readonly width?: string;
  readonly flexShrink?: number;
  readonly flex?: string;
  readonly alignSelf?:
    | 'auto'
    | 'stretch'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'initial'
    | 'inherit';
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBlock = Box as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const Grid = ({ children, ...restProps }: Props): JSX.Element => {
  return <IovBlock {...restProps}>{children}</IovBlock>;
};
