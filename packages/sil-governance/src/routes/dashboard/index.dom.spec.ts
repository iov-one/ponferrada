import { Store } from "redux";

import { aNewStore } from "../../store";
import { getDummyProposalsState } from "../../store/proposals/dummyData";
import { RootState } from "../../store/reducers";
import { click } from "../../utils/test/dom";
import {
  checkActiveVotingPanel,
  checkEndedVotingPanel,
  checkProposal,
  getAsideFilter,
  getAsideFilterOptions,
  getHeader,
  getLogoImg,
  getLogoTitle,
  getProposals,
  getTitle,
} from "./test/operateDashboard";
import { travelToDashboard } from "./test/travelToDashboard";

const shortenedDescription =
  "Really Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo ... ";

const longDescription =
  "Really Long Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod dolor mauris, a ultricies augue pulvinar eget. Nullam sed aliquam massa, in commodo sapien. Ut elementum urna sed nisl aliquet, eu feugiat magna dignissim. Sed nisi ipsum, egestas lacinia velit at, convallis malesuada elit. Sed placerat malesuada ligula, sed lobortis mauris aliquet eu. Nullam dignissim dui ut tempor imperdiet. Nulla vitae placerat enim.Maecenas volutpat lorem et egestas blandit. Etiam vitae justo eros. Etiam imperdiet ligula eros, a sollicitudin nisi vulputate et. Duis mattis congue sagittis. Donec ornare eros ut turpis sollicitudin, sed porta lectus molestie. Donec in orci dignissim, vestibulum lorem at, porta mi. Donec maximus neque lorem, ut mattis leo dapibus ac. Duis eget ex dolor. Phasellus viverra, nisi id mollis luctus, augue ante efficitur odio, eu sodales nisl lorem vel sapien. Curabitur hendrerit felis enim, ultrices lobortis orci pretium sed. Fusce at massa eu nulla interdum placerat sed nec odio. Donec faucibus orci sit amet arcu varius, id pharetra eros auctor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec mi dui, ornare non tristique et, pellentesque et leo. Quisque varius eu arcu non congue. Sed pellentesque ligula a elit aliquam hendrerit.Pellentesque metus libero, tincidunt vitae vehicula nec, luctus ac diam. Praesent vel blandit metus. Etiam dignissim ex tellus, pharetra bibendum erat elementum tempor. Proin augue erat, facilisis eget vehicula tempor, feugiat a diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras at tellus ut erat tincidunt tempor. Quisque faucibus urna ac feugiat finibus. Etiam tristique neque venenatis luctus volutpat.";

describe("DOM > Feature > Dashboard", () => {
  let store: Store<RootState>;
  let dashboardDom: React.Component;

  beforeEach(async () => {
    store = aNewStore({
      extension: {
        connected: true,
        installed: true,
      },
      proposals: getDummyProposalsState(),
    });

    dashboardDom = await travelToDashboard(store);
  }, 60000);

  it("has a header with a logo and a heading", async () => {
    const header = await getHeader(dashboardDom);

    const logoImg = getLogoImg(header);
    expect(logoImg.getAttribute("alt")).toBe("Logo");

    const logoTitle = getLogoTitle(header);
    expect(logoTitle).toBe("IOV");

    const title = getTitle(header);
    expect(title).toBe("Voting Dashboard");
  }, 60000);

  it("has an aside filter with four options", async () => {
    const asideFilter = await getAsideFilter(dashboardDom);

    const asideFilterOptions = getAsideFilterOptions(asideFilter);
    expect(asideFilterOptions[0]).toBe("All Elections");
    expect(asideFilterOptions[1]).toBe("Active Elections");
    expect(asideFilterOptions[2]).toBe("Submitted Elections");
    expect(asideFilterOptions[3]).toBe("Ended Elections");
  }, 60000);

  it("has a proposal list with three proposals", async () => {
    const proposals = await getProposals(dashboardDom);
    expect(proposals.length).toBe(3);
  }, 60000);

  it("has a proposal with correct fields", async () => {
    const proposal = (await getProposals(dashboardDom))[0];
    checkProposal(proposal);
  }, 60000);

  it("has an active proposal with correct voting panel", async () => {
    const activeProposal = (await getProposals(dashboardDom))[0];
    checkActiveVotingPanel(activeProposal);
  }, 60000);

  it("has an ended proposal with correct voting panel", async () => {
    const endedProposal = (await getProposals(dashboardDom))[2];
    checkEndedVotingPanel(endedProposal);
  }, 60000);

  it("has a Read more / Read less toggle when description too long", async () => {
    let longProposal = (await getProposals(dashboardDom))[1].children[0];
    let readToggle = longProposal.children[2].children[0].children[1];

    await click(readToggle);
    let description = longProposal.children[2].children[0].children[0].children[0].children[0].textContent;
    expect(description).toBe(longDescription);

    await click(readToggle);
    description = longProposal.children[2].children[0].children[0].textContent;
    expect(description).toBe(shortenedDescription);
  }, 60000);
});
