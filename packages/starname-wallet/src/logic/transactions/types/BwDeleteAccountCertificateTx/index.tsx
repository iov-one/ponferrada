import { DeleteAccountCertificateTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwDeleteAccountCertificateParser extends BwParser<DeleteAccountCertificateTx> {
  public graphicalRepresentation(tx: ProcessedTx<DeleteAccountCertificateTx>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(
    tx: ProcessedTx<DeleteAccountCertificateTx>,
    lastOne: boolean,
  ): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
