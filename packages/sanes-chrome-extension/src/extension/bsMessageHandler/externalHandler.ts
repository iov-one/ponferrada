/*global chrome*/
import { JsonRpcErrorResponse, JsonRpcRequest } from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../logic/persona';

type SigningServer = UseOnlyJsonRpcSigningServer | undefined;
type SendResponse = (response: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

function handleWithServer(
  signingServer: SigningServer,
  request: JsonRpcRequest,
  sendResponse: SendResponse
): void {
  if (!signingServer) {
    console.warn('Could not pass message to signing server');
    const error: JsonRpcErrorResponse = {
      jsonrpc: '2.0',
      id: typeof request.id === 'number' ? request.id : null,
      error: {
        code: -32000,
        message: 'Signing server not ready',
      },
    };
    sendResponse(error);
    return;
  }

  signingServer
    .handleUnchecked(request)
    .then(response => {
      console.log('Responding', response);
      sendResponse(response);
    })
    .catch(console.error);
}

function isForServer(request: JsonRpcRequest): boolean {
  const { method } = request;
  return method === 'getIdentities' || method === 'signAndPost';
}

function handleResponseToExtension(request: JsonRpcRequest, sendResponse: SendResponse): void {
  chrome.browserAction.setIcon({ path: 'assets/icon/request128.png' });
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 255, 255, 255] });
  chrome.browserAction.setBadgeText({ text: 'REQ' });

  // TODO dispath info to redux for getting the info in the extension. Include the
  // sendResponse ref for handling answer
}

export function handleExternalMessage(
  signingServer: SigningServer,
  request: JsonRpcRequest,
  sendResponse: SendResponse
): void {
  if (isForServer(request)) {
    handleWithServer(signingServer, request, sendResponse);
    return;
  }

  handleResponseToExtension(request, sendResponse);
}
