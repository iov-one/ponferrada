import { ChainId } from "@iov/bcp";
import { BnsConnection, createBnsConnector } from "@iov/bns";

import { getConfig } from "../config";

let bnsConnection: BnsConnection | undefined;

export async function getBnsConnection(): Promise<BnsConnection> {
  if (bnsConnection) return bnsConnection;

  const { bnsChain } = await getConfig();
  const chainConnector = createBnsConnector(bnsChain.chainSpec.node, bnsChain.chainSpec.chainId as ChainId);
  // eslint-disable-next-line require-atomic-updates
  bnsConnection = (await chainConnector.establishConnection()) as BnsConnection;
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
