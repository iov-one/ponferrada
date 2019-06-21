import { ExtensionState } from '../../store/extension';
import { sendGetIdentitiesRequest } from '../identities';

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  return {
    installed: !!identities,
    connected: !!identities && identities.length > 0,
  };
}
