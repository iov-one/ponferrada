import { Button, makeStyles } from '@material-ui/core';
import * as React from 'react';

interface Props {
  readonly positionedClass?: string;
}

const useStyles = makeStyles({
  buttonRoot: {
    outline: '1px solid red',
    width: '75%',
    height: '42px',
    borderRadius: '4px',
    backgroundColor: '#31e6c9',
    color: '#ffffff',
  },

  buttonLabel: {
    textTransform: 'capitalize',
  },
});

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
