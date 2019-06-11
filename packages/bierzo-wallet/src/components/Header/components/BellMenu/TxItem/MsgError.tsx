import * as React from 'react';
import Typography from '~/components/layout/Typography';
import { elipsify } from '~/utils/strings';

interface MsgErrorProps {
  readonly amount: string;
  readonly recipient: string;
  readonly onVisitSendPayment: (address: string) => () => void;
}

const MsgError = ({ amount, recipient, onVisitSendPayment }: MsgErrorProps) => {
  const shortRecipient = elipsify(recipient, 16);

  return (
    <React.Fragment>
      <Typography inline>{'Your '}</Typography>
      <Typography weight="semibold" inline>
        {amount}
      </Typography>
      <Typography inline>{' payment to '}</Typography>
      <Typography weight="semibold" inline pointer onClick={onVisitSendPayment(recipient)}>
        {shortRecipient}
      </Typography>
      <Typography inline>{' was '}</Typography>
      <Typography weight="semibold" inline>
        {'unsuccessful'}
      </Typography>
      <Typography inline>{', please try again later'}</Typography>
    </React.Fragment>
  );
};

export default MsgError;
