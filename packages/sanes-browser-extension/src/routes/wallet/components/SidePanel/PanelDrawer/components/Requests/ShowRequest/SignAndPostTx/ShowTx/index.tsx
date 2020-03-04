import { isSendTransaction } from "@iov/bcp";
import {
  isCreateProposalTx,
  isRegisterAccountTx,
  isRegisterDomainTx,
  isRegisterUsernameTx,
  isReplaceAccountTargetsTx,
  isUpdateTargetsOfUsernameTx,
  isVoteTx,
} from "@iov/bns";
import { Block, Button, Typography } from "medulas-react-components";
import * as React from "react";

import { SupportedTransaction } from "../../../../../../../../../../extension/background/model/persona";
import ReqCreateProposalTx from "./ReqCreateProposalTx";
import ReqRegisterAccountTx from "./ReqRegisterAccountTx";
import ReqRegisterDomainTx from "./ReqRegisterDomainTx";
import ReqRegisterUsernameTx from "./ReqRegisterUsernameTx";
import ReqReplaceAccountTargetsTx from "./ReqReplaceAccountTargetsTx";
import ReqSendTransaction from "./ReqSendTransaction";
import ReqUpdateTargetsOfUsernameTx from "./ReqUpdateTargetsOfUsernameTx";
import ReqVoteTx from "./ReqVoteTx";

export const showTxHtmlId = "tx-request-show";

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly sender: string;
  readonly tx: SupportedTransaction;
}

const ShowTx = ({ sender, tx, onAcceptRequest, showRejectView }: Props): JSX.Element => {
  let req: JSX.Element;

  if (isSendTransaction(tx)) {
    req = <ReqSendTransaction tx={tx} />;
  } else if (isRegisterUsernameTx(tx)) {
    req = <ReqRegisterUsernameTx tx={tx} />;
  } else if (isUpdateTargetsOfUsernameTx(tx)) {
    req = <ReqUpdateTargetsOfUsernameTx tx={tx} />;
  } else if (isRegisterDomainTx(tx)) {
    req = <ReqRegisterDomainTx tx={tx} />;
  } else if (isRegisterAccountTx(tx)) {
    req = <ReqRegisterAccountTx tx={tx} />;
  } else if (isReplaceAccountTargetsTx(tx)) {
    req = <ReqReplaceAccountTargetsTx tx={tx} />;
  } else if (isCreateProposalTx(tx)) {
    req = <ReqCreateProposalTx tx={tx} />;
  } else if (isVoteTx(tx)) {
    req = <ReqVoteTx tx={tx} />;
  } else {
    throw new Error("Received transaction type that cannot be displayed");
  }

  return (
    <Block id={showTxHtmlId}>
      <Block textAlign="center" marginBottom={2}>
        <Typography variant="body1" inline>
          {"The following site: "}
        </Typography>
        <Typography variant="body1" color="primary" inline>
          {sender}
        </Typography>
        <Typography variant="body1" inline>
          {" wants you to sign:"}
        </Typography>
      </Block>
      {req}
      <Block marginBottom={3} />
      <Button variant="contained" fullWidth onClick={onAcceptRequest}>
        Approve
      </Button>
      <Block marginTop={2} />
      <Button variant="contained" fullWidth color="secondary" onClick={showRejectView}>
        Reject
      </Button>
      <Block marginBottom={2} />
    </Block>
  );
};

export default ShowTx;
