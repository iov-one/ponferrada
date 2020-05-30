import { Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";

const TIMEOUT = 20000; // msec
const INTERVAL = 500;

export const findRenderedDOMComponentWithId = (
  tree: React.Component<any>, // eslint-disable-line
  id: string,
): Promise<React.ReactInstance> =>
  new Promise((resolve, reject): void => {
    let times = 0;
    const interval = setInterval((): void => {
      if (times >= TIMEOUT / INTERVAL) {
        clearInterval(interval);
        reject(`Unable to find element with id: ${id}.`);
      }

      const elementsWithId = TestUtils.findAllInRenderedTree(tree, (inst: React.ReactInstance): boolean => {
        return TestUtils.isDOMComponent(inst) && inst.id === id;
      });

      if (elementsWithId.length === 1) {
        clearInterval(interval);
        resolve(elementsWithId[0]);
      }

      times += 1;
    }, INTERVAL);
  });

export const findRenderedE2EComponentWithId = async (page: Page, elementId: string): Promise<void> => {
  const selector = `#${elementId}`;
  const elem = await page.waitForSelector(selector.replace("/", "\\/"), { timeout: TIMEOUT });
  if (!elem) {
    throw new Error(`Unable to find element with id: ${elementId}.`);
  }
};
