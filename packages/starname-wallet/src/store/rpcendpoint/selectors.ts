import { RpcEndpointType } from "../../communication/rpcEndpoint";
import { RootState } from "../reducers";

export const getRpcEndpointType = (state: RootState): RpcEndpointType => {
  const rpcEndpoint = state.rpcEndpoint;
  if (!rpcEndpoint) {
    throw new Error("RPC Endpoint should be set at this point. Something wrong!");
  }
  return rpcEndpoint.type;
};
