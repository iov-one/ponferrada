import * as React from 'react';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const TxRequest = (): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'reject'>('show');

  const showRequestView = (): void => setAction('show');
  const showRejectView = (): void => setAction('reject');

  const onAcceptRequest = (): void => {
    console.log('Accept request');
  };

  const onRejectRequest = (permanent: boolean): void => {
    console.log(`Reject request. Permanent ${permanent ? 'yes' : 'no'}`);
  };

  return (
    <React.Fragment>
      {action === 'show' && <ShowRequest onAcceptRequest={onAcceptRequest} showRejectView={showRejectView} />}
      {action === 'reject' && <RejectRequest onBack={showRequestView} onRejectRequest={onRejectRequest} />}
    </React.Fragment>
  );
};

export default TxRequest;
