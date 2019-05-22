import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { RequestContext } from '../../context/RequestProvider';
import { history } from '../../store/reducers';
import { REQUEST_ROUTE } from '../paths';
import { validRequest } from '../requests';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const ShareIdentity = ({ location }: RouteComponentProps): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'reject'>('show');
  const toast = React.useContext(ToastContext);
  const requestContext = React.useContext(RequestContext);

  const request = requestContext.firstRequest;
  const isValid = validRequest(request, location, toast);
  if (!isValid) {
    return <React.Fragment />;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const requestValid = request!;

  const showRequestView = (): void => setAction('show');
  const showRejectView = (): void => setAction('reject');

  const onAcceptRequest = (): void => {
    requestValid.accept();
    history.push(REQUEST_ROUTE);
  };

  const onRejectRequest = (permanent: boolean): void => {
    requestValid.reject(permanent);
    history.push(REQUEST_ROUTE);
  };

  return (
    <React.Fragment>
      {action === 'show' && (
        <ShowRequest
          request={requestValid}
          onAcceptRequest={onAcceptRequest}
          showRejectView={showRejectView}
        />
      )}
      {action === 'reject' && (
        <RejectRequest request={requestValid} onBack={showRequestView} onRejectRequest={onRejectRequest} />
      )}
    </React.Fragment>
  );
};

export default withRouter(ShareIdentity);
