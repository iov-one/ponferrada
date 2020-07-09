import * as React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

import { LOGIN_ROUTE } from "../../routes/paths";
import { RootState } from "../../store/reducers";

interface Props {
  readonly children: React.ReactNode;
}

const RequireLogin = ({ children }: Props): React.ReactElement => {
  const identities = useSelector((state: RootState) => state.identities);

  if (identities.size !== 0) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Redirect push to={LOGIN_ROUTE} />;
};

export default RequireLogin;
