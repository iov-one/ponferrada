import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { RequestContext } from '../../context/RequestProvider';
import { history } from '../../store/reducers';
import { REQUEST_ROUTE } from '../paths';
import { checkRequest } from '../requests';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const TxRequest = ({ location }: RouteComponentProps): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'reject'>('show');
  const toast = React.useContext(ToastContext);
  const requestContext = React.useContext(RequestContext);

  const request = requestContext.firstRequest;
  checkRequest(request, location, toast);

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

export default withRouter(TxRequest);
