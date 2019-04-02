import * as React from 'react';
import MuiTypography, { TypographyProps } from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';
import classNames from 'classnames';

const useStyles = makeStyles({
  inline: {
    display: 'inline',
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

interface Props extends TypographyProps {
  readonly inline?: boolean;
  readonly link?: boolean;
}

const Typography = ({
  children,
  inline,
  link,
  className,
  ...restProps
}: Props): JSX.Element => {
  const classes = useStyles();
  const compositeClass = classNames(className, {
    [classes.inline]: inline,
    [classes.link]: link,
  });

  return (
    <MuiTypography className={compositeClass} {...restProps}>
      {children}
    </MuiTypography>
  );
};

export default Typography;
