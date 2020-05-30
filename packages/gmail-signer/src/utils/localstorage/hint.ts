export const HINT_PHRASE = "HINT_PHRASE";

export function getHintPhrase(): string | null {
  return localStorage.getItem(`${HINT_PHRASE}`);
}

export function storeHintPhrase(hint: string): void {
  localStorage.setItem(`${HINT_PHRASE}`, hint);
}
