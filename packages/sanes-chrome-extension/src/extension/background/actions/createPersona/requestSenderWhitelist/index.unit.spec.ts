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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(SenderWhitelist['blocked']!.length).toBe(2);
  });

  it('persists blocked senders to localStorage so that they survive a reload', () => {
    SenderWhitelist.block(SENDER_ONE);
    SenderWhitelist.load();

    expect(SenderWhitelist.isBlocked(SENDER_ONE)).toBeTruthy();
  });
});
