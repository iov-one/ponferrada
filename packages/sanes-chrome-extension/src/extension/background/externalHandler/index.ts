/*global chrome*/
import {
  JsonRpcErrorResponse,
  JsonRpcResponse,
  jsonRpcCode,
  parseJsonRpcRequest,
  JsonRpcRequest,
} from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../../logic/persona';
import { RequestHandler, parseMethod } from './requestHandler';
import { SenderWhitelist } from './senderWhitelist';

type SigningServer = UseOnlyJsonRpcSigningServer | undefined;

function generateErrorResponse(id: number | null, message: string): JsonRpcErrorResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: jsonRpcCode.serverError.default,
      message,
    },
  };
}

function updateExtensionBadge(): void {
  const isExtensionContext = typeof chrome !== 'undefined'; // needed for tests
  if (!isExtensionContext) {
    return;
  }

  const queueSize = RequestHandler.requests().length;
  const badgeText = queueSize === 0 ? '' : `${queueSize}`;
  const iconPath = queueSize === 0 ? 'assets/icons/icon128.png' : 'assets/icons/request128.png';

  chrome.browserAction.setIcon({ path: iconPath });
  chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
  chrome.browserAction.setBadgeText({ text: badgeText });
}

export async function handleExternalMessage(
  signingServer: SigningServer,
  externalRequest: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  sender: string | undefined
): Promise<JsonRpcResponse> {
  const responseId = typeof externalRequest.id === 'number' ? externalRequest.id : null;
  if (!sender) {
    return generateErrorResponse(responseId, 'Unkown sender, droped request');
  }

  if (!signingServer) {
    return generateErrorResponse(responseId, 'Signing server not ready');
  }

  if (!SenderWhitelist.loaded()) {
    return generateErrorResponse(responseId, 'SenderWhitelist has not been initialised');
  }

  let request: JsonRpcRequest;
  try {
    request = parseJsonRpcRequest(externalRequest);
    parseMethod(request.method);
  } catch (err) {
    return generateErrorResponse(responseId, err.message);
  }

  if (SenderWhitelist.isBlocked(sender)) {
    return generateErrorResponse(responseId, 'Sender has been blocked by user');
  }

  return new Promise(resolve => {
    const accept = (): void => {
      RequestHandler.solved();
      updateExtensionBadge();

      resolve(signingServer.handleChecked(request));
    };

    const reject = (permanent: boolean): void => {
      if (permanent) {
        SenderWhitelist.block(sender);
      }
      RequestHandler.solved();
      updateExtensionBadge();

      resolve(generateErrorResponse(responseId, 'Request has been rejected'));
    };

    RequestHandler.add({ request, accept, reject });
    updateExtensionBadge();
  });
}
