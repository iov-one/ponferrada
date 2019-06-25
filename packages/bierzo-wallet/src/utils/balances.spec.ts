import { TokenTicker } from '@iov/bcp';
import { makeAmount as makeInfo, parseFigures, stringToAmount } from './balances';

describe('stringToAmount', () => {
  const eth = 'ETH' as TokenTicker;

  it('should handle whole numbers', () => {
    expect(stringToAmount('2340', eth)).toEqual(makeInfo('2340', 0, eth));
    expect(stringToAmount('873', eth)).toEqual(makeInfo('873', 0, eth));
  });

  it('should handle fractional numbers with or without leading 0', () => {
    expect(stringToAmount('0.1234', eth)).toEqual(makeInfo('1234', 4, eth));
    expect(stringToAmount('.1234', eth)).toEqual(makeInfo('1234', 4, eth));
    expect(stringToAmount('0,023', eth)).toEqual(makeInfo('023', 3, eth));
    expect(stringToAmount('0.170', eth)).toEqual(makeInfo('17', 2, eth));
  });
});

describe('parseFigures', () => {
  it('should handle whole numbers', () => {
    expect(parseFigures('1200')).toEqual({ quantity: '1200', fractionalDigits: 0 });
    expect(parseFigures('765')).toEqual({ quantity: '765', fractionalDigits: 0 });
  });

  it('should handle fractional numbers with or without leading 0', () => {
    expect(parseFigures('0.1234')).toEqual({ quantity: '1234', fractionalDigits: 4 });
    expect(parseFigures('.1234')).toEqual({ quantity: '1234', fractionalDigits: 4 });
    expect(parseFigures('0.023')).toEqual({ quantity: '023', fractionalDigits: 3 });
  });

  it('should return number even with trailing dot or comma', () => {
    expect(parseFigures('1.')).toEqual({ quantity: '1', fractionalDigits: 0 });
    expect(parseFigures('2,')).toEqual({ quantity: '2', fractionalDigits: 0 });
  });

  it('should support , as separator', () => {
    expect(parseFigures('0,1234')).toEqual({ quantity: '1234', fractionalDigits: 4 });
    expect(parseFigures('13,67')).toEqual({ quantity: '1367', fractionalDigits: 2 });
    expect(parseFigures(',00420')).toEqual({ quantity: '0042', fractionalDigits: 4 });
  });

  it('should remove trailing zeros from fraction', () => {
    expect(parseFigures('0,1230')).toEqual({ quantity: '123', fractionalDigits: 3 });
    expect(parseFigures('13.670')).toEqual({ quantity: '1367', fractionalDigits: 2 });
    expect(parseFigures('8,675')).toEqual({ quantity: '8675', fractionalDigits: 3 });
    expect(parseFigures('.00420')).toEqual({ quantity: '0042', fractionalDigits: 4 });
  });

  it('should error on invalid strings', () => {
    expect(() => parseFigures('12a')).toThrow(/Not a valid number/);
    expect(() => parseFigures('0x1234')).toThrow(/Not a valid number/);
    expect(() => parseFigures('-15.6')).toThrow(/Not a valid number/);
  });
});
