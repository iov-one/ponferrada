import PseudoRandom, { MersenneTwister19937, string } from 'random-js';

const prng: PseudoRandom.Engine = MersenneTwister19937.autoSeed();
const pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
export const randomString = (len: number): string => string(pool)(prng, len);
