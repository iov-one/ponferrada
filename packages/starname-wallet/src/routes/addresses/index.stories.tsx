import { Address, ChainId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import React from "react";

import { ChainAddressPairWithName } from "../../components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
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

storiesOf(`${bierzoRoot}/Addresses`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Addresses tab", () => (
    <DecoratedStorybook>
      <UserAddresses chainAddresses={chainAddresses} />
    </DecoratedStorybook>
  ));
