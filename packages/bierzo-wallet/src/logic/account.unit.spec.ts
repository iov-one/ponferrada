import { ChainId } from "@iov/bcp";
import { randomString } from "ui-logic";

import { withChainsDescribe } from "../utils/test/testExecutor";
import { isValidIov, lookupRecipientAddressByName } from "./account";
import { disconnect } from "./connection";

describe("Logic :: account", () => {
  withChainsDescribe("with blockchain", () => {
    afterAll(() => {
      disconnect();
    });

    it("should throw exception if namespace is missing", async () => {
      await expect(lookupRecipientAddressByName("test1", "ethereum-eip155-5777" as ChainId)).rejects.toThrow(
        /Username must include namespace suffix/i,
      );
    });

    it("should return personalized address not found ", async () => {
      const lookupResult = await lookupRecipientAddressByName("test1*iov", "ethereum-eip155-5777" as ChainId);

      expect(lookupResult).toBe("name_not_found");
    });
  });

  describe("without blockchain", () => {
    it("should return 'not_iov' error", () => {
      const result = isValidIov(randomString(10));
      expect(result).toBe("not_iov");
    });

    it("should return 'too_short' error", () => {
      const result = isValidIov(`${randomString(2)}*iov`);
      expect(result).toBe("too_short");
    });

    it("should return 'too_long' error", () => {
      const result = isValidIov(`${randomString(65)}*iov`);
      expect(result).toBe("too_long");
    });

    it("should return 'wrong_chars' error", () => {
      const result = isValidIov("string+with|wrong!characters*iov");
      expect(result).toBe("wrong_chars");
    });

    it("should return 'valid' result", () => {
      const result = isValidIov("some_correct-user.name*iov");
      expect(result).toBe("valid");
    });
  });
});
