import { Block } from "medulas-react-components";
import React from "react";

import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import { AddressesTableProps } from "../../../components/AddressesTable";
import StarnamesExists from "./StarnamesExists";
import StarnamesNotExists from "./StarnamesNotExists";

export const starnamesViewId = "starnames-view-id";

export interface StarnamesProps extends AddressesTableProps {
  readonly iovAddress?: string;
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const Starnames = ({
  iovAddress,
  rpcEndpointType,
  onRegisterUsername,
  chainAddresses,
}: StarnamesProps): JSX.Element => {
  return (
    <Block marginTop={3} id={starnamesViewId}>
      <Block margin={2} />
      {!iovAddress && (
        <StarnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterUsername={onRegisterUsername} />
      )}
      {iovAddress && <StarnamesExists iovAddress={iovAddress} chainAddresses={chainAddresses} />}
    </Block>
  );
};

export default Starnames;
