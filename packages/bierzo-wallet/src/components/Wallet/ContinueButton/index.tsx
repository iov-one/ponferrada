import { Button, makeStyles } from '@material-ui/core';
import * as React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles(theme => ({
  buttonRoot: {
    width: '75%',
    height: '4.2rem',
    borderRadius: '.4rem',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.6rem',
  },

  buttonLabel: {
    textTransform: 'capitalize',
  },
}));

const ContinueButton = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const buttonClasses = {
    root: classes.buttonRoot,
    label: classes.buttonLabel,
  };

  return (
    <Button className={positionedClass} classes={buttonClasses}>
      Continue
    </Button>
  );
};

export default ContinueButton;
