import { Typography } from "medulas-react-components";
import * as React from "react";
import { ellipsify } from "ui-logic";

interface MsgProps {
  readonly outgoing: boolean;
  readonly sender: string;
  readonly recipient: string;
  readonly amount: string;
  readonly onVisitSendPayment: (address: string) => () => void;
}

const Msg = ({ amount, outgoing, sender, recipient, onVisitSendPayment }: MsgProps): React.ReactElement => {
  const senderWeight = outgoing ? "regular" : "semibold";
  const recipientWeight = outgoing ? "semibold" : "regular";

  const senderShort = ellipsify(sender, 16);
  const recipientShort = ellipsify(recipient, 16);

  return (
    <React.Fragment>
      {outgoing ? (
        <Typography variant="body2" weight={senderWeight} inline>
          You
        </Typography>
      ) : (
        <Typography variant="body2" weight={senderWeight} inline link onClick={onVisitSendPayment(sender)}>
          {senderShort}
        </Typography>
      )}
      <Typography variant="body2" inline>
        {" sent "}
      </Typography>
      {outgoing ? (
        <Typography
          variant="body2"
          weight={recipientWeight}
          inline
          link
          onClick={onVisitSendPayment(recipient)}
        >
          {`${recipientShort} `}
        </Typography>
      ) : (
        <Typography variant="body2" weight={recipientWeight} inline>
          {"you "}
        </Typography>
      )}
      <Typography variant="body2" weight="semibold" inline>
        {amount}
      </Typography>
    </React.Fragment>
  );
};

export default Msg;
