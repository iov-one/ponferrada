import { RegisterUsernameTx } from '@iov/bns';
import { List } from 'medulas-react-components/lib/components/List';
import * as React from 'react';

interface Props {
  readonly creator: string;
  readonly tx: RegisterUsernameTx;
}

const ReqRegisterUsernameTx = ({ tx, creator }: Props): JSX.Element => {
  // TODO: implement
  // https://github.com/iov-one/ponferrada/issues/349
  return <List />;
};

export default ReqRegisterUsernameTx;
