import { VoteOption } from "@iov/bns";

import { voteToString } from "./votes";

describe("votes", () => {
  describe("voteToString", () => {
    it("works", () => {
      expect(voteToString(undefined)).toEqual("–");
      expect(voteToString(VoteOption.Yes)).toEqual("yes");
      expect(voteToString(VoteOption.No)).toEqual("no");
      expect(voteToString(VoteOption.Abstain)).toEqual("abstain");
    });
  });
});
