import * as React from 'react';

import Box from '@material-ui/core/Box';

import { SizingBreakpoint } from '../Grid';

export type Unit = 0 | 1 | 2 | 3 | 4;

// TODO: Remove those props after BoxProps will be properly implemented.
interface Props {
  readonly id?: string;
  readonly children?: React.ReactNode;
  readonly display?: string;
  //Flexbox Props
  readonly flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'initial' | 'inherit';
  readonly flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit';
  readonly justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'initial'
    | 'inherit';
  readonly alignItems?: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit';
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
  readonly flexBasis?: string | number;
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
  //Border
  readonly border?: string | number;
  readonly borderTop?: string | number;
  readonly borderLeft?: string | number;
  readonly borderRight?: string | number;
  readonly borderBottom?: string | number;
  readonly borderColor?: string;
  readonly borderRadius?: string | number;
  //Palette
  readonly bgcolor?: string;
  //Regular react.component props
  readonly className?: string;
}

// TODO fix once the proper BoxProps have been updated
// See: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.d.ts
const IovBlock = Box as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const Block = ({ children, display = 'block', ...restProps }: Props): JSX.Element => {
  return (
    <IovBlock display={display} {...restProps}>
      {children}
    </IovBlock>
  );
};

export default Block;
