const retryInterval = 200;

/**
 * Calls callback until it returns true or timeout is reachend.
 *
 * @param callback a callback function that is called in a loop. It should be cheap to execute.
 * @param timeout timeout in milliseconds. Defaults to 10 seconds
 * @returns a promise that resolves when the callback returned true and is rejected when timeout is reached.
 */
export function whenTrue(callback: () => boolean | Promise<boolean>, timeout: number = 10000): Promise<void> {
  return new Promise((resolve, reject): void => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      const runtime = Date.now() - startTime;
      if (runtime >= timeout) {
        clearInterval(interval);
        reject(new Error(`Timeout reached after ${runtime} ms`));
      } else {
        if (await callback()) {
          clearInterval(interval);
          resolve();
        }
      }
    }, retryInterval);
  });
}
