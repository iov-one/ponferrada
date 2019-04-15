import * as React from 'react';
import Block from 'medulas-react-components/lib/components/Block';

interface Props {
  blockchainAccounts: ReadonlyArray<string>;
}

const Account = ({ blockchainAccounts }: Props): JSX.Element => {
  console.log(blockchainAccounts);
  return (
    <React.Fragment>
      <Block>This is the block where we show accounts and bns name</Block>
      <Block>This is the block where we show balances</Block>
      <Block>This is the block where we show QR Code</Block>
      <Block>This is the block where we show links</Block>
    </React.Fragment>
  );
};

export default Account;
