import { Store } from 'redux';

const MAX_TIMES_EXECUTED = 35;
const INTERVAL = 500;

export const whenOnNavigatedToRoute = (
  refreshStore: Store,
  desiredRoute: string
): Promise<void> =>
  new Promise(
    (resolve, reject): void => {
      let times = 0;
      const interval = setInterval((): void => {
        if (times >= MAX_TIMES_EXECUTED) {
          clearInterval(interval);
          reject(`Unable to navigate to ${desiredRoute}`);
        }
        const actualRoute = refreshStore.getState().router.location.pathname;
        if (actualRoute === desiredRoute) {
          clearInterval(interval);
          resolve();
        }
        times += 1;
      }, INTERVAL);
    }
  );
