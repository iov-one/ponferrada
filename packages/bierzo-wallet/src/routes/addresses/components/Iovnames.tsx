import { Block } from "medulas-react-components";
import React from "react";

import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import { BwUsername } from "../../../store/usernames";
import IovnamesExists from "./IovnamesExists";
import IovnamesNotExists from "./IovnamesNotExists";

export const iovnamesViewId = "iovnames-view-id";

export interface IovnamesProps {
  readonly iovnames: readonly BwUsername[];
  readonly onRegisterIovname: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const Iovnames = ({ iovnames, rpcEndpointType, onRegisterIovname }: IovnamesProps): JSX.Element => {
  const hasIovnames = iovnames.length > 0;

  return (
    <Block marginTop={3} id={iovnamesViewId}>
      <Block margin={2} />
      {!hasIovnames && (
        <IovnamesNotExists rpcEndpointType={rpcEndpointType} onRegisterIovname={onRegisterIovname} />
      )}
      {hasIovnames && <IovnamesExists iovnames={iovnames} onRegisterIovname={onRegisterIovname} />}
    </Block>
  );
};

export default Iovnames;
