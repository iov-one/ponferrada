import { singleton } from '../../utils/singleton';
import { createProfile } from './profile';

export const getUserProfile = singleton<typeof createProfile>(createProfile);
