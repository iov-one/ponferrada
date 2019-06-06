import React from 'react';
import * as ReactRedux from 'react-redux';
import { Redirect, RouteProps } from 'react-router-dom';
import { history, RootState } from '../../store/reducers';
import { WELCOME_ROUTE } from '../../routes/paths';
import { ExtensionState } from '../../store/reducers/extension';
import LoginRequired from './components/LoginRequired';

interface RequireExtensionProps {
  readonly children?: React.ReactNode | ReadonlyArray<React.ReactNode>;
}

const RequireExtension = ({ children }: RequireExtensionProps): JSX.Element => {
  //TODO: Fix this as soon as proper react-redux definitions will be available
  const extensionState = (ReactRedux as any).useState(
    (state: RootState) => state.extension,
  ) as ExtensionState;

  //const path = history.location ? history.location.pathname : 'N/A';

  //const redirectPath = WELCOME_ROUTE;

  //const redirect = path !== redirectPath;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (
    <React.Fragment>
      {!extensionState.personaActive && <LoginRequired />}
      {extensionState.personaActive && children}
    </React.Fragment>
  );
};

export default RequireExtension;
