import { Location } from 'history';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { RequestContext } from '../../context/RequestProvider';
import { history } from '../../store/reducers';
import { REQUEST_ROUTE } from '../paths';
import { REQUEST_FIELD } from '../requests/components/RequestList';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

function getIdFrom(location: Location): number | undefined {
  if (!location || !location.state) {
    return undefined;
  }

  return location.state[REQUEST_FIELD];
}

const ShareIdentity = ({ location }: RouteComponentProps): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'reject'>('show');
  const toast = React.useContext(ToastContext);
  const requestContext = React.useContext(RequestContext);

  const request = requestContext.firstRequest;
  const expectedId = getIdFrom(location);

  if (!request || typeof expectedId === undefined || expectedId !== request.id) {
    toast.show('Error: Request not identified', ToastVariant.ERROR);
    history.push(REQUEST_ROUTE);
  }

  const showRequestView = (): void => setAction('show');
  const showRejectView = (): void => setAction('reject');

  const onAcceptRequest = (): void => {
    request!.accept(); // eslint-disable-line
    history.push(REQUEST_ROUTE);
  };

  const onRejectRequest = (permanent: boolean): void => {
    request!.reject(permanent); // eslint-disable-line
    history.push(REQUEST_ROUTE);
  };

  return (
    <React.Fragment>
      {action === 'show' && <ShowRequest onAcceptRequest={onAcceptRequest} showRejectView={showRejectView} />}
      {action === 'reject' && <RejectRequest onBack={showRequestView} onRejectRequest={onRejectRequest} />}
    </React.Fragment>
  );
};

export default withRouter(ShareIdentity);
