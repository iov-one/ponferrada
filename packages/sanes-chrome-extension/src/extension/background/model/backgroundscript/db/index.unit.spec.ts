import { withChainsDescribe } from '../../../../../utils/test/testExecutor';
import * as txsUpdater from '../../../updaters/appUpdater';
import { Persona } from '../../persona';
import SigningServer from '../../signingServer';
import { Db } from './index';

withChainsDescribe('backgroundscript db', () => {
  describe('hasStoredPersona', () => {
    beforeAll(() => {
      jest.spyOn(txsUpdater, 'transactionsUpdater').mockImplementation(() => {});
    });
    afterAll(() => {
      jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
    });

    it('returns false for empty database', async () => {
      const db = new Db();
      const hasPersona = await db.hasPersona();
      expect(hasPersona).toEqual(false);
    });

    it('returns true for database with persona', async () => {
      const db = new Db();
      const signingServer = new SigningServer();
      {
        const persona = await Persona.create(db.getDb(), signingServer, 'passwd');
        expect(persona).toBeTruthy();
        persona.destroy();
      }

      const hasPersona = await db.hasPersona();
      expect(hasPersona).toEqual(true);
    });
  });
});
