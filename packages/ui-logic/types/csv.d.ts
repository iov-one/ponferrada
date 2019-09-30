import { Address } from "@iov/bcp";
interface Recipient {
  address: Address;
  weight: number;
}
export declare function parseRecipients(text: string): Recipient[];
export {};
