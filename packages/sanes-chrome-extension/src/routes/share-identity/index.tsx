import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { RequestContext } from '../../context/RequestProvider';
import { isGetIdentityData } from '../../extension/background/actions/createPersona/requestHandler';
import { history } from '../../store/reducers';
import { REQUEST_ROUTE } from '../paths';
import { checkRequest } from '../requests';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const ShareIdentity = ({ location }: RouteComponentProps): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'reject'>('show');
  const toast = React.useContext(ToastContext);
  const requestContext = React.useContext(RequestContext);

  const req = requestContext.firstRequest;
  checkRequest(req, location, toast);
  const { data, accept, reject } = req!; // eslint-disable-line

  if (!isGetIdentityData(data)) {
    throw new Error('Received request with a wrong identities data');
  }

  const showRequestView = (): void => setAction('show');
  const showRejectView = (): void => setAction('reject');

  const onAcceptRequest = (): void => {
    accept();
    history.push(REQUEST_ROUTE);
  };

  const onRejectRequest = (permanent: boolean): void => {
    reject(permanent);
    history.push(REQUEST_ROUTE);
  };

  return (
    <React.Fragment>
      {action === 'show' && (
        <ShowRequest
          data={data.requestedIdentities}
          sender={data.senderUrl}
          onAcceptRequest={onAcceptRequest}
          showRejectView={showRejectView}
        />
      )}
      {action === 'reject' && (
        <RejectRequest sender={data.senderUrl} onBack={showRequestView} onRejectRequest={onRejectRequest} />
      )}
    </React.Fragment>
  );
};

export default withRouter(ShareIdentity);
