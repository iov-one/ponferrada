import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";
import { DeepPartial } from "redux";

import { ElectionFilter } from "../../components/AsideFilter";
import { adminAddress, getDummyElectorates, getDummyProposalsState } from "../../store/proposals/dummyData";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { silRoot } from "../../utils/storybook";
import Dashboard from "./index";

const storeProps: DeepPartial<RootState> = {
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
