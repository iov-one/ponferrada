import { Address, ChainId } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import { BwAccountWithChainName } from "../../components/AccountManage";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import { BwAccount } from "../../store/accounts";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import {
  REGISTER_IOVNAME_REGISTRATION_STORY_PATH,
  REGISTER_IOVNAME_STORY_PATH,
  REGISTER_STARNAME_REGISTRATION_STORY_PATH,
  REGISTER_STARNAME_STORY_PATH,
} from "../account/register/index.stories";
import AddressesTab from "./components/AddressesTab";
import Iovnames from "./components/Iovnames";
import Starnames from "./components/Starnames";
import UserAddresses from "./components/UserAddresses";

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

const iovnames: readonly BwAccountWithChainName[] = [
  {
    name: "test1",
    domain: "iov",
    expiryDate: new Date("June 5, 2120 03:00:00"),
    owner: chainAddresses[0].address,
    addresses: [chainAddresses[0]],
  },
  {
    name: "test2",
    domain: "iov",
    expiryDate: new Date("June 5, 2120 03:00:00"),
    owner: chainAddresses[0].address,
    addresses: [chainAddresses[0], chainAddresses[1]],
  },
  {
    name: "test3",
    domain: "iov",
    expiryDate: new Date("June 5, 2120 03:00:00"),
    owner: chainAddresses[0].address,
    addresses: [...chainAddresses],
  },
];

const defaultExpiryDate = new Date("June 5, 2120 03:00:00");

const starnames: readonly BwAccount[] = [
  {
    domain: "domain1",
    name: "name1",
    expiryDate: defaultExpiryDate,
    addresses: [chainAddresses[0]],
    owner: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
  },
  {
    domain: "domain2",
    name: "name2",
    expiryDate: defaultExpiryDate,
    addresses: [chainAddresses[0]],
    owner: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
  },
  {
    domain: "domain1",
    name: "name2",
    expiryDate: defaultExpiryDate,
    addresses: [chainAddresses[0]],
    owner: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
  },
];

storiesOf(`${bierzoRoot}/Addresses`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Main with extension", () => (
    <DecoratedStorybook>
      <AddressesTab
        chainAddresses={chainAddresses}
        iovnames={[]}
        starnames={[]}
        onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        onRegisterStarname={() => {}}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Main with names", () => (
    <DecoratedStorybook>
      <AddressesTab
        chainAddresses={chainAddresses}
        iovnames={iovnames}
        starnames={starnames}
        onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        onRegisterStarname={() => {}}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Main with ledger", () => (
    <DecoratedStorybook>
      <AddressesTab
        chainAddresses={chainAddresses}
        iovnames={[]}
        starnames={[]}
        onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        onRegisterStarname={() => {}}
        rpcEndpointType="ledger"
      />
    </DecoratedStorybook>
  ))
  .add("Addresses tab", () => (
    <DecoratedStorybook>
      <UserAddresses chainAddresses={chainAddresses} />
    </DecoratedStorybook>
  ))
  .add("Iovnames tab", () => (
    <DecoratedStorybook>
      <Iovnames
        iovnames={[]}
        onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Iovnames with name tab", () => (
    <DecoratedStorybook>
      <Iovnames
        iovnames={iovnames}
        onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ))
  .add("Starnames with name tab", () => (
    <DecoratedStorybook>
      <Starnames
        starnames={starnames}
        onRegisterStarname={linkTo(REGISTER_STARNAME_STORY_PATH, REGISTER_STARNAME_REGISTRATION_STORY_PATH)}
        rpcEndpointType="extension"
      />
    </DecoratedStorybook>
  ));
