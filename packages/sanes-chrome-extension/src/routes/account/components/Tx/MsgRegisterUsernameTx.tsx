import * as React from 'react';

interface MsgRegisterUsernameTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly iovAddress: string;
  readonly error?: any;
}

const MsgRegisterUsernameTx = ({
  id,
  blockExplorerUrl,
  iovAddress,
  error,
}: MsgRegisterUsernameTxProps): JSX.Element => {
  // TODO: implement
  // https://github.com/iov-one/ponferrada/issues/344
  return <React.Fragment />;
};

export default MsgRegisterUsernameTx;
