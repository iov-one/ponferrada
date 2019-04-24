import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { history } from '../../store';
import { PAYMENT_ROUTE } from '../paths';

const useStyles = makeStyles((theme: Theme) => ({
  welcome: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
  },
}));

const onPayment = () => {
  history.push(PAYMENT_ROUTE);
};

export const Welcome = () => {
  const classes = useStyles();

  return (
    <div className={classes.welcome}>
      <button onClick={onPayment}>CLICK TO GO TO PAYMENT</button>
    </div>
  );
};
