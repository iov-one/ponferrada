import Box from '@material-ui/core/Box';
import {
  border,
  ComposedStyleFunction,
  display,
  flexbox,
  palette,
  PropsFor,
  sizing,
  spacing,
} from '@material-ui/system';
import * as React from 'react';

type BlockStyleFunction = ComposedStyleFunction<
  [typeof flexbox, typeof sizing, typeof spacing, typeof display, typeof border, typeof palette]
>;
type BlockStyleProps = PropsFor<BlockStyleFunction>;

interface Props extends BlockStyleProps {
  readonly children?: React.ReactNode;
}

const Block = ({ children, display = 'block', ...restProps }: Props): JSX.Element => {
  return (
    <Box display={display} {...restProps}>
      {children}
    </Box>
  );
};

export default Block;
