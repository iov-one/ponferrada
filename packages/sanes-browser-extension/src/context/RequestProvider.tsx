import * as React from "react";

import { IovWindowExtension } from "../extension/background/model/backgroundscript";
import { Request } from "../extension/background/model/requestsHandler/requestQueueManager";
import {
  isMessageToForeground,
  MessageToForegroundAction,
} from "../extension/background/updaters/appUpdater";
import { extensionContext } from "../utils/chrome";

type Requests = readonly Request[];

export interface RequestContextInterface {
  readonly requests: Requests;
}

export const RequestContext = React.createContext<RequestContextInterface>({
  requests: [],
});

interface Props {
  readonly children: React.ReactNode;
  readonly initialRequests: Requests;
}

export const RequestProvider = ({ children, initialRequests }: Props): JSX.Element => {
  const [requests, setRequests] = React.useState<Requests>(initialRequests || []);

  React.useEffect(() => {
    if (!extensionContext()) {
      return;
    }

    chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
      const sameTarget = sender.id === chrome.runtime.id;
      const msgToForeground = isMessageToForeground(message);
      const msgToRequestProvider = message.action === MessageToForegroundAction.RequestsChanged;
      if (!sameTarget || !msgToForeground || !msgToRequestProvider) {
        // Only handle messages from background script
        return;
      }

      switch (message.action) {
        case MessageToForegroundAction.RequestsChanged: {
          const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
          const requests = extensionWindow.getQueuedRequests();
          setRequests([...requests]);
          break;
        }
        default:
          throw new Error("Unknown action");
      }
    });
  }, []);

  const requestContextValue: RequestContextInterface = { requests };

  return <RequestContext.Provider value={requestContextValue}>{children}</RequestContext.Provider>;
};
