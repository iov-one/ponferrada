import classNames from 'classnames';
import * as React from 'react';
import { Button, makeStyles } from '@material-ui/core';

interface Props {
  readonly className?: string;
}

const useStyles = makeStyles({
  root: {
    outline: '1px solid red',
    width: '75%',
    height: '42px',
    borderRadius: '4px',
    backgroundColor: '#31e6c9',
    color: '#ffffff',
  },
  label: {
    textTransform: 'capitalize',
  },
});

const ContinueButton = ({ className }: Props) => {
  const classes = useStyles();
  const muiClasses = {
    root: classes.root,
    label: classes.label,
  };

  return (
    <Button className={className} classes={muiClasses}>
      Continue
    </Button>
  );
};

export default ContinueButton;
