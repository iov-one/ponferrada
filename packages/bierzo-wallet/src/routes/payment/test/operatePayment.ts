import { Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';

import { QUANTITY_FIELD } from '../components/CurrencyToSend';
import { ADDRESS_FIELD } from '../components/ReceiverAddress';

export function getCancelButton(paymentDom: React.Component): Element {
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(paymentDom, 'button');
  return buttons[2];
}

export function getSelectedCurrency(inputs: Element[]): string {
  const input = inputs[1] as HTMLInputElement;
  return input.value;
}

export async function fillPaymentForm(page: Page): Promise<void> {
  await page.bringToFront();
  await page.type(`input[name="${QUANTITY_FIELD}"]`, '1');
  await page.type(`input[name="${ADDRESS_FIELD}`, 'tiov1q5lyl7asgr2dcweqrhlfyexqpkgcuzrm4e0cku');
  await page.click('button[type=submit]');
}
