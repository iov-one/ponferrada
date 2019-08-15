import { ToastContext } from "medulas-react-components";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { RequestContext } from "../../context/RequestProvider";
import { isSignAndPostResponseData } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { history } from "../../store/reducers";
import { REQUEST_ROUTE } from "../paths";
import { checkRequest } from "../requests";
import RejectRequest from "./components/RejectRequest";
import ShowRequest from "./components/ShowRequest";

const TxRequest = ({ location }: RouteComponentProps): JSX.Element => {
  const [action, setAction] = React.useState<"show" | "reject">("show");
  const toast = React.useContext(ToastContext);
  const requestContext = React.useContext(RequestContext);

  const firstRequest = requestContext.requests.find(() => true);
  if (!firstRequest) throw new Error("Did not find an authorization request");
  checkRequest(firstRequest, location, toast);
  const { senderUrl, responseData, accept, reject } = firstRequest;

  if (!isSignAndPostResponseData(responseData)) {
    throw new Error("Received request with a wrong sign and post request data");
  }

  const showRequestView = (): void => setAction("show");
  const showRejectView = (): void => setAction("reject");

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
      {action === "show" && (
        <ShowRequest
          tx={responseData.tx}
          sender={senderUrl}
          onAcceptRequest={onAcceptRequest}
          showRejectView={showRejectView}
        />
      )}
      {action === "reject" && (
        <RejectRequest sender={senderUrl} onBack={showRequestView} onRejectRequest={onRejectRequest} />
      )}
    </React.Fragment>
  );
};

export default withRouter(TxRequest);
