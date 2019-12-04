import { Block } from "medulas-react-components";
import React from "react";

import { BwUsernameWithChainName } from "..";
import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import StarnamesExists from "./StarnamesExists";
import StarnamesNotExists from "./StarnamesNotExists";

export const starnamesViewId = "starnames-view-id";

export interface StarnamesProps {
  readonly usernames: readonly BwUsernameWithChainName[];
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const Starnames = ({ usernames, rpcEndpointType, onRegisterUsername }: StarnamesProps): JSX.Element => {
  const hasStarnames = usernames.length > 0;

  return (
    <Block marginTop={3} id={starnamesViewId}>
      <Block margin={2} />
      {!hasStarnames && (
        <StarnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterUsername={onRegisterUsername} />
      )}
      {hasStarnames && <StarnamesExists usernames={usernames} />}
    </Block>
  );
};

export default Starnames;
