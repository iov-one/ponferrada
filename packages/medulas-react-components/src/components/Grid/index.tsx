import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

const Grid = ({ children, ...restProps }: BoxProps): JSX.Element => {
  return (
    <Box display="flex" {...restProps}>
      {children}
    </Box>
  );
};

export default Grid;
