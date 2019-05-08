import * as React from 'react';
import AcceptRequest from './components/AcceptRequest';
import RejectRequest from './components/RejectRequest';
import ShowRequest from './components/ShowRequest';

const ShareIdentity = (): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'accept' | 'reject'>('show');

  const showRequestView = (): void => setAction('show');
  const showAcceptView = (): void => setAction('accept');
  const showRejectView = (): void => setAction('reject');

  const onAcceptRequest = (): void => {
    console.log('Accept request');
  };

  const onRejectRequest = (permanent: boolean): void => {
    console.log(`Reject request. Permanent ${permanent ? 'yes' : 'no'}`);
  };

  return (
    <React.Fragment>
      {action === 'show' && <ShowRequest showAcceptView={showAcceptView} showRejectView={showRejectView} />}
      {action === 'accept' && <AcceptRequest onBack={showRequestView} onAcceptRequest={onAcceptRequest} />}
      {action === 'reject' && <RejectRequest onBack={showRequestView} onRejectRequest={onRejectRequest} />}
    </React.Fragment>
  );
};

export default ShareIdentity;
