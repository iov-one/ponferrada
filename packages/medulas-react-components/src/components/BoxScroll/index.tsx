import * as React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import classNames from 'classnames';
import { Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  scroll: {
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
}));

const BoxScroll = ({ children, display = 'block', className, ...restProps }: BoxProps): JSX.Element => {
  const classes = useStyles();
  const blockClasses = classNames(className, classes.scroll);
  return (
    <Box className={blockClasses} display={display} {...restProps}>
      {children}
    </Box>
  );
};

export default BoxScroll;
