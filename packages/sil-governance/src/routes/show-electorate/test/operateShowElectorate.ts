import { ASIDE_FILTER_HTML_ID } from "../../../components/AsideFilter";
import { blockchainTimeHtmlId } from "../../../components/BlockchainTime";
import { HEADER_HTML_ID } from "../../../components/Header";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";

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

export const getBlockchainTimeLabel = async (dashboardDom: React.Component): Promise<string> => {
  return (
    ((await findRenderedDOMComponentWithId(dashboardDom, blockchainTimeHtmlId)) as Element).children[0]
      .textContent || ""
  );
};
