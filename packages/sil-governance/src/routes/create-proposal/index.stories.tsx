import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";

import { adminAddress, getDummyElectorates } from "../../store/proposals/dummyData";
import DecoratedStorybook, { silRoot } from "../../utils/storybook";
import CreateProposal from "./index";

export const createProposalRoot = "Create Proposal";

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

storiesOf(silRoot, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(createProposalRoot, () => (
    <DecoratedStorybook storeProps={storeProps}>
      <CreateProposal />
    </DecoratedStorybook>
  ));
