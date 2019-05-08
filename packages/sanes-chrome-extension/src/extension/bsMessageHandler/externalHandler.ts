import { JsonRpcErrorResponse, JsonRpcResponse } from '@iov/jsonrpc';
import { UseOnlyJsonRpcSigningServer } from '../../logic/persona';

type SigningServer = UseOnlyJsonRpcSigningServer | undefined;

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
