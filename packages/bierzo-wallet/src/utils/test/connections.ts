import { getConfig } from "../../config";
import { establishConnection } from "../../logic/connection";

export async function establishAllConnections(): Promise<void> {
  const chains = (await getConfig()).chains;
  for (const chain of chains) {
    await establishConnection(chain.chainSpec);
  }
}
