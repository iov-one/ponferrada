import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { elipsify } from '../../../../utils/strings';

interface MsgErrorProps {
  readonly amount: string;
  readonly recipient: string;
}

const MsgError = ({ amount, recipient }: MsgErrorProps): JSX.Element => {
  const shortRecipient = elipsify(recipient, 16);

  return (
    <React.Fragment>
      <Typography weight="light" inline>
        {'Your '}
      </Typography>
      <Typography weight="semibold" inline>
        {amount}
      </Typography>
      <Typography weight="semibold" inline>
        {' payment to '}
      </Typography>
      <Typography weight="semibold" inline link>
        {shortRecipient}
      </Typography>
      <Typography weight="light" inline>
        {' was '}
      </Typography>
      <Typography weight="semibold" inline>
        {'unsuccessful'}
      </Typography>
      <Typography weight="light" inline>
        {', please try again later'}
      </Typography>
      <Block marginBottom={1.5} />
    </React.Fragment>
  );
};

export default MsgError;
