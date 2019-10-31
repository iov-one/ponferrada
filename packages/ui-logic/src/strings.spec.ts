import { ellipsify, ellipsifyAddress, ellipsifyMiddle } from "./strings";

describe("string", () => {
  describe("ellipsify", () => {
    it("should return full string if it is shorter than maxLength", () => {
      const result = ellipsify("short_string", 12);
      expect(result).toBe("short_string");
    });

    it("should return ellipsified string if it is longer than maxLength", () => {
      const result = ellipsify("long_string_to_ellipsify", 15);
      expect(result).toBe("long_string_...");
    });

    it("should return ellipsis if maxLength less than 5 characters", () => {
      const result = ellipsify("short_string", 4);
      expect(result).toBe("...");
    });
  });

  describe("ellipsifyMiddle", () => {
    it("should return full string if it is shorter than maxLength", () => {
      const result = ellipsifyMiddle("short_string", 12);
      expect(result).toBe("short_string");
    });

    it("should return ellipsified in the middle string if it is longer than maxLength", () => {
      const result = ellipsifyMiddle("long_string_to_ellipsify", 15);
      expect(result).toBe("long_...lipsify");
    });

    it("should return ellipsis if maxLength less than 6 characters", () => {
      const result = ellipsifyMiddle("short_string", 5);
      expect(result).toBe("...");
    });
  });

  describe("ellipsifyAddress", () => {
    it("should return full string if it is shorter than maxLength", () => {
      const result = ellipsifyAddress("iov45612345");
      expect(result).toBe("iov45612345");
    });

    it("should return ellipsified in the middle string if it is longer than 14", () => {
      const result = ellipsifyAddress("iov456789abcd12345");
      expect(result).toBe("iov456789...12345");
    });
  });
});
