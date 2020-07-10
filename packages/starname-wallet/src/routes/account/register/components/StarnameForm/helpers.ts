import { isValidStarname } from "logic/account";

export const starnameValidator = (value: string): string | undefined => {
  const checkResult = isValidStarname(value);
  switch (checkResult) {
    case "empty":
      return "Starname is required";
    case "not_starname":
      return "Starname must include namespace after '*'";
    case "wrong_number_of_asterisks":
      return "Starname must include only one namespace";
    case "too_short":
      return "Starname should be at least 3 characters";
    case "too_long":
      return "Starname should be maximum 16 characters";
    case "wrong_chars":
      return "Starname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
    case "valid":
      return undefined;
    default:
      throw new Error(`"Unknown starname validation error: ${checkResult}`);
  }
};
