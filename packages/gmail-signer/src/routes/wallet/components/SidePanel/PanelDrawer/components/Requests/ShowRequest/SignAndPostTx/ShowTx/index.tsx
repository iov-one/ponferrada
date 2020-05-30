import { isSendTransaction } from "@iov/bcp";
import {
  isAddAccountCertificateTx,
  isCreateProposalTx,
  isDeleteAccountCertificateTx,
  isDeleteAccountTx,
  isDeleteAllAccountsTx,
  isDeleteDomainTx,
  isRegisterAccountTx,
  isRegisterDomainTx,
  isRegisterUsernameTx,
  isRenewAccountTx,
  isRenewDomainTx,
  isReplaceAccountMsgFeesTx,
  isReplaceAccountTargetsTx,
  isTransferAccountTx,
  isTransferDomainTx,
  isTransferUsernameTx,
  isUpdateAccountConfigurationTx,
  isUpdateTargetsOfUsernameTx,
  isVoteTx,
} from "@iov/bns";
import { Block, Button, Typography } from "medulas-react-components";
import * as React from "react";

import { SupportedTransaction } from "../../../../../../../../../../extension/background/model/persona";
import ReqAddAccountCertificateTx from "./ReqAddAccountCertificateTx";
import ReqCreateProposalTx from "./ReqCreateProposalTx";
import ReqDeleteAccountCertificateTx from "./ReqDeleteAccountCertificateTx";
import ReqDeleteAccountTx from "./ReqDeleteAccountTx";
import ReqDeleteAllAccountsTx from "./ReqDeleteAllAccountsTx";
import ReqDeleteDomainTx from "./ReqDeleteDomainTx";
import ReqRegisterAccountTx from "./ReqRegisterAccountTx";
import ReqRegisterDomainTx from "./ReqRegisterDomainTx";
import ReqRegisterUsernameTx from "./ReqRegisterUsernameTx";
import ReqRenewAccountTx from "./ReqRenewAccountTx";
import ReqRenewDomainTx from "./ReqRenewDomainTx";
import ReqReplaceAccountMsgFeesTx from "./ReqReplaceAccountMsgFeesTx";
import ReqReplaceAccountTargetsTx from "./ReqReplaceAccountTargetsTx";
import ReqSendTransaction from "./ReqSendTransaction";
import ReqTransferAccountTx from "./ReqTransferAccountTx";
import ReqTransferDomainTx from "./ReqTransferDomainTx";
import ReqTransferUsernameTx from "./ReqTransferUsernameTx";
import ReqUpdateAccountConfigurationTx from "./ReqUpdateAccountConfigurationTx";
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
  } else if (isTransferUsernameTx(tx)) {
    req = <ReqTransferUsernameTx tx={tx} />;
  } else if (isUpdateTargetsOfUsernameTx(tx)) {
    req = <ReqUpdateTargetsOfUsernameTx tx={tx} />;
  } else if (isRegisterDomainTx(tx)) {
    req = <ReqRegisterDomainTx tx={tx} />;
  } else if (isTransferDomainTx(tx)) {
    req = <ReqTransferDomainTx tx={tx} />;
  } else if (isRenewDomainTx(tx)) {
    req = <ReqRenewDomainTx tx={tx} />;
  } else if (isDeleteDomainTx(tx)) {
    req = <ReqDeleteDomainTx tx={tx} />;
  } else if (isRegisterAccountTx(tx)) {
    req = <ReqRegisterAccountTx tx={tx} />;
  } else if (isTransferAccountTx(tx)) {
    req = <ReqTransferAccountTx tx={tx} />;
  } else if (isReplaceAccountTargetsTx(tx)) {
    req = <ReqReplaceAccountTargetsTx tx={tx} />;
  } else if (isDeleteAccountTx(tx)) {
    req = <ReqDeleteAccountTx tx={tx} />;
  } else if (isDeleteAllAccountsTx(tx)) {
    req = <ReqDeleteAllAccountsTx tx={tx} />;
  } else if (isRenewAccountTx(tx)) {
    req = <ReqRenewAccountTx tx={tx} />;
  } else if (isAddAccountCertificateTx(tx)) {
    req = <ReqAddAccountCertificateTx tx={tx} />;
  } else if (isReplaceAccountMsgFeesTx(tx)) {
    req = <ReqReplaceAccountMsgFeesTx tx={tx} />;
  } else if (isDeleteAccountCertificateTx(tx)) {
    req = <ReqDeleteAccountCertificateTx tx={tx} />;
  } else if (isUpdateAccountConfigurationTx(tx)) {
    req = <ReqUpdateAccountConfigurationTx tx={tx} />;
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
