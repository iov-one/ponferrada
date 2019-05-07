/*global chrome*/
import { JsonRpcRequest } from '@iov/jsonrpc';
import { extensionId } from '..';

const generateShareIdentityRequest = (): JsonRpcRequest => ({
  jsonrpc: '2.0',
  id: 2,
  method: 'shareIdentities',
  params: {},
});

export const sendShareIdentityRequest = (): void => {
  const request = generateShareIdentityRequest();

  chrome.runtime.sendMessage(extensionId, request, response => {
    console.log('Response is: ' + response);
  });
};
