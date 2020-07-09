import { Fee } from "@iov/bcp";
import { BaseAction, FormStatus } from "forms";
import React from "react";

export enum StarnameFormActions {
  SET_STARNAME_EXISTS_ERROR = "SET_STARNAME_EXISTS_ERROR",
  SET_FORMAT_ERROR = "SET_FORMAT_ERROR",
  RESET_ALL = "RESET_ALL",
  SET_VALIDATION_SUCCEEDED = "SET_VALIDATION_SUCCEEDED",
  SET_FORM_STATUS = "SET_FORM_STATUS",
  SET_STARNAME = "SET_STARNAME",
}

export interface State {
  starname: string;
  error: string | undefined;
  status: FormStatus;
  transactionFee: Fee | undefined;
}

export const initialState: State = {
  starname: "",
  error: undefined,
  status: FormStatus.Invalid,
  transactionFee: undefined,
};

export type Action = BaseAction<StarnameFormActions>;

export const reducer: React.Reducer<State, Action> = (state: State, action: Action): State => {
  const { payload } = action;
  switch (action.type) {
    case StarnameFormActions.RESET_ALL:
      return initialState;
    case StarnameFormActions.SET_STARNAME_EXISTS_ERROR:
      return {
        ...state,
        error: "Starname already exists",
        status: FormStatus.Invalid,
      };
    case StarnameFormActions.SET_FORMAT_ERROR:
      return {
        ...state,
        error: payload,
        status: FormStatus.Invalid,
      };
    case StarnameFormActions.SET_VALIDATION_SUCCEEDED:
      return { ...state, status: FormStatus.Valid, error: undefined };
    case StarnameFormActions.SET_FORM_STATUS:
      return { ...state, status: payload };
    case StarnameFormActions.SET_STARNAME:
      return { ...state, starname: payload };
  }
  return state;
};
