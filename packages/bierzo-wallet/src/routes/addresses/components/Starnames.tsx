import { Block } from "medulas-react-components";
import React from "react";

import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import { BwAccount } from "../../../store/accounts";
import StarnamesExists from "./StarnamesExists";
import StarnamesNotExists from "./StarnamesNotExists";

export const starnamesViewId = "starnames-view-id";

export interface StarnamesProps {
  readonly starnames: readonly BwAccount[];
  readonly onRegisterStarname: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const Starnames = ({ starnames, rpcEndpointType, onRegisterStarname }: StarnamesProps): JSX.Element => {
  const hasStarnames = starnames.length > 0;

  return (
    <Block marginTop={3} id={starnamesViewId}>
      <Block margin={2} />
      {!hasStarnames && (
        <StarnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterStarname={onRegisterStarname} />
      )}
      {hasStarnames && <StarnamesExists starnames={starnames} onRegisterStarname={onRegisterStarname} />}
    </Block>
  );
};

export default Starnames;
