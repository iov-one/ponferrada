import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";

import { elipsify } from "../../../../../../utils/strings";

interface MsgProps {
  readonly incoming: boolean;
  readonly signer: string;
  readonly recipient: string;
  readonly amount: string;
  readonly onVisitSendPayment: (address: string) => () => void;
}

const Msg = ({ amount, incoming, signer, recipient, onVisitSendPayment }: MsgProps): JSX.Element => {
  const signerWeight = incoming ? "semibold" : "regular";
  const recipientWeight = incoming ? "regular" : "semibold";

  const signerShort = elipsify(signer, 16);
  const recipientShort = elipsify(recipient, 16);

  return (
    <React.Fragment>
      {incoming ? (
        <Typography variant="body2" weight={signerWeight} inline link onClick={onVisitSendPayment(signer)}>
          {signerShort}
        </Typography>
      ) : (
        <Typography variant="body2" weight={signerWeight} inline>
          You
        </Typography>
      )}
      <Typography variant="body2" inline>
        {" sent "}
      </Typography>
      {incoming ? (
        <Typography variant="body2" weight={recipientWeight} inline>
          {"you "}
        </Typography>
      ) : (
        <Typography
          variant="body2"
          weight={recipientWeight}
          inline
          link
          onClick={onVisitSendPayment(recipient)}
        >
          {`${recipientShort} `}
        </Typography>
      )}
      <Typography variant="body2" weight="semibold" inline>
        {amount}
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
