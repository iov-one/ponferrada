import classNames from 'classnames';
import { FontWeightProperty } from 'csstype';
import * as React from 'react';

import { Theme } from '@material-ui/core/styles';
import MuiTypography, { TypographyProps } from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';

type Weight = 'light' | 'regular' | 'semibold';

interface StyleProps {
  readonly weight?: Weight;
}

const useStyles = makeStyles<Theme, StyleProps>({
  inline: {
    display: 'inline',
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  weight: props => ({
    fontWeight: props.weight ? (props.weight as FontWeightProperty) : 'normal',
  }),
});

interface Props extends TypographyProps, StyleProps {
  readonly inline?: boolean;
  readonly link?: boolean;
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
