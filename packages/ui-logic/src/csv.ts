import { Address } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";

interface Recipient {
  address: Address;
  weight: number;
}

export function parseRecipients(text: string): Recipient[] {
  return (
    text
      // split per new line
      .split(/\r\n|\r|\n/)
      // remove empty lines
      .filter(str => str.length > 0)
      // generate Recipient[]
      .map(recipient => {
        const [address, weight] = recipient.split(",");

        if (!bnsCodec.isValidAddress(address)) throw new Error("Address not valid: " + address);
        const weightNotValid = weight.match(/^[1-9]+[0-9]*$/) ? false : true;
        if (weightNotValid) throw new Error("Weight not valid: " + weight);

        return { address: address as Address, weight: Number(weight) };
      })
  );
}
