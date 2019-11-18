import * as React from "react";

import {
  GetIdentitiesResponseData,
  Request,
} from "../../../../../../../../../extension/background/model/requestsHandler/requestQueueManager";
import RejectIdentity from "./RejectIdentity";
import ShowIdentity from "./ShowIdentity";

interface Props {
  readonly request: Request<GetIdentitiesResponseData>;
  readonly closeExtension: () => void;
}

const ShareIdentity = ({ request, closeExtension }: Props): JSX.Element => {
  const [action, setAction] = React.useState<"show" | "reject">("show");
  const { senderUrl, responseData, accept, reject } = request;

  const showRequestView = (): void => setAction("show");
  const showRejectView = (): void => setAction("reject");

  const onAcceptRequest = (): void => {
    accept();
    closeExtension();
  };

  const onRejectRequest = (permanent: boolean): void => {
    reject(permanent);
    closeExtension();
  };

  return (
    <React.Fragment>
      {action === "show" && (
        <ShowIdentity
          data={responseData.requestedIdentities}
          sender={senderUrl}
          onAcceptRequest={onAcceptRequest}
          showRejectView={showRejectView}
        />
      )}
      {action === "reject" && (
        <RejectIdentity sender={senderUrl} onBack={showRequestView} onRejectRequest={onRejectRequest} />
      )}
    </React.Fragment>
  );
};

export default ShareIdentity;
