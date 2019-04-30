import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import { elipsify } from '../../../../utils/strings';

interface MsgErrorProps {
  readonly amount: string;
  readonly recipient: string;
  readonly onDetailedView: () => void;
}

const MsgError = ({ amount, recipient, onDetailedView }: MsgErrorProps): JSX.Element => {
  const shortRecipient = elipsify(recipient, 16);

  return (
    <React.Fragment>
      <Typography inline>{'Your '}</Typography>
      <Typography weight="semibold" inline>
        {amount}
      </Typography>
      <Typography inline>{' payment to '}</Typography>
      <Typography weight="semibold" inline link onClick={onDetailedView}>
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
