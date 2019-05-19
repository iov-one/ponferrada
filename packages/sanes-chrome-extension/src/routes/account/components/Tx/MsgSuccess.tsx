import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { elipsify } from '../../../../utils/strings';

interface MsgProps {
  readonly recipient: string;
  readonly amount: string;
  readonly onDetailedView: () => void;
}

const Msg = ({ amount, recipient, onDetailedView }: MsgProps): JSX.Element => {
  const recipientShort = elipsify(recipient, 16);

  return (
    <React.Fragment>
      <Typography weight="regular" inline>
        You
      </Typography>
      <Typography inline>{' sent '}</Typography>
      <Typography weight="semibold" inline link onClick={onDetailedView}>
        {`${recipientShort} `}
      </Typography>
      <Typography weight="semibold" inline>
        {amount}
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
