import { act } from "react-dom/test-utils";
import { ReadonlyDate } from "readonly-date";
import { Store } from "redux";

import { aNewStore } from "../../store";
import { adminAddress, getDummyElectionRules, getDummyElectorates } from "../../store/proposals/dummyData";
import { RootState } from "../../store/reducers";
import {
  getAsideFilter,
  getAsideFilterOptions,
  getBlockchainTimeLabel,
  getHeader,
  getHeaderAddress,
  getHeaderHeading,
  getHeaderLinks,
  getHeaderLogo,
} from "./test/operateCreateProposal";
import { travelToCreateProposal } from "./test/travelToCreateProposal";

describe("DOM > Feature > Create Proposal", () => {
  let store: Store<RootState>;
  let electorateDom: React.Component;

  beforeEach(async () => {
    store = aNewStore({
      extension: {
        connected: true,
        installed: true,
        governor: {
          address: adminAddress,
          getElectorates: getDummyElectorates,
          getElectionRules: getDummyElectionRules,
        },
      },
      blockchain: {
        lastBlockTime: new ReadonlyDate(),
        lastBlockHeight: 44447774,
      },
    });

    await act(async () => {
      electorateDom = await travelToCreateProposal(store);
    });
  }, 60000);

  it("has a header with a logo", async () => {
    const header = await getHeader(electorateDom);
    const logo = getHeaderLogo(header);
    expect(logo.getAttribute("alt")).toBe("Logo");
  }, 60000);

  it("has a header with a heading", async () => {
    const header = await getHeader(electorateDom);
    const heading = getHeaderHeading(header);
    expect(heading).toBe("Governance");
  }, 60000);

  it("has a header with an user address", async () => {
    const header = await getHeader(electorateDom);

    const address = getHeaderAddress(header);
    expect(address).toBe(adminAddress);
  }, 60000);

  it("has a header with links to electorates", async () => {
    const header = await getHeader(electorateDom);
    const links = getHeaderLinks(header);
    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe("Equal Electorate");
    expect(links[1].textContent).toBe("Weighted Electorate");
  }, 60000);

  it("has an aside filter with four options", async () => {
    const asideFilter = await getAsideFilter(electorateDom);

    const asideFilterOptions = getAsideFilterOptions(asideFilter);
    expect(asideFilterOptions).toEqual([
      "All Elections",
      "Active Elections",
      "Authored Elections",
      "Ended Elections",
    ]);
  }, 60000);

  it("has a 'Blockchain time' display", async () => {
    const blockchainTimeLabel = await getBlockchainTimeLabel(electorateDom);
    expect(blockchainTimeLabel).toBe("Blockchain time");
  }, 60000);
});
