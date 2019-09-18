import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import {
  Request,
  SignAndPostResponseData,
} from "../../../../extension/background/model/requestsHandler/requestQueueManager";
import { CHROME_EXTENSION_ROOT } from "../../../../utils/storybook";
import { WALLET_STATUS_PAGE } from "../../../wallet/index.stories";
import ShowRequest from "../../components/ShowRequest";
import { REJECT_REQUEST_PAGE, TX_REQUEST_PATH } from "../../index.stories";
import {
  getCreateReleaseEscrowActionTransaction,
  getCreateSendActionTransaction,
  getCreateTextResolutionActionTransaction,
  getExecuteProposalBatchActionTransaction,
  getSetValidatorsActionTransaction,
  getUpdateElectionRuleActionTransaction,
  getUpdateElectorateActionTransaction,
} from "../../test";

const createTextResolutionActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getCreateTextResolutionActionTransaction(),
  },
};

const createReleaseEscrowActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getCreateReleaseEscrowActionTransaction(),
  },
};

const createSendActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getCreateSendActionTransaction(),
  },
};

const createSetValidatorsActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getSetValidatorsActionTransaction(),
  },
};

const createUpdateElectionRuleActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getUpdateElectionRuleActionTransaction(),
  },
};

const createUpdateElectorateRuleActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getUpdateElectorateActionTransaction(),
  },
};

const createExecuteProposalBatchRuleActionRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getExecuteProposalBatchActionTransaction(),
  },
};

storiesOf(`${TX_REQUEST_PATH}/Proposal Actions`, module)
  .add("ExecuteProposalBatchAction", () => {
    const { senderUrl } = createTextResolutionActionRequest;
    const { tx } = createTextResolutionActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add("ReleaseEscrowAction", () => {
    const { senderUrl } = createReleaseEscrowActionRequest;
    const { tx } = createReleaseEscrowActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add("SendAction", () => {
    const { senderUrl } = createSendActionRequest;
    const { tx } = createSendActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add("SetValidators", () => {
    const { senderUrl } = createSetValidatorsActionRequest;
    const { tx } = createSetValidatorsActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add("UpdateElectionRule", () => {
    const { senderUrl } = createUpdateElectionRuleActionRequest;
    const { tx } = createUpdateElectionRuleActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add("UpdateElectorate", () => {
    const { senderUrl } = createUpdateElectorateRuleActionRequest;
    const { tx } = createUpdateElectorateRuleActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add("ExecuteProposalBatch", () => {
    const { senderUrl } = createExecuteProposalBatchRuleActionRequest;
    const { tx } = createExecuteProposalBatchRuleActionRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, WALLET_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  });
