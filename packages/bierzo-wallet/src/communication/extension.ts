import { ChainId, Identity } from "@iov/bcp";

import { sendGetIdentitiesRequest } from "./identities";

export interface ExtensionStatus {
  readonly connected: boolean;
  readonly installed: boolean;
  readonly identities: ReadonlyMap<ChainId, Identity>;
}

/**
 * Groups the identites by blockchain. Returns the first identity of each chain.
 *
 * The browser extension is supposed to only send one identity per chain.
 * @see https://github.com/iov-one/ponferrada/issues/447
 */
export function groupIdentitiesByChain(identities: readonly Identity[]): ReadonlyMap<ChainId, Identity> {
  const out = new Map<ChainId, Identity>();
  for (const identity of identities) {
    if (!out.has(identity.chainId)) {
      out.set(identity.chainId, identity);
    }
  }
  return out;
}

export async function getExtensionStatus(): Promise<ExtensionStatus> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, identities: new Map() };
  }

  if (identities.length === 0) {
    return { installed: true, connected: false, identities: new Map() };
  }

  const groupedIdentities = groupIdentitiesByChain(identities);

  return {
    installed: true,
    connected: true,
    identities: groupedIdentities,
  };
}
