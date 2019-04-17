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
  weight: props => ({
    fontWeight: props.weight ? props.weight : 'regular',
  }),
});

interface Props extends TypographyProps {
  readonly inline?: boolean;
  readonly link?: boolean;
  readonly weight?: 'light' | 'regular' | 'semibold';
}

const Typography = ({ children, inline, link, className, weight, ...restProps }: Props): JSX.Element => {
  const classes = useStyles({ weight });
  const compositeClass = classNames(className, classes.weight, {
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
