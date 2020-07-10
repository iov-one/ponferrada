import { Address, ChainId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import { RpcEndpoint } from "communication/rpcEndpoint";
import { ChainAddressPairWithName } from "components/AddressesTable";
import { Account, Target, Task } from "logic/api";
import React from "react";
import { BwAccount } from "store/accounts";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Starnames from ".";

const defaultExpiryDate = new Date("June 5, 2120 03:00:00");

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

const rpcEndpoint: RpcEndpoint = {
  authorizeGetIdentitiesMessage: "test authorizeGetIdentitiesMessage",
  authorizeSignAndPostMessage: "test authorizeSignAndPostMessage",
  noMatchingIdentityMessage: "test noMatchingIdentityMessage",
  notAvailableMessage: "test notAvailableMessage",
  resolveStarname: (query: string): Task<Account> => ({
    run: () => Promise.resolve<Account>({} as Account),
    abort: () => null,
  }),
  executeRequest: async (request: any): Promise<string> => "",
  getTargets: async (): Promise<Target[]> => [],
  type: "extension",
};

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

storiesOf(`${bierzoRoot}/Starnames`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Without starnames", () => (
    <DecoratedStorybook storeProps={{ rpcEndpoint }}>
      <Starnames />
    </DecoratedStorybook>
  ))
  .add("With starnames", () => (
    <DecoratedStorybook storeProps={{ accounts: starnames, rpcEndpoint } as any}>
      <Starnames />
    </DecoratedStorybook>
  ));
