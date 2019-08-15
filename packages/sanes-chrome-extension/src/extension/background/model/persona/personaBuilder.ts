import { UserProfile } from "@iov/keycontrol";
import { MultiChainSigner } from "@iov/multichain";

import { AccountManager, AccountManagerChainConfig } from "../accountManager";
import {
  algorithmForCodec,
  chainConnector,
  codecTypeFromString,
  ConfigurationFile,
  getConfigurationFile,
  pathBuilderForCodec,
} from "./config";

export class PersonaBuilder {
  public static async createAccountManager(
    profile: UserProfile,
    signer: MultiChainSigner,
  ): Promise<AccountManager> {
    const config: ConfigurationFile = await getConfigurationFile();

    const managerChains: AccountManagerChainConfig[] = [];
    for (const chainSpec of config.chains.map(chain => chain.chainSpec)) {
      const codecType = codecTypeFromString(chainSpec.codecType);
      const connector = chainConnector(codecType, chainSpec.node, chainSpec.scraper);
      const { connection } = await signer.addChain(connector);
      managerChains.push({
        chainId: connection.chainId(),
        algorithm: algorithmForCodec(codecType),
        derivePath: pathBuilderForCodec(codecType),
      });
    }

    const accountManager = new AccountManager(profile, managerChains);

    return accountManager;
  }
}
