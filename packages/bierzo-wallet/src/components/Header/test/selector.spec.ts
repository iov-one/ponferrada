import { Amount } from '@iov/bcp';
import { TokenTicker } from '@iov/core';
import { randomString } from '~/logic/testhelpers';
import { aNewStore } from '~/store';
import { ProcessedTx } from '~/store/notifications/state';
import { lastTxSelector } from '../selector';

function callSelector(store: any): any {
  const confirmedTxSelector = store.getState().notification.transaction || [];
  return lastTxSelector.resultFunc(confirmedTxSelector);
}

describe('selector', () => {
  describe('lastTxSelector', () => {
    let mockRootStoreBase: any = {};

    beforeEach(() => {
      mockRootStoreBase = {
        notification: {
          transaction: [],
        },
      };
    });

    it('should return undefine in case if no transactions found', () => {
      const store = aNewStore(mockRootStoreBase);
      const lastTx = callSelector(store);
      expect(lastTx).toBeUndefined();
    });

    it('should return newest transaction in list', () => {
      const dateNow = new Date(Date.now());
      const amount: Amount = { quantity: '100000', fractionalDigits: 0, tokenTicker: 'IOV' as TokenTicker };
      const transactions: ReadonlyArray<ProcessedTx> = [
        {
          id: randomString(16),
          time: new Date(dateNow.setMinutes(dateNow.getMinutes() + 10)),
          received: true,
          amount: amount,
          signer: randomString(16),
          recipient: randomString(16),
          success: true,
        },
        {
          id: randomString(16),
          time: new Date(dateNow.setMinutes(dateNow.getMinutes() + 20)),
          received: true,
          amount: amount,
          signer: randomString(16),
          recipient: randomString(16),
          success: true,
        },
        {
          id: randomString(16),
          time: new Date(dateNow.setMinutes(dateNow.getMinutes() + 30)),
          received: true,
          amount: amount,
          signer: randomString(16),
          recipient: randomString(16),
          success: true,
        },
      ];
      // tslint:disable-next-line:no-object-mutation
      mockRootStoreBase.notification.transaction = transactions;
      const store = aNewStore(mockRootStoreBase);
      const lastTx = callSelector(store);
      expect(lastTx).toEqual(transactions[0]);
    });
  });
});
