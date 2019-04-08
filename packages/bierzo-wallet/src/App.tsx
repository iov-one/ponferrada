import React from 'react';
import Wallet from './components/wallet/Wallet';

const App = () => {
  const style: React.CSSProperties = {
    backgroundColor: '#bb33bb',
  };

  return (
    <div style={style}>
      <Wallet />
    </div>
  );
};

export default App;
