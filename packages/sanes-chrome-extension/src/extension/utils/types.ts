/**
 * A message either from content script to background script or
 * from extension foreground to background script.
 */
export interface MessageToBackground {
  readonly action: MessageToBackgroundAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data?: any;
}

/**
 * String values will be used in the JSON message objects
 */
export enum MessageToBackgroundAction {
  ContentToBackground = 'ctb_HELLO',
  CreatePersona = 'create_persona',
}
