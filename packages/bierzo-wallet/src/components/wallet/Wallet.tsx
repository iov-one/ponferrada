import React from 'react';
import Continue from './Continue';
import CurrencyToSend from './CurrencyToSend';
import Note from './Note';
import ReceiverAddress from './ReceiverAddress';

const Wallet = () => {
  const styleGrid: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    height: 'auto',
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr minmax(375px, 450px) 1fr',
    gridTemplateRows: 'repeat(4, auto)',
    gridTemplateAreas: `
    ". currency-to-send ."
    ". receiver-address ."
    ". note             ."
    ". continue         ."
    `,
    gridGap: '20px',
    alignItems: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  };

  const styleCurrencyToSend: React.CSSProperties = {
    gridArea: 'currency-to-send',
  };

  const styleReceiverAddress: React.CSSProperties = {
    gridArea: 'receiver-address',
  };

  const styleNote: React.CSSProperties = {
    gridArea: 'note',
  };

  const styleContinue: React.CSSProperties = {
    gridArea: 'continue',
  };

  return (
    <div style={styleGrid}>
      <CurrencyToSend style={styleCurrencyToSend} />
      <ReceiverAddress style={styleReceiverAddress} />
      <Note style={styleNote} />
      <Continue style={styleContinue} />
    </div>
  );
};

export default Wallet;
