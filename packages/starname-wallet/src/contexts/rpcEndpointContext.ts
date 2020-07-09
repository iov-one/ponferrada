import React from "react";

import { RpcEndpoint } from "../communication/rpcEndpoint";

export const RpcEndpointContext = React.createContext<RpcEndpoint | null>(null);
