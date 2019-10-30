import { Block } from "medulas-react-components";
import React from "react";

import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import { ChainAddressPairWithName } from "../../../components/AddressesTable";
import StarnamesExists from "./StarnamesExists";
import StarnamesNotExists from "./StarnamesNotExists";

export const starnamesViewId = "starnames-view-id";

export interface StarnamesProps {
  readonly iovAddress?: string;
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
  readonly usernameAddresses: readonly ChainAddressPairWithName[];
}

const Starnames = ({
  iovAddress,
  rpcEndpointType,
  onRegisterUsername,
  usernameAddresses,
}: StarnamesProps): JSX.Element => {
  return (
    <Block marginTop={3} id={starnamesViewId}>
      <Block margin={2} />
      {!iovAddress && (
        <StarnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterUsername={onRegisterUsername} />
      )}
      {iovAddress && <StarnamesExists iovAddress={iovAddress} chainAddresses={usernameAddresses} />}
    </Block>
  );
};

export default Starnames;
