/* global chrome */
import { ExtensionState } from '../../store/reducers/extension';
import { parseJsonRpcResponse2, isJsonRpcErrorResponse, JsonRpcRequest } from '@iov/jsonrpc';
import { extensionId } from '..';

export async function getExtensionStatus(request: JsonRpcRequest): Promise<ExtensionState> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(extensionId, request, response => {
        try {
          const parsedResponse = parseJsonRpcResponse2(response);
          if (isJsonRpcErrorResponse(parsedResponse)) {
            resolve({ installed: true, connected: false });
            return;
          }

          resolve({ installed: true, connected: true });
        } catch (error) {
          resolve({ installed: false, connected: false });
        }
      });
    } catch (error) {
      resolve({ installed: false, connected: false });
    }
  });
}
