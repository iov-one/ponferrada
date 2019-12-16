import { Component } from "react";
import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { history } from "../..";
import { createDom } from "../../../utils/test/dom";
import { whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import { SHOW_ELECTORATE_ROUTE } from "../../paths";

export const travelToShowElectorate = async (store: Store, electorateId: string): Promise<Component> => {
  let dom: Component = new Component({});
  const targetRoute = `${SHOW_ELECTORATE_ROUTE}/${electorateId}`;

  await TestUtils.act((async () => {
    dom = createDom(store);
    history.push(targetRoute);
    await whenOnNavigatedToRoute(targetRoute);
  }) as () => void);

  return dom;
};
