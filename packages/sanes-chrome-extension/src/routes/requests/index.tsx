import * as React from 'react';
import { RequestContext } from '../../context/RequestProvider';

const Requests = (): JSX.Element => {
  const requestContext = React.useContext(RequestContext);

  return <div>We have: {requestContext.requests.length}</div>;
};

export default Requests;
