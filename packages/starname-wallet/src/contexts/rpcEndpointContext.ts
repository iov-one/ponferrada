import React, { useContext } from "react";

import { RpcEndpoint } from "../communication/rpcEndpoint";

export const RpcEndpointContext = React.createContext<RpcEndpoint | null>(null);
export const useRpcEndpoint = (): RpcEndpoint => {
  const rpcEndpoint: RpcEndpoint | null = useContext<RpcEndpoint | null>(RpcEndpointContext);
  if (rpcEndpoint === null) throw new Error("if user was signed in, there must exist a RpcEndpoint");
  return rpcEndpoint;
};
