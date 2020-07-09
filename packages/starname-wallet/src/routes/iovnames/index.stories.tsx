import { Address, ChainId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import React from "react";

import { RpcEndpoint } from "communication/rpcEndpoint";
import { BwUsernameWithChainName } from "components/AccountManage";
import { ChainAddressPairWithName } from "components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Iovnames from ".";
import { Target, Account, Task } from "logic/api";

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
  type: "extension",
  resolveStarname: (query: string): Task<Account> => ({
    run: () => Promise.resolve<Account>({} as Account),
    abort: () => null,
  }),
  executeRequest: async (request: any): Promise<string> => "",
  getTargets: async (): Promise<Target[]> => [],
};

const iovnames: readonly BwUsernameWithChainName[] = [
  {
    username: "test1*iov",
    addresses: [chainAddresses[0]],
  },
  {
    username: "test2*iov",
    addresses: [chainAddresses[0], chainAddresses[1]],
  },
  {
    username: "test3*iov",
    addresses: [...chainAddresses],
  },
];

storiesOf(`${bierzoRoot}/Iovnames`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Without iovnames", () => (
    <DecoratedStorybook storeProps={{ rpcEndpoint }}>
      <Iovnames />
    </DecoratedStorybook>
  ))
  .add("With iovnames", () => (
    <DecoratedStorybook storeProps={{ usernames: iovnames, rpcEndpoint } as any}>
      <Iovnames />
    </DecoratedStorybook>
  ));
