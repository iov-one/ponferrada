import { StdTx, Transaction } from "logic/api";
import React from "react";
import { ReadonlyDate } from "readonly-date";

export interface ProcessedTx {
  readonly time: ReadonlyDate;
  readonly id: string;
  readonly original: StdTx;
}

export abstract class BwParser<K extends Transaction> {
  public async parse(transaction: K, _: string): Promise<ProcessedTx> {
    return {
      id: transaction.hash,
      time: new Date(),
      original: transaction.tx,
    };
  }
  abstract graphicalRepresentation(tx: ProcessedTx, addresses: string[]): React.ReactElement;
  abstract headerRepresentation(tx: ProcessedTx, lastOne: boolean): React.ReactElement;
}
