import { VoteOption } from "@iov/bns";

export function voteToString(vote: VoteOption | undefined, capitalize = false): string {
  if (vote === undefined) return "–";

  switch (vote) {
    case VoteOption.Yes:
      return capitalize ? "Yes" : "yes";
    case VoteOption.No:
      return capitalize ? "No" : "no";
    case VoteOption.Abstain:
      return capitalize ? "Abstain" : "abstain";
    default:
      throw new Error("Got unexpected vote option");
  }
}
