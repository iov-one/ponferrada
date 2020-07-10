import React from "react";

import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { RpcEndpointContext } from "../../../../contexts/rpcEndpointContext";
import IovnameForm from "./IovnameForm";
import NameForm from "./NameForm";
import StarnameForm from "./StarnameForm";

interface Props {
  entity: "iovname" | "starname" | "name";
  addresses: any[];
  setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
  onCancel: () => void;
}

export const RegisterFormSelector: React.FC<Props> = (props: Props): React.ReactElement | null => {
  // FIXME: instead of returning `null' return a component indicating an error
  const rpcEndpoint: RpcEndpoint | null = React.useContext<RpcEndpoint | null>(RpcEndpointContext);
  if (rpcEndpoint === null) return null;
  switch (props.entity) {
    case "iovname":
      return (
        <IovnameForm
          onCancel={props.onCancel}
          chainAddresses={props.addresses}
          rpcEndpoint={rpcEndpoint}
          setTransactionId={props.setTransactionId}
        />
      );
    case "starname":
      return (
        <StarnameForm
          onCancel={props.onCancel}
          rpcEndpoint={rpcEndpoint}
          setTransactionId={props.setTransactionId}
        />
      );
    case "name":
      return (
        <NameForm
          onCancel={props.onCancel}
          chainAddresses={props.addresses}
          rpcEndpoint={rpcEndpoint}
          setTransactionId={props.setTransactionId}
        />
      );
    default:
      return null;
  }
};
