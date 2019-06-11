import * as React from 'react';
import Typography from '~/components/layout/Typography';
import { elipsify } from '~/utils/strings';

interface MsgProps {
  readonly received: boolean;
  readonly signer: string;
  readonly recipient: string;
  readonly amount: string;
  readonly onVisitSendPayment: (address: string) => () => void;
}

const Msg = ({ amount, received, signer, recipient, onVisitSendPayment }: MsgProps) => {
  const signerWeight = received ? 'semibold' : 'regular';
  const recipientWeight = received ? 'regular' : 'semibold';

  const signerShort = elipsify(signer, 16);
  const recipientShort = elipsify(recipient, 16);

  return (
    <React.Fragment>
      {received ? (
        <Typography weight={signerWeight} inline pointer onClick={onVisitSendPayment(signer)}>
          {signerShort}
        </Typography>
      ) : (
        <Typography weight={signerWeight} inline>
          You
        </Typography>
      )}
      <Typography inline>{' sent '}</Typography>
      {received ? (
        <Typography weight={recipientWeight} inline>
          {'you '}
        </Typography>
      ) : (
        <Typography weight={recipientWeight} inline pointer onClick={onVisitSendPayment(recipient)}>
          {`${recipientShort} `}
        </Typography>
      )}
      <Typography weight="semibold" inline>
        {amount}
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
