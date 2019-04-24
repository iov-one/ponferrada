import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles(() => ({
  buttonRoot: {
    width: '75%',
    height: '4.2rem',
    fontFamily: '"Muli SemiBold", sans-serif',
    fontSize: '1.6rem',
  },
}));

export const ContinueButton = ({ positionedClass }: Props) => {
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
