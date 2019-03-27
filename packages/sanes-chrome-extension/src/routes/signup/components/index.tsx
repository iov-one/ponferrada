import * as React from 'react';
import NewAccount from './NewAccount';

const dumpMethod = () => {
  console.log('Goto next screen');
};

const Layout = (): JSX.Element => {
  return <NewAccount nextStep={dumpMethod} />;
};

export default Layout;
