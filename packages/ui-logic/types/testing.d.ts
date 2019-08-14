/**
 * Calls callback until it returns true or timeout is reachend.
 *
 * @param callback a callback function that is called in a loop. It should be cheap to execute.
 * @param timeout timeout in milliseconds. Defaults to 10 seconds
 * @returns a promise that resolves when the callback returned true and is rejected when timeout is reached.
 */
export declare function whenTrue(callback: () => boolean | Promise<boolean>, timeout?: number): Promise<void>;
