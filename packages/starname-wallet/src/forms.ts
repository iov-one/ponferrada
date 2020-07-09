export type BaseAction<T> = { type: T; payload?: any };
export enum FormStatus {
  Invalid = "invalid",
  Valid = "valid",
  Validating = "validating",
  Submitting = "submitting",
}
