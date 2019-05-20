import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { RequestContext } from '../../context/RequestProvider';
import { history } from '../../store/reducers';
import { ACCOUNT_STATUS_ROUTE, REQUEST_ROUTE } from '../paths';
import RequestList from './components/RequestList';

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
