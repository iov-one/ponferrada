import { ChainId } from "@iov/bcp";
import { EthereumCodec } from "@iov/ethereum";

import { establishAllConnections } from "../utils/test/connections";
import { withChainsDescribe } from "../utils/test/testExecutor";
import { getCodecForChainId } from "./codec";
import { disconnect } from "./connection";

withChainsDescribe("Logic :: codec", () => {
  beforeAll(async () => {
    await establishAllConnections();
  });

  afterAll(() => {
    disconnect();
  });

  it("should return proper codec for ethereum connection", async () => {
    const codec = await getCodecForChainId("ethereum-eip155-5777" as ChainId);

    expect(codec).toBeInstanceOf(EthereumCodec);
  });

  it("should throw exception in case of wrong chain id", async () => {
    await expect(getCodecForChainId("wrong chain id" as ChainId)).rejects.toThrow(
      /No codec found or no active connection for this chainId/,
    );
  });
});
