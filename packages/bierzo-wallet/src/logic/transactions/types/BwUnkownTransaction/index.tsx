import { UnsignedTransaction } from "@iov/bcp";
import * as React from "react";

import { BwParser, ProcessedTx } from "../../types/BwParser";
import UnkownTransactionHeader from "./ui/UnknownTxHeader";
import UnkownTransactionRow from "./ui/UnknownTxRow";

export class BwUnkownParser extends BwParser<UnsignedTransaction> {
  public graphicalRepresentation(tx: ProcessedTx<UnsignedTransaction>): JSX.Element {
    return <UnkownTransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<UnsignedTransaction>, lastOne: boolean): JSX.Element {
    return <UnkownTransactionHeader key={tx.id} tx={tx} lastOne={lastOne} />;
  }
}
