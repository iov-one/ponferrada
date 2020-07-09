import { BillboardContext, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { RootState } from "../../store/reducers";
import { getFirstUsername, getFirstUsernameMigrated } from "../../store/usernames/selectors";
import { BALANCE_ROUTE, IOVNAME_REGISTER_ROUTE } from "../paths";
import UpgradeProcess from "./components";

export const GO_TO_BALANCE_LINK = "go-to-balance-link";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

function onGoHome(): void {
  history.push(BALANCE_ROUTE);
}

const Upgrade = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const bnsUsernameMigrated = ReactRedux.useSelector(getFirstUsernameMigrated);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;
  const iovAddressWithNewChain = bnsUsernameMigrated ? bnsUsernameMigrated.username : undefined;
  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const onUpgradeIovname = async (): Promise<void> => {
    if (!rpcEndpoint) throw Error("No rpcEndpoint found for submit");

    try {
      /*const starnameIdentity = identities.get("starname-migration" as ChainId);
      if (starnameIdentity === undefined || bnsUsername === undefined) {
        throw new Error("no starname network address or iovname available");
      } else {
        const request = await generateUpdateUsernameTxRequest(bnsIdentity, iovAddress as string, [
          {
            chainId: "starname-migration" as ChainId,
            address: starnameIdentity.address,
          },
          ...bnsUsername.addresses,
        ]);

        if (rpcEndpoint.type === "extension") {
          billboard.show(
            <NeumaBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
            "start",
            "flex-end",
            0,
          );
        } else {
          billboard.show(
            <LedgerBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
            "center",
            "center",
            0,
          );
        }
        const transactionId = await rpcEndpoint.sendSignAndPostRequest(request);
        if (transactionId === undefined) {
          toast.show(rpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
        } else if (transactionId === null) {
          toast.show("Request rejected", ToastVariant.ERROR);
        } else {
          // looks good
          // setTransactionId(transactionId);
        }
      }*/
    } catch (error) {
      console.error(error);
      // const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show("error", ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "50px" }}>
      <UpgradeProcess
        onRegisterIovname={onRegisterIovname}
        onUpgradeIovname={onUpgradeIovname}
        onGoHome={onGoHome}
        balances={tokens}
        iovAddress={iovAddress}
        iovAddressWithNewChain={iovAddressWithNewChain}
      />
    </div>
  );
};

export default Upgrade;
