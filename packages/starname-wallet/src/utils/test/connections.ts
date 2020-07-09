import { getConfig } from "../../config";

export async function establishAllConnections(): Promise<void> {
  const chains = (await getConfig()).chains;
  for (const chain of chains) {
  }
}
