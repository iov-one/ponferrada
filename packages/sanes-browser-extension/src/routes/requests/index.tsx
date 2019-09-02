import { Location } from "history";
import { ToastContextInterface, ToastVariant, Typography } from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { RequestContext } from "../../context/RequestProvider";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { history } from "../../utils/history";
import { REQUEST_ROUTE, WALLET_STATUS_ROUTE } from "../paths";
import RequestList, { REQUEST_FIELD } from "./components/RequestList";

function getIdFrom(location: Location): number | undefined {
  if (!location || !location.state) {
    return undefined;
  }

  return location.state[REQUEST_FIELD];
}

export function checkRequest(request: Request, location: Location, toast: ToastContextInterface): void {
  const expectedId = getIdFrom(location);

  if (typeof expectedId === undefined || expectedId !== request.id) {
    toast.show("Error: Request not identified", ToastVariant.ERROR);
    history.push(REQUEST_ROUTE);
  }
}

const Requests = (): JSX.Element => {
  const requestContext = React.useContext(RequestContext);
  const { requests } = requestContext;
  const hasRequests = requests.length > 0;

  const onBack = (): void => {
    history.push(WALLET_STATUS_ROUTE);
  };

  return (
    <NeumaPageLayout id={REQUEST_ROUTE} primaryTitle="Requests" title="queue" onBack={onBack} color="white">
      {!hasRequests && (
        <Typography align="center" weight="semibold">
          No requests in queue
        </Typography>
      )}
      {hasRequests && <RequestList requests={requests} />}
    </NeumaPageLayout>
  );
};

export default Requests;
