export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms)); //eslint-disable-line @typescript-eslint/explicit-function-return-type
