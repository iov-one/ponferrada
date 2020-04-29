import { EthereumConnection } from "@iov/ethereum";

import { ChainConfig, getConfig } from "../config";
import { withChainsDescribe } from "../utils/test/testExecutor";
import { disconnect, establishConnection, getActiveConnections } from "./connection";

withChainsDescribe("Logic :: connection", () => {
  let firstChain: ChainConfig;

  beforeEach(async () => {
    const config = await getConfig();
    firstChain = config.chains[3];
  });
  afterAll(() => disconnect());

  it("calls connections only once", async () => {
    const ethereumConnectionSpy = jest.spyOn(EthereumConnection, "establish");

    expect(firstChain.chainSpec.codecType).toBe("eth");
    await establishConnection(firstChain.chainSpec);
    await establishConnection(firstChain.chainSpec);
    await establishConnection(firstChain.chainSpec);

    expect(ethereumConnectionSpy).toHaveBeenCalledTimes(1);
  });

  it("reset connections correctly when disconnecting", async () => {
    // GIVEN
    expect(firstChain.chainSpec.codecType).toBe("eth");

    const ethereumConnectionSpy = jest.spyOn(EthereumConnection, "establish");
    await establishConnection(firstChain.chainSpec);

    // WHEN
    disconnect();

    // THEN
    expect(ethereumConnectionSpy).toHaveBeenCalledTimes(1);
    await establishConnection(firstChain.chainSpec);
    expect(ethereumConnectionSpy).toHaveBeenCalledTimes(2);
  });

  it("returns list of active connections", async () => {
    await establishConnection(firstChain.chainSpec);

    const activeConnections = getActiveConnections();

    expect(activeConnections[0].chainId).toEqual(firstChain.chainSpec.chainId);
  });
});
