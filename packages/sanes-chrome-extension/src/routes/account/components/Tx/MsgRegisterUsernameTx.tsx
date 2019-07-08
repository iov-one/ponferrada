import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';

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
  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          Your attempt to create{' '}
        </Typography>
        <Typography weight="semibold" inline link>
          {iovAddress}
        </Typography>
        <Typography weight="light" inline>
          {' '}
          username was{' '}
        </Typography>
        <Typography weight="semibold" inline>
          unsuccessful
        </Typography>
        <Typography weight="light" inline>
          , please try again later.
        </Typography>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          You have created{' '}
        </Typography>
        <Typography weight="semibold" inline link>
          {iovAddress}
        </Typography>
        <Typography weight="light" inline>
          {' '}
          username.
        </Typography>
      </React.Fragment>
    );
  }
};

export default MsgRegisterUsernameTx;
