import { parseRecipients } from "./csv";

const validText = `
tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea,4
tiov12shyht3pvvacvyee36w5844jkfh5s0mf4gszp9,5
`;

const validTextWithEmptyLines = `

tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea,4


tiov12shyht3pvvacvyee36w5844jkfh5s0mf4gszp9,5

`;

const invalidAddressText = "invalidAddress,4";

const noNumberWeightText = "tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea,invalidWeight";
const noIntegerWeightText = "tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea,4.2";
const zeroWeightText = "tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea,0";

describe("parseRecipients", () => {
  it("outputs a Recipient array if input valid", async () => {
    const recipients = parseRecipients(validText);

    expect(recipients.length).toBe(2);
    expect(recipients[0].address).toBe("tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea");
    expect(recipients[0].weight).toBe("4");
    expect(recipients[1].address).toBe("tiov12shyht3pvvacvyee36w5844jkfh5s0mf4gszp9");
    expect(recipients[1].weight).toBe("5");
  });

  it("ignores empty lines", async () => {
    const recipients = parseRecipients(validTextWithEmptyLines);

    expect(recipients.length).toBe(2);
    expect(recipients[0].address).toBe("tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea");
    expect(recipients[0].weight).toBe("4");
    expect(recipients[1].address).toBe("tiov12shyht3pvvacvyee36w5844jkfh5s0mf4gszp9");
    expect(recipients[1].weight).toBe("5");
  });

  it("throws error if address not valid", async () => {
    try {
      parseRecipients(invalidAddressText);
    } catch (error) {
      expect(error).toBe("Address not valid: invalidAddress");
    }
  });

  it("throws error if weight is not an integer > 0", async () => {
    try {
      parseRecipients(noNumberWeightText);
    } catch (error) {
      expect(error).toBe("Weight not valid: invalidAddress");
    }

    try {
      parseRecipients(noIntegerWeightText);
    } catch (error) {
      expect(error).toBe("Weight not valid: 4.2");
    }

    try {
      parseRecipients(zeroWeightText);
    } catch (error) {
      expect(error).toBe("Weight not valid: 0");
    }
  });
});
