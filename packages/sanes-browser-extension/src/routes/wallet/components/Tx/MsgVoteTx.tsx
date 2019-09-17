import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgVoteTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly selection: string;
  readonly proposalId: number;
}

const MsgVoteTx = ({ error, selection, proposalId }: MsgVoteTxProps): JSX.Element => {
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
          was unsuccessful
        </Typography>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          You have voted{" "}
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
