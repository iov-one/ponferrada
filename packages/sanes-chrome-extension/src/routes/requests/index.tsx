import * as React from 'react';
import { RequestContext } from '../../context/RequestProvider';

const Requests = (): JSX.Element => {
  const requestContext = React.useContext(RequestContext);
  const onResolve = (): void => {
    const firstTx = requestContext.requests[0];
    console.log(firstTx);
    firstTx.reject(false);
  };

  return (
    <React.Fragment>
      <div>We have: {requestContext.requests.length}</div>
      <button onClick={onResolve}>Resolve the first one</button>
    </React.Fragment>
  );
};

export default Requests;
