import { Store } from 'redux';

const MAX_TIMES_EXECUTED = 35;
const INTERVAL = 500;

export const whenOnNavigatedToRoute = (
  refreshStore: Store,
  desiredRoute: string
): Promise<void> =>
  new Promise((resolve, reject) => {
    let times = 0;
    const interval = setInterval(() => {
      if (times >= MAX_TIMES_EXECUTED) {
        clearInterval(interval);
        reject();
      }
      const actualRoute = refreshStore.getState().router.location.pathname;
      if (actualRoute === desiredRoute) {
        clearInterval(interval);
        resolve();
      }
      times += 1;
    }, INTERVAL);
  });
