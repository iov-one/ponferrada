import { Address, ChainId, Token, TokenTicker, TransactionId } from "@iov/bcp";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";
import { stringToAmount } from "ui-logic";

import { FormValues } from "../../../../../medulas-react-components/src/components/forms/Form/index";
import AccountEdit from "../../../components/AccountEdit";
import { UPDATE_ACCOUNT_STORY_PATH } from "../../../components/AccountEdit/index.stories";
import { BwAccountWithChainName } from "../../../components/AccountManage";
import { ACCOUNT_MANAGE_STORY_PATH } from "../../../components/AccountManage/index.stories";
import { ChainAddressPairWithName } from "../../../components/AddressesTable";
import DecoratedStorybook from "../../../utils/storybook";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../../transactions/index.stories";
import { ACCOUNT_MANAGE_IOVNAMES_STORY_PATH } from "../manage/index.stories";
import ConfirmUpdate from "./components/ConfirmUpdate";

export const UPDATE_IOVNAME_REGISTRATION_STORY_PATH = "Update Iovname";
const REGISTER_IOVNAME_CONFIRMATION_STORY_PATH = "Update confirmation";

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

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const account: BwAccountWithChainName = {
  name: "test",
  domain: "iov",
  expiryDate: new Date("June 5, 2120 03:00:00"),
  owner: addresses[0].address,
  addresses: addresses,
};

storiesOf(UPDATE_ACCOUNT_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(UPDATE_IOVNAME_REGISTRATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <AccountEdit
        chainAddresses={addresses}
        account={account}
        getFee={async (values: FormValues) => {
          action("get fee")(values);
          return { tokens: stringToAmount("5", iov) };
        }}
        onCancel={linkTo(ACCOUNT_MANAGE_STORY_PATH, ACCOUNT_MANAGE_IOVNAMES_STORY_PATH)}
        onSubmit={async (values: object): Promise<void> => action("Iovname update submit")(values)}
      />
    </DecoratedStorybook>
  ))
  .add(REGISTER_IOVNAME_CONFIRMATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <ConfirmUpdate
        transactionId={"0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId}
        onSeeTransactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
      />
    </DecoratedStorybook>
  ));
