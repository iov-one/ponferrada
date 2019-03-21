import PseudoRandom from 'random-js';

const prng: PseudoRandom.Engine = PseudoRandom.engines.mt19937().autoSeed();
const pool = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const randomString = (len: number): string =>
  PseudoRandom.string(pool)(prng, len);
