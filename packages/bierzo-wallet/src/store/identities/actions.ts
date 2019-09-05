import { ActionType } from "typesafe-actions";

import { IdentitiesState, SetIdentitiesStateActionType } from "./reducer";

export const setIdentities = (identities: IdentitiesState): SetIdentitiesStateActionType => ({
  type: "@@identities/SET",
  payload: identities,
});

export type IdentitiesActions = ActionType<typeof setIdentities>;
