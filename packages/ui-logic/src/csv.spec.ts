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
  it("outputs a Recipient array if input valid", () => {
    const recipients = parseRecipients(validText);

    expect(recipients.length).toBe(2);
    expect(recipients[0].address).toBe("tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea");
    expect(recipients[0].weight).toBe(4);
    expect(recipients[1].address).toBe("tiov12shyht3pvvacvyee36w5844jkfh5s0mf4gszp9");
    expect(recipients[1].weight).toBe(5);
  });

  it("ignores empty lines", () => {
    const recipients = parseRecipients(validTextWithEmptyLines);

    expect(recipients.length).toBe(2);
    expect(recipients[0].address).toBe("tiov15nuhg3l8ma2mdmcdvgy7hme20v3xy5mkxcezea");
    expect(recipients[0].weight).toBe(4);
    expect(recipients[1].address).toBe("tiov12shyht3pvvacvyee36w5844jkfh5s0mf4gszp9");
    expect(recipients[1].weight).toBe(5);
  });

  it("throws error if address not valid", () => {
    expect(() => parseRecipients(invalidAddressText)).toThrowError(/Address not valid: invalidAddress/);
  });

  it("throws error if weight is not an integer > 0", () => {
    expect(() => parseRecipients(noNumberWeightText)).toThrowError(/Weight not valid: invalidWeight/);
    expect(() => parseRecipients(noIntegerWeightText)).toThrowError(/Weight not valid: 4.2/);
    expect(() => parseRecipients(zeroWeightText)).toThrowError(/Weight not valid: 0/);
  });
});
