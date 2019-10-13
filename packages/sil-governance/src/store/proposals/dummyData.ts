import { Address, TokenTicker } from "@iov/bcp";
import { ActionKind, ElectionRule, Electorate, ProposalResult, VoteOption } from "@iov/bns";
import { ReadonlyDate } from "readonly-date";

import { ProposalsState } from "./reducer";

export const adminAddress = "adminAddress" as Address;
const elector1Address = "elector1Address" as Address;
const elector2Address = "elector2Address" as Address;
const elector3Address = "elector3Address" as Address;
const elector4Address = "elector4Address" as Address;
const elector5Address = "elector5Address" as Address;
const validator1Address = "ffvLHpRbpy5Jd+Q6/ARVqsYXdJ4kOhtp4ir8vdG3xcY";
const validator2Address = "p3lNbgFMeho2Bu9IIf6QqocDUJ6mxPSoPoTwuUpoN6I";
const rewardFundAddress = "rewardFundAddress" as Address;

export const getDummyElectorates = (): Electorate[] => [
  {
    id: 1,
    version: 1,
    admin: adminAddress,
    title: "Equal Electorate",
    electors: {
      [adminAddress]: { weight: 1 },
      [elector1Address]: { weight: 1 },
      [elector2Address]: { weight: 1 },
      [elector3Address]: { weight: 1 },
    },
    totalWeight: 4,
  },
  {
    id: 2,
    version: 2,
    admin: adminAddress,
    title: "Weighted Electorate",
    electors: {
      [adminAddress]: { weight: 3 },
      [elector1Address]: { weight: 2 },
      [elector2Address]: { weight: 2 },
      [elector3Address]: { weight: 1 },
      [elector4Address]: { weight: 1 },
      [elector5Address]: { weight: 1 },
    },
    totalWeight: 10,
  },
];

export const getDummyElectionRules = (): ElectionRule[] => [
  {
    id: 1,
    version: 1,
    admin: adminAddress,
    electorateId: 1,
    title: "Equal Election Rule",
    votingPeriod: 60 * 60,
    threshold: {
      numerator: 1,
      denominator: 2,
    },
    quorum: {
      numerator: 3,
      denominator: 4,
    },
  },
  {
    id: 2,
    version: 2,
    admin: adminAddress,
    electorateId: 2,
    title: "Weighted Election Rule",
    votingPeriod: 60 * 60 * 24,
    threshold: {
      numerator: 2,
      denominator: 3,
    },
    quorum: {
      numerator: 1,
      denominator: 2,
    },
  },
];

export const getDummyProposalsState = (): ProposalsState => {
  return {
    proposals: [
      {
        id: 1,
        action: {
          kind: ActionKind.CreateTextResolution,
          resolution: "Action Create Text Resolution",
        },
        title: "Amend Protocol",
        author: elector1Address,
        description: "Short description for Amend Protocol",
        startDate: new ReadonlyDate("October 1, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 1, 2019 02:00:00"),
        quorum: 3,
        threshold: 1,
        tally: {
          yes: 2,
          no: 0,
          abstain: 0,
          totalVotes: 2,
          maxVotes: 4,
        },
        result: ProposalResult.Undefined,
        vote: undefined,
        hasEnded: false,
      },
      {
        id: 2,
        action: {
          kind: ActionKind.UpdateElectorate,
          electorateId: 1,
          diffElectors: {
            [elector3Address]: { weight: 1 },
          },
        },
        title: "Add Committee Member",
        author: adminAddress,
        description: "Short description for Add Committee Member",
        startDate: new ReadonlyDate("October 2, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 3, 2019 01:00:00"),
        quorum: 5,
        threshold: 6,
        tally: {
          yes: 7,
          no: 1,
          abstain: 1,
          totalVotes: 9,
          maxVotes: 10,
        },
        result: ProposalResult.Accepted,
        vote: VoteOption.Yes,
        hasEnded: true,
      },
      {
        id: 3,
        action: {
          kind: ActionKind.UpdateElectorate,
          electorateId: 2,
          diffElectors: {
            [elector5Address]: { weight: 0 },
          },
        },
        title: "Remove Committee Member",
        author: elector2Address,
        description:
          "Long description for Remove Committee Member: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo sapien. Ut elementum urna sed nisl aliquet, eu feugiat magna dignissim. Sed nisi ipsum, egestas lacinia velit at, convallis malesuada elit. Sed placerat malesuada ligula, sed lobortis mauris aliquet eu. Nullam dignissim dui ut tempor imperdiet. Nulla vitae placerat enim.Maecenas volutpat lorem et egestas blandit. Etiam vitae justo eros. Etiam imperdiet ligula eros, a sollicitudin nisi vulputate et. Duis mattis congue sagittis. Donec ornare eros ut turpis sollicitudin, sed porta lectus molestie. Donec in orci dignissim, vestibulum lorem at, porta mi. Donec maximus neque lorem, ut mattis leo dapibus ac. Duis eget ex dolor. Phasellus viverra, nisi id mollis luctus, augue ante efficitur odio, eu sodales nisl lorem vel sapien. Curabitur hendrerit felis enim, ultrices lobortis orci pretium sed. Fusce at massa eu nulla interdum placerat sed nec odio. Donec faucibus orci sit amet arcu varius, id pharetra eros auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec mi dui, ornare non tristique et, pellentesque et leo. Quisque varius eu arcu non congue. Sed pellentesque ligula a elit aliquam hendrerit.Pellentesque metus libero, tincidunt vitae vehicula nec, luctus ac diam. Praesent vel blandit metus. Etiam dignissim ex tellus, pharetra bibendum erat elementum tempor. Proin augue erat, facilisis eget vehicula tempor, feugiat a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras at tellus ut erat tincidunt tempor. Quisque faucibus urna ac feugiat finibus. Etiam tristique neque venenatis luctus volutpat.",
        startDate: new ReadonlyDate("October 4, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 4, 2019 02:00:00"),
        quorum: 3,
        threshold: 1,
        tally: {
          yes: 0,
          no: 1,
          abstain: 0,
          totalVotes: 1,
          maxVotes: 4,
        },
        result: ProposalResult.Undefined,
        vote: VoteOption.No,
        hasEnded: false,
      },
      {
        id: 4,
        action: {
          kind: ActionKind.UpdateElectionRule,
          electionRuleId: 2,
          threshold: { numerator: 1, denominator: 2 },
          votingPeriod: 60 * 60 * 24,
        },
        title: "Amend Committee Threshold",
        author: adminAddress,
        description: "Short description for Amend Committee Threshold",
        startDate: new ReadonlyDate("October 5, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 6, 2019 01:00:00"),
        quorum: 5,
        threshold: 2,
        tally: {
          yes: 1,
          no: 1,
          abstain: 1,
          totalVotes: 3,
          maxVotes: 10,
        },
        result: ProposalResult.Undefined,
        vote: VoteOption.Abstain,
        hasEnded: false,
      },
      {
        id: 5,
        action: {
          kind: ActionKind.UpdateElectionRule,
          electionRuleId: 1,
          quorum: { numerator: 1, denominator: 2 },
          votingPeriod: 60 * 60,
        },
        title: "Amend Committee Quorum",
        author: elector3Address,
        description: "Short description for Amend Committee Quorum",
        startDate: new ReadonlyDate("October 7, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 7, 2019 02:00:00"),
        quorum: 3,
        threshold: 2,
        tally: {
          yes: 0,
          no: 3,
          abstain: 0,
          totalVotes: 3,
          maxVotes: 4,
        },
        result: ProposalResult.Rejected,
        vote: undefined,
        hasEnded: true,
      },
      {
        id: 6,
        action: {
          kind: ActionKind.SetValidators,
          validatorUpdates: {
            [validator1Address]: { power: 10 },
          },
        },
        title: "Add Validator",
        author: adminAddress,
        description:
          "Long description for Add Validator: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo sapien. Ut elementum urna sed nisl aliquet, eu feugiat magna dignissim. Sed nisi ipsum, egestas lacinia velit at, convallis malesuada elit. Sed placerat malesuada ligula, sed lobortis mauris aliquet eu. Nullam dignissim dui ut tempor imperdiet. Nulla vitae placerat enim.Maecenas volutpat lorem et egestas blandit. Etiam vitae justo eros. Etiam imperdiet ligula eros, a sollicitudin nisi vulputate et. Duis mattis congue sagittis. Donec ornare eros ut turpis sollicitudin, sed porta lectus molestie. Donec in orci dignissim, vestibulum lorem at, porta mi. Donec maximus neque lorem, ut mattis leo dapibus ac. Duis eget ex dolor. Phasellus viverra, nisi id mollis luctus, augue ante efficitur odio, eu sodales nisl lorem vel sapien. Curabitur hendrerit felis enim, ultrices lobortis orci pretium sed. Fusce at massa eu nulla interdum placerat sed nec odio. Donec faucibus orci sit amet arcu varius, id pharetra eros auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec mi dui, ornare non tristique et, pellentesque et leo. Quisque varius eu arcu non congue. Sed pellentesque ligula a elit aliquam hendrerit.Pellentesque metus libero, tincidunt vitae vehicula nec, luctus ac diam. Praesent vel blandit metus. Etiam dignissim ex tellus, pharetra bibendum erat elementum tempor. Proin augue erat, facilisis eget vehicula tempor, feugiat a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras at tellus ut erat tincidunt tempor. Quisque faucibus urna ac feugiat finibus. Etiam tristique neque venenatis luctus volutpat.",
        startDate: new ReadonlyDate("October 8, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 9, 2019 01:00:00"),
        quorum: 5,
        threshold: 2,
        tally: {
          yes: 2,
          no: 1,
          abstain: 0,
          totalVotes: 3,
          maxVotes: 10,
        },
        result: ProposalResult.Undefined,
        vote: VoteOption.Yes,
        hasEnded: false,
      },
      {
        id: 7,
        action: {
          kind: ActionKind.SetValidators,
          validatorUpdates: {
            [validator2Address]: { power: 0 },
          },
        },
        title: "Remove Validator",
        author: elector4Address,
        description: "Short description for Remove Validator",
        startDate: new ReadonlyDate("October 10, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 10, 2019 02:00:00"),
        quorum: 3,
        threshold: 1,
        tally: {
          yes: 0,
          no: 1,
          abstain: 0,
          totalVotes: 1,
          maxVotes: 4,
        },
        result: ProposalResult.Undefined,
        vote: VoteOption.No,
        hasEnded: false,
      },
      {
        id: 8,
        action: {
          kind: ActionKind.ReleaseEscrow,
          escrowId: 1,
          amount: {
            quantity: "10",
            fractionalDigits: 1,
            tokenTicker: "ETH" as TokenTicker,
          },
        },
        title: "Release Guarantee Funds",
        author: adminAddress,
        description: "Short description for Release Guarantee Funds",
        startDate: new ReadonlyDate("October 11, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 12, 2019 01:00:00"),
        quorum: 5,
        threshold: 6,
        tally: {
          yes: 6,
          no: 2,
          abstain: 1,
          totalVotes: 9,
          maxVotes: 10,
        },
        result: ProposalResult.Accepted,
        vote: VoteOption.Abstain,
        hasEnded: true,
      },
      {
        id: 9,
        action: {
          kind: ActionKind.ExecuteProposalBatch,
          messages: [
            {
              kind: ActionKind.Send,
              sender: rewardFundAddress,
              recipient: elector1Address,
              amount: {
                quantity: "10",
                fractionalDigits: 1,
                tokenTicker: "ETH" as TokenTicker,
              },
            },
            {
              kind: ActionKind.Send,
              sender: rewardFundAddress,
              recipient: elector2Address,
              amount: {
                quantity: "10",
                fractionalDigits: 1,
                tokenTicker: "ETH" as TokenTicker,
              },
              memo: "Sample memo",
            },
          ],
        },
        title: "Distribute Funds",
        author: elector5Address,
        description:
          "Long description for Distribute Funds: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo sapien. Ut elementum urna sed nisl aliquet, eu feugiat magna dignissim. Sed nisi ipsum, egestas lacinia velit at, convallis malesuada elit. Sed placerat malesuada ligula, sed lobortis mauris aliquet eu. Nullam dignissim dui ut tempor imperdiet. Nulla vitae placerat enim.Maecenas volutpat lorem et egestas blandit. Etiam vitae justo eros. Etiam imperdiet ligula eros, a sollicitudin nisi vulputate et. Duis mattis congue sagittis. Donec ornare eros ut turpis sollicitudin, sed porta lectus molestie. Donec in orci dignissim, vestibulum lorem at, porta mi. Donec maximus neque lorem, ut mattis leo dapibus ac. Duis eget ex dolor. Phasellus viverra, nisi id mollis luctus, augue ante efficitur odio, eu sodales nisl lorem vel sapien. Curabitur hendrerit felis enim, ultrices lobortis orci pretium sed. Fusce at massa eu nulla interdum placerat sed nec odio. Donec faucibus orci sit amet arcu varius, id pharetra eros auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec mi dui, ornare non tristique et, pellentesque et leo. Quisque varius eu arcu non congue. Sed pellentesque ligula a elit aliquam hendrerit.Pellentesque metus libero, tincidunt vitae vehicula nec, luctus ac diam. Praesent vel blandit metus. Etiam dignissim ex tellus, pharetra bibendum erat elementum tempor. Proin augue erat, facilisis eget vehicula tempor, feugiat a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras at tellus ut erat tincidunt tempor. Quisque faucibus urna ac feugiat finibus. Etiam tristique neque venenatis luctus volutpat.",
        startDate: new ReadonlyDate("October 13, 2019 01:00:00"),
        expiryDate: new ReadonlyDate("October 13, 2019 02:00:00"),
        quorum: 3,
        threshold: 1,
        tally: {
          yes: 0,
          no: 1,
          abstain: 0,
          totalVotes: 1,
          maxVotes: 4,
        },
        result: ProposalResult.Undefined,
        vote: undefined,
        hasEnded: false,
      },
    ],

    updateRequired: false,
  };
};
