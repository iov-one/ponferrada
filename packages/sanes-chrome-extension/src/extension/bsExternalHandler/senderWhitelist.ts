export function isNewSender(sender: string): boolean {
  return true;
}

const ALLOWED_URLS_KEY = 'auk';
const BLOCKED_URLS_KEY = 'buk';
const SEPARATOR = '|';

export class SenderWhitelist {
  private static blocked: ReadonlyArray<string> | undefined = undefined;
  private static allowed: ReadonlyArray<string> | undefined = undefined;

  public static load(): void {
    const allowed = localStorage.getItem(ALLOWED_URLS_KEY);
    const blocked = localStorage.getItem(BLOCKED_URLS_KEY);

    SenderWhitelist.allowed = allowed ? allowed.split(SEPARATOR) : [];
    SenderWhitelist.blocked = blocked ? blocked.split(SEPARATOR) : [];
  }

  public static isBlocked(sender: string): boolean {
    if (!SenderWhitelist.blocked) {
      throw new Error('SenderWhitelist has not been initialized');
    }

    const elem = SenderWhitelist.blocked.find(url => url === sender);

    return !!elem;
  }

  public static isAllowed(sender: string): boolean {
    if (!SenderWhitelist.allowed) {
      throw new Error('SenderWhitelist has not been initialized');
    }

    const elem = SenderWhitelist.allowed.find(url => url === sender);

    return !!elem;
  }

  public static isNewSender(sender: string): boolean {
    return !SenderWhitelist.isBlocked(sender) && !SenderWhitelist.isAllowed(sender);
  }

  public static loaded(): boolean {
    return SenderWhitelist.blocked !== undefined && SenderWhitelist.allowed !== undefined;
  }
}
