import { Identity } from '@iov/bcp';
import { TransactionEncoder } from '@iov/core';
import { Dispatch } from 'redux';
export async function subscribeTransaction(
  keys: { [chain: string]: string },
  dispatch: Dispatch,
): Promise<void> {
  // subscribe to transactions
  // const transactionsStream = connection.liveTx({ sentFromOrTo: address });
}

export function unsubscribeTransactions(): void {}
