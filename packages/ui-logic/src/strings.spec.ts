import { ellipsify, ellipsifyMiddle } from "./strings";

describe("string", () => {
  describe("ellipsify", () => {
    it("should return full string if it is shorter than maxLength", async () => {
      const result = ellipsify("short_string", 12);
      await expect(result).toBe("short_string");
    });

    it("should return ellipsified string if it is longer than maxLength", async () => {
      const result = ellipsify("long_string_to_ellipsify", 15);
      await expect(result).toBe("long_string_...");
    });

    it("should return ellipsis if maxLength less than 5 characters", async () => {
      const result = ellipsify("short_string", 4);
      await expect(result).toBe("...");
    });
  });

  describe("ellipsifyMiddle", () => {
    it("should return full string if it is shorter than maxLength", async () => {
      const result = ellipsifyMiddle("short_string", 12);
      await expect(result).toBe("short_string");
    });

    it("should return ellipsified in the middle string if it is longer than maxLength", async () => {
      const result = ellipsifyMiddle("long_string_to_ellipsify", 15);
      await expect(result).toBe("long_...lipsify");
    });

    it("should return ellipsis if maxLength less than 6 characters", async () => {
      const result = ellipsifyMiddle("short_string", 5);
      await expect(result).toBe("...");
    });
  });
});
