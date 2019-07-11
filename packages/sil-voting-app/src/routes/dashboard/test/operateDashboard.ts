import { HEADER_HTML_ID } from '../../../components/Header';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';
import { ASIDE_FILTER_HTML_ID } from '../components/AsideFilter';
import { PROPOSALS_HTML_ID } from '../components/ProposalsList';

export const getHeader = async (dashboardDom: React.Component): Promise<Element> => {
  return (await findRenderedDOMComponentWithId(dashboardDom, HEADER_HTML_ID)) as Element;
};

export const getLogoImg = (header: Element): Element => {
  return header.children[0].children[0].children[0];
};

export const getLogoTitle = (header: Element): string => {
  return header.children[0].children[1].children[0].textContent || '';
};

export const getTitle = (header: Element): string => {
  return header.children[1].textContent || '';
};

export const getAsideFilter = async (dashboardDom: React.Component): Promise<Element> => {
  return ((await findRenderedDOMComponentWithId(dashboardDom, ASIDE_FILTER_HTML_ID)) as Element).children[0]
    .children[0].children[0];
};

export const getAsideFilterOptions = (asideFilter: Element): string[] => {
  return Array.from(asideFilter.children, child => child.textContent || '');
};

export const getProposals = async (dashboardDom: React.Component): Promise<Element[]> => {
  const proposalList = (await findRenderedDOMComponentWithId(dashboardDom, PROPOSALS_HTML_ID)) as Element;

  const isNotHairline = (element: Element): boolean => {
    return element.children.length > 0;
  };

  return Array.from(proposalList.children).filter(isNotHairline);
};

export const checkVoteButtons = (proposal: Element): void => {
  const votePanel = proposal.children[1];

  const yourVote = votePanel.children[0].textContent;
  expect(yourVote).toBe('Your Vote:');

  const yesButton = votePanel.children[1].textContent;
  expect(yesButton).toBe('Yes');

  const noButton = votePanel.children[2].textContent;
  expect(noButton).toBe('No');

  const abstainButton = votePanel.children[3].textContent;
  expect(abstainButton).toBe('Abstain');
};

export const checkActiveProposal = (proposal: Element): void => {
  const proposalPanel = proposal.children[0];

  const title = proposalPanel.children[0].children[0].textContent;
  expect(title).toBe('title1');

  const status = proposalPanel.children[0].children[1].textContent;
  expect(status).toBe('Active');

  const author = proposalPanel.children[1].children[0].textContent;
  expect(author).toBe('Author: author1');

  const id = proposalPanel.children[1].children[1].textContent;
  expect(id).toBe('Proposal ID: qwereqwer');

  const creationDate = proposalPanel.children[1].children[2].textContent;
  expect(creationDate).toBe('Created on 12/10/1995, 1:00:00 AM');

  const description = proposalPanel.children[2].textContent;
  expect(description).toBe('short description');

  const expiryDate = proposalPanel.children[3].children[0].textContent;
  expect(expiryDate).toBe('Expires on 12/10/2020, 4:00:00 AM');

  const deleteIcon = proposalPanel.children[3].children[1].children[0].children[0];
  expect(deleteIcon.getAttribute('alt')).toBe('Delete Icon');

  const deleteLabel = proposalPanel.children[3].children[1].children[0].children[1].textContent;
  expect(deleteLabel).toBe('Delete');

  const resultsBar = proposalPanel.children[4].textContent;
  expect(resultsBar).toBe('This poll results will be available until 12/10/2020, 4:00:00 AM');
};

export const checkEndedProposal = (proposal: Element): void => {
  const proposalPanel = proposal.children[0];

  const title = proposalPanel.children[0].children[0].textContent;
  expect(title).toBe('title3');

  const status = proposalPanel.children[0].children[1].textContent;
  expect(status).toBe('Ended');

  const author = proposalPanel.children[1].children[0].textContent;
  expect(author).toBe('Author: author3');

  const id = proposalPanel.children[1].children[1].textContent;
  expect(id).toBe('Proposal ID: zxcvzxcv');

  const creationDate = proposalPanel.children[1].children[2].textContent;
  expect(creationDate).toBe('Created on 1/3/2010, 4:00:00 AM');

  const description = proposalPanel.children[2].textContent;
  expect(description).toBe('short description again');

  const expiryDate = proposalPanel.children[3].children[0].textContent;
  expect(expiryDate).toBe('Expired on 6/5/2017, 3:00:00 AM');

  const quorum = proposalPanel.children[3].children[1].textContent;
  expect(quorum).toBe('Quorum: 30');

  const totalVotes = proposalPanel.children[3].children[2].textContent;
  expect(totalVotes).toBe('Total votes: 25');

  const result = proposalPanel.children[3].children[3].textContent;
  expect(result).toBe('Result: Yes');

  const resultsBar = proposalPanel.children[4].textContent;
  expect(resultsBar).toBe('60% Yes');
};
