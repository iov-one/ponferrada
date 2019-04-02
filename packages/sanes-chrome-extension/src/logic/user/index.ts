import { singleton } from '../../utils/singleton';
import { createProfile } from './profile';

export const createUserProfile = singleton<typeof createProfile>(createProfile);

export const getUserProfile = (): ReturnType<typeof createUserProfile> =>
  createUserProfile('');
