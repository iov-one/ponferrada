import { JsonRpcErrorResponse, JsonRpcResponse } from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../logic/persona';

type SigningServer = UseOnlyJsonRpcSigningServer | undefined;

/*
function handleResponseToExtension(request: JsonRpcRequest, sendResponse: SendResponse): void {
  chrome.browserAction.setIcon({ path: 'assets/icons/request128.png' });
  chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
  chrome.browserAction.setBadgeText({ text: 'REQ' });

  // TODO dispath info to redux for getting the info in the extension. Include the
  // sendResponse ref for handling answer
  sendResponse(`I have handled the ${request.method} request changing the icon`);
}
*/

function generateErrorResponse(id: number | null): JsonRpcErrorResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32000,
      message: 'Signing server not ready',
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleExternalMessage(signingServer: SigningServer, request: any): Promise<JsonRpcResponse> {
  if (!signingServer) {
    const responseId = typeof request.id === 'number' ? request.id : null;
    const error = generateErrorResponse(responseId);
    return Promise.resolve(error);
  }

  return signingServer.handleUnchecked(request);
}
