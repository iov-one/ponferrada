import * as React from 'react';

interface MsgRegisterUsernameTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly iovAddress: string;
}

const MsgRegisterUsernameTx = ({
  id,
  blockExplorerUrl,
  error,
  iovAddress,
}: MsgRegisterUsernameTxProps): JSX.Element => {
  // TODO: implement
  // https://github.com/iov-one/ponferrada/issues/344
  return <React.Fragment />;
};

export default MsgRegisterUsernameTx;
