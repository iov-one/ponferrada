import { Typography } from "medulas-react-components";
import * as React from "react";

interface MsgCreateProposalTxProps {
  readonly id: string;
  readonly blockExplorerUrl: string | null;
  readonly error?: any;
  readonly title: string;
}

const MsgCreateProposalTx = ({ title, error }: MsgCreateProposalTxProps): JSX.Element => {
  if (error) {
    return (
      <React.Fragment>
        <Typography weight="light" inline>
          Your attempt to create the proposal{" "}
        </Typography>
        <Typography weight="semibold" inline link>
          {title}
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
          You have created the proposal{" "}
        </Typography>
        <Typography weight="semibold" inline link>
          {title}
        </Typography>
        <Typography weight="light" inline>
          {" "}
          .
        </Typography>
      </React.Fragment>
    );
  }
};

export default MsgCreateProposalTx;
