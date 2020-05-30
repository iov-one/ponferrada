const BLOCKED_URLS_KEY = "buk";
const SEPARATOR = ",";

export class SenderWhitelist {
  private blocked: readonly string[] = [];

  public constructor() {
    this.load();
  }

  private load(): void {
    const storedBlocked = localStorage.getItem(BLOCKED_URLS_KEY);
    this.blocked = storedBlocked ? storedBlocked.split(SEPARATOR) : [];
  }

  public isBlocked(sender: string): boolean {
    if (!this.blocked) {
      throw new Error("SenderWhitelist has not been initialized");
    }

    const elem = this.blocked.find(url => url === sender);

    return !!elem;
  }

  public block(sender: string): void {
    const blockedElements = this.blocked || [];
    const elem = blockedElements.find(url => url === sender);
    if (elem) {
      return;
    }

    const elements = [...blockedElements, sender];
    localStorage.setItem(BLOCKED_URLS_KEY, elements.toString());

    this.load();
  }
}
