import { Address, ChainId } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import { ChainAddressPairWithName } from "../../components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import {
  REGISTER_USERNAME_REGISTRATION_STORY_PATH,
  REGISTER_USERNAME_STORY_PATH,
} from "../registerName/index.stories";
import AddressesTab from "./components/AddressesTab";
import Starnames from "./components/Starnames";
import UserAddresses from "./components/UserAddresses";

const addresses: ChainAddressPairWithName[] = [
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

storiesOf(`${bierzoRoot}/Addresses`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Main with extension", () => (
    <DecoratedStorybook>
      <AddressesTab
        chainAddresses={addresses}
        onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Main with iovAddress", () => (
    <DecoratedStorybook>
      <AddressesTab
        chainAddresses={addresses}
        iovAddress="albert*iov"
        onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Main with ledger", () => (
    <DecoratedStorybook>
      <AddressesTab
        chainAddresses={addresses}
        onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="ledger"
      />
    </DecoratedStorybook>
  ))
  .add("Addresses tab", () => (
    <DecoratedStorybook>
      <UserAddresses chainAddresses={addresses} />
    </DecoratedStorybook>
  ))
  .add("Starnames tab", () => (
    <DecoratedStorybook>
      <Starnames
        chainAddresses={addresses}
        onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Starnames with name tab", () => (
    <DecoratedStorybook>
      <Starnames
        chainAddresses={addresses}
        iovAddress="albert*iov"
        onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ));
