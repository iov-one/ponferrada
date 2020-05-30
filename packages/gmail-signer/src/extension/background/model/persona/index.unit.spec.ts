import { TokenTicker } from "@iov/bcp";
import { bnsCodec, BnsConnection, RegisterUsernameTx } from "@iov/bns";
import { Bip39, EnglishMnemonic, Random } from "@iov/crypto";
import { IovFaucet } from "@iov/faucets";
import { Ed25519HdWallet, HdPaths, UserProfile } from "@iov/keycontrol";
import { sleep } from "ui-logic";

import { withChainsDescribe } from "../../../../utils/test/testExecutor";
import * as appUpdater from "../../updaters/appUpdater";
import { Db } from "../backgroundscript/db";
import { Persona, PersonaAcccount } from "./index";

withChainsDescribe("Persona", () => {
  beforeAll(() => {
    jest.spyOn(appUpdater, "updateRequestProvider").mockImplementation(() => {});
  });
  afterAll(() => {
    jest.spyOn(appUpdater, "updateRequestProvider").mockReset();
  });

  describe("create", () => {
    it("can be created", async () => {
      const db = new Db();
      const persona = await Persona.create(db.getDb(), "passwd", undefined);
      expect(persona).toBeTruthy();
      persona.destroy();
    }, 10000);
  });

  describe("load", () => {
    it("can be loaded from database", async () => {
      const db = new Db().getDb();

      let originalMnemonic: string;
      let originalAccounts: readonly PersonaAcccount[];

      {
        const originalPersona = await Persona.create(db, "passwd", undefined);
        originalMnemonic = originalPersona.mnemonic;
        originalAccounts = await originalPersona.getAccounts();
        originalPersona.destroy();
      }

      {
        const loadedPersona = await Persona.load(db, "passwd", undefined);
        expect(loadedPersona.mnemonic).toEqual(originalMnemonic);
        expect(await loadedPersona.getAccounts()).toEqual(originalAccounts);
        loadedPersona.destroy();
      }
    }, 10000);

    it("saves additional accounts to the database automatically", async () => {
      const db = new Db().getDb();

      let originalAccounts: readonly PersonaAcccount[];

      {
        const originalPersona = await Persona.create(db, "passwd", undefined);
        await originalPersona.createAccount(db);
        originalAccounts = await originalPersona.getAccounts();
        originalPersona.destroy();
      }

      {
        const loadedPersona = await Persona.load(db, "passwd", undefined);
        expect(await loadedPersona.getAccounts()).toEqual(originalAccounts);
        loadedPersona.destroy();
      }
    }, 10000);
  });

  describe("mnemonic", () => {
    it("returns a mnemonic", async () => {
      const db = new Db().getDb();
      const persona = await Persona.create(db, "passwd", undefined);

      expect(() => {
        // this constructor throws when the mnemonic string is not valid
        new EnglishMnemonic(persona.mnemonic);
      }).not.toThrow();

      persona.destroy();
    }, 10000);

    it("returns the right mnemonic", async () => {
      const db = new Db().getDb();
      const presetMnemonic = "until apple post diamond casual bridge bird solid inform size prize debris";
      const persona = await Persona.create(db, "passwd", undefined, presetMnemonic);

      expect(persona.mnemonic).toEqual(presetMnemonic);

      persona.destroy();
    }, 10000);
  });

  describe("getAccounts", () => {
    it("can get accounts", async () => {
      const db = new Db().getDb();
      const persona = await Persona.create(db, "passwd", undefined);

      const accounts = await persona.getAccounts();
      expect(accounts.length).toEqual(1);
      expect(accounts[0].label).toEqual("Account 0");

      persona.destroy();
    }, 10000);

    it("can get accounts with human readable addresses", async () => {
      const mnemonic = Bip39.encode(await Random.getBytes(16)).toString();

      const bnsUrl = "http://localhost:23456/";
      const bnsFaucetUrl = "http://localhost:8000/";
      const bnsFeeToken = "CASH" as TokenTicker;

      const name0 = `foo-${Math.random()}*iov`;
      const name1 = `bar-${Math.random()}*iov`;
      const name2 = [`one-${Math.random()}*iov`, `two-${Math.random()}*iov`];

      {
        const connection = await BnsConnection.establish(bnsUrl);
        const profile = new UserProfile();
        const wallet = profile.addWallet(Ed25519HdWallet.fromMnemonic(mnemonic));
        const identities = [
          await profile.createIdentity(wallet.id, connection.chainId, HdPaths.iov(0)),
          await profile.createIdentity(wallet.id, connection.chainId, HdPaths.iov(1)),
          await profile.createIdentity(wallet.id, connection.chainId, HdPaths.iov(2)),
        ];

        // Ensure transaction creators can pay their fees
        const bnsFaucet = new IovFaucet(bnsFaucetUrl);
        await Promise.all([
          bnsFaucet.credit(bnsCodec.identityToAddress(identities[0]), bnsFeeToken),
          bnsFaucet.credit(bnsCodec.identityToAddress(identities[1]), bnsFeeToken),
          bnsFaucet.credit(bnsCodec.identityToAddress(identities[2]), bnsFeeToken),
        ]);

        const registerName0: RegisterUsernameTx = {
          kind: "bns/register_username",
          chainId: connection.chainId,
          username: name0,
          targets: [],
        };

        const registerName1: RegisterUsernameTx = {
          kind: "bns/register_username",
          chainId: connection.chainId,
          username: name1,
          targets: [],
        };

        const registerName2a: RegisterUsernameTx = {
          kind: "bns/register_username",
          chainId: connection.chainId,
          username: name2[0],
          targets: [],
        };

        const registerName2b: RegisterUsernameTx = {
          kind: "bns/register_username",
          chainId: connection.chainId,
          username: name2[1],
          targets: [],
        };

        const transactions = [[registerName0], [registerName1], [registerName2a, registerName2b]];
        const nonces = [
          await connection.getNonces({ pubkey: identities[0].pubkey }, 1),
          await connection.getNonces({ pubkey: identities[1].pubkey }, 1),
          await connection.getNonces({ pubkey: identities[2].pubkey }, 2),
        ];

        for (const creatorIndex of [0, 1, 2]) {
          for (let i = 0; i < transactions[creatorIndex].length; ++i) {
            const tx = transactions[creatorIndex][i];
            const nonce = nonces[creatorIndex][i];

            const signer = identities[creatorIndex];
            const withFee = await connection.withDefaultFee(tx, bnsCodec.identityToAddress(signer));
            const signed = await profile.signTransaction(signer, withFee, bnsCodec, nonce);
            await connection.postTx(bnsCodec.bytesToPost(signed));
          }
        }
        connection.disconnect();
      }

      // Due to missing WebSocket connection, we cannot subscribe to block. Wait instead.
      await sleep(2000);

      const db = new Db().getDb();
      const persona = await Persona.create(db, "passwd", undefined, mnemonic);
      await persona.createAccount(db); // index 1
      await persona.createAccount(db); // index 2
      await persona.createAccount(db); // index 3

      const accounts = await persona.getAccounts();
      expect(accounts.length).toEqual(4);
      expect(accounts[0].label).toEqual(name0);
      expect(accounts[1].label).toEqual(name1);
      expect(accounts[2].label).toEqual("Multiple names");
      expect(accounts[3].label).toEqual("Account 3");

      persona.destroy();
    }, 20000);
  });

  describe("createAccount", () => {
    it("can create an account", async () => {
      const db = new Db().getDb();
      const persona = await Persona.create(db, "passwd", undefined);

      {
        const accounts = await persona.getAccounts();
        expect(accounts.length).toEqual(1); // first account created by default
      }

      await persona.createAccount(db);

      {
        const accounts = await persona.getAccounts();
        expect(accounts.length).toEqual(2);
        expect(accounts[0].label).toEqual("Account 0");
        expect(accounts[1].label).toEqual("Account 1");
      }

      persona.destroy();
    }, 10000);
  });
});
