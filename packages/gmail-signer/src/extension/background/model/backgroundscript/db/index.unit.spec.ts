import { withChainsDescribe } from "../../../../../utils/test/testExecutor";
import { Persona } from "../../persona";
import { Db } from "./index";

withChainsDescribe("backgroundscript db", () => {
  describe("clear", () => {
    it("clears all keys", async () => {
      const someKey = `${Math.random()}`;
      const db = new Db();
      await expect(db.getDb().get(someKey)).rejects.toThrow(/Key not found in database/i);
      await db.getDb().put(someKey, "foo");
      expect(await db.getDb().get(someKey, { asBuffer: false })).toEqual("foo");
      await db.clear();
      await expect(db.getDb().get(someKey)).rejects.toThrow(/Key not found in database/i);
    });
  });

  describe("hasStoredPersona", () => {
    it("returns false for empty database", async () => {
      const db = new Db();
      const hasPersona = await db.hasPersona();
      expect(hasPersona).toEqual(false);
    });

    it("returns true for database with persona", async () => {
      const db = new Db();
      {
        const persona = await Persona.create(db.getDb(), "passwd", undefined);
        expect(persona).toBeTruthy();
        persona.destroy();
      }

      const hasPersona = await db.hasPersona();
      expect(hasPersona).toEqual(true);
    });
  });
});
