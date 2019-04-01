export const skipTests = (envVar: string | undefined): boolean => !envVar;
export const mayTestChains = skipTests(process.env.CHAINS_ENABLED) ? xit : it;
