import { Page } from 'puppeteer';

const MAX_TIMES_EXECUTED = 35;
const INTERVAL = 500;

export const whenOnNavigatedToRoute = (desiredRoute: string): Promise<void> =>
  new Promise(
    (resolve, reject): void => {
      let times = 0;
      const interval = setInterval((): void => {
        if (times >= MAX_TIMES_EXECUTED) {
          clearInterval(interval);
          reject(`Unable to navigate to ${desiredRoute}`);
        }
        const actualRoute = window.location.pathname;
        if (actualRoute === desiredRoute) {
          clearInterval(interval);
          resolve();
        }
        times += 1;
      }, INTERVAL);
    },
  );

export const whenOnNavigatedToE2eRoute = (page: Page, desiredRoute: string): Promise<void> =>
  new Promise(
    (resolve, reject): void => {
      let times = 0;
      const interval = setInterval((): void => {
        if (times >= MAX_TIMES_EXECUTED) {
          clearInterval(interval);
          reject(`Unable to navigate to ${desiredRoute}`);
        }
        const actualRoute = page.url();
        console.log('Actual Route is ' + actualRoute);
        if (actualRoute.endsWith(desiredRoute)) {
          clearInterval(interval);
          resolve();
        }
        times += 1;
      }, INTERVAL);
    },
  );
