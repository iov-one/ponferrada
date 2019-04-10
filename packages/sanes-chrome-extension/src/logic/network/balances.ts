import { Amount } from '@iov/bcp';

import { getPersonaFromConfig } from './personafromconfig';
import { getSignerAndProfile } from './signerandprofile';

export async function getBalances(
  accountIndex: number
): Promise<ReadonlyArray<Amount>> {
  const singletonPersona = await getPersonaFromConfig();
  const singletonSigner = (await getSignerAndProfile()).signer;

  const account = (await singletonPersona.accounts())[accountIndex];
  const identities = [...account.identities.values()];
  const pendingAccountResults = identities.map(identity => {
    const { chainId, pubkey } = identity;
    return singletonSigner.connection(chainId).getAccount({ pubkey });
  });
  const accountResults = await Promise.all(pendingAccountResults);

  const out: Amount[] = [];
  for (const result of accountResults) {
    if (result) {
      out.push(...result.balance);
    }
  }

  return out;
}
