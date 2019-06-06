/* global chrome */
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { extensionId } from '../communication';
import { JsonRpcRequest, parseJsonRpcResponse2, isJsonRpcErrorResponse } from '@iov/jsonrpc';
import { setExtensionStateAction } from '../store/reducers/extension';
import { RootThunkDispatch } from './types';

export const getExtension = (
  request: JsonRpcRequest,
): ThunkAction<Promise<void>, {}, {}, AnyAction> => async (dispatch: RootThunkDispatch): Promise<void> => {
  try {
    chrome.runtime.sendMessage(extensionId, request, response => {
      try {
        const parsedResponse = parseJsonRpcResponse2(response);
        if (isJsonRpcErrorResponse(parsedResponse)) {
          dispatch(setExtensionStateAction(true, false));
          return;
        }

        dispatch(setExtensionStateAction(true, true));
      } catch (error) {
        dispatch(setExtensionStateAction(false, false));
      }
    });
  } catch (error) {
    dispatch(setExtensionStateAction(false, false));
  }
};
