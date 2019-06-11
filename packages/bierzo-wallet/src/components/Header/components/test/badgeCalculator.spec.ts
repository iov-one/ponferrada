import { TokenTicker } from '@iov/core';
import { randomString } from '~/logic/testhelpers';
import { ProcessedTx } from '~/store/notifications/state';
import { calcBadgeProps, hiddenBadge } from '../BellMenu/badgeCalculator';

describe('Component -> Header -> components -> BellMenu -> badgeCalculator', () => {
  let lastTx: ProcessedTx | undefined;

  beforeEach(() => {
    lastTx = {
      id: randomString(16),
      time: new Date(Date.now()),
      received: true,
      amount: { quantity: '100000', fractionalDigits: 0, tokenTicker: 'IOV' as TokenTicker },
      signer: randomString(16),
      recipient: randomString(16),
      success: true,
    };
  });

  it('should not show badge in case if no transactions', () => {
    expect(calcBadgeProps(undefined, undefined)).toBe(hiddenBadge);
  });

  it('should not show badge if last transaction time and id equals in localStorage', () => {
    const txFromStorage = JSON.parse(JSON.stringify(lastTx));
    // tslint:disable-next-line:no-object-mutation
    txFromStorage.time = new Date(txFromStorage);
    expect(calcBadgeProps(lastTx, txFromStorage)).toBe(hiddenBadge);
  });

  it('should show badge if localStorage empty and transaction exists and success', () => {
    expect(calcBadgeProps(lastTx, undefined)).toEqual({
      invisible: false,
      color: 'primary',
    });
  });

  it('should show badge if localStorage empty and transaction exists and not success', () => {
    lastTx = {
      id: randomString(16),
      time: new Date(Date.now()),
      received: true,
      amount: { quantity: '100000', fractionalDigits: 0, tokenTicker: 'IOV' as TokenTicker },
      signer: randomString(16),
      recipient: randomString(16),
      success: false,
    };
    expect(calcBadgeProps(lastTx, undefined)).toEqual({
      invisible: false,
      color: 'error',
    });
  });

  it('should show badge in case if newest transaction not in localStorage and success', () => {
    const currentDate = Date.now();
    const txFromStorage = {
      id: randomString(16),
      time: new Date(currentDate - 100000000000),
      received: true,
      amount: { quantity: '100000', fractionalDigits: 0, tokenTicker: 'IOV' as TokenTicker },
      signer: randomString(16),
      recipient: randomString(16),
      success: true,
    };
    expect(calcBadgeProps(lastTx, txFromStorage)).toEqual({
      invisible: false,
      color: 'primary',
    });
  });

  it('should show badge in case if newest transaction not in localStorage and not success', () => {
    lastTx = {
      id: randomString(16),
      time: new Date(Date.now()),
      received: true,
      amount: { quantity: '100000', fractionalDigits: 0, tokenTicker: 'IOV' as TokenTicker },
      signer: randomString(16),
      recipient: randomString(16),
      success: false,
    };
    const currentDate = Date.now();
    const txFromStorage = {
      id: randomString(16),
      time: new Date(currentDate - 100000000000),
      received: true,
      amount: { quantity: '100000', fractionalDigits: 0, tokenTicker: 'IOV' as TokenTicker },
      signer: randomString(16),
      recipient: randomString(16),
      success: true,
    };
    expect(calcBadgeProps(lastTx, txFromStorage)).toEqual({
      invisible: false,
      color: 'error',
    });
  });
});
