import { Weave } from "./weave";

describe("Weave", () => {
  describe("tryParseError", () => {
    it("finds error message in weave JSON (Error)", () => {
      const error = new Error(
        `{ "data": {}, "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input", "code": 1000, "hash": { "0": 229, "1": 8, "2": 182, "3": 138, "4": 198, "5": 215, "6": 106, "7": 90, "8": 52, "9": 79, "10": 138, "11": 190, "12": 170, "13": 69, "14": 99, "15": 228, "16": 151, "17": 142, "18": 127, "19": 89, "20": 24, "21": 125, "22": 25, "23": 242, "24": 60, "25": 167, "26": 124, "27": 241, "28": 209, "29": 245, "30": 23, "31": 221 } }`,
      );
      expect(Weave.tryParseError(error)).toContain(`options invalid: field "Threshold"`);
    });

    it("finds error message in weave JSON (string)", () => {
      const error = `{ "data": {}, "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input", "code": 1000, "hash": { "0": 229, "1": 8, "2": 182, "3": 138, "4": 198, "5": 215, "6": 106, "7": 90, "8": 52, "9": 79, "10": 138, "11": 190, "12": 170, "13": 69, "14": 99, "15": 228, "16": 151, "17": 142, "18": 127, "19": 89, "20": 24, "21": 125, "22": 25, "23": 242, "24": 60, "25": 167, "26": 124, "27": 241, "28": 209, "29": 245, "30": 23, "31": 221 } }`;
      expect(Weave.tryParseError(error)).toContain(`options invalid: field "Threshold"`);
    });

    it("finds error message in weave JSON ('Error:' prefixed string)", () => {
      const error =
        'Error: {\n  "data": {},\n  "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input",\n  "code": 1000,\n  "hash": {\n    "0": 230,\n    "1": 34,\n    "2": 73,\n    "3": 190,\n    "4": 112,\n    "5": 40,\n    "6": 174,\n    "7": 10,\n    "8": 91,\n    "9": 179,\n    "10": 237,\n    "11": 61,\n    "12": 80,\n    "13": 155,\n    "14": 105,\n    "15": 109,\n    "16": 25,\n    "17": 225,\n    "18": 116,\n    "19": 113,\n    "20": 158,\n    "21": 127,\n    "22": 129,\n    "23": 182,\n    "24": 188,\n    "25": 205,\n    "26": 78,\n    "27": 21,\n    "28": 217,\n    "29": 96,\n    "30": 236,\n    "31": 210\n  }\n}';
      expect(Weave.tryParseError(error)).toContain(`options invalid: field "Threshold"`);
    });

    it("cuts parts of error message that are not relevant for the user", () => {
      const error = `{ "data": {}, "log": "cannot check tx: options invalid: field \\"Threshold\\": must not be lower 0.5: invalid input", "code": 1000, "hash": { "0": 229, "1": 8, "2": 182, "3": 138, "4": 198, "5": 215, "6": 106, "7": 90, "8": 52, "9": 79, "10": 138, "11": 190, "12": 170, "13": 69, "14": 99, "15": 228, "16": 151, "17": 142, "18": 127, "19": 89, "20": 24, "21": 125, "22": 25, "23": 242, "24": 60, "25": 167, "26": 124, "27": 241, "28": 209, "29": 245, "30": 23, "31": 221 } }`;
      expect(Weave.tryParseError(error)).toEqual(`options invalid: field "Threshold": must not be lower 0.5`);
    });

    it("returns null when other error format is found", () => {
      expect(Weave.tryParseError("")).toBeNull();
      expect(Weave.tryParseError("{}")).toBeNull();
      expect(Weave.tryParseError('{ log: "error message, but code missing" }')).toBeNull();

      expect(Weave.tryParseError(new Error("Something happened"))).toBeNull();
    });
  });
});
