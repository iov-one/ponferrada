import { BnsConnection } from "@iov/bns";

import { getConfig } from "../config";

let bnsConnection: BnsConnection | undefined;

export async function getBnsConnection(): Promise<BnsConnection> {
  const config = await getConfig();
  const url = config.bnsChain.chainSpec.node;

  if (!bnsConnection) {
    bnsConnection = await BnsConnection.establish(url);
  }
  return bnsConnection;
}

/**
 * Disconnects all blockchain connections. Calling getConnectionFor after
 * this will establich a new connection.
 */
export function disconnect(): void {
  if (bnsConnection) bnsConnection.disconnect();

  bnsConnection = undefined;
}
