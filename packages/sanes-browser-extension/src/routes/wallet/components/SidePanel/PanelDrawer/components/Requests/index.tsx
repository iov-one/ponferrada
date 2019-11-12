import { Block, Typography } from "medulas-react-components";
import React from "react";

import { RequestContext } from "../../../../../../../context/RequestProvider";
import RequestList from "./RequestList";

const Requests = (): JSX.Element => {
  const requestContext = React.useContext(RequestContext);
  const { requests } = requestContext;
  const hasRequests = requests.length > 0;

  return (
    <Block marginLeft={3} marginRight={3}>
      {!hasRequests && (
        <Typography align="center" weight="semibold">
          No requests in queue
        </Typography>
      )}
      {hasRequests && <RequestList requests={requests} />}
    </Block>
  );
};

export default Requests;
