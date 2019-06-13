import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

const Block = ({ children, display = 'block', ...restProps }: BoxProps): JSX.Element => {
  return (
    <Box display={display} {...restProps}>
      {children}
    </Box>
  );
};

export default Block;
