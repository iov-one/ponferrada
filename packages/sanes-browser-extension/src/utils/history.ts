import { createBrowserHistory } from "history";

export let history = createBrowserHistory();

/**
 * This method can only be used in test enviromnets
 */
export const resetHistory = (): void => {
  history = createBrowserHistory();
};
