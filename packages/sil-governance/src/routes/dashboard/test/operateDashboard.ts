import {
  isCreateTextResolutionAction,
  isExecuteProposalBatchAction,
  isReleaseEscrowAction,
  isSendAction,
  isSetValidatorsAction,
  isUpdateElectionRuleAction,
  isUpdateElectorateAction,
  ProposalResult,
  SendAction,
} from "@iov/bns";
import { Page } from "puppeteer";
import {
  amountToString,
  displayPeriod,
  ellipsify,
  ellipsifyMiddle,
  round,
  sleep,
  voteToString,
} from "ui-logic";

import { ASIDE_FILTER_HTML_ID } from "../../../components/AsideFilter";
import { blockchainTimeHtmlId } from "../../../components/BlockchainTime";
import { HEADER_HTML_ID } from "../../../components/Header";
import { SilProposal } from "../../../store/proposals";
import { getDummyProposalsState } from "../../../store/proposals/dummyData";
import { click } from "../../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";
import { DESC_MAX_LENGTH } from "../components/Proposal/CollapsingData/Description";
import { comparatorLabel, PROPOSALS_HTML_ID } from "../components/ProposalsList";

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

export const getNewProposalButton = async (dashboardDom: React.Component): Promise<Element> => {
  return ((await findRenderedDOMComponentWithId(dashboardDom, ASIDE_FILTER_HTML_ID)) as Element).children[1];
};

export const getNewProposalButtonE2E = async (dashboardDom: React.Component): Promise<Element> => {
  return ((await findRenderedDOMComponentWithId(dashboardDom, ASIDE_FILTER_HTML_ID)) as Element).children[1];
};

export const getBlockchainTimeLabel = async (dashboardDom: React.Component): Promise<string> => {
  return (
    ((await findRenderedDOMComponentWithId(dashboardDom, blockchainTimeHtmlId)) as Element).children[0]
      .textContent || ""
  );
};

export const getProposals = async (dashboardDom: React.Component): Promise<Element[]> => {
  const proposalList = (await findRenderedDOMComponentWithId(dashboardDom, PROPOSALS_HTML_ID)) as Element;

  const isNotHairline = (element: Element): boolean => {
    return element.children.length > 0;
  };

  return Array.from(proposalList.children).filter(isNotHairline);
};

export const getProposalTitlesE2E = async (page: Page): Promise<string[]> => {
  return await page.evaluate(() =>
    Array.from(document.querySelectorAll("h6"), element => element.textContent || ""),
  );
};

export const checkCommonFields = (proposal: Element, id: number): void => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);

  const proposalPanel = proposal.children[0];

  const title = proposalPanel.children[0].textContent;
  expect(title).toBe(expected.title);

  const idAndAuthor = proposalPanel.children[1].textContent;
  expect(idAndAuthor).toBe(`ID:${expected.id}Author:${expected.author}`);

  const description = proposalPanel.children[2].textContent;
  const expectedDescription = ellipsify(expected.description, DESC_MAX_LENGTH);
  expect(description).toBe(expectedDescription + " Read more");

  const dates = proposalPanel.children[3].children[0];

  const expiryDate = dates.children[0].textContent;
  const expiryLabel = expected.hasEnded ? "Expired on" : "Expires on";
  expect(expiryDate).toBe(`${expiryLabel} ${expected.expiryDate.toLocaleString()}`);

  const startDate = dates.children[1].textContent;
  expect(startDate).toBe(`Started on ${expected.startDate.toLocaleString()}`);

  const resultsBar = proposalPanel.children[4].textContent;
  expect(resultsBar).toBeDefined();
};

export const checkCreateTextResolutionFields = async (proposal: Element, id: number): Promise<void> => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);
  if (!isCreateTextResolutionAction(expected.action))
    throw new Error(`Proposal ${id}'s action is not CreateTextResolution`);

  const collapsingData = proposal.children[0].children[2];
  const paragraphs = collapsingData.getElementsByTagName("p");

  expect(paragraphs.length).toBe(2);
  const readMoreButton = paragraphs[1];
  await click(readMoreButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(4);

  expect(paragraphs[0].textContent).toBe(expected.description);
  expect(paragraphs[1].textContent).toBe("Resolution:");
  expect(paragraphs[2].textContent).toBe(expected.action.resolution);

  const readLessButton = paragraphs[3];
  await click(readLessButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(2);
};

export const checkUpdateElectorateFields = async (proposal: Element, id: number): Promise<void> => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);
  if (!isUpdateElectorateAction(expected.action))
    throw new Error(`Proposal ${id}'s action is not UpdateElectorate`);

  const collapsingData = proposal.children[0].children[2];
  const paragraphs = collapsingData.getElementsByTagName("p");

  expect(paragraphs.length).toBe(2);
  const readMoreButton = paragraphs[1];
  await click(readMoreButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(4);

  expect(paragraphs[0].textContent).toBe(expected.description);
  expect(paragraphs[1].textContent).toBe(`Updates electorate ${expected.action.electorateId}:`);
  const [expectedAddress, { weight: expectedWeight }] = Object.entries(expected.action.diffElectors)[0];
  expect(paragraphs[2].textContent).toBe(`${expectedAddress} - Weight ${expectedWeight}`);

  const readLessButton = paragraphs[3];
  await click(readLessButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(2);
};

export const checkUpdateElectionRuleFields = async (proposal: Element, id: number): Promise<void> => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);
  if (!isUpdateElectionRuleAction(expected.action))
    throw new Error(`Proposal ${id}'s action is not UpdateElectionRule`);

  const collapsingData = proposal.children[0].children[2];
  const paragraphs = collapsingData.getElementsByTagName("p");

  expect(paragraphs.length).toBe(2);
  const readMoreButton = paragraphs[1];
  await click(readMoreButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(5);

  expect(paragraphs[0].textContent).toBe(expected.description);
  expect(paragraphs[1].textContent).toBe(`Updates committee ${expected.action.electionRuleId}:`);

  if (expected.action.quorum) {
    const { numerator, denominator } = expected.action.quorum;
    expect(paragraphs[2].textContent).toBe(`Quorum: ${numerator}/${denominator}`);
  }

  if (expected.action.threshold) {
    const { numerator, denominator } = expected.action.threshold;
    expect(paragraphs[2].textContent).toBe(`Threshold: ${numerator}/${denominator}`);
  }

  expect(paragraphs[3].textContent).toBe(`Period: ${displayPeriod(expected.action.votingPeriod)}`);

  const readLessButton = paragraphs[4];
  await click(readLessButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(2);
};

export const checkSetValidatorsFields = async (proposal: Element, id: number): Promise<void> => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);
  if (!isSetValidatorsAction(expected.action))
    throw new Error(`Proposal ${id}'s action is not SetValidators`);

  const collapsingData = proposal.children[0].children[2];
  const paragraphs = collapsingData.getElementsByTagName("p");

  expect(paragraphs.length).toBe(2);
  const readMoreButton = paragraphs[1];
  await click(readMoreButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(4);

  expect(paragraphs[0].textContent).toBe(expected.description);
  expect(paragraphs[1].textContent).toBe("Updates validators:");
  const [expectedAddress, { power: expectedPower }] = Object.entries(expected.action.validatorUpdates)[0];
  expect(paragraphs[2].textContent).toBe(
    `Validator ${ellipsifyMiddle(expectedAddress, 40)} - Power ${expectedPower}`,
  );

  const readLessButton = paragraphs[3];
  await click(readLessButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(2);
};

export const checkReleaseEscrowFields = async (proposal: Element, id: number): Promise<void> => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);
  if (!isReleaseEscrowAction(expected.action))
    throw new Error(`Proposal ${id}'s action is not ReleaseEscrow`);

  const collapsingData = proposal.children[0].children[2];
  const paragraphs = collapsingData.getElementsByTagName("p");

  expect(paragraphs.length).toBe(2);
  const readMoreButton = paragraphs[1];
  await click(readMoreButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(3);

  expect(paragraphs[0].textContent).toBe(expected.description);
  expect(paragraphs[1].textContent).toBe(
    `Escrow ${expected.action.escrowId} releases ${amountToString(expected.action.amount)}`,
  );

  const readLessButton = paragraphs[2];
  await click(readLessButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(2);
};

export const checkDistributeFundsFields = async (proposal: Element, id: number): Promise<void> => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);
  if (!isExecuteProposalBatchAction(expected.action)) {
    throw new Error(`Proposal ${id}'s action is not ExecuteProposalBatch`);
  }

  expected.action.messages.forEach(tx => {
    if (!isSendAction(tx)) throw new Error(`Proposal ${id}'s messages are not Send`);
  });

  const txs = expected.action.messages as SendAction[];

  const collapsingData = proposal.children[0].children[2];
  const paragraphs = collapsingData.getElementsByTagName("p");

  expect(paragraphs.length).toBe(2);
  const readMoreButton = paragraphs[1];
  await click(readMoreButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(13);

  expect(paragraphs[0].textContent).toBe(expected.description);

  expect(paragraphs[1].textContent).toBe("Transaction:");
  expect(paragraphs[2].textContent).toBe(`From: ${txs[0].sender}`);
  expect(paragraphs[3].textContent).toBe(`To: ${txs[0].recipient}`);
  expect(paragraphs[4].textContent).toBe(`Amount: ${amountToString(txs[0].amount)}`);
  expect(paragraphs[5].textContent).toBe("No memo found");

  expect(paragraphs[6].textContent).toBe("Transaction:");
  expect(paragraphs[7].textContent).toBe(`From: ${txs[1].sender}`);
  expect(paragraphs[8].textContent).toBe(`To: ${txs[1].recipient}`);
  expect(paragraphs[9].textContent).toBe(`Amount: ${amountToString(txs[1].amount)}`);
  expect(paragraphs[10].textContent).toBe("Memo: ");
  expect(paragraphs[11].textContent).toBe(txs[1].memo);

  const readLessButton = paragraphs[12];
  await click(readLessButton);
  await sleep(1000);
  expect(paragraphs.length).toBe(2);
};

const checkParticipationData = (data: Element, expected: SilProposal): void => {
  const votesNeeded = data.children[0].textContent;
  expect(votesNeeded).toBe(`Votes needed: ${expected.tally.totalVotes} / ${expected.quorum}`);

  const yesNeeded = data.children[1].textContent;
  expect(yesNeeded).toBe(`"Yes" needed: ${expected.tally.yes} / ${expected.threshold}`);

  const participation = data.children[2].textContent;
  const expectedParticipation = round((expected.tally.totalVotes / expected.tally.maxVotes) * 100, 2);
  expect(participation).toBe(`Participation: ${expectedParticipation}%`);
};

const checkActiveVotingPanel = (votingPanel: Element, expected: SilProposal): void => {
  const yourVote = votingPanel.children[0].textContent;
  expect(yourVote).toContain("Your vote:");

  const buttons = votingPanel.children[1].children[0];
  const expectedVote = voteToString(expected.vote, true);

  const yesButton = buttons.children[0].children[0];
  const yesButtonLabel = yesButton.textContent;
  expect(yesButtonLabel).toBe("Yes");
  if (expectedVote === yesButtonLabel) {
    expect(yesButton.className).toContain("contained");
    expect(yesButton.className).not.toContain("outlined");
  }

  const noButton = buttons.children[1].children[0];
  const noButtonLabel = noButton.textContent;
  expect(noButtonLabel).toBe("No");
  if (expectedVote === noButtonLabel) {
    expect(noButton.className).toContain("contained");
    expect(noButton.className).not.toContain("outlined");
  }

  const abstainButton = buttons.children[2].children[0];
  const abstainButtonLabel = abstainButton.textContent;
  expect(abstainButtonLabel).toBe("Abstain");
  if (expectedVote === abstainButtonLabel) {
    expect(abstainButton.className).toContain("contained");
    expect(abstainButton.className).not.toContain("outlined");
  }
};

const checkEndedVotingPanel = (votingPanel: Element, expected: SilProposal): void => {
  const proposalResult = votingPanel.children[0].textContent;
  const expectedResultLabel = ProposalResult[expected.result].toUpperCase();
  expect(proposalResult).toBe(`PROPOSAL ${expectedResultLabel}`);

  const yourVote = votingPanel.children[1].textContent;
  expect(yourVote).toBe(`Your vote: ${voteToString(expected.vote)}`);
};

export const checkVotingPanel = (proposal: Element, id: number): void => {
  const expected = getDummyProposalsState().proposals.find(proposal => proposal.id === id);
  if (!expected) throw new Error(`Proposal ${id} not found in ProposalsState`);

  const votingPanel = proposal.children[1];
  if (expected.hasEnded) checkEndedVotingPanel(votingPanel, expected);
  else checkActiveVotingPanel(votingPanel, expected);

  const participationData = votingPanel.children[2];
  checkParticipationData(participationData, expected);
};

const clickSortByE2E = async (page: Page): Promise<void> => {
  await page.click(`input[name="${comparatorLabel}"]`);
};

const clickTooltipOptionE2E = async (page: Page, option: number): Promise<void> => {
  await page.click(`div[role="tooltip"] nav > div:nth-child(${option}) p`);
};

export const sortByExpiryDateE2E = async (page: Page): Promise<void> => {
  await clickSortByE2E(page);
  await sleep(1000);
  await clickTooltipOptionE2E(page, 2);
};

export const sortByStartDateE2E = async (page: Page): Promise<void> => {
  await clickSortByE2E(page);
  await sleep(1000);
  await clickTooltipOptionE2E(page, 3);
};

export const sortByVoteE2E = async (page: Page): Promise<void> => {
  await clickSortByE2E(page);
  await sleep(1000);
  await clickTooltipOptionE2E(page, 4);
};

export const voteYesOnFirstProposalE2E = async (page: Page): Promise<void> => {
  await page.click(`button[type="submit"]`);
};

export const voteNoOnFirstProposalE2E = async (page: Page): Promise<void> => {
  const [txLink] = await page.$x(`//* [@id="proposals"]/div[2]/div[2]/div[1]/form/div[2]/button`);
  await txLink.click();
};
