import * as React from 'react';
import Block from 'medulas-react-components/lib/components/Block';

interface Props {
  blockchainAccounts: ReadonlyArray<string>;
}

const Account = ({ blockchainAccounts }: Props): JSX.Element => (
  <React.Fragment>
    {blockchainAccounts.map(acc => (
      <Block key={acc}>acc</Block>
    ))}
  </React.Fragment>
);

export default Account;
