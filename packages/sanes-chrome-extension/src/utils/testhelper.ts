import PseudoRandom, { MersenneTwister19937, string } from 'random-js';

export const skipTests = (envVar: string | undefined): boolean => !envVar;
export const mayTestChains = skipTests(process.env.CHAINS_ENABLED) ? xit : it;

const prng: PseudoRandom.Engine = MersenneTwister19937.autoSeed();
const pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
export const randomString = (len: number): string => string(pool)(prng, len);
