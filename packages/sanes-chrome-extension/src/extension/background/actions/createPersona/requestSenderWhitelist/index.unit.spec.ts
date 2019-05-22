import { SenderWhitelist } from './index';

describe('SenderWhitelist', () => {
  const SENDER_ONE = 'Example Sender 1';
  const SENDER_TWO = 'Example Sender 2';

  beforeEach(() => {
    localStorage.clear();
    SenderWhitelist.load();
  });

  it('does not store duplicate blocked senders', () => {
    SenderWhitelist.block(SENDER_ONE);
    SenderWhitelist.block(SENDER_ONE);
    SenderWhitelist.block(SENDER_TWO);
    SenderWhitelist.block(SENDER_ONE);
    SenderWhitelist.block(SENDER_TWO);

    // SenderWhitelist does not expose the array of blocked domains, so this is an exceptional
    // use case which can not be used in regular code because it violates private modifier of blocked variable.
    expect(SenderWhitelist['blocked']!.length).toBe(2); // eslint-disable-line
  });

  it('persists blocked senders to localStorage so that they survive a reload', () => {
    SenderWhitelist.block(SENDER_ONE);
    SenderWhitelist.load();

    expect(SenderWhitelist.isBlocked(SENDER_ONE)).toBeTruthy();
  });
});
