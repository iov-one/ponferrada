export declare class Weave {
  /**
   * Tries to parse error message as a Weave error. On success, returns an error string that
   * can be shown to the user, otherwise retuns null.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for parsing.
   */
  static tryParseError(error: unknown): string | null;
}
