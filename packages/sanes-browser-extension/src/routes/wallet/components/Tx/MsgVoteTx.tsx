import { Address } from "@iov/bcp";
import { Typography } from "medulas-react-components";
import * as React from "react";
import { ellipsifyMiddle } from "ui-logic";

interface MsgVoteTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly creator: Address;
  readonly selection: string;
  readonly proposalId: number;
}

const MsgVoteTx = ({ error, selection, proposalId, creator }: MsgVoteTxProps): JSX.Element => {
  const creatorShort = ellipsifyMiddle(creator, 18);

  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          Your attempt to vote{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {selection}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          on proposal{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {proposalId}
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
          You ({creatorShort}) have voted{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {selection}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          on proposal{" "}
        </Typography>
        <Typography weight="semibold" inline>
          {proposalId}
        </Typography>
        <Typography weight="light" inline>
          .
        </Typography>
      </React.Fragment>
    );
  }
};

export default MsgVoteTx;
