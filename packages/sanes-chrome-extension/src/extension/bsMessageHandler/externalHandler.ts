import { JsonRpcErrorResponse, JsonRpcResponse, jsonRpcCode } from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../logic/persona';

type SigningServer = UseOnlyJsonRpcSigningServer | undefined;

function generateErrorResponse(id: number | null): JsonRpcErrorResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: jsonRpcCode.serverError.default,
      message: 'Signing server not ready',
    },
  };
}

export async function handleExternalMessage(
  signingServer: SigningServer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any,
  sender: chrome.runtime.MessageSender,
): Promise<JsonRpcResponse> {
  if (!sender.url) {
    throw new Error('Got external message without sender URL');
  }

  if (!signingServer) {
    const responseId = typeof request.id === 'number' ? request.id : null;
    return generateErrorResponse(responseId);
  }

  return signingServer.handleUnchecked(request);
}
