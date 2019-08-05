import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";

import { elipsify } from "../../../../../../utils/strings";

interface MsgProps {
  readonly received: boolean;
  readonly signer: string;
  readonly recipient: string;
  readonly amount: string;
  readonly onVisitSendPayment: (address: string) => () => void;
}

const Msg = ({ amount, received, signer, recipient, onVisitSendPayment }: MsgProps): JSX.Element => {
  const signerWeight = received ? "semibold" : "regular";
  const recipientWeight = received ? "regular" : "semibold";

  const signerShort = elipsify(signer, 16);
  const recipientShort = elipsify(recipient, 16);

  return (
    <React.Fragment>
      {received ? (
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
      {received ? (
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
