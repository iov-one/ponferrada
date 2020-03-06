import { ReplaceAccountMsgFeesTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwReplaceAccountMsgFeesParser extends BwParser<ReplaceAccountMsgFeesTx> {
  public graphicalRepresentation(tx: ProcessedTx<ReplaceAccountMsgFeesTx>): JSX.Element {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<ReplaceAccountMsgFeesTx>, lastOne: boolean): JSX.Element {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
