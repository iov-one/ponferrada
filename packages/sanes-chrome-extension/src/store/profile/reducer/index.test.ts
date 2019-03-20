import { ChainId, PublicIdentity } from '@iov/bcp-types';
import { UserProfile } from '@iov/keycontrol';

import { createMemDb } from '../../../logic/db';
import {
  cleanMnemonic,
  createProfile,
  ensureIdentity,
  getWalletAndIdentity,
  hasStoredProfile,
  loadOrCreateProfile,
} from '../../../logic/core/profile';

describe('createProfile', () => {
  it('returns a profile with two keyrings with same mnemonic, and no identities', async () => {
    const profile = await createProfile();
    expect(profile.wallets.value.length).toEqual(2);
    let lastSecret: string | undefined;
    profile.wallets.value.forEach(w => {
      const idents = profile.getIdentities(w.id);
      expect(idents.length).toEqual(0);
      const secret = profile.printableSecret(w.id);
      if (lastSecret !== undefined) {
        expect(secret).toEqual(lastSecret);
      }
      lastSecret = secret;
    });
  });

  it('returns a different mnemonic each time', async () => {
    const profile = await createProfile();
    const profile2 = await createProfile();

    // compare mnemonic from first wallet in each profile
    const secret1 = profile.printableSecret(profile.wallets.value[0].id);
    const secret2 = profile2.printableSecret(profile2.wallets.value[0].id);
    expect(secret1).not.toEqual(secret2);
  });
});

describe('ensureIdentity', () => {
  it('returns different identities for different codecs', async () => {
    const profile = await createProfile();
    const ident1 = await ensureIdentity(profile, 'bns-chain' as ChainId, 'bns');
    expect(ident1).toBeTruthy();
    const ident2 = await ensureIdentity(profile, 'bov-chain' as ChainId, 'bov');
    expect(ident2).toBeTruthy();
    const ident3 = await ensureIdentity(
      profile,
      'lisk-chain' as ChainId,
      'lsk'
    );
    expect(ident3).toBeTruthy();
    const ident4 = await ensureIdentity(
      profile,
      'rinkeby-chain' as ChainId,
      'eth'
    );
    expect(ident4).toBeTruthy();

    // compare all pairs of identities to ensure all have unique derivations
    const pairs: ReadonlyArray<ReadonlyArray<PublicIdentity>> = [
      [ident1, ident2],
      [ident1, ident3],
      [ident1, ident4],
      [ident2, ident3],
      [ident2, ident4],
      [ident3, ident4],
    ];
    for (const [id1, id2] of pairs) {
      expect(id1).not.toEqual(id2);
      expect(id1.pubkey).not.toEqual(id2.pubkey);
    }
  });
});

describe('getWalletAndIdentity', () => {
  it('should error if no keyrings', async () => {
    const profile = new UserProfile();
    expect(() =>
      getWalletAndIdentity(profile, 'bns-chain' as ChainId)
    ).toThrowError(/No identity found/);
  });

  it('should error if no chains registered', async () => {
    const profile = await createProfile();
    expect(() => getWalletAndIdentity(profile, 'bns-chain' as ChainId)).toThrow(
      /No identity found/
    );
  });

  it('should error if other chains registered', async () => {
    const profile = await createProfile();
    await ensureIdentity(profile, 'bov-chain' as ChainId, 'bov');
    expect(() => getWalletAndIdentity(profile, 'bns-chain' as ChainId)).toThrow(
      /No identity found/
    );
  });

  it('should return identity if this chain registered - ed25519', async () => {
    const profile = await createProfile();
    const ident = await ensureIdentity(profile, 'bns-chain' as ChainId, 'bns');
    const { walletId, identity } = getWalletAndIdentity(
      profile,
      'bns-chain' as ChainId
    );
    expect(identity).toEqual(ident);
    // should be wallet 0 (ed25519)
    expect(walletId).toEqual(profile.wallets.value[0].id);
  });

  it('should return identity if this chain registered - secp256k1', async () => {
    const profile = await createProfile();
    const ident = await ensureIdentity(profile, 'rinkeby' as ChainId, 'eth');
    const { walletId, identity } = getWalletAndIdentity(
      profile,
      'rinkeby' as ChainId
    );
    expect(identity).toEqual(ident);
    // should be wallet 1 (secp256k1)
    expect(walletId).toEqual(profile.wallets.value[1].id);
  });
});

describe('hasStoredProfile', () => {
  it('should flag if safe to load', async () => {
    const password = 'some secret string';

    const db = createMemDb();
    expect(await hasStoredProfile(db)).toBe(false);
    await expect(UserProfile.loadFrom(db, password)).rejects.toThrow(
      /Key not found/
    );

    const chainIdBns = 'bns-chain' as ChainId;
    const profile = await createProfile();
    await ensureIdentity(profile, chainIdBns, 'bns');
    await profile.storeIn(db, password);
    expect(await hasStoredProfile(db)).toBe(true);

    const loaded = await UserProfile.loadFrom(db, password);
    // compare the identities based on unique identifier (id)
    const { identity: originalId } = getWalletAndIdentity(profile, chainIdBns);
    const { identity: loadedId } = getWalletAndIdentity(loaded, chainIdBns);
    expect(loadedId.pubkey).toEqual(originalId.pubkey);
  });
});

describe('loadOrCreateProfile', () => {
  it('should work on empty and full db', async () => {
    const db = createMemDb();
    const password = 'foobar';

    const profile1 = await loadOrCreateProfile(db, password);
    const wallets1 = profile1.wallets.value;
    expect(wallets1.length).toEqual(2);
    const secret1 = profile1.printableSecret(wallets1[0].id);

    const profile2 = await loadOrCreateProfile(db, password);
    const wallets2 = profile2.wallets.value;
    expect(wallets2.length).toEqual(2);
    const secret2 = profile2.printableSecret(wallets2[0].id);

    expect(wallets2).toEqual(wallets1);
    expect(secret2).toEqual(secret1);
  });

  it('should error loading with invalid password', async () => {
    const db = createMemDb();
    const password = "can't guess this!";

    // first time should work with any password
    // const chainIdBns = "bns-chain" as ChainId;
    await loadOrCreateProfile(db, password);
    // second load fails if password doesn't match
    await expect(loadOrCreateProfile(db, 'bad password')).rejects.toThrow(
      'invalid usage'
    );
  });

  it('generates new profile from mnemonic', async () => {
    const db = createMemDb();
    const mnemonic =
      'kiss assault oxygen consider duck auto annual nerve census cloth stem park';
    const password = 'foobar';

    // create matches mnemonic
    const profile1 = await loadOrCreateProfile(db, password, mnemonic);
    const walletId = profile1.wallets.value[0].id;
    expect(walletId).toBeDefined();
    expect(profile1.printableSecret(walletId)).toEqual(mnemonic);

    // reload with same mnemonic
    const profile2 = await loadOrCreateProfile(db, password);
    expect(profile2.printableSecret(walletId)).toEqual(mnemonic);
  });

  it('overwrites existing profile when mnemonic provided', async () => {
    const db = createMemDb();
    const mnemonic =
      'kiss assault oxygen consider duck auto annual nerve census cloth stem park';
    const password = 'foobar';
    const mnemonic2 =
      'beach young hobby distance confirm material coin endless buzz correct express they';
    const password2 = 'bazoom';

    // create matches mnemonic
    const profile1 = await loadOrCreateProfile(db, password, mnemonic);
    const walletId = profile1.wallets.value[0].id;
    expect(walletId).toBeDefined();
    expect(profile1.printableSecret(walletId)).toEqual(mnemonic);

    // reload with different mnemonic and password works (overwrite)
    const profile2 = await loadOrCreateProfile(db, password2, mnemonic2);
    const walletId2 = profile2.wallets.value[0].id;
    expect(walletId2).toBeDefined();
    expect(walletId2).not.toEqual(walletId);
    expect(profile2.printableSecret(walletId2)).toEqual(mnemonic2);
  });
});

describe('cleanMnemonic', () => {
  it('should normalize many cases', () => {
    expect(cleanMnemonic('foo')).toEqual('foo');
    expect(cleanMnemonic('\tFoo \n')).toEqual('foo');
    expect(cleanMnemonic(' One TWO three     ')).toEqual('one two three');
    // clean up all whitespace
    expect(cleanMnemonic('LINE ONE\nLINE TWO\nLINE\tTHREE')).toEqual(
      'line one line two line three'
    );
    // don't fix punctuation of other such errors
    expect(cleanMnemonic(' One. TWO three!')).toEqual('one. two three!');
  });
});
