import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { history } from "../..";
import { createDom } from "../../../utils/test/dom";
import { whenOnNavigatedToRoute } from "../../../utils/test/navigation";
import { SHOW_ELECTORATE_ROUTE } from "../../paths";

export const travelToShowElectorate = async (
  store: Store,
  electorateId: string,
): Promise<React.Component> => {
  const targetRoute = `${SHOW_ELECTORATE_ROUTE}/${electorateId}`;
  const dom = createDom(store);
  TestUtils.act((): void => {
    history.push(targetRoute);
  });
  await whenOnNavigatedToRoute(targetRoute);

  return dom;
};
