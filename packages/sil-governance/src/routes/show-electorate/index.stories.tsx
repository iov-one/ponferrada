import { storiesOf } from "@storybook/react";
import { createMemoryHistory } from "history";
import React from "react";
import { ReadonlyDate } from "readonly-date";

import { adminAddress, getDummyElectorates } from "../../store/proposals/dummyData";
import DecoratedStorybook, { silRoot } from "../../utils/storybook";
import ShowElectorate from "./index";

const showElectorateRoot = silRoot + "/Show Electorate";

const storeProps: any = {
  extension: {
    connected: true,
    installed: true,
    governor: {
      address: adminAddress,
      getElectorates: getDummyElectorates,
    },
  },
  blockchain: {
    lastBlockTime: new ReadonlyDate(1568619550 * 1000),
    lastBlockheight: 156484,
  },
};

const history = createMemoryHistory();
const location = {
  pathname: "",
  search: "",
  state: "",
  hash: "",
};
const matchEqual = {
  params: { electorateId: "1" },
  isExact: false,
  url: "",
  path: "",
};
const matchWeighted = {
  params: { electorateId: "2" },
  isExact: false,
  url: "",
  path: "",
};

storiesOf(showElectorateRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Equal Electorate", () => (
    <DecoratedStorybook storeProps={storeProps}>
      <ShowElectorate history={history} location={location} match={matchEqual} />
    </DecoratedStorybook>
  ))
  .add("Weighted Electorate", () => (
    <DecoratedStorybook storeProps={storeProps}>
      <ShowElectorate history={history} location={location} match={matchWeighted} />
    </DecoratedStorybook>
  ));
