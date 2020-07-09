import { formatDuration } from "./date";

describe("Date utils", () => {
  describe("formatDuration", () => {
    it("should return correct value if less than day", async () => {
      const duration = formatDuration(30917);
      expect(duration).toEqual("08:35:17");
    });

    it("should return correct value if less than hour", async () => {
      const duration = formatDuration(2117);
      expect(duration).toEqual("35:17");
    });

    it("should return correct value if more than day", async () => {
      const duration = formatDuration(462917);
      expect(duration).toEqual("5:08:35:17");
    });
  });
});
