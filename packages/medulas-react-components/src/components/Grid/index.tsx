import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

// TODO: Remove those props after BoxProps will be properly implemented.
interface Props extends BoxProps {
  readonly children?: React.ReactNode;
  //Flexbox Props
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
  //Sizing Props
  readonly width?: string | number | object;
  readonly minWidth?: string | number | object;
  readonly maxWidth?: string | number | object;
  readonly height?: string | number | object;
  readonly minHeight?: string | number | object;
  readonly maxHeight?: string | number | object;
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBlock = Box as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const Grid = ({ children, ...restProps }: Props): JSX.Element => {
  return (
    <IovBlock display="flex" {...restProps}>
      {children}
    </IovBlock>
  );
};

export default Grid;
