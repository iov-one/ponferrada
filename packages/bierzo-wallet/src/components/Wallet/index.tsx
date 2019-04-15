import { makeStyles } from '@material-ui/core';
import React from 'react';
import ContinueButton from './ContinueButton';
import CurrencyToSend from './CurrencyToSend';
import ReceiverAddress from './ReceiverAddress';
import TextNote from './TextNote';

const useStyles = makeStyles(theme => ({
  wallet: {
    backgroundColor: theme.palette.background.default,
    height: 'auto',
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr minmax(375px, 450px) 1fr',
    gridTemplateRows: 'repeat(4, auto)',
    gridTemplateAreas: `
  ". currency-to-send ."
  ". receiver-address ."
  ". text-note        ."
  ". continue-button  ."
  `,
    gridGap: '24px',
    placeItems: 'center',
    placeContent: 'center',
  },

  currencyToSend: {
    gridArea: 'currency-to-send',
  },

  receiverAddress: {
    gridArea: 'receiver-address',
  },

  textNote: {
    gridArea: 'text-note',
  },

  continue: {
    gridArea: 'continue-button',
  },
}));

const Wallet = () => {
  const classes = useStyles();

  return (
    <div className={classes.wallet}>
      <CurrencyToSend positionedClass={classes.currencyToSend} />
      <ReceiverAddress positionedClass={classes.receiverAddress} />
      <TextNote positionedClass={classes.textNote} />
      <ContinueButton positionedClass={classes.continue} />
    </div>
  );
};

export default Wallet;
