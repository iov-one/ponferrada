import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import PageColumn from 'medulas-react-components/lib/pages/PageColumn';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { history } from '..';
import { generateGetIdentitiesRequest } from '../../communication/identities';
import { getExtensionStatus } from '../../communication/status';
import { setExtensionStateAction } from '../../store/reducers/extension';
import { WELCOME_ROUTE } from '../paths';

const Login = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  //TODO: Fix this as soon as proper react-redux definitions will be available
  const dispatch = (ReactRedux as any).useDispatch();

  const onLogin = async (_: object): Promise<void> => {
    const request = generateGetIdentitiesRequest();
    const result = await getExtensionStatus(request);
    dispatch(setExtensionStateAction(result.connected, result.installed));

    if (!result.connected) {
      toast.show('Please login to the IOV extension to continue.', ToastVariant.ERROR);
      return;
    }
    if (!result.installed) {
      toast.show('You need to install IOV extension.', ToastVariant.ERROR);
      return;
    }

    history.push(WELCOME_ROUTE);
  };

  return (
    <PageColumn
      icon="white"
      onSubmit={onLogin}
      primaryTitle="Welcome"
      secondaryTitle="to your IOV wallet"
      subtitle="Continue to access your account"
      nextMsg="Continue"
    />
  );
};

export default Login;
