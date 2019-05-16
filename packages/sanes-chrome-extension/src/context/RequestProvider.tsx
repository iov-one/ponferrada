/*global chrome*/
import * as React from 'react';
import { isMessageToForeground, MessageToForegroundAction } from '../extension/background/messages';
import { extensionContext } from '../utils/chrome';

type Requests = ReadonlyArray<Request>;

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
      if (sender.id !== chrome.runtime.id || !isMessageToForeground(message)) {
        // Only handle messages from background script
        return;
      }

      switch (message.action) {
        case MessageToForegroundAction.RequestChanges:
          if (!Array.isArray(message.data)) {
            throw new Error('Data must be an array');
          }
          setRequests(message.data);
          break;
        default:
          throw new Error('Unknown action');
      }
    });
  }, []);

  const requestContextValue = {
    requests,
  };

  return <RequestContext.Provider value={requestContextValue}>{children}</RequestContext.Provider>;
};
