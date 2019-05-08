import * as React from 'react';
import AcceptRequest from './components/AcceptRequest';
import ShowRequest from './components/ShowRequest';

const ShareIdentity = (): JSX.Element => {
  const [action, setAction] = React.useState<'show' | 'accept'>('show');

  const showRequestView = (): void => setAction('show');
  const showAcceptView = (): void => setAction('accept');

  const onAcceptRequest = (): void => {
    console.log('Accept request');
  };

  return (
    <React.Fragment>
      {action === 'show' && <ShowRequest showAcceptView={showAcceptView} />}
      {action === 'accept' && <AcceptRequest onBack={showRequestView} onAcceptRequest={onAcceptRequest} />}
    </React.Fragment>
  );
};

export default ShareIdentity;
