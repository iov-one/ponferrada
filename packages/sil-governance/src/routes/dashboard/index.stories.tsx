import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";

import { ElectionFilter } from "../../components/AsideFilter";
import { adminAddress, getDummyElectorates, getDummyProposalsState } from "../../store/proposals/dummyData";
import DecoratedStorybook, { silRoot } from "../../utils/storybook";
import Dashboard from "./index";

const storeProps: any = {
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
    lastBlockheight: 44447774,
  },
};

storiesOf(silRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Dashboard", () => (
    <DecoratedStorybook storeProps={storeProps}>
      <Dashboard filter={ElectionFilter.All} />
    </DecoratedStorybook>
  ));
