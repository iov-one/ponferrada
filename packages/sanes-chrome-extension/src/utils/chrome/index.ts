/*global chrome*/
export function extensionContext(): boolean {
  return typeof chrome !== 'undefined' && typeof chrome.runtime.onMessage !== 'undefined';
}
