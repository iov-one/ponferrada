import { ChainId } from "@iov/bcp";

import { withChainsDescribe } from "../utils/test/testExecutor";
import { lookupRecipientAddressByName } from "./account";
import { disconnect } from "./connection";

withChainsDescribe("Logic :: account", () => {
  afterAll(() => {
    disconnect();
  });

  it("should throw exception if namespace is missing", async () => {
    await expect(lookupRecipientAddressByName("test1", "ethereum-eip155-5777" as ChainId)).rejects.toThrow(
      /Username must include namespace suffix/i,
    );
  });

  it("should throw exception if bns username was not found", async () => {
    await expect(
      lookupRecipientAddressByName("test1*iov", "ethereum-eip155-5777" as ChainId),
    ).rejects.toThrow(/Recipient's personalized address was not found/i);
  });
});
