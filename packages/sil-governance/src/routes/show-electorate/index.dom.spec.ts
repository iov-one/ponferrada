import { act, findRenderedDOMComponentWithTag, scryRenderedDOMComponentsWithTag } from "react-dom/test-utils";
import { ReadonlyDate } from "readonly-date";
import { Store } from "redux";

import { aNewStore } from "../../store";
import { adminAddress, getDummyElectorates } from "../../store/proposals/dummyData";
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
} from "./test/operateShowElectorate";
import { travelToShowElectorate } from "./test/travelToShowElectorate";

describe("DOM > Feature > Show Electorate", () => {
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
        },
      },
      blockchain: {
        lastBlockTime: new ReadonlyDate(),
        lastBlockHeight: 44447774,
      },
    });

    await act((async () => {
      electorateDom = await travelToShowElectorate(store, "1");
    }) as () => void);
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

  it("has a table with two headers: Address and Weight", () => {
    const headers = scryRenderedDOMComponentsWithTag(electorateDom, "th");

    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toBe("Address");
    expect(headers[1].textContent).toBe("Weight");
  }, 60000);

  it("has an Equal Electorate with expected members", async () => {
    await act((async () => {
      electorateDom = await travelToShowElectorate(store, "1");
    }) as () => void);

    const heading = findRenderedDOMComponentWithTag(electorateDom, "h6");
    expect(heading.textContent).toBe("Equal Electorate members:");

    const data = scryRenderedDOMComponentsWithTag(electorateDom, "td");

    expect(data[0].textContent).toBe("adminAddress");
    expect(data[1].textContent).toBe("1");
    expect(data[2].textContent).toBe("elector1Address");
    expect(data[3].textContent).toBe("1");
    expect(data[4].textContent).toBe("elector2Address");
    expect(data[5].textContent).toBe("1");
    expect(data[6].textContent).toBe("elector3Address");
    expect(data[7].textContent).toBe("1");
  }, 60000);

  it("has a Weighted Electorate with expected members", async () => {
    await act((async () => {
      electorateDom = await travelToShowElectorate(store, "2");
    }) as () => void);

    const heading = findRenderedDOMComponentWithTag(electorateDom, "h6");
    expect(heading.textContent).toBe("Weighted Electorate members:");

    const data = scryRenderedDOMComponentsWithTag(electorateDom, "td");

    expect(data[0].textContent).toBe("adminAddress");
    expect(data[1].textContent).toBe("3");
    expect(data[2].textContent).toBe("elector1Address");
    expect(data[3].textContent).toBe("2");
    expect(data[4].textContent).toBe("elector2Address");
    expect(data[5].textContent).toBe("2");
    expect(data[6].textContent).toBe("elector3Address");
    expect(data[7].textContent).toBe("1");
    expect(data[8].textContent).toBe("elector4Address");
    expect(data[9].textContent).toBe("1");
    expect(data[10].textContent).toBe("elector5Address");
    expect(data[11].textContent).toBe("1");
  }, 60000);
});
