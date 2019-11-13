import { ExecuteProposalBatchAction } from "@iov/bns";
import * as React from "react";

import { ProposalActionOptions } from "./index";

interface Props {
  readonly action: ExecuteProposalBatchAction;
}
function ExecuteProposalBatch({ action }: Props): JSX.Element {
  return (
    <React.Fragment>
      {Object.entries(action.messages).map(([key, message]) => (
        <ProposalActionOptions key={key} action={message} header={true} />
      ))}
    </React.Fragment>
  );
}

export default ExecuteProposalBatch;
