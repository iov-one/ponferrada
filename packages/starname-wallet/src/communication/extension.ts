import { Identity } from "@iov/bcp";

import { extensionRpcEndpoint } from "./extensionRpcEndpoint";
import { generateGetIdentitiesRequest } from "./requestgenerators";

export interface ExtensionStatus {
  readonly connected: boolean;
  readonly installed: boolean;
  readonly identities: readonly Identity[];
}

/**
 * Groups the identites by blockchain. Returns the first identity of each chain.
 *
 * The browser extension is supposed to only send one identity per chain.
 * @see https://github.com/iov-one/ponferrada/issues/447
 */
export function chooseFirstIdentitiesByChain(identities: readonly Identity[]): readonly Identity[] {
  const out = new Array<Identity>();
  for (const identity of identities) {
    if (!out.find(included => included.chainId === identity.chainId)) {
      out.push(identity);
    }
  }
  return out;
}

export async function getExtensionStatus(): Promise<ExtensionStatus> {
  const request = await generateGetIdentitiesRequest();
  const identities = await extensionRpcEndpoint.sendGetIdentitiesRequest(request);

  if (!identities) {
    return { installed: false, connected: false, identities: [] };
  }

  if (identities.length === 0) {
    return { installed: true, connected: false, identities: [] };
  }

  const groupedIdentities = chooseFirstIdentitiesByChain(identities);

  return {
    installed: true,
    connected: true,
    identities: groupedIdentities,
  };
}
