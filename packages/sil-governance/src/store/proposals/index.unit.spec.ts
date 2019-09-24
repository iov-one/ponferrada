import { Store } from "redux";

import { aNewStore } from "..";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { RootState } from "../reducers";
import { replaceProposalsAction } from "./actions";
import { SilProposal } from "./reducer";

const proposals = [
  {
    id: "qwereqwer",
    title: "title1",
    author: "author1",
    description: "short description",
    startDate: new Date("December 10, 1995 01:00:00"),
    expiryDate: new Date("December 10, 2020 04:00:00"),
    quorum: 10,
    threshold: 6,
    result: { yes: 5, no: 2, abstain: 1 },
    vote: "Invalid",
    status: "Active",
  },
  {
    id: "asdfasdf",
    title: "title2",
    author: "author2",
    description:
      "Really Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo sapien. Ut elementum urna sed nisl aliquet, eu feugiat magna dignissim. Sed nisi ipsum, egestas lacinia velit at, convallis malesuada elit. Sed placerat malesuada ligula, sed lobortis mauris aliquet eu. Nullam dignissim dui ut tempor imperdiet. Nulla vitae placerat enim.Maecenas volutpat lorem et egestas blandit. Etiam vitae justo eros. Etiam imperdiet ligula eros, a sollicitudin nisi vulputate et. Duis mattis congue sagittis. Donec ornare eros ut turpis sollicitudin, sed porta lectus molestie. Donec in orci dignissim, vestibulum lorem at, porta mi. Donec maximus neque lorem, ut mattis leo dapibus ac. Duis eget ex dolor. Phasellus viverra, nisi id mollis luctus, augue ante efficitur odio, eu sodales nisl lorem vel sapien. Curabitur hendrerit felis enim, ultrices lobortis orci pretium sed. Fusce at massa eu nulla interdum placerat sed nec odio. Donec faucibus orci sit amet arcu varius, id pharetra eros auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec mi dui, ornare non tristique et, pellentesque et leo. Quisque varius eu arcu non congue. Sed pellentesque ligula a elit aliquam hendrerit.Pellentesque metus libero, tincidunt vitae vehicula nec, luctus ac diam. Praesent vel blandit metus. Etiam dignissim ex tellus, pharetra bibendum erat elementum tempor. Proin augue erat, facilisis eget vehicula tempor, feugiat a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras at tellus ut erat tincidunt tempor. Quisque faucibus urna ac feugiat finibus. Etiam tristique neque venenatis luctus volutpat.",
    startDate: new Date("April 3, 2017 08:00:00"),
    expiryDate: new Date("May 5, 2023 03:00:00"),
    quorum: 20,
    threshold: 14,
    result: { yes: 4, no: 10, abstain: 3 },
    vote: "Yes",
    status: "Submitted",
  },
  {
    id: "zxcvzxcv",
    title: "title3",
    author: "author3",
    description: "short description again",
    startDate: new Date("January 3, 2010 04:00:00"),
    expiryDate: new Date("June 5, 2017 03:00:00"),
    quorum: 30,
    threshold: 20,
    result: { yes: 15, no: 4, abstain: 6 },
    vote: "Abstain",
    status: "Ended",
  },
];

withChainsDescribe("Proposals reducer", () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  }, 60000);

  it("has correct initial state", () => {
    const proposals = store.getState().proposalsState.proposals;

    expect(proposals).toEqual({});
  }, 60000);

  it("dispatches correctly getProposals action", async () => {
    const chainProposals: SilProposal[] = [];
    store.dispatch(replaceProposalsAction(chainProposals));
    const proposals = store.getState().proposalsState.proposals;

    expect(proposals).toEqual(chainProposals);
  }, 60000);

  it("stores correctly proposals", async () => {
    const chainProposals: SilProposal[] = [];
    store.dispatch(replaceProposalsAction(chainProposals));
    const storedProposals = store.getState().proposalsState.proposals;

    expect(storedProposals).toEqual(proposals);
  }, 60000);
});
