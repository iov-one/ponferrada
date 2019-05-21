import { SenderWhitelist } from './index';

describe('SenderWhitelist', () => {
  const BLOCKED_URLS_KEY = 'buk';
  const SEPARATOR = ',';
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
    const numBlocked = localStorage.getItem(BLOCKED_URLS_KEY)!.split(SEPARATOR).length;

    expect(numBlocked).toBe(2);
  });

  it('persists blocked senders to localStorage so that they survive a reload', () => {
    SenderWhitelist.block(SENDER_ONE);
    SenderWhitelist.load();

    expect(SenderWhitelist.isBlocked(SENDER_ONE)).toBeTruthy();
  });
});
