import { RpcEndpoint } from "communication/rpcEndpoint";
import { RpcEndpointContext } from "contexts/rpcEndpointContext";
import * as React from "react";
import { Redirect } from "react-router";
import { LOGIN_ROUTE } from "routes/paths";

interface Props {
  readonly rpcEndpoint: RpcEndpoint | null;
}

const RequireLogin: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  rpcEndpoint,
}: React.PropsWithChildren<Props>): React.ReactElement => {
  if (rpcEndpoint !== null) {
    return <RpcEndpointContext.Provider value={rpcEndpoint}>{children}</RpcEndpointContext.Provider>;
  }
  return <Redirect push to={LOGIN_ROUTE} />;
};

export default RequireLogin;
