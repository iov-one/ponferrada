import { JsonRpcResponse } from '@iov/jsonrpc';
import { getSigningServer } from '../actions/createPersona';
import { RequestMeta } from '../actions/createPersona/requestHandler';
import { SenderWhitelist } from '../actions/createPersona/requestSenderWhitelist';
import { generateErrorResponse } from '../errorResponseGenerator';

export async function handleExternalMessage(
  request: any, //eslint-disable-line
  sender: chrome.runtime.MessageSender,
): Promise<JsonRpcResponse> {
  const responseId = typeof request.id === 'number' ? request.id : null;
  if (!sender.url) {
    return generateErrorResponse(responseId, 'Got external message without sender URL');
  }

  const signingServer = getSigningServer();
  if (!signingServer) {
    return generateErrorResponse(responseId, 'Signing server not ready');
  }

  const { url: senderUrl } = sender;
  if (SenderWhitelist.isBlocked(senderUrl)) {
    return generateErrorResponse(responseId, 'Sender has been blocked by user');
  }

  const meta: RequestMeta = {
    senderUrl,
  };

  const response = await signingServer.handleUnchecked(request, meta);
  return response;
}
