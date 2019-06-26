import * as React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../routes/paths';
import { RootState } from '../../store/reducers';

interface Props {
  readonly children: React.ReactNode;
}

const RequireLogin = ({ children }: Props): JSX.Element => {
  const connected = useSelector((state: RootState) => state.extension.connected);

  if (connected) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Redirect push to={LOGIN_ROUTE} />;
};

export default RequireLogin;
