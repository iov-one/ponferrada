import { Page } from 'puppeteer';

const retryInterval = 500;
const defaultTimeout = 18000;

export const whenOnNavigatedToRoute = (desiredRoute: string): Promise<void> =>
  new Promise((resolve, reject): void => {
    const startTime = Date.now();
    const interval = setInterval((): void => {
      if (Date.now() - startTime >= defaultTimeout) {
        clearInterval(interval);
        reject(`Unable to navigate to ${desiredRoute}`);
      } else {
        const actualRoute = window.location.pathname;
        if (actualRoute === desiredRoute) {
          clearInterval(interval);
          resolve();
        }
      }
    }, retryInterval);
  });

export const whenOnNavigatedToE2eRoute = (page: Page, desiredRoute: string): Promise<void> =>
  new Promise((resolve, reject): void => {
    const startTime = Date.now();
    const interval = setInterval((): void => {
      if (Date.now() - startTime >= defaultTimeout) {
        clearInterval(interval);
        reject(`Unable to navigate to ${desiredRoute}`);
      } else {
        const actualRoute = page.url();
        if (actualRoute.endsWith(desiredRoute)) {
          clearInterval(interval);
          resolve();
        }
      }
    }, retryInterval);
  });
