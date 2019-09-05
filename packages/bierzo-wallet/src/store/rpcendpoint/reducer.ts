import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { RpcEndpointActions } from "./actions";

export type RpcEndpointState = RpcEndpoint | null;

const initState: RpcEndpointState = null;

export function rpcEndpointReducer(
  state: RpcEndpointState = initState,
  action: RpcEndpointActions,
): RpcEndpointState {
  switch (action.type) {
    case "@@rpcendpoint/SET":
      return action.payload;
    default:
      return state;
  }
}
