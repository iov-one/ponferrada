import { ErrorParser } from "./error";

describe("ErrorParser", () => {
  describe("tryParseError", () => {
    it("finds error message in weave JSON (Error)", () => {
      const error = new Error(
        `{ "data": {}, "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input", "code": 1000, "hash": { "0": 229, "1": 8, "2": 182, "3": 138, "4": 198, "5": 215, "6": 106, "7": 90, "8": 52, "9": 79, "10": 138, "11": 190, "12": 170, "13": 69, "14": 99, "15": 228, "16": 151, "17": 142, "18": 127, "19": 89, "20": 24, "21": 125, "22": 25, "23": 242, "24": 60, "25": 167, "26": 124, "27": 241, "28": 209, "29": 245, "30": 23, "31": 221 } }`,
      );

      expect(ErrorParser.tryParseWeaveError(error)).toContain("must not be lower 0.5");
      expect(ErrorParser.tryParseError(error)).toContain("must not be lower 0.5");
    });

    it("finds error message in weave JSON (string)", () => {
      const error = `{ "data": {}, "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input", "code": 1000, "hash": { "0": 229, "1": 8, "2": 182, "3": 138, "4": 198, "5": 215, "6": 106, "7": 90, "8": 52, "9": 79, "10": 138, "11": 190, "12": 170, "13": 69, "14": 99, "15": 228, "16": 151, "17": 142, "18": 127, "19": 89, "20": 24, "21": 125, "22": 25, "23": 242, "24": 60, "25": 167, "26": 124, "27": 241, "28": 209, "29": 245, "30": 23, "31": 221 } }`;

      expect(ErrorParser.tryParseWeaveError(error)).toContain("must not be lower 0.5");
      expect(ErrorParser.tryParseError(error)).toContain("must not be lower 0.5");
    });

    it("finds error message in weave JSON ('Error:' prefixed string)", () => {
      const error =
        'Error: {\n  "data": {},\n  "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input",\n  "code": 1000,\n  "hash": {\n    "0": 230,\n    "1": 34,\n    "2": 73,\n    "3": 190,\n    "4": 112,\n    "5": 40,\n    "6": 174,\n    "7": 10,\n    "8": 91,\n    "9": 179,\n    "10": 237,\n    "11": 61,\n    "12": 80,\n    "13": 155,\n    "14": 105,\n    "15": 109,\n    "16": 25,\n    "17": 225,\n    "18": 116,\n    "19": 113,\n    "20": 158,\n    "21": 127,\n    "22": 129,\n    "23": 182,\n    "24": 188,\n    "25": 205,\n    "26": 78,\n    "27": 21,\n    "28": 217,\n    "29": 96,\n    "30": 236,\n    "31": 210\n  }\n}';

      expect(ErrorParser.tryParseWeaveError(error)).toContain("must not be lower 0.5");
      expect(ErrorParser.tryParseError(error)).toContain("must not be lower 0.5");
    });

    it("cuts parts of error message that are not relevant for the user", () => {
      {
        const error = `{ "data": {}, "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input", "code": 1000, "hash": { "0": 229, "1": 8, "2": 182, "3": 138, "4": 198, "5": 215, "6": 106, "7": 90, "8": 52, "9": 79, "10": 138, "11": 190, "12": 170, "13": 69, "14": 99, "15": 228, "16": 151, "17": 142, "18": 127, "19": 89, "20": 24, "21": 125, "22": 25, "23": 242, "24": 60, "25": 167, "26": 124, "27": 241, "28": 209, "29": 245, "30": 23, "31": 221 } }`;

        expect(ErrorParser.tryParseWeaveError(error)).toEqual(`field "Threshold": must not be lower 0.5`);
        expect(ErrorParser.tryParseError(error)).toEqual(`field "Threshold": must not be lower 0.5`);
      }

      {
        const error = `Error: {\n  "data": {},\n  "log": "cannot check tx: vote before proposal start time: invalid state",\n  "code": 10,\n  "hash": {\n    "0": 250,\n    "1": 103,\n    "2": 147,\n    "3": 41,\n    "4": 197,\n    "5": 104,\n    "6": 49,\n    "7": 82,\n    "8": 144,\n    "9": 129,\n    "10": 236,\n    "11": 140,\n    "12": 142,\n    "13": 38,\n    "14": 93,\n    "15": 20,\n    "16": 144,\n    "17": 58,\n    "18": 170,\n    "19": 232,\n    "20": 59,\n    "21": 53,\n    "22": 53,\n    "23": 222,\n    "24": 163,\n    "25": 118,\n    "26": 114,\n    "27": 231,\n    "28": 43,\n    "29": 131,\n    "30": 111,\n    "31": 38\n  }\n}`;

        expect(ErrorParser.tryParseWeaveError(error)).toEqual("vote before proposal start time");
        expect(ErrorParser.tryParseError(error)).toEqual("vote before proposal start time");
      }
    });

    it("returns error message as is if not JSON", () => {
      const error = "Cannot distribute to 0 recipients";
      expect(ErrorParser.tryParseError(error)).toEqual("Cannot distribute to 0 recipients");
    });

    it("tryParseWeaveError returns null when error not supported", () => {
      expect(ErrorParser.tryParseWeaveError({})).toBeNull();
      expect(ErrorParser.tryParseWeaveError("")).toBeNull();
      expect(ErrorParser.tryParseWeaveError("Cannot distribute to 0 recipients")).toBeNull();
    });

    it("tryParseError returns null when error not supported", () => {
      expect(ErrorParser.tryParseError({})).toBeNull();
      expect(ErrorParser.tryParseError("")).toBeNull();
    });
  });
});
