import { JsonRpcRequest } from '@iov/jsonrpc';
import { ExtensionState } from '../../store/reducers/extension';
import { sendGetIdentitiesRequest } from '../identities';

export async function getExtensionStatus(request: JsonRpcRequest): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  return {
    installed: !!identities,
    connected: !!identities && identities.length > 0,
  };
}
