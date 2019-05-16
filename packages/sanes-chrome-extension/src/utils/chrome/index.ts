export function extensionContext(): boolean {
  return typeof chrome !== 'undefined';
}
