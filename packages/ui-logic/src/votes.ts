import { VoteOption } from "@iov/bns";

export function voteToString(vote: VoteOption | undefined): string {
  if (vote === undefined) return "–";

  switch (vote) {
    case VoteOption.Yes:
      return "yes";
    case VoteOption.No:
      return "no";
    case VoteOption.Abstain:
      return "abstain";
    default:
      throw new Error("Got unexpected vote option");
  }
}
