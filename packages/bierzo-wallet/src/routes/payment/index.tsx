import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';
import { ContinueButton } from './components/ContinueButton';
import { CurrencyToSend } from './components/CurrencyToSend';
import { ReceiverAddress } from './components/ReceiverAddress';
import { TextNote } from './components/TextNote';

const useStyles = makeStyles((theme: Theme) => ({
  payment: {
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

export const Payment = () => {
  const classes = useStyles();

  return (
    <Block className={classes.payment}>
      <CurrencyToSend positionedClass={classes.currencyToSend} />
      <ReceiverAddress positionedClass={classes.receiverAddress} />
      <TextNote positionedClass={classes.textNote} />
      <ContinueButton positionedClass={classes.continue} />
    </Block>
  );
};
