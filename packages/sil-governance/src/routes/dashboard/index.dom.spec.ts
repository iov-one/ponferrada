import { findRenderedDOMComponentWithTag } from "react-dom/test-utils";
import { ReadonlyDate } from "readonly-date";
import { Store } from "redux";

import { aNewStore } from "../../store";
import { adminAddress, getDummyElectorates, getDummyProposalsState } from "../../store/proposals/dummyData";
import { RootState } from "../../store/reducers";
import { click, input } from "../../utils/test/dom";
import { whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { CREATE_PROPOSAL_ROUTE } from "../paths";
import {
  checkCommonFields,
  checkCreateTextResolutionFields,
  checkDistributeFundsFields,
  checkReleaseEscrowFields,
  checkSetValidatorsFields,
  checkUpdateElectionRuleFields,
  checkUpdateElectorateFields,
  checkVotingPanel,
  getAsideFilter,
  getAsideFilterOptions,
  getBlockchainTimeLabel,
  getHeader,
  getHeaderAddress,
  getHeaderHeading,
  getHeaderLinks,
  getHeaderLogo,
  getNewProposalButton,
  getProposals,
} from "./test/operateDashboard";
import {
  travelToDashboard,
  travelToDashboardActive,
  travelToDashboardAuthored,
  travelToDashboardEnded,
} from "./test/travelToDashboard";

describe("DOM > Feature > Dashboard", () => {
  let store: Store<RootState>;
  let dashboardDom: React.Component;

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
      proposals: getDummyProposalsState(),
      blockchain: {
        lastBlockTime: new ReadonlyDate(),
        lastBlockHeight: 44447774,
      },
    });

    dashboardDom = await travelToDashboard(store);
  }, 60000);

  it("has a header with a logo", async () => {
    const header = await getHeader(dashboardDom);
    const logo = getHeaderLogo(header);
    expect(logo.getAttribute("alt")).toBe("Logo");
  }, 60000);

  it("has a header with a heading", async () => {
    const header = await getHeader(dashboardDom);
    const heading = getHeaderHeading(header);
    expect(heading).toBe("Governance");
  }, 60000);

  it("has a header with an user address", async () => {
    const header = await getHeader(dashboardDom);

    const address = getHeaderAddress(header);
    expect(address).toBe(adminAddress);
  }, 60000);

  it("has a header with links to electorates", async () => {
    const header = await getHeader(dashboardDom);
    const links = getHeaderLinks(header);
    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe("Equal Electorate");
    expect(links[1].textContent).toBe("Weighted Electorate");
  }, 60000);

  it("has an aside filter with four options", async () => {
    const asideFilter = await getAsideFilter(dashboardDom);

    const asideFilterOptions = getAsideFilterOptions(asideFilter);
    expect(asideFilterOptions).toEqual([
      "All Elections",
      "Active Elections",
      "Authored Elections",
      "Ended Elections",
    ]);
  }, 60000);

  it("has a proposal list with nine proposals", async () => {
    const proposals = await getProposals(dashboardDom);
    expect(proposals.length).toBe(9);
  }, 60000);

  it("has a proposal list with six active proposals", async () => {
    dashboardDom = await travelToDashboardActive(store);
    const proposals = await getProposals(dashboardDom);
    expect(proposals.length).toBe(6);
  }, 60000);

  it("has a proposal list with four authored proposals", async () => {
    dashboardDom = await travelToDashboardAuthored(store);
    const proposals = await getProposals(dashboardDom);
    expect(proposals.length).toBe(4);
  }, 60000);

  it("has a proposal list with three ended proposals", async () => {
    dashboardDom = await travelToDashboardEnded(store);
    const proposals = await getProposals(dashboardDom);
    expect(proposals.length).toBe(3);
  }, 60000);

  // NOTE click fires "Cannot read property 'createEvent' of null"
  it.skip("has an 'Add New Proposal' button that redirects to /create-proposal", async () => {
    const newProposalButton = await getNewProposalButton(dashboardDom);
    await click(newProposalButton);
    await whenOnNavigatedToRoute(CREATE_PROPOSAL_ROUTE);
  }, 60000);

  it("has a 'Blockchain time' display", async () => {
    const blockchainTimeLabel = await getBlockchainTimeLabel(dashboardDom);
    expect(blockchainTimeLabel).toBe("Blockchain time");
  }, 60000);

  // NOTE not able to change SelectField value with input()
  it.skip("has a sorting menu that sorts by expiry date, start date, or vote", async () => {
    const sortSelect = findRenderedDOMComponentWithTag(dashboardDom, "input");

    input(sortSelect, "Expiry Date");

    let proposals = await getProposals(dashboardDom);
    expect(proposals[0].children[0].children[0].textContent).toBe("");
    expect(proposals[8].children[0].children[0].textContent).toBe("");

    input(sortSelect, "Start Date");

    proposals = await getProposals(dashboardDom);
    expect(proposals[0].children[0].children[0].textContent).toBe("");
    expect(proposals[8].children[0].children[0].textContent).toBe("");

    input(sortSelect, "Vote");

    proposals = await getProposals(dashboardDom);
    expect(proposals[0].children[0].children[0].textContent).toBe("");
    expect(proposals[8].children[0].children[0].textContent).toBe("");

    input(sortSelect, "None");

    proposals = await getProposals(dashboardDom);
    expect(proposals[0].children[0].children[0].textContent).toBe("");
    expect(proposals[8].children[0].children[0].textContent).toBe("");
  }, 60000);

  it("has an Amend Protocol proposal with correct fields", async () => {
    const proposalId = 1;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkCreateTextResolutionFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has an Add Committee Member proposal with correct fields", async () => {
    const proposalId = 2;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkUpdateElectorateFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has a Remove Committee Member proposal with correct fields", async () => {
    const proposalId = 3;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkUpdateElectorateFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has an Amend Committee Threshold proposal with correct fields", async () => {
    const proposalId = 4;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkUpdateElectionRuleFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has an Amend Committee Quorum proposal with correct fields", async () => {
    const proposalId = 5;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkUpdateElectionRuleFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has an Add Validator proposal with correct fields", async () => {
    const proposalId = 6;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkSetValidatorsFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has a Remove Validator proposal with correct fields", async () => {
    const proposalId = 7;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkSetValidatorsFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has a Release Guarantee Funds proposal with correct fields", async () => {
    const proposalId = 8;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkReleaseEscrowFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);

  it("has a Distribute Funds proposal with correct fields", async () => {
    const proposalId = 9;
    const proposalIndex = 9 - proposalId;

    const proposal = (await getProposals(dashboardDom))[proposalIndex];
    checkCommonFields(proposal, proposalId);
    await checkDistributeFundsFields(proposal, proposalId);
    checkVotingPanel(proposal, proposalId);
  }, 60000);
});
