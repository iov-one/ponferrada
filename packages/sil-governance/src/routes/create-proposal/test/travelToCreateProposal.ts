import { Component } from "react";
import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { history } from "../..";
import { createDom } from "../../../utils/test/dom";
import { whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import { CREATE_PROPOSAL_ROUTE } from "../../paths";

export const travelToCreateProposal = async (store: Store): Promise<Component> => {
  let dom: Component = new Component({});

  await TestUtils.act((async () => {
    dom = createDom(store);
    history.push(CREATE_PROPOSAL_ROUTE);
    await whenOnNavigatedToRoute(CREATE_PROPOSAL_ROUTE);
  }) as () => void);

  return dom;
};
