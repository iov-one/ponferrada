import { makeStyles } from '@material-ui/core';
import React from 'react';
import { history } from '../../store';
import { PAYMENT_ROUTE } from '../paths';

const useStyles = makeStyles(theme => ({
  welcome: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
  },
}));

export const Welcome = () => {
  const classes = useStyles();

  return (
    <div className={classes.welcome}>
      <button
        onClick={() => {
          history.push(PAYMENT_ROUTE);
        }}
      >
        CLICK TO GO TO PAYMENT
      </button>
    </div>
  );
};
