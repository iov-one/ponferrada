import { Block } from "medulas-react-components";
import React from "react";

import { BwUsernameWithChainName } from "..";
import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import IovnamesExists from "./IovnamesExists";
import IovnamesNotExists from "./IovnamesNotExists";

export const iovnamesViewId = "starnames-view-id";

export interface IovnamesProps {
  readonly usernames: readonly BwUsernameWithChainName[];
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const Iovnames = ({ usernames, rpcEndpointType, onRegisterUsername }: IovnamesProps): JSX.Element => {
  const hasStarnames = usernames.length > 0;

  return (
    <Block marginTop={3} id={iovnamesViewId}>
      <Block margin={2} />
      {!hasStarnames && (
        <IovnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterUsername={onRegisterUsername} />
      )}
      {hasStarnames && <IovnamesExists usernames={usernames} />}
    </Block>
  );
};

export default Iovnames;
