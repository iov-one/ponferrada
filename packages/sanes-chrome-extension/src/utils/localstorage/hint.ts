export const HINT_PHRASE = "HINT_PHRASE";

export function getHintPhrase(accountName: string): string | null {
  return localStorage.getItem(`${HINT_PHRASE}/${accountName}`);
}

export function storeHintPhrase(accountName: string, hint: string): void {
  localStorage.setItem(`${HINT_PHRASE}/${accountName}`, hint);
}
