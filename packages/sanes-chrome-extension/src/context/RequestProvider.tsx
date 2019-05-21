/*global chrome*/
import * as React from 'react';
import { Request } from '../extension/background/actions/createPersona/requestHandler';
import { isMessageToForeground, MessageToForegroundAction } from '../extension/background/messages';
import { IovWindowExtension } from '../extension/backgroundscript';
import { extensionContext } from '../utils/chrome';

type Requests = ReadonlyArray<Request>;

export interface RequestContextInterface {
  readonly requests: Requests;
  readonly firstRequest: Request | undefined;
}

export const RequestContext = React.createContext<RequestContextInterface>({
  requests: [],
  firstRequest: undefined,
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
        case MessageToForegroundAction.RequestsChanged:
          const extensionWindow = chrome.extension.getBackgroundPage() as IovWindowExtension;
          const requests = extensionWindow.getQueuedRequests();
          setRequests([...requests]);
          break;
        default:
          throw new Error('Unknown action');
      }
    });
  }, []);

  const requestContextValue = {
    requests,
    firstRequest: requests.length > 0 ? requests[0] : undefined,
  };

  return <RequestContext.Provider value={requestContextValue}>{children}</RequestContext.Provider>;
};
