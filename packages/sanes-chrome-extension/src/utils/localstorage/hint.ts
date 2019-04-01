export const HINT_PHRASE = 'HINT_PHRASE';

export function getHintPhrase(username: string): string | null {
  return localStorage.getItem(`${HINT_PHRASE}/${username}`);
}

export function storeHintPhrase(username: string, hint: string): void {
  localStorage.setItem(`${HINT_PHRASE}/${username}`, hint);
}
