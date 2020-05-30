export const bnsRpc = "BNS_RPC";

export interface StorageRpcData {
  readonly networkName: string;
  readonly rpcUrl: string;
}

export function getBnsRpc(): StorageRpcData | null {
  const bnsRpcString = localStorage.getItem(bnsRpc);
  if (bnsRpcString) {
    return JSON.parse(bnsRpcString);
  }

  return null;
}

export function storeBnsRpc(rpc: StorageRpcData): void {
  localStorage.setItem(bnsRpc, JSON.stringify(rpc));
}
