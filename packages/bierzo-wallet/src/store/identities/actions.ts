import { IdentitiesState, SetIdentitiesStateActionType } from "./reducer";

export const setIdentitiesStateAction = (identities: IdentitiesState): SetIdentitiesStateActionType => ({
  type: "@@identities/SET_STATE",
  payload: identities,
});
