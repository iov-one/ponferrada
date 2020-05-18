import { ChainId, Identity } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import { BillboardContext, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { generateUpdateUsernameTxRequest } from "../../communication/requestgenerators";
import LedgerBillboardMessage from "../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../components/BillboardMessage/NeumaBillboardMessage";
import { getConnectionForChainId } from "../../logic/connection";
import { ExtendedIdentity } from "../../store/identities";
import { RootState } from "../../store/reducers";
import { getFirstUsername, getFirstUsernameMigrated } from "../../store/usernames/selectors";
import { BALANCE_ROUTE, UPGRADE_ROUTE } from "../paths";

export function getBnsIdentity(identities: ReadonlyMap<ChainId, ExtendedIdentity>): Identity | undefined {
  for (const identity of Array.from(identities.values()).map(ext => ext.identity)) {
    if (getConnectionForChainId(identity.chainId) instanceof BnsConnection) {
      return identity;
    }
  }
  return undefined;
}

const CheckMigration = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const bnsUsernameMigrated = ReactRedux.useSelector(getFirstUsernameMigrated);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;
  const iovAddressWithNewChain = bnsUsernameMigrated ? bnsUsernameMigrated.username : undefined;

  if (iovAddressWithNewChain) {
    history.push(BALANCE_ROUTE);
  } else {
    history.push(UPGRADE_ROUTE);
  }

  return <div style={{ maxWidth: "500px", margin: "0 auto", padding: "50px" }}>LOADING...</div>;
};

export default CheckMigration;
