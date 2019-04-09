import Persona from '../persona';
import { Amount, TokenTicker } from '@iov/bcp';

export function getBalances(
  persona: Persona,
  account: number
): ReadonlyArray<Amount> {
  console.log(`${persona} ${account}`);
  const iovAmount: Amount = {
    quantity: '102773830',
    fractionalDigits: 9,
    tokenTicker: 'IOV' as TokenTicker,
  };

  const ethAmount: Amount = {
    quantity: '978799000000000000',
    fractionalDigits: 18,
    tokenTicker: 'ETH' as TokenTicker,
  };

  const lskAmount: Amount = {
    quantity: '17738300',
    fractionalDigits: 8,
    tokenTicker: 'LSK' as TokenTicker,
  };

  return [iovAmount, ethAmount, lskAmount];
}
