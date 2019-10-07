import { Address } from "@iov/bcp";
import { Typography } from "medulas-react-components";
import * as React from "react";
import { ellipsifyMiddle } from "ui-logic";

interface MsgCreateProposalTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly creator: Address;
  readonly title: string;
}

const MsgCreateProposalTx = ({ title, error, creator }: MsgCreateProposalTxProps): JSX.Element => {
  const creatorShort = ellipsifyMiddle(creator, 18);

  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          Your attempt to create the proposal{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {title}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          from{" "}
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
          You ({creatorShort}) have created the proposal{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {title}
        </Typography>
      </React.Fragment>
    );
  }
};

export default MsgCreateProposalTx;
