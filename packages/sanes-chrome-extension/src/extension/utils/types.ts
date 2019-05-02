/**
 * A message either from content script to background script or
 * from extension foreground to background script.
 */
export interface MessageToBackground {
  readonly action: 'ctb_HELLO' | 'create_persona';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}
