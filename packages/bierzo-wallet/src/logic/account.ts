import { Address, ChainId } from "@iov/bcp";

import { getConnectionForBns } from "./connection";

export function isIov(username: string): boolean {
  return username.endsWith("*iov");
}

/**
 * Returns the address associated with the name, or undefined if not registered.
 * The name must include a namespace ("*iov")
 */
export async function lookupRecipientAddressByName(
  username: string,
  chainId: ChainId,
): Promise<Address | "name_not_found" | "no_address_for_blockchain"> {
  if (!isIov(username)) {
    throw new Error("Username must include namespace suffix");
  }

  const connection = await getConnectionForBns();
  const usernames = await connection.getUsernames({ username });
  if (usernames.length !== 1) {
    return "name_not_found";
  }

  const chainAddressPair = usernames[0].targets.find(addr => addr.chainId === chainId);

  if (chainAddressPair) {
    return chainAddressPair.address;
  }

  return "no_address_for_blockchain";
}

export function isValidIov(
  username: string,
): "valid" | "not_iov" | "wrong_number_of_asterisks" | "too_short" | "too_long" | "wrong_chars" {
  if (!isIov(username)) return "not_iov";

  const parts = username.split("*");
  if (parts.length !== 2) return "wrong_number_of_asterisks";
  // TODO: add namespace variable as soon as multiple namespaces has been supported
  const [name] = parts;

  // Username length must be at least 3 chars long
  if (name.length < 3) return "too_short";

  // Username length must maximum 64 chars long
  if (name.length > 64) return "too_long";

  // Must contain only allowed chars
  if (/^[a-z0-9_\-.]{3,64}\*iov$/.test(username)) return "valid";

  return "wrong_chars";
}
