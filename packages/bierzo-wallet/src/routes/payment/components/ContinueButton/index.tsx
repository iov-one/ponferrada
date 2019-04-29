import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles(() => ({
  button: {
    width: '75%',
    height: '42px',
  },
}));

export const ContinueButton = ({ positionedClass }: Props) => {
  const classes = useStyles();

  const buttonClasses = {
    root: classes.button,
  };

  return (
    <Button className={positionedClass} classes={buttonClasses}>
      Continue
    </Button>
  );
};
