export declare class ErrorParser {
  /**
   * Returns a trimmed error message.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for normalizing.
   */
  static normalizeErrorMessage(error: unknown): string;
  /**
   * Tries to parse error message as a Weave error. On success, returns an error string that
   * can be shown to the user, otherwise retuns null.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for parsing.
   */
  static tryParseWeaveError(error: unknown): string | null;
  /**
   * Tries to parse error message as a Weave error.
   * On success, returns an error string that can be shown to the user.
   * On failure, returns the error if it's a non empty string, otherwise retuns null.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for parsing.
   */
  static tryParseError(error: unknown): string | null;
}
