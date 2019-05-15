import { jsonRpcCode, JsonRpcErrorResponse } from '@iov/jsonrpc';

export function generateErrorResponse(id: number | null, message: string): JsonRpcErrorResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: jsonRpcCode.serverError.default,
      message,
    },
  };
}
