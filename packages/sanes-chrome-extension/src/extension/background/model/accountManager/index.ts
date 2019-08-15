import { Identity } from "@iov/bcp";

export interface AccountInfo {
  readonly index: number;
  readonly identities: readonly Identity[];
}

/**
 * An interface for account management. This will be implemented as a software
 * and a Ledger version.
 */
export interface AccountManager {
  generateNextAccount(): Promise<void>;
  accounts(): Promise<readonly AccountInfo[]>;
}
