export class Weave {
  /**
   * Tries to parse error message as a Weave error. On success, returns an error string that
   * can be shown to the user, otherwise retuns null.
   *
   * @param error pass in the variable from the catch block. Error and string are supported for parsing.
   */
  public static tryParseError(error: unknown): string | null {
    const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "";

    const normalizedErrorMessage = errorMessage.trim().replace(/^Error:\s*/, "");

    try {
      const parsed = JSON.parse(normalizedErrorMessage);
      const { code, log } = parsed;

      if (typeof code === "number" && typeof log === "string") {
        const prettified = log
          .replace(/^cannot check tx:/, "")
          .replace(/: invalid input$/, "")
          .trim();
        return prettified;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
}
