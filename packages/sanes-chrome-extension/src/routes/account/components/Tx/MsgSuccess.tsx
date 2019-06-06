import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { elipsify } from '../../../../utils/strings';

interface MsgProps {
  readonly recipient: string;
  readonly amount: string;
  readonly onDetailedView: () => void;
}

const Msg = ({ amount, recipient, onDetailedView }: MsgProps): JSX.Element => {
  const recipientShort = elipsify(recipient, 24);

  return (
    <React.Fragment>
      <Typography weight="light" inline>
        You
      </Typography>
      <Typography weight="semibold" inline>
        {` sent ${amount} `}
      </Typography>
      <Typography weight="light" inline>
        {'to '}
      </Typography>
      <Block marginBottom={1}>
        <Typography weight="semibold" onClick={onDetailedView}>
          {`${recipientShort} `}
        </Typography>
      </Block>
    </React.Fragment>
  );
};

export default Msg;
