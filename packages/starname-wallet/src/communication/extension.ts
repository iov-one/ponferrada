export interface ExtensionStatus {
  readonly connected: boolean;
  readonly installed: boolean;
  readonly identities: readonly string[];
}

export async function getExtensionStatus(): Promise<ExtensionStatus> {
  return {
    installed: false,
    connected: false,
    identities: [],
  };
}
