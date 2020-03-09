import { Address, ChainId } from "@iov/bcp";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import { ActionMenuItem } from "medulas-react-components";
import React from "react";

import { ChainAddressPairWithName } from "../../components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BwUsernameWithChainName } from "../addresses";
import {
  REGISTER_IOVNAME_REGISTRATION_STORY_PATH,
  REGISTER_IOVNAME_STORY_PATH,
} from "../register/index.stories";
import ManageName from "./ManageName";

const chainAddresses: ChainAddressPairWithName[] = [
  {
    chainId: "local-iov-devnet" as ChainId,
    address: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
    chainName: "IOV Devnet",
  },
  {
    chainId: "lisk-198f2b61a8" as ChainId,
    address: "1349293588603668134L" as Address,
    chainName: "Lisk Devnet",
  },
  {
    chainId: "ethereum-eip155-5777" as ChainId,
    address: "0xD383382350F9f190Bd2608D6381B15b4e1cec0f3" as Address,
    chainName: "Ganache",
  },
];

const username: BwUsernameWithChainName = {
  username: "test2*iov",
  addresses: [chainAddresses[0], chainAddresses[1]],
};

const menuItems: readonly ActionMenuItem[] = [
  {
    title: "Renew",
    action: () => {
      action("Renew")();
    },
  },
  {
    title: "Transfer iovname",
    action: () => {
      action("Transfer iovname")();
    },
  },
  {
    title: "Delete iovname",
    action: () => {
      action("Delete iovname")();
    },
  },
];

storiesOf(`${bierzoRoot}/Address Manage`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Manage names", () => (
    <DecoratedStorybook>
      <ManageName
        account={username}
        menuItems={menuItems}
        onRegisterUsername={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
      />
    </DecoratedStorybook>
  ));
