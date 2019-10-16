import { ASIDE_FILTER_HTML_ID } from "../../../components/AsideFilter";
import { HEADER_HTML_ID } from "../../../components/Header";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";
import { PROPOSALS_HTML_ID } from "../components/ProposalsList";

export const getHeader = async (dashboardDom: React.Component): Promise<Element> => {
  return (await findRenderedDOMComponentWithId(dashboardDom, HEADER_HTML_ID)) as Element;
};

export const getHeaderLogo = (header: Element): Element => {
  return header.getElementsByTagName("img")[0];
};

export const getHeaderHeading = (header: Element): string => {
  return header.getElementsByTagName("h5")[0].textContent || "";
};

export const getHeaderAddress = (header: Element): string => {
  return header.getElementsByTagName("p")[0].textContent || "";
};

export const getHeaderLinks = (header: Element): Element[] => {
  return Array.from(header.getElementsByTagName("a"));
};

export const getAsideFilter = async (dashboardDom: React.Component): Promise<Element> => {
  return ((await findRenderedDOMComponentWithId(dashboardDom, ASIDE_FILTER_HTML_ID)) as Element).children[0]
    .children[0].children[0];
};

export const getAsideFilterOptions = (asideFilter: Element): string[] => {
  return Array.from(asideFilter.children, child => child.textContent || "");
};

export const getProposals = async (dashboardDom: React.Component): Promise<Element[]> => {
  const proposalList = (await findRenderedDOMComponentWithId(dashboardDom, PROPOSALS_HTML_ID)) as Element;

  const isNotHairline = (element: Element): boolean => {
    return element.children.length > 0;
  };

  return Array.from(proposalList.children).filter(isNotHairline);
};

export const checkProposal = (proposal: Element): void => {
  const proposalPanel = proposal.children[0];

  const title = proposalPanel.children[0].textContent;
  expect(title).toBe("Proposal 1");

  const idAndAuthor = proposalPanel.children[1].textContent;
  expect(idAndAuthor).toBe("ID:1Author:Author 1");

  const description = proposalPanel.children[2].textContent;
  expect(description).toBe("short description Read more");

  const dates = proposalPanel.children[3].children[0];

  const expiryDate = dates.children[0].textContent;
  expect(expiryDate).toBe("Expires on 12/10/2020, 4:00:00 AM");

  const startDate = dates.children[1].textContent;
  expect(startDate).toBe("Started on 12/10/1995, 1:00:00 AM");

  const resultsBar = proposalPanel.children[4].textContent;
  expect(resultsBar).toBe("0% Yes");
};

export const checkActiveVotingPanel = (proposal: Element): void => {
  const votePanel = proposal.children[1];

  const yourVote = votePanel.children[0].textContent;
  expect(yourVote).toBe("Your vote: –");

  const buttons = votePanel.children[1].children[0];

  const yesButton = buttons.children[0].textContent;
  expect(yesButton).toBe("Yes");

  const noButton = buttons.children[1].textContent;
  expect(noButton).toBe("No");

  const abstainButton = buttons.children[2].textContent;
  expect(abstainButton).toBe("Abstain");

  const info = votePanel.children[2];

  const votesNeeded = info.children[0].textContent;
  expect(votesNeeded && votesNeeded.substring(0, 13)).toBe("Votes needed:");
  const yesNeeded = info.children[1].textContent;
  expect(yesNeeded && yesNeeded.substring(0, 13)).toBe('"Yes" needed:');
  const participation = info.children[2].textContent;
  expect(participation && participation.substring(0, 14)).toBe("Participation:");
};

export const checkEndedVotingPanel = (proposal: Element): void => {
  const votePanel = proposal.children[1];

  const proposalResult = votePanel.children[0].textContent;
  expect(proposalResult && proposalResult.substring(0, 9)).toBe("PROPOSAL ");

  const yourVote = votePanel.children[1].textContent;
  expect(yourVote && yourVote.substring(0, 10)).toBe("Your vote:");

  const info = votePanel.children[2];

  const votesNeeded = info.children[0].textContent;
  expect(votesNeeded && votesNeeded.substring(0, 13)).toBe("Votes needed:");
  const yesNeeded = info.children[1].textContent;
  expect(yesNeeded && yesNeeded.substring(0, 13)).toBe('"Yes" needed:');
  const participation = info.children[2].textContent;
  expect(participation && participation.substring(0, 14)).toBe("Participation:");
};
