import { RpcEndpointType } from "../../communication/rpcEndpoint";
import { RootState } from "../reducers";

export const getRpcEndpointType = (state: RootState): RpcEndpointType | undefined => {
  const rpcEndpointType = state.rpcEndpoint;
  return rpcEndpointType ? rpcEndpointType.rpcEndpointType : undefined;
};
