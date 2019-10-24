import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { history } from "../..";
import { createDom } from "../../../utils/test/dom";
import { whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import { CREATE_PROPOSAL_ROUTE } from "../../paths";

export const travelToCreateProposal = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act((): void => {
    history.push(CREATE_PROPOSAL_ROUTE);
  });
  await whenOnNavigatedToRoute(CREATE_PROPOSAL_ROUTE);

  return dom;
};
