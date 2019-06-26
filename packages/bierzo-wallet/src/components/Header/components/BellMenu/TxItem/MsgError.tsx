import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { elipsify } from '../../../../../utils/strings';

interface MsgErrorProps {
  readonly amount: string;
  readonly recipient: string;
  readonly onVisitSendPayment: (address: string) => () => void;
}

const MsgError = ({ amount, recipient, onVisitSendPayment }: MsgErrorProps): JSX.Element => {
  const shortRecipient = elipsify(recipient, 16);

  return (
    <React.Fragment>
      <Typography variant="body2" inline>
        {'Your '}
      </Typography>
      <Typography variant="body2" weight="semibold" inline>
        {amount}
      </Typography>
      <Typography variant="body2" inline>
        {' payment to '}
      </Typography>
      <Typography variant="body2" weight="semibold" inline link onClick={onVisitSendPayment(recipient)}>
        {shortRecipient}
      </Typography>
      <Typography variant="body2" inline>
        {' was '}
      </Typography>
      <Typography variant="body2" weight="semibold" inline>
        {'unsuccessful'}
      </Typography>
      <Typography variant="body2" inline>
        {', please try again later'}
      </Typography>
    </React.Fragment>
  );
};

export default MsgError;
