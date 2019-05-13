import { JsonRpcErrorResponse, JsonRpcResponse, jsonRpcCode } from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../logic/persona';
import { RpcCall, parseRpcCall } from './requestHandler';

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

export async function handleExternalMessage(
  signingServer: SigningServer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  externalRequest: any
): Promise<JsonRpcResponse> {
  const responseId = typeof externalRequest.id === 'number' ? externalRequest.id : null;
  if (!signingServer) {
    return generateErrorResponse(responseId, 'Signing server not ready');
  }

  // TODO allow this code from iov/core
  let rpcCall: RpcCall;
  try {
    rpcCall = parseRpcCall(externalRequest);
  } catch (err) {
    return generateErrorResponse(responseId, err.message);
  }

  /*
  check if sender is blocked -> if so generate Error response with custom message

  check request is getIentitiesif getIdentities
      check if sender is in allowed list -> if not generate a enqueue

  check request is signAndPost, update enqueue
  */

  return signingServer.handleUnchecked(externalRequest);
}
