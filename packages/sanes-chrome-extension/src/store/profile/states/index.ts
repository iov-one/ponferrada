import { UserProfile } from '@iov/keycontrol';

import { StringDB } from '../../../logic/db';

export interface ProfileState {
  readonly local: LocalDetails;
  readonly external: ExternalDetails;
}

export interface LocalDetails {
  readonly db: StringDB;
  readonly createdAt?: Date;
}

export interface ExternalDetails {
  readonly profile?: UserProfile | undefined;
}
