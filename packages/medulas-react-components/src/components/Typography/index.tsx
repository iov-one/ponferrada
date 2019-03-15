import * as React from 'react';
import MuiTypography, { TypographyProps } from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';
import classNames from 'classnames';

const useStyles = makeStyles({
  inline: {
    display: 'inline',
  },
});

interface Props extends TypographyProps {
  readonly inline?: boolean;
}

export const Typography = ({
  children,
  inline,
  className,
  ...restProps
}: Props): JSX.Element => {
  const classes = useStyles();
  const compositeClass = classNames(className, { [classes.inline]: inline });

  return (
    <MuiTypography className={compositeClass} {...restProps}>
      {children}
    </MuiTypography>
  );
};
