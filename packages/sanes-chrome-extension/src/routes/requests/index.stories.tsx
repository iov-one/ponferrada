import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Storybook } from "medulas-react-components";
import React from "react";

import { RequestProvider } from "../../context/RequestProvider";
import { Request } from "../../extension/background/model/signingServer/requestQueueManager";
import { CHROME_EXTENSION_ROOT } from "../../utils/storybook";
import Requests from "./index";

const intialRequests: Request[] = [
  {
    id: 0,
    senderUrl: "Sender 1",
    reason: "Asking for identities for changing the world",
    responseData: {
      requestedIdentities: [],
    },
    accept: action("accept"),
    reject: action("reject"),
  },
  {
    id: 1,
    senderUrl: "Sender 2",
    reason: "Asking for signAndPost example",
    responseData: {
      requestedIdentities: [],
    },
    accept: action("accept"),
    reject: action("reject"),
  },
  {
    id: 2,
    senderUrl: "Sender 3",
    reason: "Please get Identities on new website",
    responseData: {
      requestedIdentities: [],
    },
    accept: action("accept"),
    reject: action("reject"),
  },
];

storiesOf(CHROME_EXTENSION_ROOT, module).add(
  "Request queue page",
  (): JSX.Element => (
    <Storybook>
      <RequestProvider initialRequests={intialRequests}>
        <Requests />
      </RequestProvider>
    </Storybook>
  ),
);
