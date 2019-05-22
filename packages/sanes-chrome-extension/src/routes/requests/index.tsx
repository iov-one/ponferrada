import { Location } from 'history';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import { ToastContextInterface } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import * as React from 'react';
import { RequestContext } from '../../context/RequestProvider';
import { Request } from '../../extension/background/actions/createPersona/requestHandler';
import { history } from '../../store/reducers';
import { ACCOUNT_STATUS_ROUTE, REQUEST_ROUTE } from '../paths';
import RequestList, { REQUEST_FIELD } from './components/RequestList';

function getIdFrom(location: Location): number | undefined {
  if (!location || !location.state) {
    return undefined;
  }

  return location.state[REQUEST_FIELD];
}

export function validRequest(
  request: Request | undefined,
  location: Location,
  toast: ToastContextInterface,
): boolean {
  const expectedId = getIdFrom(location);

  if (!request || typeof expectedId === undefined || expectedId !== request.id) {
    toast.show('Error: Request not identified', ToastVariant.ERROR);
    history.push(REQUEST_ROUTE);
    return false;
  }

  return true;
}
const Requests = (): JSX.Element => {
  const requestContext = React.useContext(RequestContext);
  const { requests } = requestContext;
  const hasRequests = requests.length > 0;

  const onBack = (): void => {
    history.push(ACCOUNT_STATUS_ROUTE);
  };

  return (
    <PageLayout id={REQUEST_ROUTE} primaryTitle="Requests" title="queue" onBack={onBack} color="white">
      {!hasRequests && (
        <Typography align="center" weight="semibold">
          No requests in queue
        </Typography>
      )}
      {hasRequests && <RequestList requests={requests} />}
    </PageLayout>
  );
};

export default Requests;
