import { jsonRpcCode, JsonRpcErrorResponse } from "@iov/jsonrpc";

export function generateErrorResponse(
  id: number | null,
  message: string,
  code = jsonRpcCode.serverError.default,
): JsonRpcErrorResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
    },
  };
}
