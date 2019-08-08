import { Address, ChainId } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import Layout from "./components/index";

export const REGISTER_USERNAME_PATH = "Register Username";

const addresses: ChainAddressPair[] = [
  {
    chainId: "local-iov-devnet" as ChainId,
    address: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
  },
  {
    chainId: "lisk-198f2b61a8" as ChainId,
    address: "1349293588603668134L" as Address,
  },
  {
    chainId: "ethereum-eip155-5777" as ChainId,
    address: "0xD383382350F9f190Bd2608D6381B15b4e1cec0f3" as Address,
  },
];

async function onSubmit(_: object): Promise<void> {
  action("onSubmit")();
}

storiesOf(WALLET_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    REGISTER_USERNAME_PATH,
    (): JSX.Element => (
      <DecoratedStorybook>
        <Layout
          onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
          onSubmit={onSubmit}
          addresses={addresses}
        />
      </DecoratedStorybook>
    ),
  );
