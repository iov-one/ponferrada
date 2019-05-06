// WTC means "web to content"
export const WTC_MSG_HELLO = 'wtc_HELLO';

/**
 * String values will be used in the JSON message objects
 */
export enum MessageToBackgroundAction {
  ContentToBackground = 'ctb_HELLO',
  CreatePersona = 'create_persona',
}

/**
 * A message either from content script to background script or
 * from extension foreground to background script.
 */
export interface MessageToBackground {
  readonly action: MessageToBackgroundAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}
