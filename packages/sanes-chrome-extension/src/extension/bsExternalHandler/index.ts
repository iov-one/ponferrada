import {
  JsonRpcErrorResponse,
  JsonRpcResponse,
  jsonRpcCode,
  parseJsonRpcRequest,
  JsonRpcRequest,
} from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../logic/persona';
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

function rejectRequest(permanent: boolean, sender: string): void {
  if (!permanent) {
    return;
  }

  SenderWhitelist.block(sender);
}

export async function handleExternalMessage(
  signingServer: SigningServer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  externalRequest: any,
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

  // TODO allow this code from iov/core
  let request: JsonRpcRequest;
  try {
    request = parseJsonRpcRequest(externalRequest);
    parseMethod(request.method);
  } catch (err) {
    return generateErrorResponse(responseId, err.message);
  }

  const chromeRequest = {
    request,
    accept: () => signingServer.handleChecked(request),
    reject: (permanent: boolean) => rejectRequest(permanent, sender),
  };
  RequestHandler.add(chromeRequest);
  /*
  if (SenderWhitelist.isBlocked(sender)) {
    return generateErrorResponse(responseId, 'Sender has been blocked by user');
  }

  check if sender is blocked -> if so generate Error response with custom message

  check request is getIentitiesif getIdentities
      check if sender is in allowed list -> if not generate a enqueue

  check request is signAndPost, update enqueue
  */

  return signingServer.handleUnchecked(externalRequest);
}
