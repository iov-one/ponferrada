import { Button, makeStyles } from '@material-ui/core';
import * as React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles(theme => ({
  buttonRoot: {
    width: '75%',
    height: '4.2rem',
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.6rem',
  },
}));

const ContinueButton = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const buttonClasses = {
    root: classes.buttonRoot,
  };

  return (
    <Button className={positionedClass} classes={buttonClasses}>
      Continue
    </Button>
  );
};

export default ContinueButton;
