import { Action } from "redux";
import { ActionType } from "typesafe-actions";

import { RpcEndpoint } from "../../communication/rpcEndpoint";

export interface SetRpcEndpointActionType extends Action {
  type: "@@rpcendpoint/SET";
  payload: RpcEndpoint | null;
}

export const setRpcEndpoint = (rpcEndpoint: RpcEndpoint | null): SetRpcEndpointActionType => ({
  type: "@@rpcendpoint/SET",
  payload: rpcEndpoint,
});

export type RpcEndpointActions = ActionType<typeof setRpcEndpoint>;
