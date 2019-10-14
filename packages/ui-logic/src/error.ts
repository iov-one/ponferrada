export class ErrorParser {
  /**
   * Returns a trimmed error message.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for normalizing.
   */
  public static normalizeErrorMessage(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "";
    const normalizedErrorMessage = errorMessage.trim().replace(/^Error:\s*/, "");
    return normalizedErrorMessage;
  }

  /**
   * Tries to parse error message as a Weave error. On success, returns an error string that
   * can be shown to the user, otherwise retuns null.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for parsing.
   */
  public static tryParseWeaveError(error: unknown): string | null {
    const errorMessage = this.normalizeErrorMessage(error);

    try {
      const parsed = JSON.parse(errorMessage);
      const { code, log } = parsed;

      if (typeof code === "number" && typeof log === "string") {
        const prettified = log
          .trim()
          .replace(/^cannot check tx:\s*/, "")
          .replace(/^options invalid:\s*/, "")
          .replace(/: invalid input$/, "")
          .replace(/: invalid state$/, "");
        return prettified;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  /**
   * Tries to parse error message as a Weave error.
   * On success, returns an error string that can be shown to the user.
   * On failure, returns the error if it's a non empty string, otherwise retuns null.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for parsing.
   */
  public static tryParseError(error: unknown): string | null {
    const parsedError = this.tryParseWeaveError(error);
    if (parsedError) return parsedError;

    const normalizedErrorMessage = this.normalizeErrorMessage(error);
    if (normalizedErrorMessage) return normalizedErrorMessage;

    return null;
  }
}
