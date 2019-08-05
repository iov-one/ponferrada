import { SenderWhitelist } from "./index";

describe("SenderWhitelist", () => {
  const SENDER_ONE = "Example Sender 1";
  const SENDER_TWO = "Example Sender 2";

  let senderWhitelist: SenderWhitelist;
  beforeEach(() => {
    localStorage.clear();
    senderWhitelist = new SenderWhitelist();
  });

  it("does not store duplicate blocked senders", () => {
    senderWhitelist.block(SENDER_ONE);
    senderWhitelist.block(SENDER_ONE);
    senderWhitelist.block(SENDER_TWO);
    senderWhitelist.block(SENDER_ONE);
    senderWhitelist.block(SENDER_TWO);

    // SenderWhitelist does not expose the array of blocked domains, so this is an exceptional
    // use case which can not be used in regular code because it violates private modifier of blocked variable.
    expect(senderWhitelist["blocked"]!.length).toBe(2); // eslint-disable-line
  });

  it("persists blocked senders to localStorage so that they survive a reload", () => {
    senderWhitelist.block(SENDER_ONE);
    const newSenderWhitelist = new SenderWhitelist();

    expect(newSenderWhitelist.isBlocked(SENDER_ONE)).toBeTruthy();
  });
});
