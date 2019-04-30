import puppeteer, { Browser, Page } from 'puppeteer';
import { EXTENSION_HEIGHT, EXTENSION_WIDTH } from '../../theme/constants';
import { travelToSignupNewAccountStep } from './test/travelToSignup';
import { submitAccountFormE2E, handlePassPhrase2E, handleSecurityHintE2E } from './test/fillSignupForm';
import { randomString } from '../../utils/test/random';
import { withChainsDescribe } from '../../utils/test/testExecutor';

withChainsDescribe(
  'DOM > Signup route',
  (): void => {
    let browser: Browser;

    beforeEach(async (): Promise<void> => {
      const CRX_PATH = require('path').join(__dirname, '../../../build');
      browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        //slowMo: 200,
        args: [`--disable-extensions-except=${CRX_PATH}`, `--load-extension=${CRX_PATH}`],
        defaultViewport: {
          width: EXTENSION_WIDTH,
          height: EXTENSION_HEIGHT,
        },
      });
    }, 45000);

    afterEach(
      async (): Promise<void> => {
        await browser.close();
      }
    );

    it('should redirect to signup route, fill required data, show recovery phrase and hint', async (): Promise<
      void
    > => {
      const page: Page = await browser.newPage();
      await page.goto('chrome-extension://dafekhlcpidfaopcimocbcpciholgkkb/index.html', {
        waitUntil: 'networkidle2',
      });
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));

      await travelToSignupNewAccountStep(page);
      await submitAccountFormE2E(page, randomString(10), randomString(10));
      await handlePassPhrase2E(page);
      await handleSecurityHintE2E(page, randomString(10));
    }, 60000);
  }
);
