import { UpdateAccountConfigurationTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwUpdateAccountConfigurationParser extends BwParser<UpdateAccountConfigurationTx> {
  public graphicalRepresentation(tx: ProcessedTx<UpdateAccountConfigurationTx>): JSX.Element {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(tx: ProcessedTx<UpdateAccountConfigurationTx>, lastOne: boolean): JSX.Element {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
