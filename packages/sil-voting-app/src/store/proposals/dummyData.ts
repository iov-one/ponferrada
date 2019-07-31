import { Address } from '@iov/bcp';
import {
  ActionKind,
  ElectionRule,
  Electorate,
  Proposal,
  ProposalExecutorResult,
  ProposalResult,
  ProposalStatus,
} from '@iov/bns';

const adminAddress = 'Admin 1' as Address;

export const getDummyElectorates = (): Electorate[] => [
  {
    id: 1,
    version: 1,
    admin: adminAddress,
    title: 'Electorate 1',
    electors: {
      1: { weight: 1 },
      2: { weight: 1 },
      3: { weight: 1 },
    },
    totalWeight: 3,
  },
  {
    id: 2,
    version: 2,
    admin: adminAddress,
    title: 'Electorate 2',
    electors: {
      1: { weight: 3 },
      2: { weight: 2 },
      3: { weight: 2 },
      4: { weight: 1 },
      5: { weight: 1 },
      6: { weight: 1 },
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
    title: 'Rule 1',
    votingPeriod: 360000,
    threshold: {
      numerator: 1,
      denominator: 2,
    },
    quorum: {
      numerator: 2,
      denominator: 3,
    },
  },
  {
    id: 2,
    version: 2,
    admin: adminAddress,
    electorateId: 2,
    title: 'Rule 2',
    votingPeriod: 360000,
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

export const getDummyProposals = (): Proposal[] => [
  {
    id: 1,
    title: 'Proposal 1',
    action: {
      kind: ActionKind.CreateTextResolution,
      resolution: 'Text Resolution 1',
    },
    description: 'short description',
    electionRule: {
      id: 1,
      version: 1,
    },
    electorate: {
      id: 1,
      version: 1,
    },
    votingStartTime: new Date('December 10, 1995 01:00:00').getTime() / 1000,
    votingEndTime: new Date('December 10, 2020 04:00:00').getTime() / 1000,
    submissionTime: new Date('December 10, 1995 00:30:00').getTime() / 1000,
    author: 'Author 1' as Address,
    state: {
      totalYes: 0,
      totalNo: 0,
      totalAbstain: 0,
      totalElectorateWeight: 3,
    },
    status: ProposalStatus.Submitted,
    result: ProposalResult.Undefined,
    executorResult: ProposalExecutorResult.Succeeded,
  },
  {
    id: 2,
    title: 'Proposal 2',
    action: {
      kind: ActionKind.CreateTextResolution,
      resolution: 'Text Resolution 2',
    },
    description:
      'Really Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo sapien. Ut elementum urna sed nisl aliquet, eu feugiat magna dignissim. Sed nisi ipsum, egestas lacinia velit at, convallis malesuada elit. Sed placerat malesuada ligula, sed lobortis mauris aliquet eu. Nullam dignissim dui ut tempor imperdiet. Nulla vitae placerat enim.Maecenas volutpat lorem et egestas blandit. Etiam vitae justo eros. Etiam imperdiet ligula eros, a sollicitudin nisi vulputate et. Duis mattis congue sagittis. Donec ornare eros ut turpis sollicitudin, sed porta lectus molestie. Donec in orci dignissim, vestibulum lorem at, porta mi. Donec maximus neque lorem, ut mattis leo dapibus ac. Duis eget ex dolor. Phasellus viverra, nisi id mollis luctus, augue ante efficitur odio, eu sodales nisl lorem vel sapien. Curabitur hendrerit felis enim, ultrices lobortis orci pretium sed. Fusce at massa eu nulla interdum placerat sed nec odio. Donec faucibus orci sit amet arcu varius, id pharetra eros auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec mi dui, ornare non tristique et, pellentesque et leo. Quisque varius eu arcu non congue. Sed pellentesque ligula a elit aliquam hendrerit.Pellentesque metus libero, tincidunt vitae vehicula nec, luctus ac diam. Praesent vel blandit metus. Etiam dignissim ex tellus, pharetra bibendum erat elementum tempor. Proin augue erat, facilisis eget vehicula tempor, feugiat a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras at tellus ut erat tincidunt tempor. Quisque faucibus urna ac feugiat finibus. Etiam tristique neque venenatis luctus volutpat.',
    electionRule: {
      id: 2,
      version: 2,
    },
    electorate: {
      id: 2,
      version: 2,
    },
    votingStartTime: new Date('April 3, 2017 08:00:00').getTime() / 1000,
    votingEndTime: new Date('May 5, 2023 03:00:00').getTime() / 1000,
    submissionTime: new Date('April 3, 2017 07:30:00').getTime() / 1000,
    author: 'Author 2' as Address,
    state: {
      totalYes: 2,
      totalNo: 5,
      totalAbstain: 1,
      totalElectorateWeight: 10,
    },
    status: ProposalStatus.Submitted,
    result: ProposalResult.Undefined,
    executorResult: ProposalExecutorResult.Succeeded,
  },
  {
    id: 3,
    title: 'Proposal 3',
    action: {
      kind: ActionKind.CreateTextResolution,
      resolution: 'Text Resolution 3',
    },
    description: 'short description',
    electionRule: {
      id: 1,
      version: 1,
    },
    electorate: {
      id: 1,
      version: 1,
    },
    votingStartTime: new Date('January 3, 2010 04:00:00').getTime() / 1000,
    votingEndTime: new Date('June 5, 2017 03:00:00').getTime() / 1000,
    submissionTime: new Date('January 3, 2010 03:30:00').getTime() / 1000,
    author: 'Author 3' as Address,
    state: {
      totalYes: 2,
      totalNo: 0,
      totalAbstain: 1,
      totalElectorateWeight: 3,
    },
    status: ProposalStatus.Closed,
    result: ProposalResult.Accepted,
    executorResult: ProposalExecutorResult.Succeeded,
  },
];

export const getDummyVote = (proposal: Proposal): 'Invalid' | 'Yes' | 'No' | 'Abstain' => {
  switch (proposal.id) {
    case 2:
      return 'Yes';
    case 3:
      return 'Abstain';
    default:
      return 'Invalid';
  }
};
