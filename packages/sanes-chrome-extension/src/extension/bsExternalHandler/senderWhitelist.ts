const ALLOWED_URLS_KEY = 'auk';
const BLOCKED_URLS_KEY = 'buk';
const SEPARATOR = ',';

export class SenderWhitelist {
  private static blocked: ReadonlyArray<string> | undefined = undefined;
  private static allowed: ReadonlyArray<string> | undefined = undefined;

  public static load(): void {
    SenderWhitelist.allowed = SenderWhitelist.loadAllowed();
    SenderWhitelist.blocked = SenderWhitelist.loadBlocked();
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

  public static block(sender: string): void {
    const blockedElements = SenderWhitelist.blocked || [];
    const elem = blockedElements.find(url => url === sender);
    if (elem) {
      return;
    }

    const elements = [...blockedElements, sender];
    localStorage.setItem(BLOCKED_URLS_KEY, elements.toString());

    SenderWhitelist.load();
  }

  private static loadBlocked(): ReadonlyArray<string> {
    const blocked = localStorage.getItem(BLOCKED_URLS_KEY);
    return blocked ? blocked.split(SEPARATOR) : [];
  }

  private static loadAllowed(): ReadonlyArray<string> {
    const allowed = localStorage.getItem(ALLOWED_URLS_KEY);
    return allowed ? allowed.split(SEPARATOR) : [];
  }
}
