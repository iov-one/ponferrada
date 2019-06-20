import { ExtensionState } from '../../store/reducers/extension';
import { sendGetIdentitiesRequest } from '../identities';

export const getExtensionStatus = async (): Promise<ExtensionState> => {
  const identities = await sendGetIdentitiesRequest();

  return {
    installed: !!identities,
    connected: !!identities && identities.length > 0,
  };
};
