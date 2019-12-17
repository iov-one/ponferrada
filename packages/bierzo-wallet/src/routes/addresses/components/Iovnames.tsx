import { Block } from "medulas-react-components";
import React from "react";

import { BwUsernameWithChainName } from "..";
import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import IovnamesExists from "./IovnamesExists";
import IovnamesNotExists from "./IovnamesNotExists";

export const iovnamesViewId = "iovnames-view-id";

export interface IovnamesProps {
  readonly usernames: readonly BwUsernameWithChainName[];
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const Iovnames = ({ usernames, rpcEndpointType, onRegisterUsername }: IovnamesProps): JSX.Element => {
  const hasIovnames = usernames.length > 0;

  return (
    <Block marginTop={3} id={iovnamesViewId}>
      <Block margin={2} />
      {!hasIovnames && (
        <IovnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterUsername={onRegisterUsername} />
      )}
      {hasIovnames && <IovnamesExists usernames={usernames} onRegisterUsername={onRegisterUsername} />}
    </Block>
  );
};

export default Iovnames;
