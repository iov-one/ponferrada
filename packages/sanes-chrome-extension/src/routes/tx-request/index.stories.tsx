import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components/lib/utils/storybook";
import React from "react";

import {
  Request,
  SignAndPostResponseData,
} from "../../extension/background/model/signingServer/requestQueueManager";
import { CHROME_EXTENSION_ROOT } from "../../utils/storybook";
import { ACCOUNT_STATUS_PAGE } from "../account/index.stories";
import RejectRequest from "./components/RejectRequest";
import ShowRequest from "./components/ShowRequest";
import { getCashTransaction, getEthTransaction, getUsernameTransaction } from "./test";

const TX_REQUEST_PATH = `${CHROME_EXTENSION_ROOT}/Transaction Request`;
const SHOW_TX_REQUEST_PAGE = "Show TX Request page";
const SHOW_ETHEREUM_TX_REQUEST_PAGE = "Show TX Request page (Ethereum)";
const SHOW_USERNAME_REQUEST_PAGE = "Show USERNAME Request page";
const REJECT_REQUEST_PAGE = "Reject Request page";

const txRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getCashTransaction(),
  },
};

const ethereumTxRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this Ethereum TX",
  responseData: {
    tx: getEthTransaction(),
  },
};

const usernameRequest: Request<SignAndPostResponseData> = {
  id: 0,
  accept: () => action("accept request"),
  reject: (permanent: boolean) => action(`reject request. Permanently: ${permanent ? "yes" : "no"}`),
  senderUrl: "http://localhost/",
  reason: "I would like you to sign this TX",
  responseData: {
    tx: getUsernameTransaction(),
  },
};

storiesOf(TX_REQUEST_PATH, module)
  .add(SHOW_TX_REQUEST_PAGE, () => {
    const { tx } = txRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          sender={txRequest.senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(SHOW_ETHEREUM_TX_REQUEST_PAGE, () => {
    const { senderUrl } = ethereumTxRequest;
    const { tx } = ethereumTxRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          tx={tx}
          sender={senderUrl}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(SHOW_USERNAME_REQUEST_PAGE, () => {
    const { senderUrl } = usernameRequest;
    const { tx } = usernameRequest.responseData;

    return (
      <Storybook>
        <ShowRequest
          sender={senderUrl}
          tx={tx}
          onAcceptRequest={linkTo(CHROME_EXTENSION_ROOT, ACCOUNT_STATUS_PAGE)}
          showRejectView={linkTo(TX_REQUEST_PATH, REJECT_REQUEST_PAGE)}
        />
      </Storybook>
    );
  })
  .add(REJECT_REQUEST_PAGE, () => {
    const { senderUrl } = txRequest;

    return (
      <Storybook>
        <RejectRequest
          sender={senderUrl}
          onBack={linkTo(TX_REQUEST_PATH, SHOW_TX_REQUEST_PAGE)}
          onRejectRequest={action("onAcceptRequest")}
        />
      </Storybook>
    );
  });
