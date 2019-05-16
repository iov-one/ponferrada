const BLOCKED_URLS_KEY = 'buk';
const SEPARATOR = ',';

export class SenderWhitelist {
  private static blocked: ReadonlyArray<string> | undefined = undefined;

  public static load(): void {
    const blocked = localStorage.getItem(BLOCKED_URLS_KEY);
    SenderWhitelist.blocked = blocked ? blocked.split(SEPARATOR) : [];
  }

  public static isBlocked(sender: string): boolean {
    if (!SenderWhitelist.blocked) {
      throw new Error('SenderWhitelist has not been initialized');
    }

    const elem = SenderWhitelist.blocked.find(url => url === sender);

    return !!elem;
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
}
