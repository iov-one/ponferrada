import { Address } from "@iov/bcp";
import { Typography } from "medulas-react-components";
import * as React from "react";
import { ellipsifyMiddle } from "ui-logic";

interface MsgRegisterUsernameTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly creator: Address;
  readonly iovAddress: string;
}

const MsgRegisterUsernameTx = ({
  id,
  blockExplorerUrl,
  error,
  creator,
  iovAddress,
}: MsgRegisterUsernameTxProps): JSX.Element => {
  const creatorShort = ellipsifyMiddle(creator, 18);

  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          Your attempt to create{" "}
        </Typography>
        <Typography weight="semibold" inline link>
          {iovAddress}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          personalized address from{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {creatorShort}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          was unsuccessful
        </Typography>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          You ({creatorShort}) have created{" "}
        </Typography>
        <Typography weight="semibold" inline link>
          {iovAddress}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          personalized address.
        </Typography>
      </React.Fragment>
    );
  }
};

export default MsgRegisterUsernameTx;
