export const skipTests = (envVar: string | undefined): boolean => !envVar;
export const mayTestChains = skipTests(process.env.CHAINS_ENABLED) ? xit : it;

export const withChainsDescribe = skipTests(process.env.CHAINS_ENABLED) ? xdescribe : describe;
